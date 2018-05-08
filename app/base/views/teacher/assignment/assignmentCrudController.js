define(['app'], function (app) {
    app.register.controller('assignmentCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            $scope.showSchoolCourseGrid = false;
            var reloadData = function (assignment) {
                $scope.assignment = assignment;
            }
            if ($stateParams.mode === "edit") {
                reloadData($stateParams.assignment);
            }
            //$scope.gradeAcademicYearOptions = [];
            //dataService.getData(RESOURCES.USERS_DOMAIN + "/api/GradeAcademicYears?inlinecount=allpages&$expand=AcademicYear").then(function (data) {
            //    var items = [];
            //    angular.forEach(data.Items, function (value, key) {
            //        var majorText = enumService.MajorEnum(value.Major);
            //        items.push({ text: enumService.GradeEnum(value.Grade).Text + ' - ' + majorText.Text + ' - ' + value.AcademicYear.Name, value: value.Id });
            //    });
            //    $scope.gradeAcademicYearOptions = items;
            //});
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
                    editable: "inline",

                    columns: [
                        {
                            title: "انتخاب",
                            width: 60,
                            template: '<input class="checkboxRowGrid" type="checkbox" />'/*, headerTemplate: '<input class="checkboxCheckAllGrid" type="checkbox" />'*/
                        },
                        {
                            field: "CourseId",
                            title: "درس",
                            width: 150,
                            values: courseItems
                        }, {
                            field: 'TeacherId',
                            title: 'معلم',
                            width: 150,
                            values: teacherItems
                        }, {
                            field: "SchoolClassId",
                            title: "کلاس",
                            width: 150,
                            values: schoolClassItems
                        }, {
                            field: "ClassTime",
                            title: "زمان کلاس",
                            width: 200,
                            filterable:
                            {
                                cell:
                                {
                                    dataSource: {},
                                }
                            }
                        }
                    ]
                };
                $scope.showSchoolCourseGrid = true;
            }
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

            $scope.onSelectRow = function (data) {
                $scope.selectedSchoolCourseRows = data.allChecked;
            }
            $scope.saveEntity = function () {
                if ($scope.assignmentForm.$valid) {
                    $scope.assignment.GradeAcademicYearId = 9;
                    if ($stateParams.mode === "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Assignments', { Assignment: $scope.assignment, SchoolCourseIds: $scope.selectedSchoolCourseRows }).then(function (id) {
                            if (id) {
                                Notification.success("با موفقیت ثبت شد.");
                                $state.go("assignmentSearch");
                            }
                        }, function (err) {

                            angular.forEach(err.errormessages, function (value, key) {
                                Notification.error(value);
                            });
                        });
                    } else if ($stateParams.mode === "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Assignments/' + $scope.student.Id, { Assignment: $scope.student, SchoolCourseIds: $scope.selectedSchoolCourseRows }).then(function () {
                            Notification.success("با موفقیت ذخیره شد.");
                            $state.go("assignmentSearch");
                        }, function (err) {

                            angular.forEach(err.errormessages, function (value, key) {
                                Notification.error(value);
                            });
                        });
                    }
                }
            }
            $scope.dateOptionsDtDue = {
                change: function () {
                    var val = this.value();
                    if (val && val.gregoriandate)
                        $scope.assignment.DtDue = moment(val.gregoriandate).format('YYYY-MM-DD');
                    else
                        $scope.assignment.DtDue = val;
                }
            }
        }


    ]);
});