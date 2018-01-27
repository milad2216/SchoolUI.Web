debugger
define(['app'], function (app) {
    app.register.controller('loginController', ['$scope', '$rootScope', 'dataService', 'RESOURCES',
        function ($scope, $rootScope, dataService, RESOURCES) {
            debugger;
            $scope.checkAuthenticated = function () {
                debugger;
                
                dataService.postUnauthorizedData(
                    RESOURCES.USERS_DOMAIN + '/token', { grant_type: "password", username: $scope.login_username, password: $scope.login_password }
                ).then(data => {
                    debugger;
                    if (data.token_type === "bearer") {
                        localStorage.setItem('lt', JSON.stringify(data));
                        $rootScope.statusforlayout = true;
                        $rootScope.statusforlogin = false;
                    }
                });
            }
        }


    ]);
});