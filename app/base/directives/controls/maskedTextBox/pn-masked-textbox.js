define(['angularAMD'], function (app) {
    app.directive('pnMaskedTextbox', function factory() {
        var directiveDefinitionObject = {
            template: '<input kendo-masked-text-box="options.editorElem" ' +
                            'k-options="options.kendoOptions" ' +
                            ' ng-model="ngModel" ng-required="options.required" ' +
                            ' nationalcode-validator="options.isNationalcode" ' + 
                            ' ng-disabled="options.disabled" ' +
                            ' class="form-control text-left ltr"> ',
            restrict: 'E',
            scope: {
                options: '=',
                ngModel: '=',
                onDestory: '&'
            },
            controller: function($scope, $element, $attrs) {
            },
            link: function (scope, elem, attr) {
                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });


                if (typeof (attr.pnNationalCode) !== "undefined") {

                    function checkMelliCode(meliCode) {
                        if (meliCode == null)
                            return false;

                        if (meliCode.length == 10) {
                            if (meliCode == '1111111111' ||
                                meliCode == '0000000000' ||
                                meliCode == '2222222222' ||
                                meliCode == '3333333333' ||
                                meliCode == '4444444444' ||
                                meliCode == '5555555555' ||
                                meliCode == '6666666666' ||
                                meliCode == '7777777777' ||
                                meliCode == '8888888888' ||
                                meliCode == '9999999999') {
                                return false;
                            }
                            c = parseInt(meliCode.charAt(9));
                            n = parseInt(meliCode.charAt(0)) * 10 +
                                parseInt(meliCode.charAt(1)) * 9 +
                                parseInt(meliCode.charAt(2)) * 8 +
                                parseInt(meliCode.charAt(3)) * 7 +
                                parseInt(meliCode.charAt(4)) * 6 +
                                parseInt(meliCode.charAt(5)) * 5 +
                                parseInt(meliCode.charAt(6)) * 4 +
                                parseInt(meliCode.charAt(7)) * 3 +
                                parseInt(meliCode.charAt(8)) * 2;
                            r = n - parseInt(n / 11) * 11;
                            if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                    function setSafeValue() {
                        if (scope.options && scope.options.editorElem && scope.options.editorElem.value()) {
                            var stripedValue = scope.options.editorElem.value().replace(/-/g, "");
                            if (checkMelliCode(stripedValue))
                                scope.options.value_typeSafe = scope.options.editorElem.value().replace(/-/g, "");

                        }
                    }                
                
                    scope.$watch("ngModel", function (newValue, oldValue) {
                        if (newValue){
                            var v = scope.options.editorElem.value();

                            if (v)
                                setSafeValue();                                
                                //$scope.options.value_typeSafe = $scope.options.editorElem.value().toUTCString().replace(/(\w*,\s)/, "").replace(" GMT", "");
                                
                        }
                    });
                }
            }
        };
        return directiveDefinitionObject;
    });
});