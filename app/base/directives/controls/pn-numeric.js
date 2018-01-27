define(['angularAMD'], function(control) {
    control.directive('pnNumeric', function factory() {
        var directiveDefinitionObject = {
            template: '<input type="number" ' +
                            ' min="{{options.minRange}}" ' +
                            ' max="{{options.maxRange}}" ' +
                            //' ng-pattern="options.pattern" ' +
                            ' ng-model="ngModel" ng-required="options.required" ' +
                            ' ng-disabled="options.disabled" ' +
                            ' class="form-control text-left ltr mousetrap"> ',
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