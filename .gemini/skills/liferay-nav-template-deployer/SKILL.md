---
name: liferay-nav-template-deployer
description: Fully independent automated deployment guide for Navigation Menu display templates (ADT: PortletDisplayTemplate / NavItem) in Liferay DXP.
---

# Liferay Navigation Template Deployer Ver.2

## 1. Overview
This skill provides the procedure for dynamically deploying (creating/updating) `.ftl` files of Application Display Templates (ADT) for Navigation Menu widgets using Liferay's JSONWS API. It is designed to work completely independent of the fragment auto-deployment feature.

## 2. API Endpoints and Required Classes
When creating a template (`add-template`), it is necessary to specify the correct `classNameId` and `resourceClassNameId` dynamically obtained from the Liferay side.
Since IDs vary depending on the Liferay environment, do not use fixed IDs. Be sure to dynamically resolve them using the following procedures.

- **Target Class Names to Retrieve**:
  1. `com.liferay.portal.kernel.theme.NavItem` (for `classNameId`)
  2. `com.liferay.portlet.display.template.PortletDisplayTemplate` (for `resourceClassNameId`)
- **Class ID Retrieval API**: `/classname/fetch-class-name`
- **Template Creation API**: `/ddm.ddmtemplate/add-template`

## 3. Deployment Payload Specification
Send the following JSON payload to the `add-template` endpoint. Also, to ensure idempotency, it is recommended to check for existence beforehand using `/ddm.ddmtemplate/get-templates` (`update-template` for updates). The `companyId` parameter is required for all APIs.

```json
{
  "/ddm.ddmtemplate/add-template": {
      "externalReferenceCode": "Unique ERC (e.g.: NAV_TEMPLATE_MAIN)",
      "companyId": <LIFERAY_COMPANY_ID>,
      "groupId": <LIFERAY_SITE_ID>,
      "classNameId": <NavItem's class ID>,
      "classPK": 0,
      "resourceClassNameId": <PortletDisplayTemplate's class ID>,
      "nameMap": {"en_US": "Template Name (Infer from file name)"},
      "descriptionMap": {},
      "type": "display",
      "mode": "",
      "language": "ftl",
      "script": "<The actual FreeMarker script>",
      "serviceContext": {}
  }
}
```

## 4. Execution Flow (Agent-led Workflow)
1. **Detect FTL Files**: Scan for navigation templates (e.g.: `global-nav.ftl`) under `src/`.
2. **Obtain OAuth2 Token**: Retrieve it using `LIFERAY_OAUTH_CLIENT_ID` etc. from `.env.config`.
3. **Dynamic ID Retrieval**: 
   - Use `/classname/fetch-class-name` to get the 2 mandatory class IDs.
   - Use `/group/get-group` (specifying groupId) to get the `companyId`, which is a required parameter.
4. **Existence Check and Deployment**: 
   - Search for existing templates using `/ddm.ddmtemplate/get-templates` (companyId specification required).
   - Execute deployment with `update-template` if it exists, or `add-template` if it doesn't.

## 5. Reference Code
- Reference Implementation: `references/deploy-nav-template.js`