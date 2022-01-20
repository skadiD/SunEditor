'use strict';

export default {
    name: 'details',
    display: 'submenu',
    // add function - It is called only once when the plugin is first run.
    // This function generates HTML to append and register the event.
    // arguments - (core : core object, targetElement : clicked button element)
    add: function (core, targetElement) {
        // @Required
        // Registering a namespace for caching as a plugin name in the context object
        const context = core.context;
        context.customSubmenu = {
            targetButton: targetElement,
            textElement: null,
            currentSpan: null
        };

        // Generate submenu HTML
        // Always bind "core" when calling a plugin function
        let listDiv = this.setSubmenu(core);

        // Input tag caching
        context.customSubmenu.textElement = listDiv.querySelector('input');

        // You must bind "core" object when registering an event.
        /** add event listeners */
        listDiv.querySelector('.se-btn-primary').addEventListener('click', this.onClick.bind(core));

        // @Required
        // You must add the "submenu" element using the "core.initMenuTarget" method.
        /** append target button menu */
        core.initMenuTarget(this.name, targetElement, listDiv);
    },

    setSubmenu: function (core) {
        const listDiv = core.util.createElement('DIV');
        // @Required
        // A "se-submenu" class is required for the top level element.
        listDiv.className = 'se-menu-container se-submenu se-list-layer';
        listDiv.innerHTML = '' +
            '<div class="se-list-inner">' +
                '<ul class="se-list-basic" style="width: 230px;">' +
                    '<li>' +
                        '<div class="se-form-group">' +
                            '<input class="se-input-form" type="text" placeholder="折叠块标题" style="border: 1px solid #CCC;" />' +
                            '<button type="button" class="se-btn-primary">' +
                                '<strong>创建</strong>' +
                            '</button>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>';

        return listDiv;
    },

    // @Override core
    // Plugins with active methods load immediately when the editor loads.
    // Called each time the selection is moved.
    active: function (element) {
        // If no tag matches, the "element" argument is called with a null value.
        if (!element) {
            this.util.removeClass(this.context.customSubmenu.targetButton, 'active');
            this.context.customSubmenu.textElement.value = '';
            this.context.customSubmenu.currentSpan = null;
        } else if (this.util.hasClass(element, 'se-custom-tag')) {
            this.util.addClass(this.context.customSubmenu.targetButton, 'active');
            this.context.customSubmenu.textElement.value = element.textContent;
            this.context.customSubmenu.currentSpan = element;
            return true;
        }

        return false;
    },

    // @Override submenu
    // Called after the submenu has been rendered
    on: function () {
        this.context.customSubmenu.textElement.focus();
    },

    onClickRemove: function () {
        const span = this.context.customSubmenu.currentSpan;
        if (span) {
            this.util.removeItem(span);
            this.context.customSubmenu.currentSpan = null;

            this.submenuOff();
            this.focus();
        }
    },

    onClick: function () {
        const value = this.context.customSubmenu.textElement.value.trim();
        if (!value) return;

        const span = this.context.customSubmenu.currentSpan;
        if (span) {
            span.textContent = value;
            this.setRange(span, 1, span, 1);
        } else {
            this.functions.insertHTML('<details><summary>' + value + '</summary><p>被折叠的内容</p></details><p>外部内容</p>', true);
            this.context.customSubmenu.textElement.value = '';
        }

        this.submenuOff();
    }
};
