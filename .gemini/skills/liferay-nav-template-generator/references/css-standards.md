# CSS Standards (Modern & Shirley's Protocol)

Liferay ナビゲーションテンプレートにおけるCSS設計指針です。

## 1. セマンティック・シールディング (Semantic Shielding)
LiferayのグローバルなCSS（Bootstrap等）による予期せぬ干渉を避けるため、構造は原則として `<div>` または `<span>` で構成します。
- `<ul>` -> `<div class="ln-menu__list">`
- `<li>` -> `<div class="ln-menu__item">`

## 2. CSS Encapsulation (プレフィックスの義務化)
すべてのクラス名には一意のプレフィックスを付与し、カプセル化を徹底します。
- プレフィックス候補: `ln-` (Liferay Navigation), `shirley-nav-`
- 例: `.ln-menu`, `.ln-menu__link--active`

## 3. Local Reset
デザインの整合性を保つため、コンテナのルートで `box-sizing` をリセットします。

```css
.ln-nav-container *,
.ln-nav-container *::before,
.ln-nav-container *::after {
    box-sizing: border-box;
}
```

## 4. BEM Naming Convention
- **Block**: `.ln-menu`
- **Element**: `.ln-menu__item`
- **Modifier**: `.ln-menu__item--selected`
