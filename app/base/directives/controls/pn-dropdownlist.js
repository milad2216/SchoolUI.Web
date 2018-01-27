define(['angularAMD'], function (control) {
    control.directive('pnDropdownlist', function factory() {
        var directiveDefinitionObject = {
            template: '<select kendo-drop-down-list="options.editorElem" ' +
            'ng-model="ngModel" ng-required="options.required" ' +
            ' ng-disabled="ngDisabled" ' +
            'k-options="options.kendoOptions"></select>',
            restrict: 'E',
            scope: {
                options: '=',
                ngModel: '=',
                onDestory: '&',
                ngDisabled: "=?"
            },
            require: '?ngModel',
            controller: function ($scope) {
                if ($scope.options) {
                    $scope.options.kendoOptions.optionLabel= "انتخاب کنید...";
                }
            },
            link: function (scope, elem, attr, ngModelCtrl) {
                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });

               
                ngModelCtrl.$render = function () {
                    if (!ngModelCtrl.$viewValue) {
                        ngModelCtrl.$setViewValue("");
                        if (scope.options.editorElem) {
                            scope.options.editorElem.text("")
                        }
                    }
                }

            }
        };
        return directiveDefinitionObject;
    });
});