---
name: liferay-object-management
description: Liferay DXP におけるオブジェクト定義（Object Definition）の動的な生成、公開、および管理ワークフロー
---

# Liferay オブジェクト管理スキル (JS/Ajax 版)

このスキルは, Liferay DXP 上でオブジェクト定義（Object Definition）を動的に生成、公開、および管理するためのものです。Node.js や Python に依存せず、ブラウザまたはフラグメント上で動作する純粋な JavaScript (Fetch API) を使用します。

## 技術制約
- **言語**: JavaScript (ES6+)
- **通信**: Fetch API / XMLHttpRequest (Ajax)
- **禁止事項**: Node.js モジュール、TypeScript、Python、外部ライブラリ（jQuery等）への依存。

## 実行プロトコル（ワークフロー）

オブジェクト操作を行う際は、常に以下のステップを順守し、**進捗を console に出力すること。**

### 0. 環境設定の定義【絶対遵守】
コードの先頭で以下の優先順位で変数を定義すること。
1. **`.env.config` ファイル**: 存在すれば、その値を最優先で読み込む。
2. **ハードコードされたデフォルト値**: ファイルがない、または値が定義されていない場合のフォールバックとして設定する。

**実装プロトコル**:
ルートディレクトリに `.env.config` が存在しない場合、以下のサンプル内容でファイルを自動生成すること。
```text
LIFERAY_BASE_URL=http://localhost:8080
# その他、必要な認証情報を追記
```

### 1. オブジェクトの存在確認 (GET)
`/o/object-admin/v1.0/object-definitions?filter=name eq '${definition.name}'` を使用して、同名のオブジェクトが既に存在するか確認する。

### 2. オブジェクトの定義作成 (POST)
存在しない場合、`/o/object-admin/v1.0/object-definitions` に対して詳細なペイロードを送信する。
- **重要**: `externalReferenceCode` (ERC) は常に一意の値を生成（または指定）して含めること。

### 3. オブジェクトの公開 (POST)
作成直後は `draft` 状態のため、エントリを追加する前に公開（Publish）が必要。
- **エンドポイント**: `/o/object-admin/v1.0/object-definitions/{objectDefinitionId}/publish`

### 4. エントリの追加 (POST)
公開後、`/o/c/{pluralName}` またはオブジェクト定義で指定した `restContextPath` に対してデータを送信する。

---

## 詳細リファレンスとサンプル

### オブジェクト定義ペイロードの構成例 (より詳細な例)
オブジェクトを作成する際、様々なビジネスタイプ（Text, LongText, Date, Keyword等）を組み合わせた JSON 構造の例です。

```json
{
  "active": true,
  "name": "Email",
  "label": { "en_US": "Email", "ja_JP": "メール" },
  "pluralLabel": { "en_US": "Emails", "ja_JP": "メール" },
  "externalReferenceCode": "EMAIL_OBJECT_ERC",
  "scope": "company",
  "titleObjectFieldName": "subject",
  "objectFields": [
    {
      "name": "sender",
      "label": { "en_US": "Sender" },
      "DBType": "String",
      "businessType": "Text",
      "required": true,
      "indexed": true,
      "type": "String"
    },
    {
      "name": "subject",
      "label": { "en_US": "Subject" },
      "DBType": "String",
      "businessType": "Text",
      "required": true,
      "indexed": true,
      "type": "String"
    },
    {
      "name": "body",
      "label": { "en_US": "Body" },
      "DBType": "String",
      "businessType": "LongText",
      "required": true,
      "type": "String"
    },
    {
      "name": "timestamp",
      "label": { "en_US": "Timestamp" },
      "DBType": "Date",
      "businessType": "Date",
      "required": true,
      "indexed": true,
      "type": "Date"
    },
    {
      "name": "emailActionType",
      "label": { "en_US": "Email Action Type" },
      "DBType": "String",
      "businessType": "Text",
      "required": true,
      "indexed": true,
      "indexedAsKeyword": true,
      "type": "String"
    }
  ]
}
```
- **`indexedAsKeyword: true`**: `emailActionType` のように、特定のキーワードでフィルタリングや検索を行いたい場合に重要です。
- **`businessType: "LongText"`**: メールの本文など、長文を格納するフィールドに使用します。

### エントリの一括追加 (Bulk/Populate)
オブジェクト定義が公開された後、ダミーデータや外部データを一括で投入する際の JavaScript 例です。

```javascript
const populateObjectEntries = async (pluralName, records) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'x-csrf-token': Liferay.authToken
  };

  const endpoint = `/o/c/${pluralName}`;
  console.info(`Adding ${records.length} records to ${endpoint}...`);

  for (const [index, record] of records.entries()) {
    try {
      // 各エントリには一意の ERC を含めることを推奨
      if (!record.externalReferenceCode) {
        record.externalReferenceCode = `entry-${Date.now()}-${index}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(record)
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      console.info(`[${index + 1}/${records.length}] Added: ${record.subject || 'Record'}`);
    } catch (error) {
      console.error(`Failed to add record ${index + 1}:`, error);
    }
  }
  console.info("Population complete.");
};
```

### リレーションシップ（関連）フィールドの扱い
他のオブジェクトやアカウントに関連付ける場合、フィールド名は `r_{relationshipName}_{relatedObject}Id` という形式になります。
- **例**: `r_accountToEmail_accountEntryId`: `12345` (Integer ID)
- **注意**: ID は直接の数値として渡し、オブジェクトで囲む必要はありません。

### 実装サンプル (Pure JS - Liferay Fragment Context)

```javascript
const createObjectFullFlow = async (definition) => {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'x-csrf-token': Liferay.authToken
  };

  // 1. 作成
  console.info(`Creating object definition: ${definition.name}...`);
  const createRes = await fetch('/o/object-admin/v1.0/object-definitions', {
    method: 'POST',
    headers,
    body: JSON.stringify(definition)
  });
  const newObj = await createRes.json();
  const objId = newObj.id;

  // 2. 公開
  console.info(`Publishing object (ID: ${objId})...`);
  await fetch(`/o/object-admin/v1.0/object-definitions/${objId}/publish`, {
    method: 'POST',
    headers
  });

  // 3. 公開完了待ち（簡易的なポーリング）
  let status = 'draft';
  while (status !== 'approved') {
    const checkStatus = await fetch(`/o/object-admin/v1.0/object-definitions/${objId}`, { headers });
    const data = await checkStatus.json();
    status = data.status.code === 0 ? 'approved' : 'draft';
    if (status !== 'approved') await new Promise(r => setTimeout(r, 2000));
  }
  console.info("Object is now published and ready.");
};
```
