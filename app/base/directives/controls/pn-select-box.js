define(['angularAMD'], function(control) {
    control.directive('pnSelectBox', function factory() {
        var directiveDefinitionObject = {
            templateUrl: "app/base/partials/directives/pnSelectBox.html",//"app/directives/controls/partials/pnSelectBox.html",
            restrict: 'E',
            scope: {
                options: '=',
                ngModel: '=',
                onDestory: '&'
            },
            link: function(scope, elem, attr) {
                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });
            }
        };
        return directiveDefinitionObject;
    });
});