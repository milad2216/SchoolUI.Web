define(['angularAMD'], function (control) {
    control.directive('pnLookup', ['$sce', '$compile', 'Notification', '$rootScope', '$state', '$q', '$modal', 'pn.remote.service',
        function factory($sce, $compile, Notification, $rootScope, $state, $q, $modal, remoteService) {
            return {
                templateUrl: "app/base/partials/directives/pn-lookup.html",
                restrict: 'E',
                replace: false,
                transclude: true,
                scope: {
                    options: '=?',
                    isHidden: '@',
                    api: '=?',
                    onClose: "&",
                    extraData: '=?',
                    model: '=?ngModel',
                    onSelectedRow: '&',
                    disabled: "=?",
                    chosenItems: "=?",
                    onOpen: "&",
                },

                link: function ($scope, elem, attr) {
                    $scope.options.title = attr.title ? attr.title : "...";
                    var templateSize = attr.size ? 'app-modal-window-' + attr.size : 'app-modal-window-medium';
                    $scope.htmlPopover = function () {
                        if ($scope.chosenItems) {
                            var html = [];
                            $scope.chosenItems.forEach(function (item) {
                                var text = item[$scope.options.lookup.textField]
                                html.push(text);
                            })
                            return $sce.trustAsHtml(html.join("<br />"));
                        }
                        return "";
                    }

                    $scope.$watch('options.value', function () {
                        if ($scope.options.value) {
                            $scope.model = $scope.options.value;
                        }
                    });
                    $scope.$watch('options.showValue', function (newValue, oldValue) {
                        if ($scope.options.showValue != null) {
                            $scope.options.text = $scope.options.showValue;
                        }
                    });
                   


                    $scope.$watch('model', function (newValue, oldValue) {
                        if (newValue == null) {
                            $scope.options.showValue = null;
                            $scope.options.text = null;
                            if ($scope.options.lookup.codeField) {
                                $scope.options.valueCode = null;
                            }
                        }
                    });

                    $scope.setCodeKeypress = function (e) {
                        if (e.keyCode == 13 && $scope.options.valueCode.length > 0) {
                            var filter = {
                                logic: "and", filters: [{ DataType: 101, field: $scope.options.lookup.codeField, operator: "eq", value: $scope.options.valueCode }]
                            };
                            remoteService.post({ Filter: filter }, $scope.options.lookup.url).then(function (data) {
                                var entity = data.Entities[0];
                                if (entity) {
                                    $scope.options.text = entity[$scope.options.lookup.textField];
                                    $scope.options.value = entity[$scope.options.lookup.valueField];
                                } else {
                                    $scope.options.text = "";
                                    $scope.options.value = "";
                                }
                                $scope.onSelectedRow({ selectedRow: entity });
                            });
                        }
                    }

                    $scope.openModal = function () {
                        var modalInstance = $modal.open({
                            backdrop: 'static',
                            keyboard: true,
                            templateUrl: 'pnlook.html',
                            controller: $scope.lookupController,
                            windowClass: templateSize,
                            resolve: {
                                options: function () {
                                    return $scope.options;
                                },
                                getExtraData: function () {
                                    return $scope.getExtraData;
                                },
                                chosenItems: function () {
                                    return $scope.chosenItems;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {

                            var selectedRowOrg = null;

                            if (angular.isArray(selectedItem)) {
                                $scope.options.text = selectedItem[0][$scope.options.lookup.textField.replace(/\./ig, "_")];
                                $scope.options.values = selectedItem;
                                $scope.model = selectedItem;
                                $scope.chosenItems = selectedItem;
                                selectedRowOrg = { Items: selectedItem };
                            }
                            else {
                                if ($scope.options.lookup.codeField) {
                                    $scope.options.valueCode = selectedItem[$scope.options.lookup.codeField.replace(/\./ig, "_")]
                                }

                                $scope.options.text = selectedItem[$scope.options.lookup.textField.replace(/\./ig, "_")];
                                $scope.options.value = selectedItem[$scope.options.lookup.valueField.replace(/\./ig, "_")];
                                $scope.model = $scope.options.value;
                                $scope.options.showValue = $scope.options.text;
                                selectedRowOrg = selectedItem;
                            }
                            $scope.onSelectedRow({ selectedRow: selectedRowOrg });
                            $scope.onClose({ items: selectedRowOrg });

                        });
                    };

                    $scope.lookupController = function ($scope, $modalInstance, options, getExtraData, chosenItems) {
                        debugger;

                        //setTimeout(function () {
                        //    debugger;
                        //    $('.modal-dialog').css('border', '1px solid red');
                        //    //    on('focusin.bs.modal', function () {
                        //    //   // console.log("sdfsdfsfsf")
                        //    //})
                        //});

                            $(document)
                                .off('focusin.bs.modal') 
                                .on('focusin.bs.modal', function (e) {
                                    var tabIndex = $(".modal-dialog").find(e.target);
                                    if (tabIndex.length == 0) {
                                        var inputs = $(".modal-dialog").find("input");
                                        $.each(inputs, function (index,value) {
                                            if (!$(value).hasClass("ng-hide")) {
                                                $(value).focus();
                                                return false;
                                            }

                                        }); 
                                    }  
                                })
                      
                        $scope.options = options;
                        var selectedItem;
                        var checkedIds = {};
                        $scope.originalItems = [];
                        $scope.unSelectGrid = $scope.options.multiSelect;

                        $scope.safeApply = function (fn) {
                            var phase = this.$root.$$phase;
                            if (phase === '$apply' || phase === '$digest')
                                this.$eval(fn);
                            else
                                this.$apply(fn);
                        };
                        if (!$scope.options.resetOnOpen) {
                            if ($scope.options.multiSelect && chosenItems && chosenItems.length) {
                                $scope.originalItems = chosenItems;
                                for (var i = 0; i < chosenItems.length; i++) {
                                    var valueField = chosenItems[i][$scope.options.lookup.valueField];
                                    checkedIds[valueField] = true;
                                }
                            }
                        }


                        $scope.gridConfig = {
                            inlineOperationalUrl: {
                                read: {
                                    url: options.lookup.url,
                                    data: getExtraData
                                },
                            },
                            autoBind: false,
                            filterable: false
                        };
                        $scope.gridSchema = {
                            model: {
                                id: $scope.options.lookup.valueField
                            },
                            data: 'Entities',
                            total: 'TotalCount'
                        };
                        $scope.gridColumns = [];


                        $scope.removeRowsGrid = function (item) {
                            var dataItem = $scope.kendo.dataSource.get(item[$scope.options.lookup.valueField]);
                            if (dataItem) {
                                var row = $("#lookupGrid tr[data-uid='" + dataItem.uid + "']");
                                if (row) {
                                    row.find("input[type='checkbox']").prop("checked", false);
                                    row.removeClass("k-state-selected");
                                }
                            }
                            checkedIds[item[$scope.options.lookup.valueField]] = false;
                            var index = $scope.originalItems.findIndex(x => x.id == item[$scope.options.lookup.valueField]);
                            $scope.originalItems.splice(index, 1);
                        }

                        $scope.onGridReady = function (kendo) {
                            $scope.kendo = kendo;

                            $scope.gridOptions = $scope.kendo.getOptions();
                            $scope.gridOptions.columns = [];
                            $scope.searchFields = [];

                            $scope.textFields = [];

                            $scope.$watch('selectedItems', function (newVal, oldVal) {
                                if ($scope.selectedItems.length <= 0)
                                    return;

                                if ($scope.options.multiSelect === true) {

                                    var currentRow = $("tr[data-uid='" + $scope.selectedItems[0].uid + "']");
                                    var currentCheckBox = !(currentRow.find("input[type='checkbox']").is(":checked"));
                                    currentRow.find("input[type='checkbox']").prop("checked", currentCheckBox);
                                    checkedIds[$scope.selectedItems[0].id] = currentCheckBox;

                                    var checkedInputs = $("#lookupGrid tr input[type='checkbox']:checked");
                                    $.each(checkedInputs, function (i, v) {
                                        $(v).closest("tr").addClass("k-state-selected");
                                    });

                                    if (currentCheckBox) {
                                        $scope.originalItems.push(angular.copy($scope.selectedItems[0]));
                                    }
                                    else {
                                        currentRow.removeClass("k-state-selected");
                                        var index = $scope.originalItems.findIndex(x => x.id == $scope.selectedItems[0].id);
                                        $scope.originalItems.splice(index, 1);
                                    }
                                }
                            });


                            $scope.options.lookup.fields.forEach(function (field) {
                                if (field.showInSearchPanel)
                                    $scope.searchFields.push(field);
                                if (field.showInGrid) {
                                    $scope.gridOptions.columns.push({
                                        field: field.latinName.replace(/\./ig, "_"),
                                        title: field.persianName
                                    });
                                }
                            });
                            if ($scope.options.multiSelect === true) {
                                var checkBox = { width: 30, template: '<input class="checkboxRow" type="checkbox" />', headerTemplate: '<input class="checkboxCheckAllGrid" type="checkbox" />' };
                                $scope.gridOptions.columns.unshift(checkBox);
                            }

                            $scope.searchGroup = {
                                "Fields_FieldGroup": "ع¯ط±ظˆظ‡ 1",
                                "FieldsList": $scope.searchFields
                            };
                            var childScope = $scope.$new();
                            var group = "<group-control options='searchGroup' bare with-title></group-control>";
                            var el = $compile(group)(childScope);
                            $('#lookup-search-' + $scope.$id).append(el);

                            $scope.kendo.setOptions($scope.gridOptions);

                            $scope.kendo.bind("dataBound", function () {
                                $scope.searchEnable = true;
                            });
                            $scope.kendo.dataSource.bind("error", function () {
                                $scope.searchEnable = true;
                            });
                            kendo.dataSource.read();
                        };


                        $scope.search = function () {
                            $scope.searchEnable = false;
                            try {
                                var filters = [];
                                angular.forEach($scope.searchGroup.FieldsList, function (item) {
                                    if (item.value) {
                                        if (item.operator) {
                                            filters.push({
                                                field: item.latinName,
                                                value: item.value,
                                                groupId: item.groupId,
                                                operator: item.operator,
                                                dataType: item.typeKey,
                                                //Aghayee panahi inao ro pak nakon - personeli
                                                ParameterName: item.ParameterName
                                            });
                                        }
                                        if (item.typeKey <= 103) {
                                            filters.push({
                                                field: item.latinName,
                                                value: item.value,
                                                groupId: item.groupId,
                                                operator: "eq",
                                                dataType: 101,
                                                //Aghayee panahi inao ro pak nakon - personeli
                                                ParameterName: item.ParameterName
                                            });
                                        } else {
                                            filters.push({
                                                field: item.latinName,
                                                value: item.value,
                                                groupId: item.groupId,
                                                operator: "contains",
                                                dataType: item.typeKey,
                                                //Aghayee panahi inao ro pak nakon - personeli
                                                ParameterName: item.ParameterName
                                            });
                                        }
                                    }
                                });

                                if ($scope.options.lookup.filter) {
                                    for (var i = 0; i < $scope.options.lookup.filter.filters.length; i++) {
                                        filters = filters.concat($scope.options.lookup.filter.filters[i]);
                                    }
                                    $scope.kendo.dataSource.filter.logic = $scope.options.lookup.filter.logic;
                                }
                                $scope.kendo.dataSource.filter(filters);
                            } catch (e) {
                                Notification.error({ message: e.message, title: "ط®ط·ط§" });
                                $scope.searchEnable = true;
                            }
                        }

                        $scope.clearFilter = function () {
                            Object.keys($scope.searchGroup.FieldsList).forEach(function (key) {
                                $scope.searchGroup.FieldsList[key].value = '';
                            })
                            $scope.kendo.dataSource.filter([]);
                        }

                        function selectCheckAll(ev) {
                            if (ev.target.checked) {
                                $("#lookupGrid").find(".checkboxRow:not(:checked)").each(function (i, item) {
                                    $(item).click()
                                })
                            }
                            else {
                                $("#lookupGrid").find(".checkboxRow:checked").each(function (i, item) {
                                    $(item).click()
                                })
                            }
                        }

                        function selectRow() {
                            var checked = this.checked;
                            var row = $(this).closest("tr");
                            dataItem = $scope.kendo.dataItem(row);
                            checkedIds[dataItem.id] = checked;
                            if (checked) {
                                $scope.safeApply(function () {
                                    row.addClass("k-state-selected");
                                    $scope.originalItems.push(dataItem);
                                });

                            } else {
                                row.removeClass("k-state-selected");
                                $scope.safeApply(function () {
                                    var index = $scope.originalItems.findIndex(x => x.id == dataItem.id);
                                    $scope.originalItems.splice(index, 1);
                                });
                            }

                            if ($("#lookupGrid").find(".checkboxRow:not(:checked)").length > 0)
                                $("#lookupGrid").find(".checkboxCheckAllGrid").removeProp("checked");
                            else
                                $("#lookupGrid").find(".checkboxCheckAllGrid").prop("checked", "checked");
                        }
                        $scope.cancelPopup = function () {
                            $modalInstance.dismiss('cancel');
                        }
                        //
                        Mousetrap.bind('esc', function (e) {
                            $modalInstance.dismiss('cancel');
                        });
                        Mousetrap.bind('space', function (e) {
                            $scope.performMultiselect();
                        });

                        //
                        $scope.performMultiselect = function () {
                            var selected = $scope.kendo.select();
                            if (selected.length > 0) {
                                if ($scope.options.multiSelect) {
                                    selectedItem = [];
                                    // chosenItems = [];
                                    for (var i = 0; i < selected.length; i++) {
                                        selectedItem.push(angular.copy($scope.kendo.dataItem(selected[i])));
                                    }
                                }
                                else {
                                    selectedItem = $scope.selectedItems[0];
                                }
                            }
                            else {
                                Notification.error({ message: "يک رکورد انتخاب کنيد", title: "خطا" });
                                return;
                            }

                            $scope.closePopup();
                        }


                        $scope.onDblClick = function (items) {
                            if ($scope.options.multiSelect === true)
                                return;
                            selectedItem = items[0];
                            $scope.closePopup();
                        };

                        $scope.closePopup = function () {
                            if (selectedItem) {
                                $modalInstance.close(selectedItem);
                            }
                        };

                        $scope.onKendoDataBound = function (kendo) {
                            if (!angular.equals({}, checkedIds)) {
                                var view = kendo.dataSource.view();
                                for (var i = 0; i < view.length; i++) {
                                    if (checkedIds[view[i].id]) {
                                        $("#lookupGrid tr[data-uid='" + view[i].uid + "']")
                                            .addClass("k-state-selected")
                                            .find(".checkboxRow")
                                            .prop("checked", true);
                                    }
                                }
                            }
                            $("#lookupGrid").off("click", "tr .checkboxRow");
                            $("#lookupGrid").off("click", "tr .checkboxCheckAllGrid");
                            $("#lookupGrid").on("click", "tr .checkboxRow", selectRow);
                            $("#lookupGrid").on('click', 'tr .checkboxCheckAllGrid', selectCheckAll);
                        }
                    };

                    $scope.openPopup = function (event) {

                        if (angular.isDefined(attr.onOpen) && $scope.onOpen() == false) {
                            return
                        }
                        $scope.openModal();





                    };

                    $scope.getExtraData = function () {

                        var extraData = {};
                        if (typeof ($scope.extraData) === 'function') {
                            extraData = $scope.extraData() || {};
                        } else {
                            extraData = $scope.extraData || {};
                        }
                        extraData.currentDate = $state.current.data;
                        extraData.currentName = $state.current.name;
                        extraData.table = $scope.options.lookup.table;
                        extraData.data = $scope.options.lookup.data;

                        if ($scope.options.lookup.fields && $scope.options.lookup.fields.map)

                            extraData.fields = $scope.options.lookup.fields.map(function (x) { return x.latinName });

                        for (var j = 0; j < $rootScope.tabItems.length; j++) {
                            if ($state.current.name.indexOf($rootScope.tabItems[j].action) == 0) {

                                extraData.SystemId = $rootScope.tabItems[j].SystemKey;
                                extraData.FormId = $rootScope.tabItems[j].FormId;
                                break;
                            }
                        }

                        return extraData;
                    }


                    $scope.api = {
                        search: function () {
                            $scope.search();
                        },
                        open: function () {
                            $scope.openModal();
                        },
                        setData: function (arrs) {
                            gridApi.setData(arrs);
                        },
                        clearSelectedItems: function () {
                            $scope.chosenItems = [];
                            $scope.originalItems = [];
                        }
                    };

                    $scope.SetFocus = function () {
                        $(elem).find('button').addClass('k-state-focused');
                    }
                    $scope.SetBlur = function () {
                        $(elem).find('button').removeClass('k-state-focused');
                    }

                }

            }

        }]);
});
