# Liferay Navigation API Reference (FreeMarker)

## Core Objects

- `entries` (List<NavItem>): The list of top-level navigation items for the current scope.
- `displayDepth` (int): The configured depth for the navigation widget.

## NavItem Methods

- `navItem.getName()`: Returns the page title.
- `navItem.getURL()`: Returns the absolute URL to the page.
- `navItem.isBrowsable()`: Whether the item is a clickable link.
- `navItem.isSelected()`: Whether the current item is selected.
- `navItem.isChildSelected()`: Whether any child item is selected.
- `navItem.hasBrowsableChildren()`: Whether the item has child items that are browsable.
- `navItem.getChildren()`: Returns a list of child NavItem objects.
- `navItem.getLayout()`: Returns the underlying Liferay Layout object.
- `navItem.getTarget()`: Returns the HTML `target` attribute (e.g., `_blank`).

## Standard Macros

- `<@liferay_theme["layout-icon"] layout=navItem.getLayout() />`: Renders the icon associated with the page.
- `<@liferay.language key="site-pages" />`: Renders a localized language string.
- `<#include "${templatesPath}/NAVIGATION-MACRO-FTL" />`: (Legacy) Includes standard navigation macros. Prefer custom recursive macros for modern templates.

## Best Practices

- Use `javascript:void(0);` or similar for non-clickable parent items to prevent page reload.
- Always check `entries?has_content` before listing.
- Use the `?then(val1, val2)` built-in for concise conditional attribute values.
