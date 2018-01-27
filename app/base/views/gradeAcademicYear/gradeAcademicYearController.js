debugger
define(['app'], function (app) {
    app.register.controller('gradeAcademicYearController', ['$scope', '$rootScope', 'dataService', 'enumService', 'RESOURCES',
        function ($scope, $rootScope, dataService, enumService, RESOURCES) {
            debugger;
            //var destroy = function (e) {
            //    debugger;
            //    dataService.deleteEntity()
            //}
          //  $scope.mainGridOptions = {};

            dataService.getData(RESOURCES.USERS_DOMAIN + '/api/SchoolClasses').then(function (data) {
                //var items = [];
                //angular.forEach(data, function (value, key) {
                //    items.push({ text: value.Name, value: value.Id });
                //});
                var items = [{ text: "سال تحصیلی 96-97", value: '8' }, { text: "سال تحصیلی 97-98", value: '4' }, { text: "سال تحصیلی 98-99", value: '5' }];

                var grade = enumService.GradeEnum();
                var gradeItems = [];
                angular.forEach(grade, function (value, key) {
                    gradeItems.push({ text: value.Text, value: value.Value });
                });

                var major = enumService.MajorEnum();
                var majorItems = [];
                angular.forEach(major, function (value, key) {
                    majorItems.push({ text: value.Text, value: value.Id });
                });
                loadGrid(items, majorItems, gradeItems);
            });
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: {
                    read: {
                        type: "GET",
                        url: RESOURCES.USERS_DOMAIN + "/api/GradeAcademicYears",
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
                            return RESOURCES.USERS_DOMAIN + "/api/GradeAcademicYears/" + options.Id;
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
                            return RESOURCES.USERS_DOMAIN + "/api/GradeAcademicYears/" + options.Id;
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
                        url: RESOURCES.USERS_DOMAIN + "/api/GradeAcademicYears",
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
                            Grade: { type: "number", nullable: false, validation: { required: { message: "انتخاب پایه الزامی است." } } },
                            AcademicYearId: { type: "number", nullable: false, validation: { required: { message: "انتخاب سال تحصیلی الزامی است." } } },
                            Tuition: { type: "number", nullable: false, validation: { required: { message: "وارد نمودن شهریه الزامی است." } } },
                            SchoolId: { type: "number", nullable: false },
                            Major : {type:"string"}
                        }
                    }
                },
                autoSync: false,
                pageSize: 9,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            });

            var loadGrid = function (academicYearItems, majorItems, gradeItems) {
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
                            field: "Grade",
                            title: "پایه تحصیلی",
                            values: gradeItems
                        }, {
                            field: 'AcademicYearId',
                            title: 'سال تحصیلی',
                            width: '300px',
                            values: academicYearItems
                        },{
                            field: "Major",
                            title: "رشته",
                            values: majorItems
                        },{
                            field: "Tuition",
                            title: "شهریه",
                            filterable:
                            {
                                cell:
                                {
                                    dataSource: {},
                                }
                            }
                        },
                        //{
                        //    field: "SchoolName", title: "نام مدرسه",
                        //    filterable:
                        //    {
                        //        cell:
                        //        {
                        //            dataSource: {},
                        //        }
                        //    }
                        //},
                        {
                            command: ["edit", "delete"],
                            title: "&nbsp;",
                            width: 200
                        },
                    ]
                };
            }

        }


    ]);
});