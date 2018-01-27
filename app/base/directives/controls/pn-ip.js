
define(['angularAMD'], function (control) {
 
    control.directive('pnIp', [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
             options: '=',
                model: '=ngModel',
                isValid: "="
            },
            require: '?ngModel',
            templateUrl: function(element, attrs) {
                 return "/app/base/partials/directives/pn-ipv" + attrs.ipVersion + ".html";
            },

            link: function ($scope, $elem, $attrs, ngModelCtrl) {

                $scope.modelIP = { };
               
                var ipV4format = /^(25[0-5]|2[0-4][0-9]|1?[0-9][0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/;
                var  ipV6format = /^([0-9a-f]){1,4}(:([0-9a-f]){1,4}){7}$/i;

                var ipV4Seprator =".";
                var ipV6Seprator =":";
                
                var ipformat = ipV4format;
                var seprator = ipV4Seprator;
                if ($attrs.ipVersion === "6") {
                     ipformat = ipV6format;
                     seprator = ipV6Seprator;
                }

                var validateIP = function (value) {
                     
                    if (value.match(ipformat)) {
                        return true;
                    }
                    return false;
                }

                $scope.$watch('modelIP', function (newValue, oldValue) {
                    if (newValue) {
                        var arrCtrl = [];

                        for (var item in $scope.modelIP) {
                            if ($scope.modelIP[item] != "") {
                                arrCtrl.push($scope.modelIP[item]);
                            }
                        }
                        //arrCtrl.reverse();
                        var modelCtrl = arrCtrl.join(seprator);
                        $scope.isValid = validateIP(modelCtrl);
                        ngModelCtrl.$setViewValue(modelCtrl)
                    }
                }, true)

                ngModelCtrl.$render = function () { 
                    var value = ngModelCtrl.$viewValue;
                    if (value) {
                        var strArr = value.split(seprator);
                        //strArr.reverse();
                        for (var i = 0; i < strArr.length; i++) {
                            var num = 1 + i;
                            $scope.modelIP["Reng" + num] = strArr[i];
                         
                        }
                    }
                    else {
                        $scope.modelIP = {  };
                    }
                };
 
              
            }

        };
    }]);
});