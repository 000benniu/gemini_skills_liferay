---
name: liferay-api-best-practices
description: Usage of Liferay DXP Headless API (Delivery, Objects, Commerce, User).
---

# Liferay API Best Practices (Domain Specific)

## 1. Overview
This skill defines specific operational guidelines for the Headless API provided by Liferay DXP.
For common JS coding conventions, asynchronous processing patterns, and environment variable settings (variable definition), **be sure to refer to `modern-ux-core-protocol`.**

## 2. API Endpoints
- **Headless Delivery:** `/o/headless-delivery/v1.0/` (Blogs, Content, Documents)
- **Objects:** `/o/c/<object-name>/` (Custom Objects)
- **Headless Commerce:** `/o/headless-commerce-admin-catalog/v1.0/` (Products, Categories)
- **Headless Admin User:** `/o/headless-admin-user/v1.0/` (Users, Accounts, Roles)

## 3. Liferay Specific Workflows

### External Reference Code (ERC)
- Always prioritize using **ERC** over internal IDs in all operations to avoid inconsistencies.
...

## 4. Design Protocol Compliance
- JS Coding Standards (Async/Await, Error Handling) -> **Refer to `modern-ux-core-protocol`**
- Environment Settings (Variable definition in code) -> **Refer to `modern-ux-core-protocol`**
- Error Handling (Fetch Pattern) -> **Refer to `modern-ux-core-protocol`**
