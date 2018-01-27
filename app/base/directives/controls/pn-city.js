define(['angularAMD'], function (control) {
    control.directive('pnCity', ["infWebAccess", "pn.remote.service", function (webAccess, remoteService) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {
               disabled: "=ngDisabled"
            },
            require: '?ngModel',
            templateUrl: "app/base/partials/directives/pn-city.html",
            controller: function ($scope) {
                $scope.optionCombo = {
                    Item0: { SelectedItem: null, Items: [] },
                    Item1: { SelectedItem: null, Items: [] },
                    Item2: { SelectedItem: null, Items: [] },
                    Item3: { SelectedItem: null, Items: [] },
                    Item4: { SelectedItem: null, Items: [] },
                }
            },
            link: function ($scope, $elem, $attrs, ngModelCtrl) {
                var firstOneLoad = true;
                var lastlevel = $attrs.lastLevel ? parseInt($attrs.lastLevel) : 4

                function getData(data, item) {
                    remoteService.post(data, webAccess + "api/GeographicArea/GetGeographicAreas").then(function (result) {
                        $scope.optionCombo[item].Items = result.Entities;
                    });
                }



                $scope.$applyAsync(function () {
                    firstOneLoad = false;
                    if (!ngModelCtrl.$viewValue) {
                        if ($attrs.hascountry) {
                            getData({ Parent: 0, LevelNo: 0 }, "Item0");
                        }
                        else {
                            getData({ Parent: 1 }, "Item1");
                        }
                    }
                });

                $scope.onChangeItem0 = function (combo) {
                    var item = "Item1"
                    clearData(item);
                    getData({ Parent: $scope.optionCombo.Item0.SelectedItem }, item);
                    ngModelCtrl.$setViewValue("");
                }

                $scope.onChangeItem1 = function (combo) {
                    var item = "Item2"
                    if (lastlevel==1) {
                        ngModelCtrl.$setViewValue($scope.optionCombo.Item1.SelectedItem);
                    }
                    else {
                        clearData(item);
                        getData({ Parent: $scope.optionCombo.Item1.SelectedItem }, item);
                        ngModelCtrl.$setViewValue("");
                    }
                   
                }

                $scope.onChangeItem2 = function (combo) {
                    var item = "Item3"
                    if (lastlevel == 2) {
                        ngModelCtrl.$setViewValue($scope.optionCombo.Item2.SelectedItem);
                    }
                    else {
                        clearData(item);
                        getData({ Parent: $scope.optionCombo.Item2.SelectedItem }, item);
                        ngModelCtrl.$setViewValue("");
                    }
                    
                }

                $scope.onChangeItem3 = function (combo) {
                    var item = "Item4"
                    if (lastlevel ==3) {
                        ngModelCtrl.$setViewValue($scope.optionCombo.Item3.SelectedItem);
                    }
                    else {
                        clearData(item);
                        getData({ Parent: $scope.optionCombo.Item3.SelectedItem }, item);
                        ngModelCtrl.$setViewValue("");
                    }
                }

                $scope.onChangeItem4 = function (combo) {
                    ngModelCtrl.$setViewValue($scope.optionCombo.Item4.SelectedItem);
                }

                function clearData(item) {
                    var status = false;
                    for (var i in $scope.optionCombo) {
                        if (i == item) {
                            status = true;
                        }
                        if (status) {
                            $scope.optionCombo[i].SelectedItem = null;
                            $scope.optionCombo[i].Items = [];
                        }
                    }
                }

                ngModelCtrl.$render = function () {
                    var hascountry = $attrs.hascountry ? true : false;
                    if (ngModelCtrl.$viewValue) {
                        var value = ngModelCtrl.$viewValue;
                        remoteService.post({ Key: value }, webAccess + "api/GeographicArea/GetGeographicTreeStructure").then(function (result) {
                            clearData("Item0");
                            if (result.Entity.Items.length > 0) {
                                result.Entity.Items.reverse()
                                for (var i = 0; i < result.Entity.Items.length; i++) {
                                    if (!hascountry && i == 0) {
                                        continue;
                                    }
                                    if (i >lastlevel) {
                                        continue;
                                    }
                                    $scope.optionCombo["Item" + i].Items = result.Entity.Items[i].Value;
                                    $scope.optionCombo["Item" + i].SelectedItem = result.Entity.Items[i].Key;
                                }
                            }
                        });
                    }
                    else if (!firstOneLoad) {
                        if ($attrs.hascountry) {
                            clearData("Item1");
                            getData({ Parent: 0, LevelNo: 0 }, "Item0");
                        }
                        else {
                            clearData("Item2");
                            getData({ Parent: 1 }, "Item1");
                        }

                    }
                };

            }
        };

    }]);
})