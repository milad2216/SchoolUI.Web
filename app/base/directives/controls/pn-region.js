define(['angularAMD'], function (control) {
    control.register.directive('pnRegion', ["$rootScope", function factory($rootScope) {
        var directiveDefination =
            {
                template: '<fieldset ng-disabled="isDisabled" ng-hide="isHidden" ng-transclude></fieldset>',
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: {
                    isHidden: '=',
                    isDisabled: '=',
                },
                link: function (scope, elem, attrs, ctrl) {
                    var currentRegionValue = $rootScope.pnRegions[attrs.name];
                    switch (currentRegionValue) {

                        case "0": // Full Access
                            scope.isDisabled = false;
                            scope.isHidden = false;
                            break;

                        case "1": // ReadOnly
                            scope.isDisabled = true;
                            break;

                        case "2":
                        default:// No Access (Hidden)
                            scope.isHidden = true;
                            scope.isDisabled = true;
                            break;
                    }
                }
            };
        return directiveDefination;
    }])
})


