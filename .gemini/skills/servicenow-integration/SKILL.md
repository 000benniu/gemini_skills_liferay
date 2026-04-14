---
name: servicenow-integration
description: ServiceNow インシデントサービスとの統合。ServiceNow のインシデントを取得、表示やデータの永続化も含まれます。
---

# ServiceNow Integration Guide

## 1. Overview
このスキルは、ServiceNow のインシデント（`incident`）テーブルからデータを取得し、Liferay DXP 上で表示および同期するための手順を定義します。

### 0. 環境設定の定義【絶対遵守】
すべてのスクリプト（JS/Python等）の先頭で、以下の優先順位で変数を定義すること。
1. **`.env.config` ファイル**: 存在すれば、その値を最優先で読み込む。
2. **ハードコードされたデフォルト値**: ファイルがない場合のフォールバックとして使用。

**対象**: `SERVICENOW_INSTANCE`, `SERVICENOW_USERNAME`, `SERVICENOW_PASSWORD`

ルートディレクトリに `.env.config` が存在しない場合、以下のサンプル内容で自動生成すること。
```text
SERVICENOW_INSTANCE=devXXXXX
SERVICENOW_USERNAME=admin
SERVICENOW_PASSWORD=your_password
```

## 2. API Configuration & Authentication
ServiceNow API へのアクセスには以下のパラメータを使用し、`.env.config` の値を優先します。

| Parameter | Description | Env Variable |
| :--- | :--- | :--- |
| `instance` | ServiceNow インスタンス名 | `SERVICENOW_INSTANCE` |
| `username` | API ユーザー名 | `SERVICENOW_USERNAME` |
| `password` | API パスワード | `SERVICENOW_PASSWORD` |

### Authentication Header
Basic Auth を使用します：`Authorization: Basic btoa(username:password)`

### Endpoint
`GET https://${instance}.service-now.com/api/now/table/incident`

## 3. Data Structure Notes
ServiceNow のレスポンスには、単純な文字列フィールドと、ネストされたオブジェクトフィールドが混在しています。

- **String fields**: `number`, `short_description`, `incident_state`, `urgency` など。
- **Object fields**: `caller_id`, `opened_by`, `sys_domain` など。これらは `{"link": "...", "value": "..."}` という構造を持ち、ID は `value` プロパティに格納されています。

## 4. Workflow: Fetch & Sync　**【絶対遵守】**

### Step 1: Fetch Incidents　**【絶対遵守】**
`sysparm_query` を用いてフィルタリングします。
- `incident_state!=7` (完了以外)
- `ORDERBYDESCopened_at` (最新順)

### Step 2: Persistence (LocalStorage) **【絶対遵守】**
取得したインシデントデータは、`localStorage` に保存します。
```javascript
localStorage.setItem('servicenow_incidents', JSON.stringify(data.result));
```

## 5. UI/UX Standards (modern-ux-core-protocol)
ServiceNow の情報を画面に表示する際は、`modern-ux-core-protocol` を厳守し、**デフォルトは日本語**で表示します。

### Interaction Rules **【絶対遵守】**
1. **Title Link**: インシデント番号やタイトルをクリックした際、ServiceNow 側のインシデント詳細画面（`https://${instance}.service-now.com/now/nav/ui/classic/params/target/incident.do?sys_id=${sys_id}`）へ新しいタブで遷移させます。
2. **Detail Popup**: 各リスト項目に「詳細 (Details)」ボタンを配置します。クリックするとモーダル（ポップアップ）が表示され、インシデントの概要や説明などの詳細情報を確認できるようにします。

### Visual Specs
- **Modal Design**: 不透明かつシャープな背景（`background: #ffffff`）に、繊細な境界線（`border: 1px solid rgba(0,0,0,0.05)`）と深みのあるシャドウ（`box-shadow: 0 30px 60px rgba(0,0,0,0.12)`）を採用します。
- **Grid Layout**: 非対称グリッド（1.2fr 0.8fr 等）や、ゆとりのある余白（Negative Space）を活用し、情報の視認性を高めます。
- **Status Tags**: `incident_state` の値に応じたコントラストの強い色分けを適用。
- **Typography**: 見出しには `letter-spacing: 0.1em` と `text-transform: uppercase` を適用し、現代的なタイポグラフィを実現します。
- **Animation**: モーダル表示時には `transform: scale(0.95)` から `scale(1)` への滑らかなズームイン・フェードインを、`cubic-bezier(0.23, 1, 0.32, 1)` を用いて実装します。

## 6. References
マッピング詳細は `references/api-docs.md` を参照してください。

