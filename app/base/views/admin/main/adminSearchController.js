debugger
define(['app'], function (app) {
    app.register.controller('adminSearchController', ['$scope', '$rootScope', '$stateParams', '$state', 'dataService', 'RESOURCES',
        function ($scope, $rootScope, $stateParams, $state, dataService, RESOURCES) {
            debugger
            $scope.init = function () {
                //$scope.parents = [{ Name: "asdass" }, { Name: "asdass" }];
                $scope.payItems = [];
                debugger
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Parents').then(function (data) {
                    $scope.parents = data.Items;
                })
                $scope.showDetails = function (parentId) {
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Parents?$filter=Id eq '+parentId).then(function (data) {
                        $scope.selectedParent = data.Items[0];
                        $scope.selectedParent.FullName = $scope.selectedParent.FirstName + ' ' + $scope.selectedParent.LastName;
                    })
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/PayItems?$filter=ParentPayments/any( pp: pp/Student/ParentIdFather eq ' + parentId + ' or pp/Student/ParentIdMother eq ' + parentId + ')').then(function (data) {
                        $scope.payItems = data.Items;
                        $scope.payItems.push({ DscPay: "شهریه", DateInsert: "1396-11-10", Price: 25000000 });
                        $scope.payItems.push({ DscPay: "شهریه", DateInsert: "1396-11-10", Price: 25000000 });
                        $scope.totalOfNotPay = $scope.payItems.sum(function (t) { return t.Price });
                    })
                }
            }


        }
    ]);
});