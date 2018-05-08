debugger;
define(['app'], function (app) {
    app.register.controller('onlineQuizSearchController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {

            $scope.startQuiz = function (e) {
                var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
                $state.go("studentQuizAnswer", { quiz: myItem, mode: "edit" });
            }
            $scope.dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: {
                    read: {
                        type: "GET",
                        url: RESOURCES.USERS_DOMAIN + "/api/Quizes",
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
                            Name: { type: "string", defaultValue: null }
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
                field: "Name",
                title: "نام آزمون",
                filterable:
                {
                    cell:
                    {
                        dataSource: {},
                    }
                }

            },
            {
                command: [{
                    text: "شروع آزمون", click: $scope.startQuiz
                }],
                title: "&nbsp;",
                width: 200
            }
                ]
            };
        }
    ]);
});