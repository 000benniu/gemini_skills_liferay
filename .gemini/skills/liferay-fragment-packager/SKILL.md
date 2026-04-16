---
name: liferay-fragment-packager
description: Expert guidance and tools for packaging Liferay Fragment Collections into ZIP files for manual import. Ensures the correct root directory structure required by Liferay's Site Builder.
---

# Liferay Fragment Packager Skill

このスキルは、Liferay DXP の「サイトビルダー > ページフラグメント」へインポート可能な ZIP ファイルを正しく生成するための手順とツールを定義します。

## 1. Critical Structure Rule【絶対遵守】

Liferay のインポーターは、ZIP ファイル内の構造に対して非常に厳格です。以下の構造を「一字一句違わず」再現する必要があります。

### 1.1 Fragment Collection ZIP (推奨)
コレクション全体をインポートする場合、**必ずルートディレクトリ（コレクション名と同名のフォルダ）を含める**必要があります。

```
collection-name.zip
└── collection-name/           <-- ルートディレクトリが必須
    ├── collection.json       <-- コレクションのメタデータ
    └── fragments/            <-- 各フラグメントの親フォルダ
        ├── fragment-1/
        │   ├── fragment.json
        │   ├── index.html
        │   ├── index.css
        │   ├── index.js
        │   ├── configuration.json
        │   └── thumbnail.png
        └── fragment-2/
            └── ...
```

### 1.2 Individual Fragment ZIP
単一のフラグメントのみをインポートする場合：
```
fragment-name.zip
└── fragment-name/            <-- フラグメント名と同名のフォルダが必須
    ├── fragment.json
    ├── index.html
    ├── index.css
    ├── index.js
    ├── configuration.json
    └── thumbnail.png
```

### 1.3 Naming Convention【絶対遵守】
フラグメント名の重複によるエラーを防ぐため、**必ず `liferay-modern-fragment-guide` の「8. Naming Convention」に従って命名を行ってください。**

## 2. Packaging Workflow

### Step 1: Prepare Metadata & Visuals【絶対遵守】
インポート前に、メタデータ、アイコン、サムネイル画像が適切に準備されている必要があります。
- **命名規約**: **`liferay-modern-fragment-guide` の「8. Naming Convention」** を遵守すること。
- **メタデータ (`fragment.json`)**: **`liferay-modern-fragment-guide` の「7. Metadata & Visuals」** に従って `"icon": "third-party"` 等を設定すること。
- **サムネイル画像 (`thumbnail.png`)**: **`liferay-modern-fragment-guide` の「7.2 サムネイル画像」** に従い、専用の Python スクリプトで画像を生成・配置すること。

### Step 2: Content Filtering【重要】
ZIP 内には、`collection.json`、`fragments/`、`resources/` 以外の不要なファイルを含めてはいけません。

### Step 3: ZIP Creation【絶対遵守】
標準の OS 右クリック「ZIP化」やシェルコマンド `Compress-Archive` は、Liferay が解釈できないアーカイブを生成する可能性があるため、**提供された Python スクリプトを使用すること。**

## 3. Tool Usage

### Scripts
- `scripts/create_zip.py`: 指定されたディレクトリを、Liferay 互換のルートフォルダ付き ZIP にパッケージングします。このスクリプトは自動的に不要なファイルをフィルタリングします。

```bash
python .gemini/skills/liferay-fragment-packager/scripts/create_zip.py <source_dir> <output_zip_name>
```

## 4. References
詳細なデプロイメントガイドについては `references/LIFERAY_DEPLOYMENT_GUIDE.md` を参照してください。
