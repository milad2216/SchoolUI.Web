debugger
define(['app'], function (app) {
    app.register.controller('teacherSchoolClassController', ['$scope', '$rootScope', 'dataService', 'RESOURCES',
        function ($scope, $rootScope, dataService, RESOURCES) {
            debugger;
            //var destroy = function (e) {
            //    debugger;
            //    dataService.deleteEntity()
            //}
            $scope.schoolClassStudents = function (e) {
                var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
                $state.go("schoolClassStudent", { schoolClass: myItem });
            }

            $scope.schoolClassRollCalls = function (e) {
                var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
                $state.go("schoolClassRollCall", { schoolClass: myItem });
            }

            $scope.dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: {
                    read: {
                        type: "GET",
                        url: RESOURCES.USERS_DOMAIN + "/api/SchoolClasses?$expand=School",
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
                        debugger;
                        return result.Items;
                    },
                    total: function (data) {
                        debugger;
                        return data.Count;
                    },
                    model: {
                        id: "Id",
                        fields: {
                            Id: { type: "number", editable: false, nullable: false },
                            Name: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن نام مدرسه الزامی است." } } },
                            Grade: { type: "number", defaultValue: null, validation: { required: { message: "وارد نمودن پایه الزامی است." } } },
                            //SchoolName: { from: "School.Name", defaultValue: null, editable: false, type: "string", validation: {} },
                            //School: { defaultValue: {Name:null} },
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
                        title: "نام کلاس"

                    },
                    {
                        field: "Grade",
                        title: "پایه تحصیلی",
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
                            text: "دانش آموزان", click:$scope.schoolClassStudents
                        }, {
                            text: "حضوروغیاب", click: $scope.schoolClassRollCalls
                        }],
                        title: "&nbsp;",
                        width: 200
                    },
                ]
            };
        }


    ]);
});