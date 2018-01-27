define(['angularAMD'], function(app) {
    app.register.directive('pnTelephone', function factory() {
        var directiveDefinitionObject = {
            restrict: 'A',
            scope: false,
            link: function (scope, elem, attr) {
                scope.options.kendoOptions = {
                    mask: "000 0000000"
                };
            }
        };
        return directiveDefinitionObject;
    });
});