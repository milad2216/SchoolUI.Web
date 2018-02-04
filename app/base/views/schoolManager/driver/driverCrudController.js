debugger
define(['app'], function (app) {
    app.register.controller('driverCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES) {
            debugger;
            var reloadData = function (driver) {
                $scope.driver = driver;
            }

            if ($stateParams.mode === "edit") {
                reloadData($stateParams.driver);
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
                if ($scope.driverForm.$valid) {
                    if ($stateParams.mode === "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Drivers', { Driver: $scope.driver, Base64Image: $scope.base64Image }).then(function (id) {
                            if (id) {
                                Notification.success("با موفقیت ثبت شد.");
                                $state.go("driverSearch");
                            }
                        }, function (err) {
                            Notification.error("اشکال در ثبت.");
                        });
                    } else if ($stateParams.mode === "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Drivers/' + $scope.driver.Id, { Driver: $scope.driver, Base64Image: $scope.base64Image }).then(function () {
                            Notification.success("با موفقیت ذخیره شد.");
                            $state.go("driverSearch")
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
                        $scope.driver.BirthDate = moment(val.gregoriandate).format('YYYY-MM-DD');
                    else
                        $scope.driver.BirthDate = val;
                }
            }

        }


    ]);
});