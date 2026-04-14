const fs = require('fs');
const path = require('path');
const https = require('https');

// 0. 環境設定の定義（.env.config 優先）
const configContent = fs.existsSync('.env.config') ? fs.readFileSync('.env.config', 'utf8') : "";
const config = Object.fromEntries(configContent.split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())));

const BASE_URL = (config.LIFERAY_BASE_URL || "").replace(/\/$/, "");
const SITE_ID = config.LIFERAY_SITE_ID;
const CLIENT_ID = config.LIFERAY_OAUTH_CLIENT_ID;
const CLIENT_SECRET = config.LIFERAY_OAUTH_CLIENT_SECRET;

async function request(options, body = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
                } else { reject({ status: res.statusCode, data: data, path: options.path }); }
            });
        });
        req.on('error', (e) => reject(e));
        if (body) req.write(body);
        req.end();
    });
}

async function getAccessToken() {
    console.log("--- Authenticating ---");
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const options = {
        hostname: new URL(BASE_URL).hostname, port: 443, path: '/o/oauth2/token', method: 'POST',
        headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    const res = await request(options, 'grant_type=client_credentials');
    console.log("Success: Token acquired.");
    return res.access_token;
}

async function deployNavTemplate(token, companyId, ftlPath) {
    const fileName = path.basename(ftlPath, '.ftl');
    const templateKey = fileName.toUpperCase();
    console.log(`--- Deploying Nav Template: ${fileName} ---`);
    
    const baseOptions = {
        hostname: new URL(BASE_URL).hostname, port: 443, path: '/api/jsonws/invoke', method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    };
    
    // 3. 動的 ID 取得
    const cnRes1 = await request(baseOptions, JSON.stringify({ 
        "/classname/fetch-class-name": { "value": "com.liferay.portal.kernel.theme.NavItem" } 
    }));
    const classNameId = cnRes1.classNameId;
    console.log(`NavItem Class ID: ${classNameId}`);

    const cnRes2 = await request(baseOptions, JSON.stringify({ 
        "/classname/fetch-class-name": { "value": "com.liferay.portlet.display.template.PortletDisplayTemplate" } 
    }));
    const resourceClassNameId = cnRes2.classNameId;
    console.log(`PortletDisplayTemplate Class ID: ${resourceClassNameId}`);
    
    const scriptContent = fs.readFileSync(ftlPath, 'utf8');

    // 上書きまたは新規作成のロジック
    let existingTemplateId = null;
    try {
        const checkPayload = {
            "/ddm.ddmtemplate/get-templates": {
                "companyId": companyId,
                "groupId": parseInt(SITE_ID),
                "classNameId": classNameId,
                "classPK": 0,
                "resourceClassNameId": resourceClassNameId,
                "status": 0,
                "start": -1,
                "end": -1
            }
        };
        const templates = await request(baseOptions, JSON.stringify(checkPayload));
        if (Array.isArray(templates)) {
            const existing = templates.find(t => t.templateKey === templateKey || (t.nameCurrentValue && t.nameCurrentValue === fileName));
            if (existing) existingTemplateId = existing.templateId;
        }
    } catch (e) {
        console.log("Check template failed, assuming it does not exist.", e.status);
    }

    let payload;
    if (existingTemplateId) {
        console.log(`Template '${fileName}' exists (ID: ${existingTemplateId}). Updating...`);
        payload = {
            "/ddm.ddmtemplate/update-template": {
                "templateId": existingTemplateId,
                "classPK": 0,
                "nameMap": {"en_US": fileName, "ja_JP": fileName},
                "descriptionMap": {},
                "type": "display",
                "mode": "",
                "language": "ftl",
                "script": scriptContent,
                "cacheable": false
            }
        };
    } else {
        console.log(`Template '${fileName}' does not exist. Creating new...`);
        payload = {
            "/ddm.ddmtemplate/add-template": {
                "externalReferenceCode": templateKey,
                "companyId": companyId,
                "groupId": parseInt(SITE_ID),
                "classNameId": classNameId,
                "classPK": 0,
                "resourceClassNameId": resourceClassNameId,
                "nameMap": {"en_US": fileName, "ja_JP": fileName},
                "descriptionMap": {},
                "type": "display",
                "mode": "",
                "language": "ftl",
                "script": scriptContent,
                "serviceContext": {}
            }
        };
    }

    console.log("=== Payload Request ===");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=======================");

    const res = await request(baseOptions, JSON.stringify(payload));
    const resultId = res.templateId || existingTemplateId;
    console.log(`Success: ${fileName} (Template ID: ${resultId})`);
}

async function main() {
    try {
        const token = await getAccessToken();
        const baseOptions = {
            hostname: new URL(BASE_URL).hostname, port: 443, path: '/api/jsonws/invoke', method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        };
        const groupRes = await request(baseOptions, JSON.stringify({ "/group/get-group": { "groupId": SITE_ID } }));
        const companyId = groupRes.companyId;

        const ftlPath = path.resolve('src/templates/LFR_ELEC_GlobalNav/global-nav.ftl');
        
        if (fs.existsSync(ftlPath)) {
            await deployNavTemplate(token, companyId, ftlPath);
        } else {
            console.error(`File not found: ${ftlPath}`);
        }
        
        console.log("\n--- All Deployments Finished ---");
    } catch (e) { 
        console.error("Error:", e); 
    }
}
main();