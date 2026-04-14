---
name: liferay-fragment-automation-core
description: Liferay DXP におけるフラグメント、ページ、およびドキュメントリソースの API 駆動による自動生成とデプロイメントを制御するためのエキスパートガイド。
---

### 0. 環境設定の定義【絶対遵守】
すべてのスクリプト（JS/Python等）の先頭で、以下の優先順位で変数を定義すること。
1. **`.env.config` ファイル**: 存在すれば、その値を優先的に読み込む。
2. **ハードコードされたデフォルト値**: ファイルに定義がない、またはファイルが存在しない場合のフォールバックとして使用。

### 1. .env.config の管理プロトコル【絶対遵守】
1. **既存ファイルの優先**: ルートディレクトリに `.env.config` が既に存在する場合、**いかなる理由があっても上書き・変更をしてはならない。** 
2. **存在チェックの必須化**: ファイルを生成する前に、必ずツールの実行（`fs.existsSync` や `ls` 等）によって存在を確認すること。
3. **新規生成**: ファイルが「存在しない場合のみ」、以下の内容でサンプルファイルを生成すること。
   - **ファイル名**: `.env.config`
   - **内容**: 
     ```text
     LIFERAY_BASE_URL=https://your-liferay-instance.lfr.cloud
     LIFERAY_SITE_ID=
     LIFERAY_OAUTH_CLIENT_ID=
     LIFERAY_OAUTH_CLIENT_SECRET=
     LIFERAY_FRAGMENT_COLLECTION_ERC=CP_CHAIR_COLLECTION
     LIFERAY_PAGE_ERC=CP_DASHBOARD_PAGE
     ```

## 2. 目的
JSONWS と Headless API を組み合わせ、`src/` 内のデザイン素材から Liferay 上の機能的なフラグメントおよびページを完全に自動構築する。

## 3. Liferay 側の必須設定 (OAuth 2.0)
デプロイ前に、Liferay の「コントロールパネル > お使いのサイト > OAuth2 管理」で以下の設定を持つクライアントを作成すること。

| 項目 | 設定値 | 備考 |
| :--- | :--- | :--- |
| **Allowed Authorization Types** | `Client Credentials` | サーバー間通信に必須 |
| **Client Authentication Method** | `Client Secret Basic` | ヘッダー認証を使用 |
| **Client Profile** | `Other` | 制限の少ないプロファイル |

### 必要なスコープ (Scopes)
以下のスコープを「Selected」にし、`everything` にチェックを入れること。
1. **Liferay.Headless.Admin.Site**: ページの作成・管理用
2. **Liferay.Headless.Delivery**: ドキュメントのアップロード用
3. **Portal Services** : フラグメントの管理用

## 4. html, jsチェックリスト【絶対遵守】
### html file チェック
`data-lfr-editable`（エディタブル領域）に関する制約は、表示崩れやデータ破損を防ぐための最重要事項です。また、Liferayではこのルールに違反するとAPIデプロイ時に「500 Internal Server Error」で弾かれます。

- [ ] **タグとtypeの不整合（最重要・500エラー原因）**
    - `<a>` タグのエディタブルタイプは必ず `data-lfr-editable-type="link"` にすること。（`text` 等にするとパースエラーでデプロイが失敗します）
    - `<img>` タグのエディタブルタイプは必ず `data-lfr-editable-type="image"` にすること。
- [ ] **エディタブル領域にHTMLタグを内包していないか**
    - `data-lfr-editable` を付与したタグの内部（innerHTML）が**プレーンテキストのみ**であることを確認してください。
    - `<span>`, `<i>`, `<b>`, `<strong>` などのタグが含まれている場合は、エディタブルタグの外側に配置してください。
- [ ] **エディタブル要素をネスト（ラップ）させていないか**
    - `data-lfr-editable` を持つ要素の中に、別の `data-lfr-editable` 要素が入っていないか確認してください。
    - リンク（link型）の中に画像（image型）を入れる構成などは厳禁です。

> [!CAUTION]
> **【絶対遵守】スクリプト実装時の事前バリデーションと自動修正**
> デプロイスクリプト（JS等）を生成・更新する際は、必ずAPIリクエストを送信する「前」に、`index.html` 内の `<a>` や `<img>` タグの `data-lfr-editable-type` が正しく設定されているかを正規表現等でチェックし、違反している場合はスクリプト内で自動的に正しい値（`link` または `image`）に置換（Auto-fix）してファイルを上書き保存してから、デプロイ（APIリクエスト）を続行する処理を組み込んでください。

