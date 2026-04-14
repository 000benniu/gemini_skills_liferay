<#assign
    portletDisplay = themeDisplay.getPortletDisplay()
    navbarId = "navbar_" + portletDisplay.getId()
/>

<div class="ln-nav-container" id="${navbarId}">
    <div class="ln-menu" role="menubar">
        <#if entries?has_content>
            <#list entries as navItem>
                <@renderNavItem navItem=navItem depth=1 />
            </#list>
        </#if>
    </div>
</div>

<#macro renderNavItem navItem depth>
    <#assign
        showChildren = (displayDepth != 1) && navItem.hasBrowsableChildren()
        isSelected = navItem.isSelected() || navItem.isChildSelected()
        
        itemClass = "ln-menu__item"
        linkClass = "ln-menu__link"
    />

    <#if isSelected>
        <#assign itemClass = itemClass + " ln-menu__item--active" />
    </#if>

    <#if showChildren>
        <#assign itemClass = itemClass + " ln-menu__item--has-children" />
        <#assign linkClass = linkClass + " ln-menu__link--dropdown" />
    </#if>

    <div class="${itemClass}" role="presentation">
        <a class="${linkClass}" 
           href="${navItem.isBrowsable()?then(navItem.getURL(), 'javascript:void(0);')}" 
           ${navItem.getTarget()} 
           role="menuitem"
           <#if showChildren>aria-haspopup="true" aria-expanded="false"</#if>>
            
            <span class="ln-menu__text">
                <#if navItem.iconURL()?has_content>
                    <@liferay_theme["layout-icon"] layout=navItem.getLayout() />
                </#if>
                ${navItem.getName()}
            </span>

            <#if showChildren>
                <span class="ln-menu__indicator">
                    <i class="fa-solid fa-caret-down"></i>
                </span>
            </#if>
        </a>

        <#if showChildren>
            <div class="ln-menu__child-list" role="menu">
                <#list navItem.getChildren() as childNavItem>
                    <@renderNavItem navItem=childNavItem depth=depth + 1 />
                </#list>
            </div>
        </#if>
    </div>
</#macro>
