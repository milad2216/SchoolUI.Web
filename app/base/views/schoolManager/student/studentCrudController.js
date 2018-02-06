define(['app'], function (app) {
    app.register.controller('studentCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            $scope.ParentFather = {};
            $scope.ParentMother = {};
            var reloadData = function (student) {
                $scope.student = student;
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/GradeAcademicYears/' + student.GradeAcademicYearId).then(function (data) {
                    $scope.academicYearApi.setValue(data.AcademicYearId);
                    dataService.getData(RESOURCES.USERS_DOMAIN + "/api/GradeAcademicYears?inlinecount=allpages&$filter=AcademicYearId eq " + data.AcademicYearId).then(function (data) {
                        debugger;
                        var items = [];
                        angular.forEach(data.Items, function (value, key) {
                            var majorText = enumService.MajorEnum(value.Major);
                            items.push({ text: enumService.GradeEnum(value.Grade).Text + ' - ' + majorText.Text, value: value.Id });
                        });
                        $scope.gradeAcademicYearOptions = items;
                    });
                });
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Parents/' + student.ParentIdFather).then(function (data) {
                    $scope.ParentFather = data;
                });
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Parents/' + student.ParentIdMother).then(function (data) {
                    $scope.ParentMother = data;
                });
            }
            if ($stateParams.mode === "edit") {
                reloadData($stateParams.student);
                //academicYearApi.setValue(AcademicYearId)
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

            $scope.gradeAcademicYearOptions = [];


            $scope.academicYearOptions = [{ text: "سال تحصیلی 96-97", value: '8' }, { text: "سال تحصیلی 97-98", value: '4' }, { text: "سال تحصیلی 98-99", value: '5' }];
            $scope.academicYearOnSelect = function (combo) {
                var academicYearId = combo.dataSource._data[combo.selectedIndex].value;
                dataService.getData(RESOURCES.USERS_DOMAIN + "/api/GradeAcademicYears?inlinecount=allpages&$filter=AcademicYearId eq " + academicYearId).then(function (data) {
                    var items = [];
                    angular.forEach(data.Items, function (value, key) {
                        var majorText = enumService.MajorEnum(value.Major);
                        items.push({ text: value.Grade + ' ' + majorText.Text, value: value.Id });
                    });
                    $scope.gradeAcademicYearOptions = items;
                });
            }

            $scope.saveEntity = function () {
                if ($scope.studentForm.$valid) {
                    if ($scope.ParentFather.FirstName && $scope.ParentFather.LastName && $scope.ParentFather.Email) {
                        $scope.student.ParentFather = $scope.ParentFather;
                    }
                    if ($scope.ParentMother.FirstName && $scope.ParentMother.LastName && $scope.ParentMother.Email) {
                        $scope.student.ParentMother = $scope.ParentMother;
                    }
                    if ($stateParams.mode === "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Students', { Student: $scope.student, Base64Image: $scope.base64Image }).then(function (id) {
                            if (id) {
                                Notification.success("با موفقیت ثبت شد.");
                                $state.go("studentSearch");
                            }
                        }, function (err) {

                            angular.forEach(err.errormessages, function (value, key) {
                                Notification.error(value);
                            });
                        });
                    } else if ($stateParams.mode === "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Students/' + $scope.student.Id, { Student: $scope.student, Base64Image: $scope.base64Image }).then(function () {
                            Notification.success("با موفقیت ذخیره شد.");
                            $state.go("studentSearch");
                        }, function (err) {

                            angular.forEach(err.errormessages, function (value, key) {
                                Notification.error(value);
                            });
                        });
                    }
                }
            }
            $scope.dateOptionsBirthDate = {
                change: function () {
                    var val = this.value();
                    if (val && val.gregoriandate)
                        $scope.student.BirthDate = moment(val.gregoriandate).format('YYYY-MM-DD');
                    else
                        $scope.student.BirthDate = val;
                }
            }
            $scope.schoolClassOptions = {
                autoBind: false,
                text: "Name",
                value: "Id",
                transport: {
                    read: {
                        url: RESOURCES.USERS_DOMAIN + "/api/SchoolClasses?inlinecount=allpages",
                        beforeSend: function (request) {
                            var aut = JSON.parse(localStorage.getItem("lt"));
                            request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                        },
                        type: "GET"
                    }
                }
            };

            $scope.driverOptions = {
                autoBind: false,
                text: "LastName",
                value: "Id",
                transport: {
                    read: {
                        url: RESOURCES.USERS_DOMAIN + "/api/Drivers?inlinecount=allpages",
                        beforeSend: function (request) {
                            var aut = JSON.parse(localStorage.getItem("lt"));
                            request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                        },
                        type: "GET"
                    }
                }
            };
        }


    ]);
});