debugger
define(['app'], function (app) {
    app.register.controller('propertyController', ['$scope', '$rootScope', 'dataService', 'enumService', 'RESOURCES',
        function ($scope, $rootScope, dataService, enumService, RESOURCES) {
            debugger;
            
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: {
                    read: {
                        type: "GET",
                        url: RESOURCES.USERS_DOMAIN + "/api/Properties",
                        beforeSend: function (request) {
                            var aut = JSON.parse(localStorage.getItem("lt"));
                            request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                        },
                        withCredentials: true,
                        dataType: "json",
                    },
                    update: {
                        dataType: "json",
                        type: "PUT",
                        url: function (options) {
                            debugger;
                            return RESOURCES.USERS_DOMAIN + "/api/Properties/" + options.Id;
                        },

                        beforeSend: function (request) {
                            var aut = JSON.parse(localStorage.getItem("lt"));
                            request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                        },
                        complete: function (jqXhr, textStatus) {
                            $scope.mainGridOptions.dataSource.read();
                        }

                    },
                    destroy: {
                        type: "DELETE",
                        url: function (options) {
                            return RESOURCES.USERS_DOMAIN + "/api/Properties/" + options.Id;
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
                    },
                    create: {
                        type: "POST",
                        url: RESOURCES.USERS_DOMAIN + "/api/Properties",
                        beforeSend: function (request) {
                            var aut = JSON.parse(localStorage.getItem("lt"));
                            request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                        },
                        dataType: "json",
                        complete: function (jqXhr, textStatus) {
                            $scope.mainGridOptions.dataSource._page = 1;
                            $scope.mainGridOptions.dataSource._skip = 0;
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
                            Id: { type: "number", editable: false, nullable: false },
                            Code: { type: "string", nullable: false, validation: { required: { message: "وارد نمودن کد الزامی است." } } },
                            Name: { type: "string", nullable: false, validation: { required: { message: "وارد نمودن نام الزامی است." } } },
                            Count: { type: "number", nullable: false, validation: { required: { message: "وارد نمودن تعداد الزامی است." } } }
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
                dataSource: dataSource,
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
                toolbar: [{ name: "create", text: "اضافه کردن" }],
                editable: "inline",

                columns: [
                    {
                        field: "Name",
                        title: "نام کالا",
                        filterable:
                        {
                            cell:
                            {
                                dataSource: {},
                            }
                        }
                    }, {
                        field: 'Code',
                        title: 'کد کالا',
                        filterable:
                        {
                            cell:
                            {
                                dataSource: {},
                            }
                        }
                    }, {
                        field: "Count",
                        title: "تعداد",
                        filterable:
                        {
                            cell:
                            {
                                dataSource: {},
                            }
                        }
                    },
                    {
                        command: ["edit", "delete"],
                        title: "&nbsp;",
                        width: 200
                    },
                ]
            };

        }


    ]);
});