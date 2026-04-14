---
name: modern-ux-core-protocol
description: Core UI/UX and Design Standards (CSS, JS, HTML, Mobile-First). ファッション・現代的・クールなデザインと、堅牢な実装を実現するための基本規約。
---

# モダンUXコアプロトコル (基本規約)

この規約は、Liferay DXP 上で「ファッション・現代的・カッコいい」最高峰のユーザー体験（UX）を構築するための、デザインと技術の共通ガイドラインです。

## 1. 視覚的・デザイン基準 (Visual & Design Standards)

### 圧倒的な視覚的インパクト (Visual Impact)
- **高品質な画像利用:** `object-fit: cover` と `aspect-ratio` を駆使し、解像度を保ちつつレイアウトを維持する。
- **テクスチャと深み:** 高精細な画像、繊細なグラデーション、シャープなシャドウ（`box-shadow: 0 20px 40px rgba(0,0,0,0.1)`）を組み合わせてモダンな立体感を出す。
- **大胆なタイポグラフィ:** 極細（100-200）と極太（800-900）を組み合わせた対比。見出しには `letter-spacing: 0.1em` や `text-transform: uppercase` を適用し、エディトリアル（雑誌風）な高級感を演出する。
- **CSS アニメーション:** 静的な表示を避け、`Intersection Observer` を用いたフェードイン、スライド、ズームなどの「動き」を標準装備する。

### 直感的なナビゲーション (Easy Navigation)
- **シンプルかつ明快なメニュー:** 階層を深くせず、カテゴリー名を直感的に（例: 「New Arrivals」「Collections」）。
- **洗練された検索体験:** 入力時にリアルタイムで結果を表示するか、モーダルでフル画面の検索インターフェースを提供する。
- **一貫したラベリング:** 全ページで用語を統一。クリックできる要素は一目でそれと分かるようにする。

### 明確な行動喚起 (Clear CTAs)
- **コントラストの強いボタン:** 背景や画像に埋もれない、際立つ配色。
- **戦略的な配置:** ファーストビュー（Hero Area）、スクロールの区切り、フッターなど、ユーザーが意思決定するタイミングに必ず CTA を配置する。
- **マイクロインタラクション:** ホバー時やクリック時に、色の変化だけでなく、僅かな移動（`translateY(-2px)`）や拡がり（`scale`）を加えることで、操作への期待感を高める。

### 強固なブランディング (Strong Branding)
- **一貫したカラーパレット:** ブランドカラー、アクセントカラー、背景色を厳格に管理。
- **トーン＆マナーの統一:** タイポグラフィのフォント、行間、マージン、角丸（`border-radius: 4px` または `0px` のようなシャープな選択）を全コンポーネントで統一する。
- **ブランドの個性を反映:** ブランドが「Bold（大胆）」なら強い色彩と大きな文字を、「Minimal（最小限）」なら余白を贅沢に使うなど、戦略に合わせたデザイン要素を選択する。

## 2. 実装・技術プロトコル (Implementation Protocols) - 【絶対遵守】

### CSS Architecture (構築規則)
- **No `position: fixed`:** モバイルにおけるスクロールの不安定性やオーバーレイの重なり問題を避けるため、`position: fixed` の使用を禁止する。ヘッダーの固定等が必要な場合は、必ず **`position: sticky`** を使用すること。
- **Semantic Shielding:** UIは原則 **`<div>` または `<span>`** で構成し、Liferay や外部ライブラリのグローバル定義（`h1`, `p`, `a` 等への直接指定）による干渉を避ける。
- **BEM 命名規則:** クラス名は BEM を採用し、一意のプレフィックス（例: `lux-`, `ui-`, `ln-`）を付与してカプセル化を徹底する（例: `lux-card`, `lux-btn--primary`）。
- **Modern Layout:** `grid` と `flex` を主軸にし、`clamp()` を活用した流動的なサイズ調整を行う。

### JavaScript & データ連携規則
- **Variable Definition:** 環境変数やAPI設定などの動的な値は、コードの冒頭でデフォルト値として変数定義すること。
- **Async/Await & Error Handling:** すべての API インタラクションには `try-catch` を用い、失敗時も UI 上で Elegant Error State を表示すること。
- **Performance:** アニメーションは `transform` と `opacity` に限定し、`will-change` を使って 60fps を維持する。

### モバイル・デザイン (Mobile-First Approach)
- **Priority (実装順序):** スタイルは常に **スマホ（375px〜）を基準に書き始め**、デスクトップへ拡張する。
- **タッチターゲットの確保:** ボタンやリンクは最小 **44px x 44px** の領域を確保。
- **軽量・高速化:** 画像の Lazy Load (`loading="lazy"`) を徹底。ネイティブの CSS/JS を優先して 60fps の滑らかな操作感を実現する。
- **フルスクリーンメニュー:** モバイルではハンバーガーメニューから、画面全体を使った大胆なナビゲーション（不透明な背景 `background: #ffffff !important`）を展開する。

## 3. インタラクション & モーション (Interactions & Motion)

- **Easing:** 心地よい動きのために `cubic-bezier(0.23, 1, 0.32, 1)`（極めて滑らかな動き）を多用する。
- **Scroll Shrink:** スクロール量に応じて要素の高さや背景の透明度を動的に変更（例: `is-shrunk` クラスのトグル）し、コンテンツへの集中を高める。
- **Scroll Reveal:** `Intersection Observer` を活用し、要素が画面に入った際にふわっと現れる演出（Reveal Effect）を標準実装する。
- **Loading State:** スケルトンスクリーンや、洗練されたローディングアニメーションを実装する。
- **Microinteractions:** ホバーやクリックなどのユーザーアクションに対して、色の変化だけでなく、僅かな移動（`translateY(-2px)`）や拡がり（`scale(1.05)`）を加えることで、操作への期待感を高める。
