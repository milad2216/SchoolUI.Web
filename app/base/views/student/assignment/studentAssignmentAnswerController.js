define(['app'], function (app) {
    app.register.controller('studentAssignmentAnswerController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            $scope.assignment = $stateParams.assignment;
            $scope.Description = "";

            $scope.qoestionBase64ImageOnSelect = function (fileStream, fileInfo) {
                debugger
                $scope.assignmentAnswerBase64Image = fileStream.split(',')[1];
                $scope.FileName = fileInfo.files[0].name;
            }

            $scope.qoestionBase64ImageOnRemove = function (e) {
                $scope.assignmentAnswerBase64Image = "";
            }
            $scope.qoestionBase64ImageFile = {
                multiple: false,
                allowedExtensions: [".img", ".png", ".jpeg", ".jpg"],
                preview: true,
            }

            $scope.saveAssignmentEntity = function () {
                if ($scope.questionForm.$valid) {
                    var sendData = {};
                    sendData.Description = $scope.Description;
                    sendData.AssignmentId = $scope.assignment.Id;
                    //sendData.QuestionBase64Image = $scope.qoestionBase64Image;
                    //sendData.QuestionOptionsBase64Image = $scope.QuestionOptionsBase64Image;
                    debugger;
                    dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/AssignmentAnswers', { AssignmentAnswer: sendData, Base64File: $scope.assignmentAnswerBase64Image, FileName: $scope.FileName }).then(function (id) {
                        Notification.success('با موفقیت ذخیره شد.');
                        //$state.go("questionSearch");
                    });
                }
            }
        }


    ]);
});