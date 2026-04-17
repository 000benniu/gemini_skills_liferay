---
name: servicenow-integration
description: Integration with ServiceNow Incident Service. Includes fetching, displaying, and persisting ServiceNow incidents.
---

# ServiceNow Integration Guide

## 1. Overview
This skill defines the procedure for fetching data from ServiceNow's incident (`incident`) table, and displaying and syncing it on Liferay DXP.

### 0. Environment Setting Definition [Strict Compliance]
At the beginning of all scripts (JS/Python, etc.), define variables in the following order of priority:
1. **`.env.config` file**: If it exists, read its value with the highest priority.
2. **Hard-coded default values**: Use as a fallback if the file does not exist.

**Target**: `SERVICENOW_INSTANCE`, `SERVICENOW_USERNAME`, `SERVICENOW_PASSWORD`

If `.env.config` does not exist in the root directory, automatically generate it with the following sample content.
```text
SERVICENOW_INSTANCE=devXXXXX
SERVICENOW_USERNAME=admin
SERVICENOW_PASSWORD=your_password
```

## 2. API Configuration & Authentication
Use the following parameters to access the ServiceNow API, prioritizing the values in `.env.config`.

| Parameter | Description | Env Variable |
| :--- | :--- | :--- |
| `instance` | ServiceNow Instance Name | `SERVICENOW_INSTANCE` |
| `username` | API Username | `SERVICENOW_USERNAME` |
| `password` | API Password | `SERVICENOW_PASSWORD` |

### Authentication Header
Use Basic Auth: `Authorization: Basic btoa(username:password)`

### Endpoint
`GET https://${instance}.service-now.com/api/now/table/incident`

## 3. Data Structure Notes
ServiceNow responses contain a mix of simple string fields and nested object fields.

- **String fields**: `number`, `short_description`, `incident_state`, `urgency`, etc.
- **Object fields**: `caller_id`, `opened_by`, `sys_domain`, etc. These have a structure like `{"link": "...", "value": "..."}`, and the ID is stored in the `value` property.

## 4. Workflow: Fetch & Sync **[Strict Compliance]**

### Step 1: Fetch Incidents **[Strict Compliance]**
Filter using `sysparm_query`.
- `incident_state!=7` (Not closed)
- `ORDERBYDESCopened_at` (Newest first)

### Step 2: Persistence (LocalStorage) **[Strict Compliance]**
Save the fetched incident data in `localStorage`.
```javascript
localStorage.setItem('servicenow_incidents', JSON.stringify(data.result));
```

## 5. UI/UX Standards (modern-ux-core-protocol)
When displaying ServiceNow information on the screen, strictly adhere to `modern-ux-core-protocol` and display in **English by default.**

### Interaction Rules **[Strict Compliance]**
1. **Title Link**: When the incident number or title is clicked, open a new tab and transition to the incident details screen on the ServiceNow side (`https://${instance}.service-now.com/now/nav/ui/classic/params/target/incident.do?sys_id=${sys_id}`).
2. **Detail Popup**: Place a "Details" button for each list item. When clicked, display a modal (popup) so that detailed information such as the incident's overview and description can be confirmed.

### Visual Specs
- **Modal Design**: Adopt an opaque and sharp background (`background: #ffffff`), delicate borders (`border: 1px solid rgba(0,0,0,0.05)`), and deep shadows (`box-shadow: 0 30px 60px rgba(0,0,0,0.12)`).
- **Grid Layout**: Utilize asymmetric grids (e.g., 1.2fr 0.8fr) and generous margins (Negative Space) to enhance information visibility.
- **Status Tags**: Apply high-contrast color coding based on the `incident_state` value.
- **Typography**: Apply `letter-spacing: 0.1em` and `text-transform: uppercase` to headings to achieve modern typography.
- **Animation**: When displaying the modal, implement a smooth zoom-in and fade-in from `transform: scale(0.95)` to `scale(1)` using `cubic-bezier(0.23, 1, 0.32, 1)`.

## 6. References
Please refer to `references/api-docs.md` for mapping details.