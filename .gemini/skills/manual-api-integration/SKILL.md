---
name: manual-api-integration
description: A skill to retrieve and display a list of business manuals from an external system. Defines API endpoints and modern display logic on Liferay.
---

# Manual API Integration Guide

## 1. Overview
This skill defines the procedures for retrieving a list of business manuals (SOPs) from an external manual management system and beautifully displaying them on Liferay DXP.

### 0. Environment Setting Definition [Strict Compliance]
At the beginning of all scripts (JS/Python, etc.), define variables in the following order of priority:
1. **`.env.config` file**: If it exists, read its value with the highest priority.
2. **Hard-coded default values**: Use as a fallback if the file does not exist.

**Target**: `MANUAL_API_ENDPOINT`

If `.env.config` does not exist in the root directory, automatically generate it with the following sample content.
```text
MANUAL_API_ENDPOINT=https://randomapi.com/api/hszdw6mc?key=LESD-D3KS-40OF-62DB
```

## 2. API Configuration
Use the following endpoints, prioritizing the values in `.env.config`.

| Parameter | Env Variable | Default Fallback |
| :--- | :--- | :--- |
| `Endpoint` | `MANUAL_API_ENDPOINT` | `https://randomapi.com/api/hszdw6mc?key=LESD-D3KS-40OF-62DB` |

### Auth
Because this API includes a `key` in the URL parameters, no additional authentication headers are required.

## 3. Data Structure
The response has the following hierarchical structure:
- `results[0].manuals`: An array of manuals.
- **Manual Data Fields**:
  - `manual_id`: SOP identifier (e.g.: SOP-100)
  - `title`: Manual name
  - `meta`: Includes category, priority, author, version, and last_review date.
  - `workflow`: An array of procedures (including `step`, `task`, `assigned_role`, `is_critical`).
  - `contact`: Responsible team (`team`) and internal extension number (`internal_line`).

## 4. UI/UX Standards (modern-ux-core-protocol)
When displaying manual information on the screen, strictly adhere to `modern-ux-core-protocol` and display in **English by default.**

## 5. Persistence (LocalStorage)
Save the retrieved manual data in `localStorage`.
```javascript
localStorage.setItem('task_manuals', JSON.stringify(results[0].manuals));
```

### Interaction Rules **[Strict Compliance]**
1. **List View**: Display badges according to categories (`meta.category`) and priorities (`meta.priority`).
2. **Detail Action (Modal)**: Display a detailed modal containing the following elements when clicked.
   - **Constraint**: The maximum height of the modal must be **700px**, and internal scrolling must be enabled if the content exceeds this.
   - **Meta Grid**: Organize category, version, author, and priority in a grid of about 4 columns.
   - **Workflow Visualization**: Loop through the `workflow` array and display the step numbers, tasks, and roles. Highlight steps with `is_critical: true` using red accents or warning icons.
   - **Emergency Contact**: Place the responsible team and internal extension number at the bottom.

### Visual Specs [Strict Compliance]
- **Grid Layout**: Asymmetric grids or card-format layouts within the modal.
- **Scrolling & Overflow**: Apply `display: flex; flex-direction: column; max-height: 100%; overflow: hidden;` to the modal body (`.lux-modal__content`), and set `flex: 1 1 auto; overflow-y: auto;` to the body section (`.lux-modal__body`) to ensure appropriate internal scrolling if the content exceeds.
- **Workflow Styling**: Change the background color or border (e.g., `border-left`) for each step to visualize the continuity of the procedure.
- **Critical Indicators**: Apply visual warnings (e.g., using the `#ff4757` color) based on the `is_critical` flag.
- **Animation**: Implement zoom-in when displaying modals and fade-in when displaying lists.

## 5. References
Please refer to `references/api-docs.md` for field mappings and detailed query examples.