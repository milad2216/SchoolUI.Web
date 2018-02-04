debugger;
define(['app'], function (app) {
    app.register.controller('requestViewController', ['$scope', '$rootScope', '$state', '$stateParams', 'dataService', 'RESOURCES', 'Notification',
    function ($scope, $rootScope, $state, $stateParams, dataService, RESOURCES, Notification) {

        $scope.studentRequest = $stateParams.studentRequest;
        dataService.patchEntity(RESOURCES.USERS_DOMAIN + '/api/Requests/' + $scope.studentRequest.Id, { RequestState: 1 }).then(function () {
            
        }, function (err) {

        });
        $scope.approvedRequest = function () {
            dataService.patchEntity(RESOURCES.USERS_DOMAIN + '/api/Requests/' + $scope.studentRequest.Id, { RequestState: 2 }).then(function () {
                Notification.success("درخواست قبول شد.");
                $state.go("requestManagmentSearch");
            }, function (err) {
                Notification.error("اشکال در قبول درخواست.");
            });
        }
        $scope.deniedRequest = function () {
            dataService.patchEntity(RESOURCES.USERS_DOMAIN + '/api/Requests/' + $scope.studentRequest.Id, { RequestState: 3 }).then(function () {
                Notification.success("درخواست رد شد.");
                $state.go("requestManagmentSearch");
            }, function (err) {
                Notification.error("اشکال در رد درخواست.");
            });
        }


    }


    ]);
});