debugger
define(['app'], function (app) {
    app.register.controller('schoolCourseController', ['$scope', '$rootScope', 'dataService', 'enumService', 'blockUI', 'RESOURCES',
        function ($scope, $rootScope, dataService, enumService, blockUI, RESOURCES) {
            dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Courses').then(function (data) {

                var courseItems = [];
                angular.forEach(data.Items, function (value, key) {
                    courseItems.push({ text: value.Name, value: value.Id });
                });
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Teachers').then(function (data) {

                    var teacherItems = [];
                    angular.forEach(data.Items, function (value, key) {
                        teacherItems.push({ text: value.FirstName + ' ' + value.LastName, value: value.Id });
                    });
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/SchoolClasses').then(function (data) {

                        var schoolClassItems = [];
                        angular.forEach(data.Items, function (value, key) {
                            schoolClassItems.push({ text: value.Name, value: value.Id });
                        });
                        loadGrid(courseItems, teacherItems, schoolClassItems);
                    });
                });
            });
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: {
                    read: {
                        type: "GET",
                        url: RESOURCES.USERS_DOMAIN + "/api/SchoolCourses",
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
                            return RESOURCES.USERS_DOMAIN + "/api/SchoolCourses/" + options.Id;
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
                            return RESOURCES.USERS_DOMAIN + "/api/SchoolCourses/" + options.Id;
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
                        url: RESOURCES.USERS_DOMAIN + "/api/SchoolCourses",
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
                            CourseId: { type: "number", nullable: false, validation: { required: { message: "انتخاب درس الزامی است." } } },
                            TeacherId: { type: "number", nullable: false, validation: { required: { message: "انتخاب معلم الزامی است." } } },
                            SchoolClassId: { type: "number", nullable: false, validation: { required: { message: "انتخاب کلاس الزامی است." } } },
                            ClassTime: { type: "string", nullable: false, validation: { required: { message: "وارد نمودن زمان کلاس الزامی است." } } }
                        }
                    }
                },
                autoSync: false,
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            });

            var loadGrid = function (courseItems, teacherItems, schoolClassItems) {
                $scope.mainGridOptions = {
                    dataSource: dataSource,
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
                    toolbar: [{ name: "create", text: "اضافه کردن" }],
                    editable: "inline",

                    columns: [
                        {
                            field: "CourseId",
                            title: "درس",
                            values: courseItems
                        }, {
                            field: 'TeacherId',
                            title: 'معلم',
                            width: '300px',
                            values: teacherItems
                        }, {
                            field: "SchoolClassId",
                            title: "کلاس",
                            values: schoolClassItems
                        }, {
                            field: "ClassTime",
                            title: "زمان کلاس",
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

        }


    ]);
});