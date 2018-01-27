define(['angularAMD'], function(control) {
    control.register.directive('pnCurrency', function factory() {
        var directiveDefinitionObject = {
            template: '<input kendo-numeric-text-box="options.editorElem" ' +
                            'k-options="options.kendoOptions" ' +
                            ' ng-model="ngModel" ng-required="options.required" ' +
                            ' ng-disabled="options.disabled" ' +
                            ' class="text-left ltr mousetrap"> ',
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
                scope.options.kendoOptions = {
                    format: "c",
                    decimals: 3
                };
                scope.options.isNationalCode = true;
            }
        };
        return directiveDefinitionObject;
    });
});