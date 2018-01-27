define(['angularAMD'], function(app) {
    app.directive('pnTimePicker', function factory() {
        var directiveDefinitionObject = {


            restrict: 'A',
            controller: function ($scope) {
                $scope.$on('kendoWidgetCreated', function () {
                    $scope.options.kendoOptions.mask = "00:00";
                    $scope.options.editorElem.setOptions($scope.options.kendoOptions);
                });
            },
            link: function (scope, elem, attr) {
            }
        };
        return directiveDefinitionObject;
    });
});