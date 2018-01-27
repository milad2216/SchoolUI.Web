define(['angularAMD'], function (control) {
    control.directive('pnGridNavigator', ["Notification", function factory(notify) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                kOptions: "=?",
                onChangeRow: "&",
                dblClickRow: "&",
                clickHeder: "&",
                disabled: "=ngDisabled",
                api: "=?",
                onKendoDataBound: '&',
                structureCode: "=?",
                schema: "=?"
            },
            templateUrl: '/app/base/partials/directives/pnGridNavigator.html',
            link: function ($scope, $elem, $attrs) {
                var disabledFilter = ($attrs.disabledFilter && $attrs.disabledFilter == "true") ? true : false
                $scope.kOptions.kendoGrid = null;
                $scope.kOptions.filter = null,
                    //  $scope.kOptions.fristLoad = false,
                    $scope.levelRecords = [];
                $scope.totalCodeHeder = 0;
                var selectedDataRow = {};
                $scope.kOptions.levelRecord = 0;

                var dataSource = new kendo.data.DataSource({
                    transport: {
                        type: "jsonp",
                        read:
                        {
                            url: $scope.kOptions.read.url,
                            type: "POST",
                            contentType: "application/json",
                            data: $scope.kOptions.read.data ? $scope.kOptions.read.data : {},
                        },
                        parameterMap: function (options, operation) {
                            if (operation === "read") {
                                if (!disabledFilter) {
                                    if (angular.isUndefined(options.filter) || options.filter == null) {
                                        if (angular.isDefined($scope.kOptions.filter) && $scope.kOptions.filter != null) {
                                            options.filter = {
                                                logic: "and", filters: [{ field: $scope.kOptions.filter.Field, operator: "eq", value: $scope.kOptions.filter.Value },
                                                { field: $scope.kOptions.model.ParentId.field, operator: "eq", value: null }]
                                            };
                                        }
                                        else {
                                            options.filter = {
                                                logic: "and", filters: [{ field: $scope.kOptions.model.ParentId.field, operator: "eq", value: null }]
                                            };
                                        }

                                    }
                                }
                                if ($scope.kOptions.model.StructureCode && $scope.structureCode) {
                                    options.filter = !options.filter ? [] : options.filter;
                                    var struc = $.grep(options.filter.filters, function (n) {
                                        return n.field.toLowerCase() == $scope.kOptions.model.StructureCode.field.toLowerCase();
                                    })[0];
                                    if (!struc) {
                                        options.filter.filters.push({ Field: $scope.kOptions.model.StructureCode.field, operator: "eq", value: $scope.structureCode });
                                    }
                                }

                                return angular.toJson(options);
                            }
                        }
                    },
                    requestStart: function (result) {

                        if (angular.isDefined($scope.kOptions.fristLoad) && $scope.kOptions.fristLoad == false) {
                            $scope.kOptions.fristLoad = true;
                            result.preventDefault();
                        }
                    },

                    schema: $scope.schema ? $scope.schema : {
                    
                        model: { id: "Key", fields: { Code: { type: "number", editable: false } } },

                        data: "Entities", total: "TotalCount"
                    },
                    autoSync: false,
                    pageSize: $scope.kOptions.pageSize ? $scope.kOptions.pageSize : 10,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    filterable: true,
                });
                
                $scope.mainGridOptions = {
                    dataSource: dataSource,
                    height: $scope.kOptions.height ? $scope.kOptions.height : 330,
                    groupable: false,
                    resizable: true,
                    scrollable: true,
                    selectable: "row",
                    navigatable: true,
                    sortable: {
                        mode: "single",
                        allowUnsort: true
                    },
                    filterable: {
                        extra: false,
                    },
                    pageable: {
                        refresh: true
                    },
                    dataBound: function (e) {
                        $scope.onKendoDataBound({ kendo: $scope.kOptions.kendoGrid });
                        this.select(this.tbody.find('>tr:first'));
                    },
                    change: function (e) {
                        var grid = e.sender;
                        selectedDataRow = grid.dataItem(grid.select());
                        $scope.onChangeRow({ row: selectedDataRow });
                        $scope.totalCodeHeder = selectedDataRow[$scope.kOptions.model.TotalCode.field];
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    },
                    columns: $scope.kOptions.columns
                };

                $scope.getLevelRecord = function (selected, status) {
                    var len = $scope.levelRecords.length;

                    if (selected == null) {
                        if (len > 0) {
                            romoveItem(0, len);
                        }
                        $scope.totalCodeHeder = 0;
                        if (!status) {
                            $scope.mainGridOptions.dataSource.filter(null);
                        }

                    }
                    else {
                        var id = selected.ID;
                        if (id == len) {
                            return;
                        }
                        else {
                            romoveItem(id, len);
                            $scope.totalCodeHeder = selected.Entity == null ? 0 : selected.Entity[$scope.kOptions.model.TotalCode.field];
                            $scope.mainGridOptions.dataSource.filter({
                                "field": $scope.kOptions.model.ParentId.field,
                                "operator": "eq",
                                "value": selected.Entity == null ? null : selected.Entity[$scope.kOptions.model.Id]
                            });
                        }
                    }

                    var length = $scope.levelRecords.length;
                    var entity = null;
                    if (length > 0) {
                        entity = $scope.levelRecords[length - 1].Entity;
                    }
                    $scope.clickHeder({ e: length, entity: entity });

                }

                var romoveItem = function (id, len) {
                    id++;
                    index = $scope.levelRecords.findIndex(x => x.ID == id)
                    $scope.levelRecords.splice(index, 1);
                    if (len > id) {
                        romoveItem(id, len);
                    }
                }

                $elem.off("dblclick", "#mainGridOptions tr.k-state-selected");
                $elem.on("dblclick", "#mainGridOptions tr.k-state-selected", function (e) {
                        if (selectedDataRow[$scope.kOptions.model.IsLastLevel.field] == false) {
                            $scope.totalCodeHeder = selectedDataRow[$scope.kOptions.model.TotalCode.field];
                            $scope.levelRecords.push({ ID: $scope.levelRecords.length + 1, Entity: selectedDataRow, TotalDesc: selectedDataRow[$scope.kOptions.model.Description.field] });
                            $scope.mainGridOptions.dataSource.filter({ "field": $scope.kOptions.model.ParentId.field, "operator": "eq", "value": selectedDataRow[$scope.kOptions.model.Id] });
                            $scope.dblClickRow({ row: selectedDataRow });
                        }
                        else {
                            notify.info({ message: "سطح پایانی است", title: "پیغام" });
                        }
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });

                $scope.$watchCollection('levelRecords', function (newValue, oldValue) {
                    if (newValue)
                        $scope.kOptions.levelRecord = newValue.length + 1;
                })

                $elem.on("keyup", function (ke) {
                    var elem = $(ke.target);
                    var el = elem.find('.k-state-focused');
                    el.removeClass('k-state-focused');
                    el.removeAttr('aria-describedby');
                    ke.preventDefault();
                    ke.stopImmediatePropagation();
                    var kGrid, curRow, newRow;
                    kGrid = $scope.kOptions.kendoGrid;
                    curRow = kGrid.select();
                    if (!curRow.length)
                        return false;
                    if (ke.which == 38) {
                        newRow = curRow.prev();
                    } else if (ke.which == 40) {
                        newRow = curRow.next();
                    } else {
                        return false;
                    }

                    if (!newRow.length)
                        return false;
                    kGrid.select(newRow);
                });

                $scope.api = {
                    emptyLevelRecord: function () {
                        $scope.getLevelRecord(null);
                    },
                    emptyGrid: function () {
                        $scope.mainGridOptions.dataSource.data([]);
                        $scope.getLevelRecord(null, true);
                    }
                }

                $scope.$on('do-navigation', function (event, navigation) {
                    $scope.getLevelRecord(navigation);
                });
            }
        }
    }]);
});