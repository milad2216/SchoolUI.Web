define(['angularAMD'], function (app) {
    app.provider('pn.kendo.config', function () {

        var treelistConfig = {};
        var treeviewConfig = {};
        var secondtreeviewConfig = {};

        this.setTreelistConfig = function (config) {
            treelistConfig = config;
        };

        this.setTreeViewConfig = function (config) {
            treeviewConfig = config;
        };

         this.setSecondTreeviewConfig = function (config) {
            secondtreeviewConfig = config;
        };

        this.$get = function () {
            return {
                getTreelistConfig: function () {
                    return treelistConfig;
                },
                getTreeviewConfig: function () {
                    return treeviewConfig;
                },
                getSecondTreeviewConfig: function () {
                    return secondtreeviewConfig;
                }
            }
        };
    });
});