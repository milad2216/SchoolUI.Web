define(['angularAMD'], function(app) {
    app.register.directive('pnNationalCode', function factory() {
        var directiveDefinitionObject = {
            restrict: 'A',
            controller: function ($scope) {
                $scope.$on('kendoWidgetCreated', function () {
                    $scope.options.kendoOptions.mask = "000-000000-0";
                    $scope.options.editorElem && $scope.options.editorElem.setOptions($scope.options.kendoOptions);
                });
            },
            link: function (scope, ele, attrs, ngModel) {
                scope.options.isNationalcode = true;
            }
        };
        return directiveDefinitionObject;
    });
});