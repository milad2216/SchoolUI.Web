debugger;
define(['app'], function (app) {
    app.register.controller('onlineQuizSearchController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            debugger;


            $scope.qoestionBase64ImageOnSelect = function (fileStream, fileInfo) {
                debugger
                $scope.qoestionBase64Image = fileStream.split(',')[1];
                $scope.FileName = fileInfo.files[0].name;
            }

            $scope.qoestionBase64ImageOnRemove = function (e) {
                $scope.qoestionBase64Image = "";
            }
            $scope.qoestionBase64ImageFile = {
                multiple: false,
                allowedExtensions: [".img", ".png", ".jpeg", ".jpg"],
                preview: true,
            }

            $scope.startOnlineQuizEntity = function () {
                var sendData = {};
                sendData.QuizId = "3";
                var aut = JSON.parse(localStorage.getItem("lt"));
                sendData.StudentId = aut.user_id;
                debugger;
                dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/StudentQuizAnswers', sendData).then(function (id) {
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/StudentQuizAnswers/' + id).then(function (data) {
                        debugger;
                        $scope.StudentQuizAnswerId = id;
                        $scope.DtDefine = data.DtDefine;
                    })
                });
            }

            $scope.getQueationsEntity = function () {
                debugger;
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Quizes/3?$expand=Questions/QuestionOptions').then(function (data) {
                    debugger;
                    $scope.Questions = data.Questions;
                });
            }

            $scope.AnswerQuizQuestionEntity = function () {
                var sendData = {};
                sendData.StudentQuizAnswerId = $scope.StudentQuizAnswerId;
                sendData.QuestionOptionIdAnswer = 15;
                debugger;
                dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/StudentQuestionAnswers', [sendData]).then(function (id) {
                    debugger
                });
            }

            $scope.finishQuizQuestionEntity = function () {
                debugger;
                dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/StudentQuizAnswers/FinishQuiz/3').then(function (id) {
                    debugger
                });
            }

            $scope.saveAssignmentEntity = function () {
                if ($scope.questionForm.$valid) {
                    var sendData = {};
                    sendData.Description = "توضیحات";
                    sendData.AssignmentId = 1;
                    //sendData.QuestionBase64Image = $scope.qoestionBase64Image;
                    //sendData.QuestionOptionsBase64Image = $scope.QuestionOptionsBase64Image;
                    debugger;
                    dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/AssignmentAnswers', { AssignmentAnswer: sendData, Base64File: $scope.qoestionBase64Image, FileName: $scope.FileName }).then(function (id) {
                        Notification.success('با موفقیت ذخیره شد.');
                        //$state.go("questionSearch");
                    });
                }
            }
        }
    ]);
});