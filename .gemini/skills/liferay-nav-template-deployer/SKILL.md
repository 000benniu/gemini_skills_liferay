---
name: liferay-nav-template-deployer
description: Liferay DXP におけるナビゲーションメニュー用表示テンプレート（ADT: PortletDisplayTemplate / NavItem）の完全独立版自動デプロイメントガイド。
---

# Liferay Navigation Template Deployer Ver.2

## 1. Overview
このスキルは、Liferay の JSONWS API を使用して、ナビゲーションメニューウィジェット向けの表示テンプレート（Application Display Template / ADT）の `.ftl` ファイルを動的にデプロイ（作成・更新）するための手順を提供します。フラグメントの自動デプロイ機能とは完全に独立して動作する設計になっています。

## 2. API Endpoints と Required Classes
テンプレートの作成（`add-template`）には、正しい `classNameId` と `resourceClassNameId` を Liferay 側から動的に取得して指定する必要があります。
Liferay環境によってIDは変動するため、固定のIDを使わず、必ず以下の手順で動的に解決してください。

- **取得対象クラス名**:
  1. `com.liferay.portal.kernel.theme.NavItem` (`classNameId` 用)
  2. `com.liferay.portlet.display.template.PortletDisplayTemplate` (`resourceClassNameId` 用)
- **クラスID取得 API**: `/classname/fetch-class-name`
- **テンプレート作成 API**: `/ddm.ddmtemplate/add-template`

## 3. デプロイペイロード仕様
`add-template` エンドポイントに対し、以下のJSONペイロードを送信します。また、冪等性を担保するため事前に `/ddm.ddmtemplate/get-templates` での存在確認（更新時は `update-template`）を推奨します。いずれのAPIでも `companyId` パラメータが必須です。

```json
{
  "/ddm.ddmtemplate/add-template": {
      "externalReferenceCode": "一意のERC（例: NAV_TEMPLATE_MAIN）",
      "companyId": <LIFERAY_COMPANY_ID>,
      "groupId": <LIFERAY_SITE_ID>,
      "classNameId": <NavItemのクラスID>,
      "classPK": 0,
      "resourceClassNameId": <PortletDisplayTemplateのクラスID>,
      "nameMap": {"ja_JP": "テンプレート名（ファイル名から類推）"},
      "descriptionMap": {},
      "type": "display",
      "mode": "",
      "language": "ftl",
      "script": "<FreeMarkerスクリプトの実体>",
      "serviceContext": {}
  }
}
```

## 4. 実行フロー (Agent-led Workflow)
1. **FTL ファイルの検出**: `src/` 配下からナビゲーションテンプレート（例: `global-nav.ftl` など）を走査する。
2. **OAuth2 トークン取得**: `.env.config` の `LIFERAY_OAUTH_CLIENT_ID` 等を使用して取得する。
3. **動的 ID 取得**: 
   - `/classname/fetch-class-name` を使用して、2つの必須クラスIDを取得する。
   - `/group/get-group` (groupId指定) を使用して、必須パラメータである `companyId` を取得する。
4. **存在確認とデプロイ**: 
   - `/ddm.ddmtemplate/get-templates` (companyId指定必須) で既存テンプレートを検索する。
   - 存在すれば `update-template`、存在しなければ `add-template` でデプロイを実行する。

## 5. リファレンスコード
- 参照実装: `references/deploy-nav-template.js`
