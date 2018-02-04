define(['app'], function (app) {
    app.register.controller('employeeCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES) {
            
            var reloadData = function (employee) {
                $scope.employee = employee;
            }

            $scope.academicDegreeOptions = enumService.AcademicDegreeEnum();
            if ($stateParams.mode === "edit") {
                reloadData($stateParams.employee);
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
                if ($scope.employeeForm.$valid) {
                    if ($stateParams.mode === "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Employees', { Employee: $scope.employee, Base64Image: $scope.base64Image }).then(function (id) {
                            if (id) {
                                Notification.success("با موفقیت ثبت شد.");
                                $state.go("employeeSearch");
                            }
                        }, function (err) {
                            Notification.error("اشکال در ثبت.");
                        });
                    } else if ($stateParams.mode === "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Employees/' + $scope.employee.Id, { Employee: $scope.employee, Base64Image: $scope.base64Image }).then(function () {
                            Notification.success("با موفقیت ذخیره شد.");
                            $state.go("employeeSearch")
                        }, function (err) {
                            Notification.error("اشکال در ذخیره.");
                        });
                    }
                }
            }
            $scope.dateOptionsBirthDate = {
                change: function () {
                    var val = this.value();
                    if (val && val.gregoriandate)
                        $scope.employee.BirthDate = moment(val.gregoriandate).format('YYYY-MM-DD');
                    else
                        $scope.employee.BirthDate = val;
                }
            }
        }


    ]);
});