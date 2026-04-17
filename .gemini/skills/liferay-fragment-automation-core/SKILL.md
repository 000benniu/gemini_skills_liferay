---
name: liferay-fragment-automation-core
description: Expert guide for controlling API-driven automated generation and deployment of fragment, page, and document resources in Liferay DXP.
---

### 0. Environment Setting Definition [Strict Compliance]
At the beginning of all scripts (JS/Python, etc.), define variables in the following order of priority:
1. **`.env.config` file**: If it exists, read its value with the highest priority.
2. **Hard-coded default values**: Use as a fallback if there is no definition in the file or the file does not exist.

### 1. Management Protocol for .env.config [Strict Compliance]
1. **Priority of Existing File**: If `.env.config` already exists in the root directory, **do not overwrite or modify it for any reason.**
2. **Mandatory Existence Check**: Before generating the file, always confirm its existence by executing a tool (e.g., `fs.existsSync` or `ls`).
3. **New Generation**: Only when the file "does not exist", generate a sample file with the following content.
   - **File Name**: `.env.config`
   - **Content**: 
     ```text
     LIFERAY_BASE_URL=https://your-liferay-instance.lfr.cloud
     LIFERAY_SITE_ID=
     LIFERAY_OAUTH_CLIENT_ID=
     LIFERAY_OAUTH_CLIENT_SECRET=
     LIFERAY_FRAGMENT_COLLECTION_ERC=CP_CHAIR_COLLECTION
     LIFERAY_PAGE_ERC=CP_DASHBOARD_PAGE
     ```

## 2. Objective
Combine JSONWS and Headless APIs to fully automatically construct functional fragments and pages on Liferay from design assets in `src/`.

## 3. Required Liferay Configuration (OAuth 2.0)
Before deployment, create a client with the following settings in Liferay's "Control Panel > Your Site > OAuth2 Administration".

| Item | Setting Value | Remarks |
| :--- | :--- | :--- |
| **Allowed Authorization Types** | `Client Credentials` | Required for server-to-server communication |
| **Client Authentication Method** | `Client Secret Basic` | Uses header authentication |
| **Client Profile** | `Other` | Less restrictive profile |

### Required Scopes
Select "Selected" for the following scopes and check `everything`.
1. **Liferay.Headless.Admin.Site**: For creating and managing pages
2. **Liferay.Headless.Delivery**: For uploading documents
3. **Portal Services**: For managing fragments

## 4. html, js Checklist [Strict Compliance]
### html file check
Restrictions regarding `data-lfr-editable` (editable areas) are of utmost importance to prevent display collapse and data corruption. Furthermore, violating this rule in Liferay will result in rejection with a "500 Internal Server Error" during API deployment.

- [ ] **Mismatch between tag and type (Most important, cause of 500 error)**
    - The editable type of `<a>` tags must always be `data-lfr-editable-type="link"`. (If set to `text`, etc., deployment will fail due to a parse error)
    - The editable type of `<img>` tags must always be `data-lfr-editable-type="image"`.
- [ ] **Does the editable area contain HTML tags inside?**
    - Ensure that the inside (innerHTML) of tags with `data-lfr-editable` is **only plain text**.
    - If tags like `<span>`, `<i>`, `<b>`, `<strong>` are included, place them outside the editable tag.
- [ ] **Are editable elements nested (wrapped)?**
    - Ensure that an element with `data-lfr-editable` does not contain another `data-lfr-editable` element inside it.
    - Structures such as placing an image (image type) inside a link (link type) are strictly prohibited.

> [!CAUTION]
> **[Strict Compliance] Pre-validation and Auto-fix During Script Implementation**
> When generating or updating deployment scripts (JS, etc.), "before" sending an API request, you must use regular expressions, etc., to check if the `data-lfr-editable-type` of `<a>` and `<img>` tags in `index.html` is correctly set. If violated, automatically replace (Auto-fix) it with the correct value (`link` or `image`) in the script, overwrite and save the file, and then proceed with the deployment (API request).

