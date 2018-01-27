define(['angularAMD'], function(control) {
    control.directive('pnMultiselect', function factory() {
        var directiveDefinitionObject = {
            template: '<select kendo-multi-select="options.editorElem" ' +
                            'ng-model="ngModel" ng-required="options.required" ' +
                            ' ng-disabled="options.disabled" ' +
                            'k-options="options.kendoOptions"></select>',
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