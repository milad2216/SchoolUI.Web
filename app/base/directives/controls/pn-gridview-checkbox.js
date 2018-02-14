define(['angularAMD'], function (control) {
    control.directive("pnGridviewCheckbox", ["$window", "$timeout", "$parse", "$rootScope", e]);
    function e($window, $timeout, $parse, $rootScope) {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                options: "=?",
                onSelectRow: "&",
                api: "=?"
            },
            template: function (element, attrs) {
                return '<div  kendo-grid="kendoGrid" class="k-rtl mousetrap" k-options="options"></div>';
            },
            controller: function ($scope) {
                $scope.objChecks = {};
                $scope.options.dataBound = function () {
                    $(".checkboxCheckAllGrid").prop("checked", false);
                    debugger
                    var data = $scope.kendoGrid.dataSource.data();
                    data.forEach(function (item) {
                        if ($scope.objChecks[item.Id]) {
                            debugger;
                            var tr = $("tr[data-uid='" + item.uid + "']");
                            tr.addClass("k-state-selected");
                            tr.find(".checkboxRowGrid").prop("checked", true);
                        }
                    });
                }
            },
            link: function (scope, element, attrs) {

                element.off('click');
                element.on('click', '.checkboxCheckAllGrid', function (ev) {
                    debugger
                    var checked = ev.target.checked;
                    checkboxCheckAllClick(checked);
                });
                element.on("click", ".checkboxRowGrid", function () {
                    debugger
                    var dataItem = scope.kendoGrid.dataItem($(this).closest("tr"))
                    if ($(this).is(":checked")) {
                        scope.objChecks[dataItem.Id] = true;
                    }
                    else {
                        scope.objChecks[dataItem.Id] = false;
                        $(".checkboxCheckAllGrid").prop("checked", false);
                    }
                    var checks = element.find(".checkboxRowGrid");
                    checks.each(function () {
                        debugger
                        if ($(this)[0].checked) {
                            $(this).closest("tr").addClass("k-state-selected");
                        }
                        else {
                            $(this).closest("tr").removeClass("k-state-selected");
                        }
                    });
                    var selects = scope.kendoGrid.select();
                    var multiselects = selects.map(function (idx, sel) { return scope.kendoGrid.dataItem(sel) });
                    var item = { items: multiselects };

                    scope.onSelectRow({ data: item });

                    //if ($(this).is(":checked")) {
                    //    $(this).closest("tr").addClass("k-state-selected");
                    //}
                    //else {
                    //    $(this).closest("tr").removeClass("k-state-selected");
                    //}
                    //var selects = scope.kendoGrid.select();
                    //var multiselects = selects.map(function (idx, sel) { return scope.kendoGrid.dataItem(sel) });
                    //var item = { items: multiselects };
                    //scope.onSelectRow({ data: item });


                    //if (element.find(".checkboxRowGrid:not(:checked)").length > 0)
                    //    element.find(".checkboxCheckAllGrid").removeProp("checked");
                    //else
                    //    element.find(".checkboxCheckAllGrid").prop("checked", "checked");
                });

                function checkboxCheckAllClick(checked) {
                    element.find(".checkboxRowGrid").prop("checked", checked);
                    var data = scope.kendoGrid.dataSource.data();
                    if (checked) {
                        element.find('tr').addClass('k-state-selected');

                    }
                    else {
                        element.find('tr').removeClass('k-state-selected');
                    }
                    data.forEach(function (item) {
                        scope.objChecks[item.Id] = checked;
                    });
                    var selects = scope.kendoGrid.select();
                    var multiselects = selects.map(function (idx, sel) { return scope.kendoGrid.dataItem(sel) });
                    var item = { items: multiselects };
                    scope.onSelectRow({ data: { rows: item } });
                }


                scope.api = {
                    getSelected: function () {
                        var itmes = [];
                        for (var t in scope.objChecks) {
                            if (scope.objChecks[t]) {
                                itmes.push(t);
                            }
                        }
                        return itmes;
                    }
                };
            }
        };
    }
});
