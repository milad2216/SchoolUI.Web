debugger;
define(['app'], function (app) {
    app.register.controller('quizCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            debugger;
            $scope.get = function () {
                debugger
             var t=   $scope.api.getSelected();
            }
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
                //dataBound: function () {
                //    $(".k-grid").find('a').removeAttr('href');
                //  //  bindEvent();
                //},
                editable: "inline",

                columns: [
                    { width: 30, template: '<input class="checkboxRowGrid" type="checkbox" />', headerTemplate: '<input class="checkboxCheckAllGrid" type="checkbox" />' },
                    {
                        field: "Subject",
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
                        width: '300px',
                        values: DifficultyLevelItems
                    }, {
                        field: 'Grade',
                        title: 'مقطع تحصیلی',
                        width: '300px',
                        values: GradeItems
                    }
                ]
            };

           
            $scope.onSelectRow = function (data) {
                $scope.selectedRows = data;
            }
              

            $scope.saveEntity = function () {
                if ($scope.questionForm.$valid) {
                    var sendData = {};
                    sendData.Question = $scope.question;
                    sendData.QuestionOptions = $scope.QuestionOptions;
                    sendData.QuestionBase64Image = $scope.qoestionBase64Image;
                    sendData.QuestionOptionsBase64Image = $scope.QuestionOptionsBase64Image;
                    debugger;
                    if ($stateParams.mode == "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Quizs', sendData).then(function (id) {
                            Notification.success('با موفقیت ذخیره شد.');
                            $state.go("questionSearch");
                        });
                    } else if ($stateParams.mode == "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Quizs/' + $scope.question.Id, sendData);
                        $state.go("questionSearch");
                    }
                }
            }
        }
    ]);
});