debugger
define(['app'], function (app) {
    app.register.controller('loginController', ['$scope', '$rootScope', 'dataService', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, RESOURCES, Notification) {
            debugger;
            $scope.schoolOptions = [];
            dataService.getData(RESOURCES.USERS_DOMAIN + "/api/GetAllSchools").then(function (data) {
                var schoolItems = [];
                debugger;
                angular.forEach(data.Items, function (value, key) {
                    schoolItems.push({ text: value.Name, value: value.Id });
                });
                $scope.schoolOptions = schoolItems;
            });

            $scope.closePupop = function () {
                $("#select_school_model").hide();
            }
            $scope.userTypeOnClose = function (combo) {
                var school_id = combo.dataSource._data[combo.selectedIndex].value;
                $scope.checkAuthenticated(school_id);
            }
            $scope.checkAuthenticated = function (school_id) {
                debugger;
                var sendData = {
                    grant_type: "password", username: $scope.login_username, password: $scope.login_password
                };
                if (school_id) {
                    sendData.school_id = school_id;
                }
                dataService.postUnauthorizedData(
                    RESOURCES.USERS_DOMAIN + '/token', sendData
                ).then(data => {
                    debugger;
                    if (data.Invalid_grant2) {
                        $("#select_school_model").show();
                        return;
                    }
                    if (data.token_type === "bearer") {
                        localStorage.setItem('lt', JSON.stringify(data));
                        $rootScope.statusforlayout = true;
                        $rootScope.statusforlogin = false;
                        return
                    }
                    Notification.error("کد کاربری یا رمز عبور اشتباه است.");
                });
            }
        }


    ]);
});