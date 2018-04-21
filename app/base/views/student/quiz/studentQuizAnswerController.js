debugger;
define(['app'], function (app) {
    app.register.controller('studentQuizAnswerController', ['$scope', '$rootScope', 'dataService', '$stateParams', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, $state, RESOURCES, Notification) {
            debugger;
            $scope.quiz = $stateParams.quiz;

            $scope.userDomain = RESOURCES.USERS_DOMAIN;

            var sendData = {};
            sendData.QuizId = $scope.quiz.Id;
            var aut = JSON.parse(localStorage.getItem("lt"));
            sendData.StudentId = aut.user_id;
            debugger;
            dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/StudentQuizAnswers', sendData).then(function (id) {
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/StudentQuizAnswers/' + id).then(function (data) {
                    debugger;
                    $scope.StudentQuizAnswerId = id;
                    $scope.DtDefine = data.DtDefine;
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Quizes/' + $scope.quiz.Id + '?$expand=Questions/QuestionOptions').then(function (data) {
                        debugger;
                        $scope.Questions = data.Questions;
                        $scope.currentQuestion = data.Questions[0];
                    });
                })
            });

            $scope.selectOption = function (optionId) {
                var sendData = {};
                sendData.StudentQuizAnswerId = $scope.StudentQuizAnswerId;
                sendData.QuestionOptionIdAnswer = optionId;
                if ($scope.Questions.indexOf($scope.currentQuestion) + 1 < $scope.Questions.length) {
                    $scope.currentQuestion = $scope.Questions[$scope.Questions.indexOf($scope.currentQuestion) + 1];
                } else {
                    //Finish Quiz
                }
                dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/StudentQuestionAnswers', [sendData]).then(function (id) {
                    debugger
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
        }
    ]);
});