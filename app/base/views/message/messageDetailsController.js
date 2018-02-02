debugger;
define(['app'], function (app) {
    app.register.controller('messageDetailsController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            debugger;
            var reloadData = function (disciplineItem) {
                $scope.disciplineItem = disciplineItem;
            }
            if ($stateParams.mode == "edit") {
                reloadData($stateParams.disciplineItem);
            }
            $scope.studentOptions = {
                tempalte: '<span class="k-state-default"><h3>#: data.FirstName #</h3><p>#: data.LastName #</p></span>',
                autoBind: false,
                text: "LastName",
                value: "Id",
                transport: {
                    read: {
                        url: RESOURCES.USERS_DOMAIN + "/api/Students?inlinecount=allpages",
                        beforeSend: function (request) {
                            debugger;
                            var aut = JSON.parse(localStorage.getItem("lt"));
                            request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                        },
                        type: "GET"
                    }
                }
            };
            $scope.saveEntity = function () {
                if ($scope.disciplineItemForm.$valid) {
                    if ($stateParams.mode == "create") {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/disciplineItems', $scope.disciplineItem).then(function (id) {
                            Notification.success('با موفقیت ذخیره شد.');
                            $state.go("disciplineItemSearch");
                        });
                    } else if ($stateParams.mode == "edit") {
                        dataService.updateEntity(RESOURCES.USERS_DOMAIN + '/api/disciplineItems/' + $scope.disciplineItem.Id, $scope.disciplineItem);
                        $state.go("disciplineItemSearch");
                    }
                }
            }
        }
    ]);
});