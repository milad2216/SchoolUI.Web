debugger
define(['app'], function (app) {
    app.register.controller('adminSearchController', ['$scope', '$rootScope', '$stateParams','$state',
        function ($scope, $rootScope, $stateParams, $state) {
            debugger
            $scope.init = function () {
                debugger
                $state.go("admin.milad");
            }

                
        }
    ]);
});