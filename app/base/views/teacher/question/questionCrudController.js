debugger;
define(['app'], function (app) {
    app.register.controller('questionCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            debugger;
            var reloadData = function (question) {
                $scope.question = question;
            }
            if ($stateParams.mode == "edit") {
                reloadData($stateParams.question);
            }
            $scope.question = {};
            $scope.QuestionOptions = [];
            $scope.QuestionOptionsBase64Image = [];
            $scope.difficultyLevelOptions = [];
            var DifficultyLevel = enumService.DifficultyLevel();
            var DifficultyLevelItems = [];
            angular.forEach(DifficultyLevel, function (value, key) {
                DifficultyLevelItems.push({ text: value.Text, value: value.Id });
            });

            $scope.addOption = function () {
                if ($scope.questionForm.$valid) {
                    $scope.QuestionOptions.push({});
                    $scope.QuestionOptionsBase64Image.push("");
                }
            }
            $scope.difficultyLevelOptions = DifficultyLevelItems;
            $scope.gradeOptions = [];

            var Grade = enumService.GradeEnum();
            var GradeItems = [];
            angular.forEach(Grade, function (value, key) {
                GradeItems.push({ text: value.Text, value: value.Id });
            });

            $scope.gradeOptions = GradeItems;
            $scope.courseOptions = [];
            dataService.getData(RESOURCES.USERS_DOMAIN + '/api/SchoolCourses?$expand=Course&inlinecount=allpages').then(data=> {

                angular.forEach(data.Items, function (value, key) {
                    $scope.courseOptions.push({ text: value.Course.Name, value: value.Course.Id });
                });
            })

            $scope.qoestionBase64ImageOnSelect = function (fileStream, fileInfo) {
                $scope.qoestionBase64Image = fileStream.split(',')[1];
            }

            $scope.qoestionBase64ImageOnRemove = function (e) {
                $scope.qoestionBase64Image = "";
            }
            $scope.qoestionBase64ImageFile = {
                multiple: false,
                allowedExtensions: [".img", ".png", ".jpeg", ".jpg"],
                preview: true,
            }
            $scope.optionsBase64ImageFile = {
                multiple: false,
                allowedExtensions: [".img", ".png", ".jpeg", ".jpg"],
                preview: true,
            }
            $scope.optionsBase64ImageOnSelect = function (fileStream, fileInfo, index) {
                $scope.QuestionOptionsBase64Image[index] = fileStream.split(',')[1];
            }
            $scope.optionsBase64ImageOnRemove = function (e, index) {
                $scope.QuestionOptionsBase64Image[index] = "";
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
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Questions', sendData).then(function (id) {
                            Notification.success('با موفقیت ذخیره شد.');
                            $state.go("questionSearch");
                        });
                    } else if ($stateParams.mode == "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Questions/' + $scope.question.Id, sendData);
                        $state.go("questionSearch");
                    }
                }
            }
        }
    ]);
});