-define(['angularAMD'], function (control) {
    control.directive('pnComboBox', ['$timeout', function factory($timeout) {
        return {
            restrict: 'E',
            scope: {
                dataSource: "=?source",
                value: "=?",
                onOpen: "&",
                onClose: "&",
                onSelect: "&",
                onFiltering: "&",
                onChange: "&",
                onDataBound: "&",
                onComboReady: "&",
                disabled: "=?",
                api: "=?",
                model: '=?ngModel',
                tabindex: "@"
            },
            require: '?ngModel',
            templateUrl: '/app/base/partials/directives/comboBox.html',
            link: function ($scope, element, attr, ngModelCtrl) {
                $scope.cbx = null;
                function getDataSource() {
                    return {
                        type: "json",
                        serverFiltering: false,
                        transport: {
                            read: {
                                url: $scope.dataSource.transport.read.url,
                                data: $scope.dataSource.transport.read.data,
                                beforeSend: $scope.dataSource.transport.read.beforeSend,
                                type: $scope.dataSource.transport.read.type,
                                contentType: "application/json",
                                dataType: "json",
                            },
                            //parameterMap: function (data, operation) {
                            //    if (operation === "read") {
                            //        return angular.toJson(data);
                            //    }
                            //}
                        },
                        schema: { data: "Items" }
                    }
                }

                $scope.comboOptions = {
                    dataTextField: angular.isArray($scope.dataSource) ? attr.textfield : $scope.dataSource.text,
                    dataValueField: angular.isArray($scope.dataSource) ? attr.valuefield : $scope.dataSource.value,
                    cascadeFrom: $scope.dataSource.cascade,
                    autoBind: $scope.dataSource.autoBind != false ? true : false,
                    dataSource: angular.isArray($scope.dataSource) ? [] : getDataSource(),
                    filter: "contains",
                    suggest: true,
                    select: onSelect,
                    close: onClose,
                    open: onOpen,
                    filtering: onFiltering,
                    dataBound: onDataBound,
                }

                $scope.$on('kendoWidgetCreated', function (event, target) {
                    $scope.onComboReady({ combo: $scope.cbx });
                    debugger;
                    if (angular.isArray($scope.dataSource)) {
                        $scope.$watchCollection('dataSource', function (newValue, oldValue) {
                            if ($scope.dataSource) {
                                $scope.cbx.dataSource.data($scope.dataSource);
                            }
                        }, true)
                    }
                });

                $scope.onChangeCombo = function () {
                    $scope.onChange({ combo: $scope.cbx });
                }

                $scope.api = {
                    empty: function () {
                        ngModelCtrl.$setViewValue("");
                        $scope.cbx.text("")
                    },
                    refresh: function () {
                        $scope.cbx.dataSource.read();
                    },
                    enable: function () {
                        $scope.cbx.enable(true);
                    },
                    clear: function () {
                        $scope.cbx.value(null);
                    },

                    disable: function () {
                        $scope.cbx.enable(false);
                    },
                    setValue: function (value) {
                        $scope.cbx.value(value);
                    },
                    getValue: function () {
                        return $scope.cbx.value();
                    },
                    setData: function (arrs) {
                        $scope.cbx.dataSource.data(arrs);
                    },
                    getData: function () {
                        return $scope.cbx.dataSource._pristineData;
                    }
                }

                function onSelect() {
                    $scope.onSelect({ combo: this });
                }

                function onOpen() {
                    $scope.onOpen({ combo: this });
                }

                function onClose() {
                    $scope.onClose({ combo: this });

                }

                var _onFilterring = true;
                function onFiltering() {
                    _onFilterring = false;
                    $scope.onFiltering({ combo: this });
                }

                function onDataBound() {
                    $scope.onDataBound({ combo: this });
                }
                ngModelCtrl.$render = function () {
                    if (ngModelCtrl.$viewValue == null) {
                        ngModelCtrl.$setViewValue("");
                        if ($scope.cbx) {
                            $scope.cbx.text("")
                        }
                    }
                }
            }
        }
    }]);
});