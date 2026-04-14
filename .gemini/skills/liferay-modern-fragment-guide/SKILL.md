---
name: liferay-modern-fragment-guide
description: Liferay のモダンなフラグメント作成（HTML/CSS/JS）に関するベストプラクティス、および動的メニュー連携ガイド。
---

# Modern Liferay Fragment Guide (Domain Specific)

## 1. Overview
- **【最重要コアスキル】**: このスキルはLiferay DXPのフラグメント開発における**コア（中核）スキル**です。ここに記載されているすべてのルール、特に【絶対遵守】事項は、一部の例外もなく**「すべて、もれなく」対応**することが義務付けられています。
- このスキルは、Liferay DXP の「フラグメント」機能に特化した実装指針を定義します。
- **ディレクトリ構造**: すべてのフラグメントは必ず **`src/fragments/`** 配下にフォルダ単位で管理してください。
- **命名規則**: フラグメント名およびフォルダ名には、プロジェクト間で衝突を避けるための「一意かつ識別しやすいプレフィックス」を必ず付与してください。
- デザイン基準、共通 CSS/JS、およびモバイルファーストの原則については、**必ず `modern-ux-core-protocol` を参照してください。**
- ヘッダー等でナビゲーションが必要な場合、内部ロジックをフラグメントに持たせず `lfr-drop-zone` を使用する。
- 配置されるナビゲーションウィジェットには、**必ずスキル`liferay-nav-template-generator`で生成したテンプレートを適用する。**
- 表示言語は日本語とします。
- 【絶対遵守】このスキルに記述した内容はLiferay DXPの最新定義を反映済みなので、最新とします。絶対に遵守してください。
- 画像を積極的に使用してビジュアルインパクトを高めてください。

## 2. HTML: Liferay Specific Tags

### LFR-Editable
ユーザーがページビルダーで編集可能な領域を定義します。
- **Text:** `<h2 data-lfr-editable-id="my-title" data-lfr-editable-type="text">Title</h2>`
- **Image:** `<img data-lfr-editable-id="my-image" data-lfr-editable-type="image" src="..." />`
- **Link:** `<a data-lfr-editable-id="my-link" data-lfr-editable-type="link" href="#">Link Display Text</a>`
- **Span:** `<span data-lfr-editable-id="my-span" data-lfr-editable-type="text">Span Text</span>`

> [!CAUTION]
> **【絶対遵守】エディタブル領域のHTML内包禁止およびネスト（ラップ）禁止**
> `data-lfr-editable` を付与したタグの内部には、プレーンテキストのみを含めるようにしてください（文字化けやタグのエスケープを防ぐため）。
> 内部にHTMLタグ（`<span>`, `<i>`, `<b>`, `<strong>`, `<em>` など）を含めることは厳禁です。
> アイコン（`<i>`）やバッジ（`<span>`）を含めたい場合は、エディタブルタグの「外側（直前など）」に配置してください。
> **さらに、エディタブル要素同士をネスト（別のエディタブル要素でラップ）することも厳禁です。** 独立して配置するか、リンク等のラップが必要な場合は通常のHTMLタグ（非エディタブル）を使用してください。
> **NG (HTML内包)**: `<a data-lfr-editable-id="l1" data-lfr-editable-type="link"><i class="fa-solid fa-clock"></i> リンク</a>`
> **OK (HTML内包)**: `<div><i class="fa-solid fa-clock"></i> <a data-lfr-editable-id="l1" data-lfr-editable-type="link">リンク</a></div>`
> **NG (エディタブルのネスト)**:
> ```html
> <a data-lfr-editable-id="logo-link" data-lfr-editable-type="link" href="/">
>     <img data-lfr-editable-id="logo-image" data-lfr-editable-type="image" src="..." />
> </a>
> ```

## 3. JavaScript: Fragment Environment
フラグメント特有のJSコンテキストとデータ連携。

### Fragment Context
- **fragmentElement:** フラグメントのルート要素（DOM）を直接参照します。`fragmentElement.querySelector('.class')` のように使用します。
- **Mapping:** フラグメントのマッピング機能を活用し、Liferay Object や Web Content のデータを美しく流し込む。

