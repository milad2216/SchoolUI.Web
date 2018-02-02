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
                $scope.totalOfNotPay = 0;
                $scope.totalOfPaid = 0;
                $scope.showDetails = function (parentId) {
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Parents?$filter=Id eq '+parentId).then(function (data) {
                        $scope.selectedParent = data.Items[0];
                        $scope.selectedParent.FullName = $scope.selectedParent.FirstName + ' ' + $scope.selectedParent.LastName;
                    })
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/PayItems?$filter=Student/ParentIdFather eq ' + parentId + ' or Student/ParentIdMother eq ' + parentId + ' and (ParentPayments/any() eq false and Checks/any() eq false)').then(function (data) {
                        $scope.payItems = data.Items;
                        $scope.totalOfNotPay = $scope.payItems.sum(function (t) { return t.Price });
                    })
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/PayItems?$filter=Student/ParentIdFather eq ' + parentId + ' or Student/ParentIdMother eq ' + parentId + ' and (ParentPayments/any() eq true or Checks/any() eq true)').then(function (data) {
                        $scope.paidItems = data.Items;
                        $scope.totalOfPaid = $scope.paidItems.sum(function (t) { return t.Price });
                    })
                }
            }


        }
    ]);
});