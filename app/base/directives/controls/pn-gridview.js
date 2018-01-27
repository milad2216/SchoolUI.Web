define(['angularAMD'], function (control) {
    control.directive("pnGridview", ["$window", "$timeout", "$parse", "localStorageService", "AuthToken", "$rootScope", "pn.enum", e]);
    function e($window, $timeout, $parse, localStorageService, tokenKey, $rootScope, pnenum) {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                gridConfig: "=?config",
                gridColumns: "=columns",
                gridSchema: "=schema",
                gridAggregate: "=?aggregate",
                toolbars: "=?",
                selecteditems: "=?",
                parameters: "=?",
                sortable: "=?",
                hasWorkflowStatus: "=?",
                api: "=?",
                hasRowNumber: "=?",
                onKendoReady: '&',
                onApiReady: '&',
                onDblClick: '&',
                onKendoDataBound: '&',
                onSelectRow: "&",
                unSelect: "=?",
                contextMenuConfig: "=?",
                recordIdBindField: "=?",
                subject: '@?',
                disable: '=?ngDisabled'
            },
            template: function (element, attrs) {
                return '<div kendo-grid="kendoGrid" class="k-rtl mousetrap" k-options="gridOptions"><div ng-class="{\'disablegrid \':disable}"></div></div>';
            },
			link: function (scope, element, attrs) {
                //var checkedIds = {};
                var hidcolumns = {};
                scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof (fn) === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };

                if (attrs.subject !== undefined) {
                    $('<div />', {
                        class: 'grid-title genral-background',
                        text: _t(attrs.subject),
                        insertBefore: element
                    });
                }

                if (scope.contextMenuConfig) {

                    debugger;

                    var options = {};
                    if (scope.contextMenuConfig.actions != undefined) {
                        options.actions = scope.contextMenuConfig.actions;
                    }
                    if (scope.contextMenuConfig.menuPosition != undefined) {
                        options.menuPosition = scope.contextMenuConfig.menuPosition;
                    }
                    else { options.menuPosition = 'aboveRight'; }
                    var id = $(element).attr('id');
                    if (id == undefined) {
                        throw 'grid view id is required!, ' +
                        'remark: if developer used contextMenuConfig property in gridview config,' +
                        'set id otherwise, not required.';
                    }
                    else {
                        debugger;
                        var menu = new BootstrapMenu('#' + id + ' tbody tr', options);
                    }
                }

                if (!scope.unSelect || scope.gridConfig.multiselect) {
                    scope.unSelect = false;
                }

                var getColumns = function (columns) {
                    if (scope.gridConfig.noIndex === true) {
                        return columns;
                    }
                    if (angular.isUndefined(columns) || columns == null)
                        return new Array();
                    columns.forEach(function (col) {



                        if (col.filtermode && (col.filterable || col.filterable == undefined)) {
                            col.filterable = {
                                operators: {
                                    string: {
                                        eq: _t("GRID.EQ")
                                    }
                                },
                                ui: function (element) {
                                    element.kendoDropDownList({
                                        dataTextField: col.filtermode.dataTextField,
                                        dataValueField: col.filtermode.dataValueField,
                                        dataSource: col.filtermode.dataSource,
                                        optionLabel: _t("GRID.SELECTTEXT")
                                    });
                                }
                            }
                        }


                    });

                    var thisScope = scope;
                    var rowNumberTemplate = function (row) {
                        var base = 0;
                        if (thisScope.kendoGrid.pager) {
                            var page = thisScope.kendoGrid.pager.page();
                            if (page === 0)
                                page = 1;
                            base = (page - 1) * thisScope.kendoGrid.pager.pageSize();
                        }
                        var index = thisScope.kendoGrid.dataSource.indexOf(row);
                        return base + (index + 1);
                    }

                    if (attrs.hasWorkflowStatus !== "false") {

                        var wfOpStateRow = {
                            template: function (row) {
                                switch (row.WfOpStatus) {
                                    case pnenum.pnWorkflowState.toDo:
                                        return ["<span class=\'label label-danger\'>", _t("WfOpStatus.ToDo"), "</span>"].join("");
                                    case pnenum.pnWorkflowState.inprogress:
                                        return ["<span class=\'label label-warning\'>", _t("WfOpStatus.InProgress"), "</span>"].join("");
                                    case pnenum.pnWorkflowState.done:
                                        return ["<span class=\'label label-success\'>", _t("WfOpStatus.Done"), "</span>"].join("");
                                }
                                return ["<span class=\'label label-danger\'>", _t("WfOpStatus.ToDo"), "</span>"].join("");
                            },
                            width: 100,
                            title: _t("GridViewColumnTemplate.WorkflowColumnTitle"),
                            field: "WfOpStatus",
                            hidden: true
                        };

                        if (columns) {
                            columns.unshift(wfOpStateRow);
                        } else {
                            columns = [wfOpStateRow];
                        }
                    }


                    if (thisScope.hasRowNumber || thisScope.hasRowNumber == undefined) {
                        var rowNumber = {
                            template: rowNumberTemplate, width: 50, title: _t("GridViewColumnTemplate.RowColumnTitle")
                        };
                        columns.unshift(rowNumber);
                    }
                    if (scope.gridConfig.multiselect == true) {
                        var checkBox = { width: 30, template: '<input class="checkboxRowGrid" type="checkbox" />', headerTemplate: '<input class="checkboxCheckAllGrid" type="checkbox" />' };
                        columns.unshift(checkBox);
                    }
                    var columnsOrg = [];
                    $.each(columns, function (idx, elem) {
                        if (!elem.hidden ) {
                            columnsOrg.push(elem);
                        }
                    });

                    return columnsOrg;
                };

                if (scope.gridSchema) {
                    scope.gridSchema.parse = function (res) {
                        if (res != null)
                            if (res.Entities)
                                if (res.Entities.length > 0) {
                                    if (angular.isDefined(res.Entities[0].WfOpStatus)) {
                                        scope.kendoGrid.showColumn("WfOpStatus");
                                    } else {
                                        scope.kendoGrid.hideColumn("WfOpStatus");
                                    }
                                }
                        return res;

                    }
                }


                function initilalizeGrid() {
                    var kendogrid;
                    scope.gridInitialized = true;
                    scope.gridConfig.autoSize = scope.gridConfig.autoSize || false;
                    scope.gridOptions = {
                        dataSource: new kendo.data.DataSource({
                            type: "json",
                            transport: {
                                read:
                                {
                                    url: scope.gridConfig.inlineOperationalUrl.read.url,
                                    data: scope.gridConfig.inlineOperationalUrl.read.data,
                                    type: "POST",
                                    contentType: "application/json; charset=utf-8",
                                },
                                update:
                                {
                                    url: scope.gridConfig.inlineOperationalUrl.update,
                                    type: "PUT",
                                    contentType: "application/json; charset=utf-8",
                                },
                                destroy:
                                {
                                    url: scope.gridConfig.inlineOperationalUrl.destroy,
                                    type: "DELETE",
                                    contentType: "application/json; charset=utf-8",
                                },
                                create:
                                {
                                    url: scope.gridConfig.inlineOperationalUrl.create,
                                    type: "POST",
                                    contentType: "application/json; charset=utf-8",
                                },
                                parameterMap: function (data, operation) {
                                    if (operation === "read") {
                                        return angular.toJson(data);
                                    }
                                }
                            },
                            error: function (e) {
                            },
                            requestStart: function () {
                            },
                            requestEnd: function (result) {
                            },
                            batch: attrs.batch,
                            pageSize: attrs.pageSize ? attrs.pageSize : 15,
                            serverPaging: true,
                            serverFiltering: true,
                            serverSorting: true,
                            schema: scope.gridSchema,
                            aggregate: scope.gridAggregate,
                            sort: scope.gridConfig.sort
                        }),
                        navigatable: true,
                        scrollable: {
                            virtual: true
                        },
                        resizable: true,
                        height: angular.isUndefined(attrs.height) ? 'auto' : attrs.height,
                        width: angular.isUndefined(attrs.width) ? 'auto' : attrs.width,
                        pageable: (scope.gridConfig.pageable !== undefined) ? scope.gridConfig.pageable : {
                            buttonCount: scope.gridConfig.buttonCount ? scope.gridConfig.buttonCount : 3,
                            previousNext: !scope.gridConfig.previousNext ? scope.gridConfig.previousNext : true,
                            numeric: !scope.gridConfig.numeric ? scope.gridConfig.numeric : true,
                            refresh: (scope.gridConfig.refreshButton !== undefined) ? scope.gridConfig.refreshButton : true,
                            info: !scope.gridConfig.pageableInfo ? scope.gridConfig.pageableInfo : true,
                            pageSizes: scope.gridConfig.pageSizes ? (scope.gridConfig.pageSizes.length === 0 ? false : scope.gridConfig.pageSizes) : [15, 30, 100, 500]
                        },
                        autoBind: typeof (scope.gridConfig.autoBind) === "undefined" ? true : scope.gridConfig.autoBind,
                        dataBound: function (arg) {
                            try {
                                element.find('.k-button').removeAttr("href");

                                scope.onKendoDataBound({ kendo: scope.kendoGrid });
                            } catch (e) {
                            }

                            if (scope.gridConfig.autoSize === true) {
                                var grid = scope.kendoGrid;
                                if (grid.dataSource.data().length > 0)

                                    for (var iC = 0; iC < grid.columns.length; iC++) {
                                        grid.autoFitColumn(iC);
                                    }
                            }
                            var rows = this.dataSource.view();

                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].IsRead == undefined)
                                    break;
                                if (!rows[i].IsRead) {
                                    this.tbody.find("tr[data-uid='" + rows[i].uid + "']").addClass("unreadclass");
                                }
                            }

                            if (scope.currentRow) {
                                scope.kendoGrid.select(scope.kendoGrid.tbody.find('tr:nth(' + scope.currentRow + ')'));
                                scope.currentRow = undefined;
                            }

                            if (scope.unSelect == false)
                                scope.kendoGrid.select(scope.kendoGrid.tbody.find('tr:first'));

                            if (scope.disabledItem) {

                                var selectedItems = [];
                                scope.selecteditems = selectedItems;
                                scope.disabledItem.addClass("toolbarDisabledCommandButton");
                                var getter = $parse(attrs.isSelected);
                                var setter = getter.assign;
                                setter(scope.$parent, "false");
                                scope.$apply();
                            }

                            //if (scope.gridConfig.checkAllPages)
                            //    checkboxCheckAllClick($(element).find(".checkboxCheckAllGrid").is(":checked"));
                            //else
                            //    $(element).find(".checkboxCheckAllGrid").removeProp("checked");



                        },
                        navigatable: false,
                        groupable: false,
                        editable: false,
                        scrollable: {
                            virtual: true
                        },
                        columnMenu: attrs.columnmenu ? attrs.columnmenu : false,
                        columnShow: function (e) {

                            hidcolumns[e.column.field] = false;

                            localStorageService.set(attrs.id + "-grid", JSON.stringify(hidcolumns));

                        },
                        columnHide: function (e) {

                            hidcolumns[e.column.field] = true;
                          
                            localStorageService.set(attrs.id + "-grid", JSON.stringify(hidcolumns));

                        },

                        filterable: (angular.isUndefined(scope.gridConfig.filterable) || scope.gridConfig.filterable == true) ? { extra: false } : false,
                        scrollable: attrs.scrollable ? attrs.scrollable : true,

                        toolbar: scope.gridConfig.excel ? [{ name: "excel", text: "خروجی اکسل" }] : false,
                        excel: {
                            allPages: true
                        },

                        sortable: (scope.sortable !== undefined ? scope.sortable : true),
                        columns: getColumns(scope.gridColumns),
                        selectable: "row",
                        change: function () {
                            if (!scope.gridConfig.multiselect) {
                                if (attrs.isSelected) {
                                    var getter = $parse(attrs.isSelected);
                                    var setter = getter.assign;
                                    setter(scope.$parent, "true");
                                    scope.disabledItem = $(".toolbarDisabledCommandButton");
                                    $("a").removeClass("toolbarDisabledCommandButton");

                                }
                                var selectedRows = this.select();
                                var selectedItems = [];
                                for (var i = 0; i < selectedRows.length; i++) {
                                    var dataItem = this.dataItem(selectedRows[i]);
                                    selectedItems.push(dataItem);
                                }

                                scope.selecteditems = selectedItems;

                                if (dataItem)
                                    scope.onSelectRow({ data: dataItem });

                                setCuuernRowForEngines(selectedItems);
                                scope.safeApply(function () {
                                });

                            }
                            else {
                                multiSelectedRow();
                            }
                        }
                    };
                    if (scope.gridConfig.group != null && scope.gridConfig.group.fieldName != null) {
                        scope.gridOptions.dataSource.group = { field: scope.gridConfig.group.fieldName, aggregates: scope.gridConfig.group.aggregates };
                    }
                }

                if (scope.gridConfig) {
                    initilalizeGrid();
                }
                scope.$parent.$watch(scope.gridConfig, function (newparameter, oldparameter) {

                    if (!scope.gridInitialized) {
                        initilalizeGrid();
                    }
                    if (newparameter) {


                        scope.gridOptions.dataSource.transport = {
                            type: "jsonp",
                            read:
                            {
                                url: scope.gridConfig.inlineOperationalUrl.read,
                                data: scope.gridConfig.inlineOperationalUrl.read.data,
                                type: "POST",
                                contentType: "application/json"
                            },
                            update:
                            {
                                url: scope.gridConfig.inlineOperationalUrl.update,
                                type: "PUT",
                                contentType: "application/json"
                            },
                            destroy:
                            {
                                url: scope.gridConfig.inlineOperationalUrl.destroy,
                                type: "DELETE",
                                contentType: "application/json"
                            },
                            create:
                            {
                                url: scope.gridConfig.inlineOperationalUrl.create,
                                type: "POST",
                                contentType: "application/json"
                            },
                            parameterMap: function (data) {

                                data.parameters = scope.parameters;
                                //return JSON.stringify(data);
                                return angular.toJson(data);
                            }
                        };

                        scope.kendoGrid.setOption(scope.gridOptions);
                    }
                });
                scope.$watch(attrs.isSelected, function (newparameter, oldparameter) {
                    if (newparameter) {

                        $("p").removeClass(".toolbarDisabledCommandButton");
                    }
                });
                element.on("click", ".checkbox", selectRow);

                //on dataBound event restore previous selected rows:
                element.on('click', '.selected', selectRow);

               
                element.on("mousedown", "tr[role='row']", function (e) {
                    if (e.which === 3) {
                        $(this).siblings().removeClass("k-state-selected");
                        $(this).addClass("k-state-selected");
                        selectRow();
                    }
                });

                element.on("keyup", function (ke) {
                    if (!scope.gridConfig.multiselect) {
                        //var elem = $(ke.target);
                        //var el = elem.find('.k-state-focused');
                        //el.removeClass('k-state-focused');
                        //el.removeAttr('aria-describedby');


                        ke.preventDefault();
                        ke.stopImmediatePropagation();
                        var kGrid, curRow, newRow;
                        kGrid = scope.kendoGrid;

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
                    }
                });


                element.on("dblclick", "tr", function (e) {
                    scope.onDblClick({ items: scope.selecteditems });
                });

                scope.api = {
                    refresh: function () { },
                    setActive: function (isActive) { },
                    getSelected: function () { }
                };

                scope.$on('kendoWidgetCreated', function (event, target) {

                    if (target.options.name == "Grid") {

                        scope.kendoGrid.tbody.attr("tabindex", 0);
                        var gridOverlay;
                        scope.api.remove = function (record) {
                            scope.kendoGrid.dataSource.data().remove(record);
                        };
                        scope.api.unSelect = function () {
                        };
                        scope.kendoGrid.clearSelection();
                        scope.api.insert = function (record) {
                            scope.kendoGrid.dataSource.data().push(record);
                        };

                        scope.api.refresh = function () {
                            var row = scope.kendoGrid.dataItem(scope.kendoGrid.select());
                            scope.currentRow = scope.kendoGrid.dataSource.indexOf(row);
                            scope.kendoGrid.dataSource.page(1);
                        };


                        scope.api.setActive = function (isActive) {

                            if (isActive && gridOverlay) {
                                gridOverlay.remove();
                                gridOverlay = null;
                                return;
                            }

                            if (!isActive && !gridOverlay) {
                                gridOverlay = $("<div  />")
                                    .css({
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        left: 0,
                                        top: 2,
                                        cursor: "not-allowed",
                                        opacity: 0.3,
                                        background: "#ffffff",
                                        zIndex: 9
                                    });
                                gridOverlay.appendTo(scope.kendoGrid.element);
                            }

                        };

                        scope.api.setData = function (arrs) {
                            scope.kendoGrid.dataSource.data(arrs);
                        };
                        scope.api.setDataAndOption = function (arrs, options) {
                            // scope.kendoGrid.dataSource.options = options;
                            scope.kendoGrid.setOptions(options);

                            scope.kendoGrid.dataSource.data(arrs);


                        };

                        scope.api.getSelected = function (column) {
                            var selects = scope.kendoGrid.select();
                            var multiselects = selects.map(function (idx, sel) { return scope.kendoGrid.dataItem(sel) });
                            return multiselects;
                        };

                        scope.api.showColumn = function (column) {
                            scope.kendoGrid.showColumn(column);
                        };

                        scope.api.hideColumn = function (column) {
                            scope.kendoGrid.hideColumn(column);
                        };
                        
                        scope.api.selectFirstRow = function () {
                            scope.kendoGrid.select(scope.kendoGrid.tbody.find('tr:first'));
                        };
                        scope.onKendoReady({ kendo: scope.kendoGrid, options: scope.gridOptions });
                        scope.onApiReady({ api: scope.api });
                    }
                    if (attrs.columnmenu) {
                        var cols = localStorageService.get(attrs.id + "-grid");
                        if (cols) {
                            hidcolumns = JSON.parse(cols);
                            for (item in hidcolumns) {
                                if (hidcolumns[item]) {
                                    scope.kendoGrid.hideColumn(item);
                                }
                            }
                        }
                    }
                });

                element.on('click', '.checkboxCheckAllGrid', function (ev) {
                    var checked = ev.target.checked;
                    checkboxCheckAllClick(checked);
                });


                element.on("click", ".checkboxRowGrid", function () {
                    if ($(this).is(":checked")) {
                        $(this).closest("tr").addClass("k-state-selected");
                    }
                    else {
                        $(this).closest("tr").removeClass("k-state-selected");
                    }
                    var selects = scope.kendoGrid.select();
                    var multiselects = selects.map(function (idx, sel) { return scope.kendoGrid.dataItem(sel) });
                    var item = { items: multiselects };
                    scope.onSelectRow({ data: item });


                    if ($(element).find(".checkboxRowGrid:not(:checked)").length > 0)
                        $(element).find(".checkboxCheckAllGrid").removeProp("checked");
                    else
                        $(element).find(".checkboxCheckAllGrid").prop("checked", "checked");
                });

                function checkboxCheckAllClick(checked) {
                    $(element).find(".checkboxRowGrid").prop("checked", checked);
                    if (checked) {
                        $(element).find('tr').addClass('k-state-selected');
                    }
                    else {
                        $(element).find('tr').removeClass('k-state-selected');
                    }
                    var selects = scope.kendoGrid.select();
                    var multiselects = selects.map(function (idx, sel) { return scope.kendoGrid.dataItem(sel) });
                    var item = { items: multiselects };
                    scope.onSelectRow({ data: item });
                }

                function multiSelectedRow() {
                    var item = scope.kendoGrid.dataItem(scope.kendoGrid.select());
                    if (item) {
                        var checkbox = $("[data-uid='" + item.uid + "']").find(".checkboxRowGrid");
                        var checked = !checkbox.is(":checked");
                        var checkboxs = $(element).find('.checkboxRowGrid:checked');
                        checkbox.prop("checked", checked);
                        if (checked == false) {
                            $(element).find("tr").removeClass("k-state-selected");
                        }
                        checkboxs = $(element).find('.checkboxRowGrid:checked');
                        checkboxs.each(function (index, ck) {
                            $(this).closest("tr").addClass("k-state-selected");
                        });
                        var selects = scope.kendoGrid.select();
                        var multiselects = selects.map(function (idx, sel) { return scope.kendoGrid.dataItem(sel) });
                        var item = { items: multiselects };
                        scope.onSelectRow({ data: item });
                    }
                }

                function selectRow() {

                    var checked = this.checked;
                    row = $(this).closest("tr");

                    var rowData = scope.kendoGrid.dataItem(row);
                    scope.onSelectRow({ data: rowData });

                    //if (checked) {
                    //    row.addClass("k-state-selected");
                    //} else {
                    //    row.removeClass("k-state-selected");
                    //}
                    //elem.trigger("change");


                }

                function setCuuernRowForEngines(selectedRows) {

                    if (selectedRows == undefined || selectedRows.length == 0)
                        return;
                    var currentRow = selectedRows[0];
                    var form = $('.acitveForm:visible');
                    var currentScope = angular.element(form).scope();

                    if (!currentScope || !currentScope.engine) return;

                    currentScope.engine.Status = currentRow["WfOpStatus"];

                }


            }
        };
    }
});
