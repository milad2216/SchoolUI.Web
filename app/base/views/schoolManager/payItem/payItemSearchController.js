define(['app'], function (app) {
    app.register.controller('payItemSearchController', ['$scope', '$rootScope', 'dataService', '$state', 'RESOURCES',
    function ($scope, $rootScope, dataService, $state, RESOURCES) {

        $scope.addPayItem = function (e) {
            $state.go("payItemCrud", { payItem: {} });
        }

        $scope.dataSource = new kendo.data.DataSource({
            type: 'odata',
            transport: {
                read: {
                    type: "GET",
                    url: RESOURCES.USERS_DOMAIN + "/api/PayItems?$expand=Student",
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
                        return RESOURCES.USERS_DOMAIN + "/api/PayItems/" + options.Id;
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
                update: {
                    dataType: "json",
                    type: "PUT",
                    url: function (options) {
                        debugger;
                        return RESOURCES.USERS_DOMAIN + "/api/PayItems/" + options.Id;
                    },

                    beforeSend: function (request) {
                        var aut = JSON.parse(localStorage.getItem("lt"));
                        request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                    },
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
                        StudentId: { type: "number", editable: false, nullable: true },
                        Student: { defaultValue: {} },
                        StudentFirstName: { from: "Student.FirstName", type: "string", editable: false, nullable: true },
                        StudentLastName: { from: "Student.LastName", type: "string", editable: false, nullable: true },
                        DscPay: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن عنوان پرداخت الزامی است." } } },
                        Price: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن میزان پرداخت الزامی است." } } }
                    }
                }
            },
            error: function (e) {
                dataService.DispatchErrReponseForKendo(e);
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
            toolbar: [{ name: "addPayItem", template: '<button data-ng-click=\'addPayItem()\' class=\'k-button\'>ثبت پرداخت جدید</button>' }],
            editable: "inline",

            columns: [
                {
                    field: "StudentFirstName",
                    title: "نام دانش‌آموز",
                    filterable:
                    {
                        cell:
                        {
                            dataSource: {},
                        }
                    }

                }, {
                    field: 'StudentLastName',
                    title: 'نام خانوادگی دانش‌آموز',
                    filterable:
                    {
                        cell:
                        {
                            dataSource: {},
                        }
                    }
                }, {
                    field: 'DscPay',
                    title: 'عنوان پرداخت',
                    filterable:
                    {
                        cell:
                            {
                                dataSource: {},
                            }
                    }
                }, {
                    field: 'Price',
                    title: 'میزان پرداخت',
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
                        text: "ویرایش", name: "edit"
                    }, {
                        text: "حذف", name: "delete"
                    }],
                    title: "&nbsp;",
                    width: 200
                },
            ]
        };
    }


    ]);
});