debugger
define(['app'], function (app) {
    app.register.controller('adminSearchController', ['$scope', '$rootScope', '$stateParams','$state', 'dataService', 'RESOURCES',
        function ($scope, $rootScope, $stateParams, $state, dataService, RESOURCES) {
            debugger
            $scope.init = function () {
                debugger
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Parents').then(function (data) {
                    $scope.parents = data.Items;
                    $state.go("adminSearch.milad");
                })
                $scope.showDetails = function (parentId) {
                    debugger;
                    $state.go("adminSearch.milad", { parentId: parentId });
                }
                //$scope.parents = [{ Id: 1 }, { Id: 2 }];
            }

                
        }
    ]);
});