### Data Logic
- API を使用した動的なデータ表示を行う場合は、`modern-ux-core-protocol` で定義された Async/Await パターンとエラーハンドリングに従う。

> [!CAUTION]
> **【絶対遵守】JSコード生成時のバッククォートのエスケープ禁止**
> スクリプト（JavaScript）を生成する際、テンプレートリテラルで使用するバッククォート（`）や変数展開（${}）をバックスラッシュ（\）でエスケープしないでください（例: \` や \${ は禁止）。これはJSの文法エラーを引き起こします。必ずエスケープ無しのバッククォート（`）と変数展開（${}）を出力してください。

### 4. Dynamic Menu Integration
フラグメント内に「動的なサイトメニュー」を組み込む際、以下のルールに従います。

#### 4.1 Dropzoneの活用 (フラグメント側)
ヘッダーやナビゲーションが必要な場合、内部ロジックをフラグメントに持たせず、ウィジェットを配置するための専用 `lfr-drop-zone` を定義します。
配置時の利便性とレイアウト確保のため、`lfr-drop-zone` には CSS で **`min-width: 300px;`** も指定することを必須とします。**

> [!IMPORTANT]
> **レンダリング後の特性 (Rendered Characteristics)**
> `lfr-drop-zone` 内にウィジェットを配置すると、Liferay によって `lfr-layout-structure-item-...` や `portlet-boundary` といった複数のラッパー `div` が自動生成されます。
> **【絶対遵守】CSS/JS設計の注意点**:
> 1.  **子要素セレクタ (`>`) の回避**: フラグメントのCSSで `lfr-chair-header__nav > .ln-menu` のように記述すると、自動生成されるラッパーの介在によりスタイルが適用されません。必ず子孫セレクタ (` `) を使用してください。
> 2.  **イベントデリゲーションの活用**: JSでメニュー内要素にアクセスする場合、`fragmentElement.querySelector('.ln-menu')` は配置直後に取得できない可能性があるため、親要素（フラグメントルート）へのイベントデリゲーションを使用して、動的に追加されたメニュー要素を制御してください。
> 3.  **モバイルドロワーの階層**: モバイルドロワー（`.lfr-chair-header__nav`）の中に `lfr-drop-zone` を含める場合、ドロワー自体の `display: none` を解除し、`transform` 等で画面外に待機させることで、Liferayのウィジェット配置機能を損なわずにドロワーを実現できます。

```html
<div class="header-navigation">
    <lfr-drop-zone></lfr-drop-zone>
</div>
```
#### 4.2 標準モバイルナビゲーション実装パターン (Mandatory)
モバイル表示時のハンバーガーメニューとドロワーは、以下のパターンで「必ず」実装してください。

1.  **JSでのクラス制御**: `mobileToggle` クリック時に、ヘッダーに `.mobile-menu-open` を付与し、`document.body` にスクロール防止用クラスをトグルする。
2.  **モバイルサブメニュー（アコーディオン）の実装**:
    *   `lfr-drop-zone` 内に配置されたナビゲーションテンプレートが多階層の場合、スマホ表示では**必ずアコーディオン形式**で展開すること。
    *   親メニュー（リンクなし）または矢印アイコン（`.ln-menu__indicator`）のタップをトリガーとし、`.mobile-open` クラス等を付与してサブメニューを表示・非表示させること。
    *   矢印アイコンの回転（180度）による視覚的フィードバックを含めること。
3.  **CSSでのドロワー配置**:
...
   - `.header-navigation` (Wrapper) はモバイルで `position: fixed` または `sticky` を使用。
   - `top: var(--header-height);` でヘッダー直下に配置。
   - `background: #ffffff !important;` で透過を防止。
   - `transition` による滑らかな出現（Slide or Fade）。
3. **メニュー項目のレイアウト**:
   - モバイルでは `.ln-menu` を `flex-direction: column;` に変更。
   - ドロップダウン（`.ln-menu__child-list`）はホバーではなく、クリックまたは常時展開（`position: static;`）を考慮する。

#### 4.3 スキル連携: liferay-nav-template-generator【絶対遵守】
`lfr-drop-zone` に配置されるナビゲーションメニューウィジェットに適用するテンプレート（.ftl）を生成する際は、**必ずスキル `liferay-nav-template-generator` を利用してください。**

