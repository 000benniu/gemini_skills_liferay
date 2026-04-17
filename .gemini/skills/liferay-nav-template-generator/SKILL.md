---
name: liferay-nav-template-generator
description: Liferay Navigation Template Generator. Based on FreeMarker and NavItem API.
---

# Liferay Navigation Template Generator (Domain Specific)

## 1. Overview
This skill defines implementation guidelines specifically for the "Navigation Menu" widget of Liferay DXP.
For design conventions, common CSS/JS, and mobile-first principles, **be sure to refer to `modern-ux-core-protocol`.**

## 2. Liferay API Compliance
Properly use Liferay's NavItem API to build templates.
- **Methods:** `getName()`, `getURL()`, `getChildren()`, `isSelected()`, `isBrowsable()`, `getLayout()`, `getTarget()`.
- **Macros:** `language`, `taglib_aui`, `taglib_portlet`, `taglib_ui`, `layout-icon`.
- **Caution (Method Calls):** When calling Java methods in FreeMarker templates, always append `()` (e.g., `navItem.iconURL()?has_content`). Accessing them as properties like `navItem.iconURL?has_content` will cause an error (`not a real listable value`).

## 3. Template Architecture
- **FreeMarker:** Use recursive macros to efficiently build multi-level menus.
- **No Header Comments:** Never include `<#-- ... -->` comments at the beginning of `.ftl` files.
- **Structure:** Instead of a `<ul>`/`<li>` base, adopt a `<div>` based structure (BEM) defined in `modern-ux-core-protocol`.

## 4. Design Protocol Compliance
- Design Guidelines (BEM, Typography) -> **Refer to `modern-ux-core-protocol`**
- Mobile Readiness (Mobile-First, Tap Targets, Drawer Patterns) -> **Refer to `modern-ux-core-protocol`**
- Common CSS/JS Standards -> **Refer to `modern-ux-core-protocol`**

## 5. Rendered Characteristics (Insights on Actual Device Behavior)
- **Dynamic Resolution of IDs**: `${navbarId}` is resolved as a unique value including the portlet instance ID, such as `navbar_com_liferay_site_navigation_menu_web_portlet_SiteNavigationMenuPortlet_INSTANCE_xxxx` on Liferay.
- **Maintenance of BEM**: Although many Liferay-specific wrapper `div`s are generated, the BEM class structure defined in the template, such as `ln-menu`, is maintained, allowing styling from the fragment side.
- **Inline Styles**: `<style>` tags within the template are output inside the portlet's `portlet-body`.

## 6. Resources

### assets/
- `boilerplate.ftl`: A navigation template boilerplate compliant with `modern-ux-core-protocol`.

### references/
- `liferay-nav-api.md`: Liferay's NavItem API Reference.