define(['app'], function (app) {
    app.register.controller('payItemCrudController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {

            $scope.saveEntity = function () {
                debugger;
                if ($scope.payItemForm.$valid) {
                    var sendItem = {};
                    sendItem.PayItem = $scope.payItem; 
                    if ($scope.schoolClassId) {
                        sendItem.SchoolClassId = $scope.schoolClassId;
                    }
                    if ($scope.StudentId) {
                        sendItem.StudentId = $scope.StudentId;
                    }
                    dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/PayItems', sendItem).then(function (id) {
                        Notification.success('با موفقیت ذخیره شد.');
                    }, function (err) {
                        Notification.error('ذخیره با اشکال روبرو شد دوباره تلاش کنید.');
                    });
                }
            }
            $scope.schoolClassOptions = {
                autoBind: false,
                text: "Name",
                value: "Id",
                transport: {
                    read: {
                        url: RESOURCES.USERS_DOMAIN + "/api/SchoolClasses?inlinecount=allpages",
                        beforeSend: function (request) {
                            debugger;
                            var aut = JSON.parse(localStorage.getItem("lt"));
                            request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                        },
                        type: "GET"
                    }
                }
            };
            $scope.studentOptions = {
                tempalte:'<span class="k-state-default"><h3>#: data.FirstName #</h3><p>#: data.LastName #</p></span>',
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
        }


    ]);
});