#### 4.4 アイコン（FontAwesome）の取り扱い (Mandatory)
Liferay 7.3 以降、FontAwesome は標準で含まれなくなりました。フラグメント内で `<i>` タグ（FontAwesome）を使用する場合、以下のルールを厳守してください。

1. **ライブラリの導入**: フラグメントの `index.html` の冒頭に、必ず外部 CDN（例: Cloudflare）の FontAwesome CSS リンクを追記してください。
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
   ```
2. **一貫性**: プロジェクト内で使用する FontAwesome のバージョンを統一してください。


### 設計ガイドライン
- **構造の分離**: フラグメントは「枠組み（Container/Dropzone）」を担当し、ナビゲーションメニューの「内部ロジック（Menu list/Link logic）」は生成されたナビゲーションテンプレートが担当するように設計を分離します。
- **画像の取り扱い**: 画像を多めに使ってビジュアルインパクトを高めることを推奨します。画像は高品質なものを使用し、必要に応じて `object-fit: cover;` を適用してください。 
- **スタイルの整合性**: フラグメントのCSS変数（Clay/Bootstrap準拠）を、ナビゲーションテンプレート側でも継承できるようにクラス名を設計します。
- **ドロップダウンの制御**: ナビゲーションを組み込む際は、必ず親要素に `position: relative` を、子リスト（`.ln-menu__child-list`）に `position: absolute` を指定し、デスクトップ表示でのホバー制御（`opacity/visibility`）を記述すること。
- **モバイルドロワーの不透明化**: モバイル表示時のメニュー展開（`.mobile-menu-open` 等）は、背後を透過させないため、必ず不透明な背景（`background: #ffffff !important` 等）を指定すること。
- **高さ管理と追従**: ヘッダーフラグメントで `sticky` を使用する場合、ドロワー（モバイルメニュー等）が正しく追従するように、スクロール状態（`is-shrunk` 等）に応じて `--header-height` などの変数も動的に更新してください。
- **不透明度の確保**: モバイル用ドロワーは、背後を透過させないため、背景色に `!important` を指定し、親要素（ヘッダー）の `backdrop-filter` 等の影響を排除してください。

### 5. Fragment Configuration & Configuration Template
フラグメントの設定定義と、それを用いたテンプレートの動的制御。

> [!CAUTION]
> **【絶対遵守】フォーマット厳守の徹底**
> `configuration.json` の構文、フィールド定義、および HTML 側での参照構文（`${configuration.fieldName}`）は、Liferay DXP の仕様により極めて厳密なフォーマットが要求されます。一字一句のミスも許されません。
> 記述ミスはフラグメントの読み込み失敗や予期せぬ動作を招くため、必ず以下の5.1から5.4までの定義を「絶対」にフォローし、変更の際は一貫性を徹底的に検証してください。

#### 5.1 構成定義 (configuration.json)
フラグメントのフォルダ内にある `configuration.json` に設定を記述します。大きく分けて `fieldSets`、`fields` で構成されます。

```json
{
  "fieldSets": [
    {
      "label": "スタイル設定",
      "fields": [
        {
          "name": "numberOfFeatures",
          "label": "Number Of Features",
          "description": "number-of-features",
          "type": "select",
          "dataType": "int",
          "typeOptions": {
              "validValues": [
                {"value": "1"},
                {"value": "2"},
                {"value": "3"}
              ]
          },
          "defaultValue": "3"
        },
        {
          "name": "showButton",
          "label": "ボタンを表示する",
          "type": "checkbox",
          "defaultValue": true
        }
      ]
    }
  ]
}
```

#### 5.2 HTML側での参照方法 (index.html)
HTML内では `${configuration.fieldName}` という構文を使って、JSONで定義した値を取得します。

```html
<div class="container bg-${configuration.backgroundColor}">
    <h2 data-lfr-editable-id="title" data-lfr-editable-type="text">
        タイトル
    </h2>
</div>
<div style="display: [#if configuration.showTitleButton??]'block'[#else]'none'[/#if];">
```

#### 5.3 フィールドタイプ一覧

> [!CAUTION]
> **【絶対遵守】以下の定義のみを利用することを徹底**

