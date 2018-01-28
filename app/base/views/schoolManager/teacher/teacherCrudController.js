define(['app'], function (app) {
    app.register.controller('teacherCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES) {
            var reloadData = function (teacher) {
                $scope.teacher = teacher;
            }

            $scope.academicDegreeOptions = enumService.AcademicDegreeEnum();
            if ($stateParams.mode === "edit") {
                reloadData($stateParams.teacher);
            }

            $scope.base64ImageFileOptions = {
                multiple: false,
                allowedExtensions: [".img", ".png", ".jpeg", ".jpg"],
                preview: true,

            }
            $scope.base64ImageFileOnSelect = function (fileStream, fileInfo) {
                $scope.base64Image = fileStream.split(',')[1];
            }
            $scope.base64ImageFileOnRemove = function (e) {
                $scope.base64Image = "";
            }

            $scope.saveEntity = function () {
                if ($scope.teacherForm.$valid) {
                    if ($stateParams.mode === "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Teachers', { Teacher: $scope.teacher, Base64Image: $scope.base64Image }).then(id=> {
                            if (id) {
                                $state.go("teacherSearch");
                            }
                        });
                    } else if ($stateParams.mode === "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Teachers/' + $scope.teacher.Id, { Teacher: $scope.teacher, Base64Image: $scope.base64Image }).then(function () {
                            $state.go("teacherSearch");
                        });
                    }
                }
            }
            $scope.dateOptionsBirthDate = {
                change: function () {
                    var val = this.value();
                    if (val && val.gregoriandate)
                        $scope.teacher.BirthDate = moment(val.gregoriandate).format('YYYY-MM-DD');
                    else
                        $scope.teacher.BirthDate = val;
                }
            }

            $scope.academicDegreeOptions = enumService.AcademicDegreeEnum();

            //$scope.schoolClassOptions = {
            //    autoBind: false,
            //    text: "Name",
            //    value: "Id",
            //    transport: {
            //        read: {
            //            url: "http://localhost:8080/api/SchoolClasses?inlinecount=allpages",
            //            beforeSend: function (request) {
            //                var aut = JSON.parse(localStorage.getItem("lt"));
            //                request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
            //            },
            //            type: "GET"
            //        }
            //    }
            //};

            //$scope.courseOptions = {
            //    autoBind: false,
            //    text: "Name",
            //    value: "Id",
            //    transport: {
            //        read: {
            //            url: "http://localhost:8080/api/Courses?inlinecount=allpages",
            //            beforeSend: function (request) {
            //                var aut = JSON.parse(localStorage.getItem("lt"));
            //                request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
            //            },
            //            type: "GET"
            //        }
            //    }
            //};
        }


    ]);
});