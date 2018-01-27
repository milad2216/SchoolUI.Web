define(['angularAMD'], function(control) {
    control.directive('pnDatePickerJalali', function factory() {
        var directiveDefinitionObject = {
            template: '<input kendo-jalali-date-picker="options.editorElem" ' +
                            'ng-model="value" ng-required="options.required" ' +
                            ' ng-disabled="options.disabled" ' +
                            'k-options="options.kendoOptions" class="mousetrap" />',
            restrict: 'E',
            scope: {
                options: '=',
                value: '=',
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