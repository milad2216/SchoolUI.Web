debugger
define(['app'], function (app) {
    app.register.controller('rollCallController', ['$scope', '$rootScope', 'dataService', 'enumService', 'RESOURCES',
        function ($scope, $rootScope, dataService, enumService, RESOURCES) {
            $scope.rollCallStateOptions = [];
            var rollCallStateItems = [];
            angular.forEach(enumService.RollCallType(), function (value, key) {
                rollCallStateItems.push({ text: value.Text, value: value.Id });
            });
            $scope.rollCallStateOptions = rollCallStateItems;
            $scope.students = [];
            $scope.onComboReady = function (combo) {
                
            }
            dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Students').then(function (data) {
                $scope.students = data.Items;
            })
        }


    ]);
});