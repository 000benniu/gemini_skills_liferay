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
const COLLECTION_ERC = config.LIFERAY_FRAGMENT_COLLECTION_ERC;

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

// サムネイル画像を Headless API でアップロードして ID を取得する
async function uploadThumbnail(token, filePath) {
    if (!fs.existsSync(filePath)) return 0;
    
    console.log(`--- Uploading Thumbnail (Headless): ${path.basename(filePath)} ---`);
    const fileName = `thumb_${Date.now()}_${path.basename(filePath)}`;
    const fileBuffer = fs.readFileSync(filePath);
    
    const boundary = `----GeminiBoundary${Date.now()}`;
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="document"\r\nContent-Type: application/json\r\n\r\n` +
                   JSON.stringify({ title: fileName, fileName: fileName, viewableBy: "Anyone" }) + `\r\n` +
                   `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`;
    const footer = `\r\n--${boundary}--`;
    const body = Buffer.concat([Buffer.from(header), fileBuffer, Buffer.from(footer)]);

    const options = {
        hostname: new URL(BASE_URL).hostname, port: 443, 
        path: `/o/headless-delivery/v1.0/sites/${SITE_ID}/documents`,
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length
        }
    };

    try {
        const res = await request(options, body);
        console.log(`Thumbnail uploaded. ID: ${res.id}`);
        return res.id;
    } catch (e) {
        console.error("Thumbnail upload failed.", e.status);
        return 0;
    }
}

async function getOrCreateCollection(token) {
    console.log(`--- Collection Check: ${COLLECTION_ERC} ---`);
    const options = {
        hostname: new URL(BASE_URL).hostname, port: 443, path: '/api/jsonws/invoke', method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' }
    };
    const checkData = JSON.stringify({ "/fragment.fragmentcollection/get-fragment-collection-by-external-reference-code": { "externalReferenceCode": COLLECTION_ERC, "groupId": SITE_ID } });
    try {
        const res = await request(options, checkData);
        if (res.fragmentCollectionId) return res.fragmentCollectionId;
    } catch (e) {}
    const createData = JSON.stringify({ "/fragment.fragmentcollection/add-fragment-collection": { "externalReferenceCode": COLLECTION_ERC, "groupId": SITE_ID, "name": COLLECTION_ERC, "description": "Auto-generated" } });
    const resCreate = await request(options, createData);
    return resCreate.fragmentCollectionId;
}

const readFileSafe = (filePath) => fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : "";

async function deployFragment(token, collectionId, companyId, fragmentPath) {
    const folderName = path.basename(fragmentPath);
    console.log(`--- Deploying Fragment: ${folderName} ---`);
    
    const fragmentJsonPath = path.join(fragmentPath, 'fragment.json');
    if (!fs.existsSync(fragmentJsonPath)) {
        console.log(`Skipping: fragment.json not found in ${folderName}`);
        return;
    }
    const fragmentMeta = JSON.parse(fs.readFileSync(fragmentJsonPath, 'utf8'));
    const fragmentKey = fragmentMeta.name; // 一意のキーとして使用
    
    const thumbnailId = await uploadThumbnail(token, path.join(fragmentPath, 'thumbnail.png'));

    const options = {
        hostname: new URL(BASE_URL).hostname, port: 443, path: '/api/jsonws/invoke', method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' }
    };

    // 1. 既存のフラグメントが存在するかチェック
    let existingFragmentId = null;
    try {
        const checkPayload = {
            "/fragment.fragmententry/get-fragment-entries": {
                "companyId": companyId,
                "groupId": parseInt(SITE_ID),
                "fragmentCollectionId": parseInt(collectionId),
                "status": 0,
                "start": -1,
                "end": -1
            }
        };
        const entries = await request(options, JSON.stringify(checkPayload));
        if (Array.isArray(entries)) {
            const existing = entries.find(e => 
                e.fragmentEntryKey === fragmentKey || 
                e.fragmentEntryKey === fragmentKey.toLowerCase() || 
                e.name === fragmentKey
            );
            if (existing) {
                existingFragmentId = existing.fragmentEntryId;
            }
        }
    } catch (e) {
        console.log("Check fragment failed or empty result. Assuming it does not exist.");
    }

    // 2. 更新 または 新規作成
    let payload;
    if (existingFragmentId) {
        console.log(`Fragment '${fragmentKey}' exists (ID: ${existingFragmentId}). Updating...`);
        payload = {
            "/fragment.fragmententry/update-fragment-entry": {
                fragmentEntryId: existingFragmentId,
                fragmentCollectionId: parseInt(collectionId),
                configuration: readFileSafe(path.join(fragmentPath, 'configuration.json')),
                css: readFileSafe(path.join(fragmentPath, 'index.css')),
                html: readFileSafe(path.join(fragmentPath, 'index.html')),
                js: readFileSafe(path.join(fragmentPath, 'index.js')),
                name: fragmentMeta.name,
                cacheable: false, 
                icon: fragmentMeta.icon || 'third-party',
                previewFileEntryId: thumbnailId,
                readOnly: false, 
                type: 1, 
                typeOptions: '{}', 
                status: 0
            }
        };
    } else {
        console.log(`Fragment '${fragmentKey}' does not exist. Creating new...`);
        payload = {
            "/fragment.fragmententry/add-fragment-entry": {
                cacheable: false, 
                configuration: readFileSafe(path.join(fragmentPath, 'configuration.json')),
                css: readFileSafe(path.join(fragmentPath, 'index.css')),
                externalReferenceCode: fragmentKey, 
                fragmentCollectionId: parseInt(collectionId),
                fragmentEntryKey: fragmentKey, 
                groupId: parseInt(SITE_ID),
                html: readFileSafe(path.join(fragmentPath, 'index.html')), 
                icon: fragmentMeta.icon || 'third-party',
                js: readFileSafe(path.join(fragmentPath, 'index.js')), 
                marketplace: false,
                name: fragmentMeta.name, 
                previewFileEntryId: thumbnailId, 
                readOnly: false, 
                status: 0, 
                type: 1, 
                typeOptions: '{}'
            }
        };
    }

    try {
        const res = await request(options, JSON.stringify(payload));
        const resultId = res.fragmentEntryId || existingFragmentId;
        console.log(`Success: ${fragmentMeta.name} (ID: ${resultId})`);
    } catch (e) {
        console.error(`Failed! HTTP Status: ${e.status}`);
        if (e.data) {
            console.error(e.data.substring(0, 500));
        }
    }
}

async function main() {
    try {
        const token = await getAccessToken();

        const baseOptions = {
            hostname: new URL(BASE_URL).hostname, port: 443, path: '/api/jsonws/invoke', method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' }
        };
        const groupRes = await request(baseOptions, JSON.stringify({ "/group/get-group": { "groupId": SITE_ID } }));
        const companyId = groupRes.companyId;

        const srcDir = path.resolve('src');
        
        // 解析されたフラグメントの相対パスリスト (AIによって注入される)
        const fragmentRelativePaths = [
            // 'collection1/fragment-a',
            // 'collection1/fragment-b',
            // ...
        ];

        if (fragmentRelativePaths.length === 0) {
            console.log("No specific fragments injected by Agent. Falling back to dynamic scan...");
            const findFragments = (dir) => {
                let results = [];
                if (!fs.existsSync(dir)) return results;
                fs.readdirSync(dir).forEach(file => {
                    const filePath = path.join(dir, file);
                    if (fs.statSync(filePath).isDirectory()) {
                        if (fs.existsSync(path.join(filePath, 'fragment.json'))) results.push(filePath);
                        else results = results.concat(findFragments(filePath));
                    }
                });
                return results;
            };
            const paths = findFragments(srcDir);
            if (paths.length > 0) {
                const colId = await getOrCreateCollection(token);
                for (const p of paths) await deployFragment(token, colId, companyId, p);
            }
        } else {
            console.log(`Deploying ${fragmentRelativePaths.length} fragments identified by Agent...`);
            const colId = await getOrCreateCollection(token);
            for (const relPath of fragmentRelativePaths) {
                await deployFragment(token, colId, companyId, path.join(srcDir, relPath));
            }
        }
        
        console.log("\n--- All Deployments Finished ---");
    } catch (e) { console.error("Error:", e); }
}
main();