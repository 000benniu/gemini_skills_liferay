---
name: liferay-nav-template-generator
description: Liferayナビゲーションテンプレートジェネレーター。FreeMarkerおよびNavItem APIをベースとしています。
---

# Liferay Navigation Template Generator (Domain Specific)

## 1. Overview
このスキルは、Liferay DXP の「ナビゲーションメニュー」ウィジェットに特化した実装指針を定義します。
デザイン規約、共通 CSS/JS、およびモバイルファーストの原則については、**必ず `modern-ux-core-protocol` を参照してください。**

## 2. Liferay API Compliance
Liferay の NavItem API を適切に使用してテンプレートを構築します。
- **Methods:** `getName()`, `getURL()`, `getChildren()`, `isSelected()`, `isBrowsable()`, `getLayout()`, `getTarget()`.
- **Macros:** `language`, `taglib_aui`, `taglib_portlet`, `taglib_ui`, `layout-icon`.
- **Caution (Method Calls):** FreeMarker テンプレート内で Java のメソッドを呼び出す際は、必ず `()` を付けること（例：`navItem.iconURL()?has_content`）。`navItem.iconURL?has_content` のようにプロパティとしてアクセスするとエラー（`not a real listable value`）が発生します。

## 3. Template Architecture
- **FreeMarker:** 再帰的なマクロを使用して、多階層メニューを効率的に構築する。
- **No Header Comments:** `.ftl` ファイルの冒頭に `<#-- ... -->` コメントを絶対に含めない。
- **Structure:** `<ul>`/`<li>` ベースではなく、`modern-ux-core-protocol` で定義された `<div>` ベースの構造（BEM）を採用する。

## 4. Design Protocol Compliance
- デザイン規約 (BEM, Typography) -> **`modern-ux-core-protocol` 参照**
- モバイル対応 (Mobile-First, Tap Targets, Drawer Patterns) -> **`modern-ux-core-protocol` 参照**
- 共通 CSS/JS 基準 -> **`modern-ux-core-protocol` 参照**

## 5. Rendered Characteristics (実機挙動の知見)
- **ID の動的解決**: `${navbarId}` は Liferay 上で `navbar_com_liferay_site_navigation_menu_web_portlet_SiteNavigationMenuPortlet_INSTANCE_xxxx` のように、ポートレットのインスタンス ID を含むユニークな値として解決される。
- **BEM の維持**: Liferay 固有のラッパー `div` が多数生成されるが、テンプレート内で定義した `ln-menu` などの BEM クラス構造は維持されるため、フラグメント側からのスタイリングが可能。
- **インラインスタイル**: テンプレート内の `<style>` タグはポートレットの `portlet-body` 内に出力される。

## 6. Resources

### assets/
- `boilerplate.ftl`: `modern-ux-core-protocol` に準拠したナビゲーションテンプレートの雛形。

### references/
- `liferay-nav-api.md`: Liferay の NavItem API リファレンス。