> [!CAUTION]
> **[Strict Compliance] Implementation Examples**
> - **NG (HTML inclusion)**: `<a data-lfr-editable-id="btn" data-lfr-editable-type="link"><i class="fa"></i> View Details</a>`
> - **OK (HTML externalization)**: `<div><i class="fa"></i> <a data-lfr-editable-id="btn" data-lfr-editable-type="link">View Details</a></div>`
> - **NG (Nesting)**: 
>   ```html
>   <a data-lfr-editable-id="link" data-lfr-editable-type="link" href="/">
>       <img data-lfr-editable-id="img" data-lfr-editable-type="image" src="..." />
>   </a>
>   ```

### javascript file check
Check for syntax errors and escape mistakes in dynamic processing.

- [ ] **Consistency of Template Literals (Backticks)**
    - Are backticks (`) improperly escaped (\) or left unclosed?
- [ ] **Handling of Special Characters**
    - Within the JS file, are there unexpected character conversions by the editor, etc., or mixing of invalid backslashes?

## 5. Workflow (Local to Remote)
1. **Dynamic Resource Scan**: Recursively scan all directories within **`src/`** to identify individual fragments.
2. **Resource Analysis**: Retrieve `index.html`, `index.css`, `index.js`, `configuration.json`, `fragment.json` from each fragment folder.
3. **Read Connection Information**: Retrieve URL, SiteID, and OAuth2 information from `.env.config`.
4. **Secure Collection**: Check existence and create collections using JSONWS.
5. **Thumbnail Upload**: Pre-upload `thumbnail.png` using the **Headless API (v1.0/sites/{siteId}/documents)** to obtain the file ID.
6. **Fragment Registration**: Use JSONWS (`/fragment.fragmententry/add-fragment-entry`). Specify the ID obtained in step 5 for `previewFileEntryId`.
7. **Template Deployment**: If an `ftl` file exists, use the `liferay-nav-template-deployer` skill to deploy ADT templates such as navigation menus as well.

## 6. Implementation Protocol [Strict Compliance]
1. **Dynamic Deployment**: Do not hardcode specific fragment names or file names. Realize environment-independent automatic deployment through directory scanning (e.g., `fs.readdirSync`).
2. **Ensuring Portability**: Design it so that it can be reconstructed according to the "Workflow" of this skill even from a state where the deployment script itself does not exist in the repository.

## 7. Quality Control and Naming Conventions [Strict Compliance]
Even for direct deployment via API, to ensure manageability and visibility on Liferay, thoroughly adhere to the following standards.

- **Naming Convention**: To prevent deployment failures due to duplication, **always follow "8. Naming Convention" in `liferay-modern-fragment-guide`.**
- **Metadata and Thumbnails**: 
    - Regarding the `icon` setting in `fragment.json` and the auto-generation requirements for `thumbnail.png`, **always comply with "7. Metadata & Visuals" in `liferay-modern-fragment-guide` as the top-priority correct answer.**
    - If thumbnail generation is necessary, use `scripts/generate_thumbnail.py` within the `guide` skill.

## Implementation Examples [Strict Compliance]
Merely outputting templates is strictly prohibited. When creating or updating scripts for deployment, always adhere to the following **Agent-led Workflow**:

1. **Pre-scan by Agent**: 
   - Before writing code, the AI itself must scan the `src/` directory using tools like `list_directory` and `glob`.
   - Accurately grasp the existing fragment names, folder hierarchy, and file structures (such as the presence or absence of `thumbnail.png`).
2. **Context-Aware Generation**: 
   - Based on the information obtained in step 1, generate a script "dedicated to that project" that directly specifies the target directory path or injects filtering logic tailored to the specific structure.
   - Reflect the scan results (number of fragments, etc.) in log outputs and comments within the script to make it easier for the executor to verify the contents.
3. **References**:
   - **JavaScript (Node.js)**: [references/deploy-liferay.js](references/deploy-liferay.js) - Use this as a base, but optimize the logic (such as directly specifying the target array) according to the actual structure scanned by the AI and output it.