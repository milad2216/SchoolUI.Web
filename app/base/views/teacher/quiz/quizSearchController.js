define(['app'], function (app) {
    app.register.controller('quizSearchController', ['$scope', '$rootScope', 'dataService', '$state', 'RESOURCES', 'enumService',
    function ($scope, $rootScope, dataService, $state, RESOURCES, enumService) {

        $scope.editQuiz = function (e) {
            var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
            $state.go("quizCrud", { question: myItem, mode: "edit" });
        }

        $scope.addQuiz = function (e) {
            $state.go("quizCrud", { question: {} });
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
                },
                destroy: {
                    type: "DELETE",
                    url: function (options) {
                        return RESOURCES.USERS_DOMAIN + "/api/Quizes/" + options.Id;
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
            toolbar: [{ name: "addQuiz", template: '<button data-ng-click=\'addQuiz()\' class=\'k-button\'>جدید</button>' }],
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
                        text: "حذف", name: "delete"
                    }, {
                        text: "ویرایش", click: $scope.editQuiz
                    }],
                    title: "&nbsp;",
                    width: 200
                }
            ]
        };
    }


    ]);
});