define(['app'], function (app) {
    app.register.controller('studentAssignmentSearchController', ['$scope', '$rootScope', 'dataService', '$state', 'RESOURCES', 'enumService',
    function ($scope, $rootScope, dataService, $state, RESOURCES, enumService) {

        $scope.answer = function (e) {
            var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
            $state.go("studentAssignmentAnswer", { assignment: myItem, mode: "edit" });
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
            height: 500,
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
                        text: "پاسخ", click: $scope.answer
                    }],
                    title: "&nbsp;",
                    width: 100
                }
            ]
        };

    }


    ]);
});