debugger;
define(['app'], function (app) {
    app.register.controller('requestManagmentSearchController', ['$scope', '$rootScope', 'dataService', '$state', 'RESOURCES', 'enumService',
    function ($scope, $rootScope, dataService, $state, RESOURCES, enumService) {


        $scope.viewRequest = function (e) {
            var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
            $state.go("requestView", { studentRequest: myItem, mode: "view" });
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
                        Title: { type: "string", editable: false, validation: { required: { message: "وارد نمودن عنوان الزامی است." } } },
                        Description: { type: "string", editable: false, validation: { required: { message: "وارد نمودن نام خانوادگی الزامی است." } } },
                        RequestState: { type: "string", editable: true, validation: { required: { message: "انتخاب وضعیت درخواست الزامی است." } } }
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

                }, {
                    field: 'RequestState',
                    title: 'وضعیت',
                    width: '300px',
                    values: RequestStateItems
                },
                {
                    command: [{
                        text: "نمایش", click: $scope.viewRequest
                    }],
                    title: "&nbsp;",
                    width: 100
                },
            ]
        };
    }


    ]);
});