define(['angularAMD'], function (control) {
    control.directive('pnPersonalid', ['infWebAccess', function (webAccess) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {
                disabled: "=ngDisabled",
                tabindex1: "@",
                tabindex2: "@",
                tabindex3: "@",
            },
            require: '?ngModel',
            templateUrl: "app/base/partials/directives/pn-personalid.html",
            controller: function ($scope) {
                $scope.model = {};
            },
            link: function ($scope, $elem, $attrs, ngModelCtrl) {
               
                
                $scope.errorclass = true;
                $scope.onChange = function (model) {
                    
                    $scope.errorclass = false;

                    if ($scope.model.character2  && $scope.model.character && $scope.model.character3) {
                        var text = $scope.model.character + "/" + $scope.model.character2 + "/" + $scope.model.character3;
                        ngModelCtrl.$setViewValue(text);
                    }
                    else {
                        $scope.errorclass = true;
                        ngModelCtrl.$setViewValue("");
                    }
                }

                ngModelCtrl.$render = function () {
                    if (ngModelCtrl.$viewValue) {
                        var arr = ngModelCtrl.$viewValue.split("/");
                        $scope.model.character = arr[0];
                        $scope.model.character2 = arr[1];
                        $scope.model.character3 = arr[2];
                        if (arr[1] && arr[0] && arr[2] && arr[1].length > 1) {
                            $scope.errorclass = false;
                        }
                        else {
                            $scope.errorclass = true;
                            ngModelCtrl.$setViewValue("");
                        }
                    } else if (!ngModelCtrl.$viewValue) {
                        $scope.model = {};
                        //$scope.model.character = "";
                        //$scope.model.character2 = "";
                        //$scope.model.character3 = "";
                        //ngModelCtrl.$setViewValue("");
                    }
                 
                };

            }
        };

    }]);
});