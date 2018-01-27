define(['angularAMD'], function (control) {
    control.directive('pnPrice', ['$browser', 'recWebAccess', '$compile', function ($browser, webAccess, $compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                option: "=",
                disabled:"=ngDisabled",
                foreignCurrency:"=",
                isHiddenCurrentPrice: "@",
                blur: "&",
            },
            templateUrl: '/app/base/partials/directives/pn-price.html',
            controller: function ($scope) {
                if (!$scope.option.Title)
                    $scope.option.Title = "مبلغ";
                $scope.modelCurrency = {
                    CurrentPrice: angular.copy($scope.option.CurrentPrice),
                    SecondPrice: angular.copy($scope.option.SecondPrice),
                    NumberToPersian: showToman(angular.copy($scope.option.CurrentPrice.toString().replace(/,/g, '')))
                }

                $scope.blurCurrentPrice = function () {
                    $scope.blur();
                }

                $scope.pressSecondPrice = function (txt) {
                    $scope.option.SecondPrice = angular.copy(txt.replace(/,/g, ''));
                }

                $scope.pressCurrentPrice = function (txt) {
                    $scope.option.CurrentPrice = angular.copy(txt.replace(/,/g, ''));
                    $scope.modelCurrency.NumberToPersian = showToman($scope.option.CurrentPrice);
                }
                $scope.sourceCurrency = {
                    text: "Value",
                    value: "FieldItemId",
                    transport: {
                        read: {
                            data: { ItemGroupId: 'a0f8ffaf-3664-e611-80eb-000c29c9d3ad' },
                            url: webAccess + "api/ItemGroup/GetFieldItems"
                        }
                    }
                };

                function showToman(text) {
                    var numberToPersian = "";
                    if (text) {
                        var number = Math.floor(parseInt(text) / 1);
                        var remain = parseInt(text) % 10;

                        if (number > 0) {
                            var toman = convertNumberToPersianString(number.toString());
                            numberToPersian = toman + " ریال";
                        }

                        //if (remain > 0) {
                        //    if (number > 0) {
                        //        numberToPersian += " و ";
                        //    }
                        //    numberToPersian += convertNumberToPersianString(remain.toString()) + " ریال";
                        //}
                    }

                    return numberToPersian;
                }

                $scope.$watch('option.CurrentPrice', function (newValue, oldValue) {
                    if (angular.isDefined(newValue)) {
                        $scope.modelCurrency.NumberToPersian = showToman(newValue.toString().replace(/,/g, ''));
                        $scope.modelCurrency.CurrentPrice = newValue;
                    }

                }, true);

                $scope.$watch('option.SecondPrice', function (newValue, oldValue) {
                   if (angular.isDefined(newValue)) {
                        $scope.modelCurrency.SecondPrice = newValue==null?"":newValue;
                    }

                }, true);

                function convertNumberToPersianString(number) {
                    var base = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];
                    var result = "";

                    if (number == "0") {
                        return "صفر";
                    }
                    else {
                        var remain = number.length % 3;
                        if (remain > 0) {
                            for (var i = 0; i < 3 - remain; i++) {
                                number = '0' + number;
                            }
                        }

                        var count = number.length / 3;
                        for (var i = 0; i < count; i++) {
                            var subNumber = parseInt(number.substring(i * 3, (i * 3) + 3));
                            if (subNumber != 0) {
                                result = result + convertThreeDigitNumberToPersianString(subNumber) + " " + base[count - 1 - i] + " و ";
                            }
                        }
                        result = result.substring(0, result.length - 3);
                    }

                    return result;
                }

                function convertThreeDigitNumberToPersianString(number) {

                    var yekan = ["صفر", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
                    var dahgan = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
                    var dahyek = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
                    var sadgan = ["", "یکصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];

                    var result = "";
                    var digitSadgan, digitDahgan;

                    digitDahgan = number % 100;
                    digitSadgan = Math.floor(number / 100);

                    if (digitSadgan != 0)
                        result = sadgan[digitSadgan] + " و ";

                    if ((digitDahgan >= 10) && (digitDahgan <= 19)) {
                        result = result + dahyek[digitDahgan - 10];
                    }
                    else {
                        var intOfDivide = Math.floor(digitDahgan / 10);
                        if (intOfDivide != 0)
                            result = result + dahgan[intOfDivide] + " و ";

                        var remainOfDivide = digitDahgan % 10;
                        if (remainOfDivide != 0)
                            result = result + yekan[remainOfDivide] + " و ";

                        result = result.substring(0, result.length - 3);
                    }
                    return result;
                }
            },

            compile: function compile($elem, $attrs) {
                return {
                    pre: function preLink($scope, $elem, $attrs) {
                        $scope.modelattrs = {
                            CurrentLength: $attrs.currentLength ? $attrs.currentLength : 8,
                            SecondLength: $attrs.secondLength ? $attrs.secondLength : 8
                        }
                    },
                    post: function postLink($scope, $elem, $attrs) {

                    }
                };
            }
        };
    }]);
});
