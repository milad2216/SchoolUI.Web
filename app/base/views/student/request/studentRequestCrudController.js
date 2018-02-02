debugger;
define(['app'], function (app) {
    app.register.controller('studentRequestCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            debugger;
            var reloadData = function (studentRequest) {
                $scope.studentRequest = studentRequest;
            }
            if ($stateParams.mode == "edit") {
                reloadData($stateParams.studentRequest);
            }

            $scope.saveEntity = function () {
                if ($scope.studentRequestForm.$valid) {
                    if ($stateParams.mode == "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Requests', $scope.studentRequest).then(function (id) {
                            Notification.success('با موفقیت ذخیره شد.');
                            $state.go("studentRequestSearch");
                        });
                    } else if ($stateParams.mode == "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/Requests/' + $scope.studentRequest.Id, $scope.studentRequest);
                        $state.go("studentRequestSearch");
                    }
                }
            }
        }
    ]);
});