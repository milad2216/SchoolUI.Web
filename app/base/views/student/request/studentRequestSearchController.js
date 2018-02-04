define(['app'], function (app) {
    app.register.controller('studentRequestSearchController', ['$scope', '$rootScope', 'dataService', '$state', 'RESOURCES', 'enumService',
    function ($scope, $rootScope, dataService, $state, RESOURCES, enumService) {

        $scope.addRequest = function (e) {
            //var myItem = $scope.mainGrid.dataItem($(e.target).closest("tr"));
            $state.go("studentRequestCrud", { studentRequest: {} });
            //$scope.$apply();
        }

        $scope.editRequest = function (e) {
            var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
            $state.go("studentRequestCrud", { studentRequest: myItem, mode: "edit" });
        }
        var RequestState = enumService.RequestState();
        var RequestStateItems = [];
        angular.forEach(RequestState, function (value, key) {
            RequestStateItems.push({ text: value.Text, value: value.Id });
        });
        $scope.dataSource = new kendo.data.DataSource({
            type: 'odata',
            transport: {
                read: {
                    type: "GET",
                    url: RESOURCES.USERS_DOMAIN + "/api/Requests",
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
                        return RESOURCES.USERS_DOMAIN + "/api/Requests/" + options.Id;
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
                        Title: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن عنوان الزامی است." } } },
                        Description: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن نام خانوادگی الزامی است." } } },
                        RequestState: { type: "string", editable: false }
                    }
                }
            },
            autoSync: false,
            pageSize: 9,
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
            toolbar: [{ name: "addRequest", template: '<button data-ng-click=\'addRequest()\' class=\'k-button\'>درخواست جدید</button>' }],
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

                }, {
                    field: 'RequestState',
                    title: 'وضعیت',
                    width: '300px',
                    values: RequestStateItems
                },
                {
                    command: [{
                        text: "حذف", name: "delete"
                    }],
                    title: "&nbsp;",
                    width: 200
                }
            ]
        };
    }


    ]);
});