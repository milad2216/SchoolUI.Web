debugger
define(['app'], function (app) {
    app.register.controller('rollCallController', ['$scope', '$rootScope', 'dataService', 'enumService', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, enumService, RESOURCES, Notification) {
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
                $scope.students = data.Items.select(function (item) { item.RollCall = { RollCallType: 0 }; return item; });
            })


            $scope.dateOptionsDtDay = {
                change: function () {
                    var val = this.value();
                    if (val && val.gregoriandate)
                        $scope.DtDay = moment(val.gregoriandate).format('YYYY-MM-DD');
                    else
                        $scope.DtDay = val;
                    // refresh data

                    dataService.getData(RESOURCES.USERS_DOMAIN + "/api/Students?$expand=RollCalls").then(function (data) {
                        debugger;
                        if (data.Items.length > 0) {
                            $scope.students = data.Items.select(function (item) {
                                var selectedDate = item.RollCalls.first(function(rc){return rc.DtDay.indexOf($scope.DtDay)>-1});
                                if (selectedDate)
                                    item.RollCall = selectedDate;
                                else
                                    item.RollCall = { RollCallType: 0 };
                                return item;
                            });
                        }
                    })
                }
            }

            $scope.saveEntity = function () {
                if ($scope.rollCallForm.$valid) {
                    var sendData = $scope.students.select(function (item) { return { StudentId: item.Id, DtDay: $scope.DtDay, RollCallType: item.RollCall.RollCallType, MinutesOfDelay: item.RollCall.MinutesOfDelay } });
                    dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/RollCalls', sendData).then(function () {
                        Notification.success("با موفقیت ثبت شد.");
                        $state.go("main");
                    }, function (err) {
                        Notification.error("اشکال در ثبت.");
                    });
                }
            }
        }


    ]);
});