> [!CAUTION]
> **【絶対遵守】実装例**
> - **NG (HTML内包)**: `<a data-lfr-editable-id="btn" data-lfr-editable-type="link"><i class="fa"></i> 詳しく見る</a>`
> - **OK (HTML外出し)**: `<div><i class="fa"></i> <a data-lfr-editable-id="btn" data-lfr-editable-type="link">詳しく見る</a></div>`
> - **NG (ネスト)**: 
>   ```html
>   <a data-lfr-editable-id="link" data-lfr-editable-type="link" href="/">
>       <img data-lfr-editable-id="img" data-lfr-editable-type="image" src="..." />
>   </a>
>   ```

### javascript file チェック
動的な処理における構文エラーやエスケープミスを確認します。

- [ ] **テンプレートリテラル（バッククォート）の整合性**
    - バッククォート（`）が不正にエスケープ（\）されたり、閉じ忘れたりしていないか。
- [ ] **特殊文字の処理**
    - JSファイル内で、エディタ等による予期せぬ文字変換や、不正なバックスラッシュの混入がないか。

## 5. ワークフロー (Local to Remote)
1. **動的リソーススキャン**: **`src/`** 内の全ディレクトリを再帰的に走査し、個々のフラグメントを特定する。
2. **リソース解析**: 各フラグメントフォルダ内の `index.html`, `index.css`, `index.js`, `configuration.json`, `fragment.json` を取得。
3. **接続情報の読み込み**: `.env.config` から URL, SiteID, OAuth2 情報を取得。
4. **コレクション確保**: JSONWS でコレクションの存在確認・作成。
5. **サムネイル・アップロード**: **Headless API (v1.0/sites/{siteId}/documents)** を使用し、`thumbnail.png` を事前にアップロードしてファイル ID を取得する。
6. **フラグメント登録**: JSONWS (`/fragment.fragmententry/add-fragment-entry`) を使用。`previewFileEntryId` に手順5で取得した ID を指定する。
7. **テンプレートのデプロイ**: `ftl` ファイルが存在する場合、スキル `liferay-nav-template-deployer` を使用して、ナビゲーションメニュー等のADTテンプレートもデプロイする。

## 6. 実装プロトコル【絶対遵守】
1. **動的デプロイ**: 特定のフラグメント名やファイル名をハードコードせず、ディレクトリ走査（`fs.readdirSync` 等）により環境に依存しない自動デプロイを実現すること。
2. **ポータビリティの確保**: デプロイスクリプト自体がリポジトリ内に存在しない状態からでも、本スキルの「ワークフロー」に従って再構築可能な設計にすること。

## 7. 品質管理と命名規約【絶対遵守】
APIによる直接デプロイであっても、Liferay上の管理性と視認性を確保するため、以下の基準を徹底すること。

- **命名規約 (Naming Convention)**: 重複によるデプロイ失敗を防ぐため、**必ず `liferay-modern-fragment-guide` の「8. Naming Convention」に従ってください。**
- **メタデータとサムネイル**: 
    - `fragment.json` の `icon` 設定や `thumbnail.png` の自動生成要件については、**必ず `liferay-modern-fragment-guide` の「7. Metadata & Visuals」を最優先の正解として遵守してください。**
    - サムネイル生成が必要な場合は、`guide` スキル内の `scripts/generate_thumbnail.py` を使用すること。

## Implementation Examples【絶対遵守】
単なるテンプレートの出力は厳禁。デプロイ用スクリプトを作成・更新する際は、必ず以下の **Agent-led Workflow** を遵守すること：

1. **AIによる事前走査 (Pre-scan by Agent)**: 
   - コードを書く前に、AI自身が `list_directory` や `glob` などのツールを使用して `src/` 配下を走査すること。
   - 存在するフラグメントの名前、フォルダ階層、ファイル構成（`thumbnail.png` の有無など）を正確に把握すること。
2. **解析結果に基づいたコード生成 (Context-Aware Generation)**: 
   - 手順1で得た情報を元に、対象ディレクトリパスを直接指定したり、特定の構成に合わせたフィルタリングロジックを注入した「そのプロジェクト専用」のスクリプトを生成すること。
   - 走査結果（フラグメント数など）をスクリプト内のログ出力やコメントに反映させ、実行者が内容を検証しやすくすること。
3. **リファレンス**:
   - **JavaScript (Node.js)**: [references/deploy-liferay.js](references/deploy-liferay.js) - これをベースにするが、AIが走査した実際の構造に合わせてロジック（対象配列の直接指定など）を最適化して出力すること。

