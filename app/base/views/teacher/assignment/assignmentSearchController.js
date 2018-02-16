define(['app'], function (app) {
    app.register.controller('assignmentSearchController', ['$scope', '$rootScope', 'dataService', '$state', 'RESOURCES', 'enumService',
    function ($scope, $rootScope, dataService, $state, RESOURCES, enumService) {

        $scope.editAssignment = function (e) {
            var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
            $state.go("assignmentCrud", { assignment: myItem, mode: "edit" });
        }

        $scope.showAnswers = function (e) {
            var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
            $state.go("assignmentAnswer", { assignment: myItem, mode: "edit" });
        }

        $scope.addAssignment = function (e) {
            $state.go("assignmentCrud", { assignment: {} });
        }
        $scope.dataSource = new kendo.data.DataSource({
            type: 'odata',
            transport: {
                read: {
                    type: "GET",
                    url: RESOURCES.USERS_DOMAIN + "/api/Assignments",
                    beforeSend: function (request) {
                        var aut = JSON.parse(localStorage.getItem("lt"));
                        request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                    },
                    withCredentials: true,
                    dataType: "json",
                },
                destroy: {
                    type: "DELETE",
                    url: function (options) {
                        return RESOURCES.USERS_DOMAIN + "/api/Assignments/" + options.Id;
                    },
                    beforeSend: function (request) {
                        var aut = JSON.parse(localStorage.getItem("lt"));
                        request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                    },
                    dataType: "json",
                    withCredentials: true,
                    complete: function (jqXhr, textStatus) {
                        $scope.mainGridOptions.dataSource.read();

                    }
                }
            },
            schema: {
                data: function (result) {
                    return result.Items;
                },
                total: function (data) {
                    return data.Count;
                },
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", editable: false, nullable: true },
                        Title: { type: "string", defaultValue: null },
                        Description: { type: "string", defaultValue: null },
                        DtDue: { type: "date", editable: false }
                    }
                }
            },
            autoSync: false,
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
        });

        $scope.mainGridOptions = {
            dataSource: $scope.dataSource,
            filterable: {
                extra: false
            },
            height: 490,
            groupable: false,
            resizable: true,
            scrollable: true,
            pageSize: 10,
            selectable: "row",
            sortable: {
                mode: "single",
                allowUnsort: true
            },
            pageable: {
                buttonCount: 3,
                previousNext: true,
                numeric: true,
                refresh: true,
                info: true,
                pageSizes: [10, 20, 50, 100]
            },
            dataBound: function () {
                $(".k-grid").find('a').removeAttr('href');
            },
            toolbar: [{ name: "addAssignment", template: '<button data-ng-click=\'addAssignment()\' class=\'k-button\'>جدید</button>' }],
            editable: "inline",

            columns: [
                {
                    field: "Title",
                    title: "عنوان",
                    filterable:
                    {
                        cell:
                        {
                            dataSource: {},
                        }
                    }

                },
                {
                    field: "DtDue",
                    title: "مهلت",
                    template: "#= moment(DtDue).format('jYYYY/jMM/jDD')#",
                    filterable:
                    {
                        extra: true,
                        ui: 'datepicker',
                        operators: {
                            date: {
                                gt: "بزرگتر",
                                lt: "کوچکتر"
                            }
                        }
                    }
                },
                {
                    command: [{
                        text: "حذف", name: "delete"
                    }, {
                        text: "ویرایش", click: $scope.editAssignment
                    }, {
                        text: "پاسخ‌ها", click: $scope.showAnswers
                    }],
                    title: "&nbsp;",
                    width: 300
                }
            ]
        };

    }


    ]);
});