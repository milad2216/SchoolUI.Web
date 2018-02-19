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

            $scope.onlineQuizEntity = function () {
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