| type | dataType | 用途 |
| :--- | :--- | :--- |
| text | string | 任意のテキスト入力 |
| select | string | ドロップダウン選択（optionsが必要） |
| checkbox | boolean | ON/OFFの切り替え |
| colorPicker | string | カラーコード（#FFFFFFなど）の取得 |
| number | number | 数値入力（スライダーも可能） |

#### 5.4 開発時のポイント（Tips）
- **名前の一致**: `configuration.json` の `name` と、HTML内の `configuration.name` は完全に一致させる必要があります。
- **デフォルト値の重要性**: `defaultValue` を設定しておかないと、配置直後に意図しない表示（空の状態）になることがあります。
- **プレビューへの反映**: フラグメントエディタの右側にある「設定」タブから値を変更すると、リアルタイムでHTMLに反映されます。

## 7. Metadata & Visuals (fragment.json)【絶対遵守】

フラグメントの管理性と視認性を確保するため、以下の設定を必ず含めてください。

### 7.1 アイコンとパスの設定 (fragment.json)
- **`"icon": "third-party"`**: Liferay DXP の UI 上でカスタムフラグメントとして正しく識別されるために【絶対遵守】。
- **パスの明示的定義**: 以下のすべてのパスを省略せず定義すること。

**実装例 (`fragment.json`):**
```json
{
  "name": "ORG_PROJ_MyFragment",
  "type": "component",
  "icon": "third-party",
  "htmlPath": "index.html",
  "cssPath": "index.css",
  "jsPath": "index.js",
  "configurationPath": "configuration.json",
  "thumbnailPath": "thumbnail.png"
}
```

### 7.2 サムネイル画像 (`thumbnail.png`) の自動生成【絶対遵守】
各フラグメントには内容を識別するためのサムネイル画像が必須です。
- **規格**: **320x160 px** の PNG 画像。
- **自動生成フロー**: フラグメント作成または更新時、AI は必ず **Python スクリプト (`scripts/generate_thumbnail.py`)** を実行して画像を物理的に生成すること。
- **デザイン**: スクリプトにより「ランダムな背景色」と「中央にフラグメント名」が描画されます。
- **配置**: 生成された画像は必ず各フラグメントディレクトリの直下に `thumbnail.png` という名前で配置してください。

## 8. Naming Convention (命名規約)【絶対遵守】
重複によるインポート失敗や予期せぬ上書きを防ぐため：
1.  **`fragment.json` の `name` フィールド**: 必ずプロジェクトや組織に基づいた「一意かつ識別しやすいプレフィックス」を付与すること（例: `ORG_PROJ_HeroBanner`）。
2.  **フォルダ名**: `fragment.json` の `name` と完全に一致させること。

## 9. Design Protocol Compliance
- ナビゲーションテンプレート作成 -> **`liferay-nav-template-generator` 参照**
- 共通のデザイン・コーディング規約 -> **`modern-ux-core-protocol` 参照**
- デザイン規約 (BEM, Typography, Visual Impact) -> **`modern-ux-core-protocol` 参照**
- メディア設計 (Aspect Ratio, Object Fit, High-Quality Images) -> **`modern-ux-core-protocol` 参照**
- インタラクション (Scroll Reveal, CSS Animations) -> **`modern-ux-core-protocol` 参照**
- モバイル対応 (Mobile-First, Breakpoints, Fast Loading) -> **`modern-ux-core-protocol` 参照**
- ブランディング (Consistent Branding, CTAs) -> **`modern-ux-core-protocol` 参照**

## 10. Post-Implementation Validation (Workflow)【絶対遵守】
フラグメントの HTML を作成・更新した後は、タスクを完了する前に必ず以下のチェックフローを実行し、再発防止に努めてください。

1. **HTML内包のチェック**: `data-lfr-editable` が付与されたタグの内部に、HTMLタグ（`<i>`, `<span>`, `<img>` など）が含まれていないかコードを再確認する。
2. **エディタブルのネストチェック**: `data-lfr-editable` が付与されたタグの内部に、さらに別の `data-lfr-editable` 要素が存在していないか再確認する。
3. **修正の実施**: もし上記に違反するコードを生成していた場合は、ユーザーに報告する前に自己修正（`div` 等による外側でのラップ、またはエディタブル属性の分離）を行うこと。
