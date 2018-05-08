debugger;
define(['app'], function (app) {
    app.register.controller('quizCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            debugger;
            $scope.showSchoolCourseGrid = false;
            
            $scope.quiz = {};
            var reloadData = function (quiz) {
                $scope.quiz = quiz;
            }
            if ($stateParams.mode == "edit") {
                reloadData($stateParams.quiz);
            }
            $scope.selectedRows = [];
            var DifficultyLevel = enumService.DifficultyLevel();
            var DifficultyLevelItems = [];
            angular.forEach(DifficultyLevel, function (value, key) {
                DifficultyLevelItems.push({ text: value.Text, value: value.Id });
            });
            var Grade = enumService.GradeEnum();
            var GradeItems = [];
            angular.forEach(Grade, function (value, key) {
                GradeItems.push({ text: value.Text, value: value.Id });
            });
            $scope.dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: {
                    read: {
                        type: "GET",
                        url: RESOURCES.USERS_DOMAIN + "/api/Questions",
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
                            return RESOURCES.USERS_DOMAIN + "/api/Quesions/" + options.Id;
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
                            QuestionText: { type: "string", defaultValue: null },
                            AttachmentAddress: { type: "string", defaultValue: null },
                            Subject: { type: "string", editable: false },
                            DifficultyLevel: { type: "number", editable: false, nullable: true },
                            Grade: { type: "number", defaultValue: null },
                            CourseId: { type: "number", defaultValue: null },
                            QuestionOptionIdCorrect: { type: "number", editable: false }
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
                //dataBound: function () {
                //    $(".k-grid").find('a').removeAttr('href');
                //  //  bindEvent();
                //},
                editable: "inline",

                columns: [
                    {
                        title: "انتخاب",
                        width: 60,
                        template: '<input class="checkboxRowGrid" type="checkbox" />'/*, headerTemplate: '<input class="checkboxCheckAllGrid" type="checkbox" />'*/
                    },
                    {
                        field: "Subject",
                        width: 200,
                        title: "مبحث",
                        filterable:
                        {
                            cell:
                            {
                                dataSource: {},
                            }
                        }

                    }, {
                        field: 'DifficultyLevel',
                        title: 'وضعیت',
                        width: 200,
                        values: DifficultyLevelItems
                    }, {
                        field: 'Grade',
                        title: 'مقطع تحصیلی',
                        width: 200,
                        values: GradeItems
                    }
                ]
            };


            $scope.onSelectRow = function (data) {
                $scope.selectedQuestionRows = data.allChecked;
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
            var schoolCoursesDataSource = new kendo.data.DataSource({
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
                pageSize: 9,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            });

            var loadGrid = function (courseItems, teacherItems, schoolClassItems) {
                $scope.schoolCoursesGridOptions = {
                    dataSource: schoolCoursesDataSource,
                    filterable: {
                        extra: false
                    },
                    height: 600,
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

            $scope.schoolCoursesOnSelectRow = function (data) {
                $scope.selectedSchoolCourseRows = data.allChecked;
            }


            $scope.saveEntity = function () {
                if ($scope.questionForm.$valid) {
                    var sendData = {};
                    debugger;
                    sendData.Quiz = $scope.quiz;
                    sendData.QuestionIds = $scope.selectedQuestionRows;
                    sendData.SchoolCourseIds = $scope.selectedSchoolCourseRows;
                    if ($stateParams.mode == "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Quizes', sendData).then(function (id) {
                            Notification.success('با موفقیت ذخیره شد.');
                            $state.go("questionSearch");
                        });
                    } else if ($stateParams.mode == "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Quizes/' + $scope.question.Id, sendData);
                        $state.go("questionSearch");
                    }
                }
            }
        }
    ]);
});