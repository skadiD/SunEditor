'use strict';

import './assets/css/editor.css';
import './assets/css/editor-contents.css';

import plugins from './plugins';
import suneditor from './suneditor';

if (!window.SUNEDITOR) {
    Object.defineProperty(window, 'SUNEDITOR', {
        enumerable: true,
        writable: false,
        configurable: false,
        value: suneditor.init({
            plugins: plugins
        })
    });
}