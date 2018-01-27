define(['angularAMD'], function (control) {
    control.directive('pnDatePicker', function factory() {
        var directiveDefinitionObject = {
            template: function (element, attrs) {
                var calType = 'kendo-masked-jalali-date-picker';
                if (attrs.en !== undefined)
                    calType = 'kendo-date-picker';
                var t = '<input ' + calType + '="options.editorElem" ' +
                    ' ng-model="ngModel" ng-required="options.required" ' +
                    ' ng-disabled="ngDisabled" ' +
                    ' k-options="options.kendoOptions" ng-blur="onBlur()" ng-focus="onFocus()" class="mousetrap"  />';
                return t;
            },
            //replace: true,
            restrict: 'E',
            scope: {
                options: '=?',
                ngModel: '=?',
                dateTime: '=?',
                ngDisabled: '=?',
                onDestory: '&'
            },
            link: function (scope, elem, attrs) {
                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });

				elem.on('keydown', function (e) {
					if (e.key === "ArrowDown") {
                        var widget = scope.options.editorElem;
						 widget.open()
                    }
                })

            },
            controller: function ($scope, $attrs, Notification) {
                $scope.options = $scope.options || {};
                var def = { culture: 'fa-IR' };
                if ($attrs.en !== undefined)
                    def.culture = 'en-US';




                function setSafeValue() {
                    if ($scope.options && $scope.options.editorElem) {
                        if ($scope.options.editorElem.value()) {
                            $scope.options.value_typeSafe = $scope.options.editorElem.value().gregoriandate.toDateString().replace(/^(\w{3})\s(\w{3})\s(\d{2})\s(\d{4})/mg, "$3 $2 $4") + " 10:00:00";
                        }
                    }
                }

                if (typeof ($attrs.datetime) !== "undefined") {
                    $scope.$watch("ngModel", function (newValue, oldValue) {

                        if (newValue) {

                            var v = $scope.options.editorElem.value();
                            if (v)
                                setSafeValue();
                            //$scope.options.value_typeSafe = $scope.options.editorElem.value().toUTCString().replace(/(\w*,\s)/, "").replace(" GMT", "");

                        }
                    });
                }



                $scope.options.kendoOptions = angular.extend({}, $scope.options.kendoOptions, def);

                $scope.$watch("ngDisabled", function (newValue, oldValue) {
                    var elem = $scope.options.editorElem.element;
                    var kendoJalaliDatePicker = elem.data("kendoJalaliDatePicker");
                    if (kendoJalaliDatePicker) {
                        if (newValue) {
                            kendoJalaliDatePicker.enable(false);
                        } else {
                            kendoJalaliDatePicker.enable(true);
                        }
                    }


                });


                $scope.onBlur = function () {
                    var SHAMSI_REGEXP = /^1[34][0-9][0-9]\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|([1-2][0-9])|(0[1-9]))))$/gi;

                    if ($scope.ngModel && !SHAMSI_REGEXP.test($scope.ngModel)) {
                        Notification.error("تاریخ وارد شده صحیح نمی باشد");
                        $scope.options.editorElem.value("");
                    }

                }

                $scope.onFocus = function () {
                    if (!$scope.ngModel) {
                        $scope.options.editorElem.value(new JalaliDate(new Date()));
                    }
                }

                $scope.$applyAsync(function () {
                    setSafeValue();
                })

            }
        };
        return directiveDefinitionObject;
    });
});