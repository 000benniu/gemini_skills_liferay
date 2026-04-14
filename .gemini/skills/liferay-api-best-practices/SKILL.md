---
name: liferay-api-best-practices
description: Liferay DXP Headless API（Delivery, Objects, Commerce, User）の利用。
---

# Liferay API ベストプラクティス (Domain Specific)

## 1. Overview
このスキルは、Liferay DXP が提供する Headless API の具体的な操作指針を定義します。
共通の JS コーディング規約、非同期処理のパターン、および環境変数設定（変数定義）については、**必ず `modern-ux-core-protocol` を参照してください。**

## 2. API Endpoints
- **Headless Delivery:** `/o/headless-delivery/v1.0/` (Blogs, Content, Documents)
- **Objects:** `/o/c/<object-name>/` (Custom Objects)
- **Headless Commerce:** `/o/headless-commerce-admin-catalog/v1.0/` (Products, Categories)
- **Headless Admin User:** `/o/headless-admin-user/v1.0/` (Users, Accounts, Roles)

## 3. Liferay Specific Workflows

### External Reference Code (ERC)
- すべての操作において内部 ID よりも **ERC** を優先して使用し、不整合を回避する。
...

## 4. Design Protocol Compliance
- JS コーディング基準 (Async/Await, Error Handling) -> **`modern-ux-core-protocol` 参照**
- 環境設定 (コード内での変数定義) -> **`modern-ux-core-protocol` 参照**
- エラーハンドリング (Fetch Pattern) -> **`modern-ux-core-protocol` 参照**
