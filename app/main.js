/// <reference path="E:\Work\Me\SchoolUI.Web\Scripts/bower_components/angular-block-ui.js" />
debugger
require.config({
    urlArgs: "v=" + new Date().getTime(),
    waitSeconds: 300,
    paths: {
        'app': 'app',
        'angularAMD': '/Scripts/core/angularAMD'
    },
    deps: ['app']
});

require([
    'app',
    'base/services/dataService',
    'base/services/enumService',
    'base/services/userMenuAccessService',
    'base/services/pn.message',
    'base/directives/controls/pn-combobox',
    'base/directives/controls/pn-file-upload',
    'base/directives/controls/pn-right-menu',
    'base/directives/controls/pn-auto-complete',
    'base/directives/controls/header/pn-sidebar-primary-toggle',
    'base/directives/controls/header/pn-header',
    'base/directives/controls/header/pn-main-search-hide',
    'base/directives/controls/header/pn-main-search-show',
    'base/directives/controls/header/pn-full-screen-toggle',
    'base/directives/controls/header/pn-custom-scrollbar',
    'base/directives/controls/header/pn-style-switcher',
    'base/directives/controls/header/pn-page-aside-toggle',
    'base/directives/controls/header/pn-page-aside',
    'base/directives/controls/header/pn-md-fab-sheet',
     'base/directives/controls/pn-gridview-checkbox'
    

], function (app) {
    app.bootstrap();
});
