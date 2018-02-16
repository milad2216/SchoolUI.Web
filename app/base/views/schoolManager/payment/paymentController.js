define(['app'], function (app) {
    app.register.controller('paymentController', ['$scope', '$rootScope', '$stateParams', '$state', 'dataService', 'RESOURCES', 'enumService', 'Notification',
        function ($scope, $rootScope, $stateParams, $state, dataService, RESOURCES, enumService, Notification) {
            $scope.init = function () {
                //$scope.parents = [{ Name: "asdass" }, { Name: "asdass" }];
                $scope.payItems = [];
                $scope.paidItems = [];
                $scope.newParentPayment = {};
                $scope.newCheck = {};
                $scope.parents = [];
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Parents').then(function (data) {
                    $scope.parents = data.Items;
                })
                $scope.totalOfNotPay = 0;
                $scope.totalOfPaid = 0;
                $scope.gradeAcademicYearOptions = [];
                dataService.getData(RESOURCES.USERS_DOMAIN + "/api/GradeAcademicYears?inlinecount=allpages&$expand=AcademicYear").then(function (data) {
                    var items = [];
                    angular.forEach(data.Items, function (value, key) {
                        var majorText = enumService.MajorEnum(value.Major);
                        items.push({ text: enumService.GradeEnum(value.Grade).Text + ' - ' + majorText.Text + ' - ' + value.AcademicYear.Name, value: value.Id });
                    });
                    $scope.gradeAcademicYearOptions = items;
                });

                var payStateItems = [];
                angular.forEach(enumService.PayStateEnum(), function (value, key) {
                    payStateItems.push({ text: value.Text, value: value.Id });
                });
                $scope.payStateOptions = payStateItems;


                $scope.showNewParentPaymentPupop = function (payItemId) {
                    $scope.newParentPayment.PayItemId = payItemId;
                    $("#payByCash").show();
                }

                $scope.showNewCkeckPupop = function (payItemId) {
                    $scope.newCheck.PayItemId = payItemId;
                    $("#payByCheck").show();
                }

                $scope.closePupop = function (elemId) {
                    $("#" + elemId).hide();
                }
                $scope.showDetails = function (parentId) {
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Parents?$filter=Id eq ' + parentId).then(function (data) {
                        $scope.selectedParent = data.Items[0];
                        $scope.selectedParent.FullName = $scope.selectedParent.FirstName + ' ' + $scope.selectedParent.LastName;
                    })
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/PayItems?$filter=(Student/ParentIdFather eq ' + parentId + ' or Student/ParentIdMother eq ' + parentId + ') and (ParentPayments/any() eq false and Checks/any() eq false)').then(function (data) {
                        $scope.payItems = data.Items;
                        $scope.totalOfNotPay = $scope.payItems.sum(function (t) { return t.Price });
                    })
                    dataService.getData(RESOURCES.USERS_DOMAIN + '/api/PayItems?$filter=(Student/ParentIdFather eq ' + parentId + ' or Student/ParentIdMother eq ' + parentId + ') and (ParentPayments/any() eq true or Checks/any() eq true)').then(function (data) {
                        $scope.paidItems = data.Items;
                        $scope.totalOfPaid = $scope.paidItems.sum(function (t) { return t.Price });
                    })
                }

                $scope.dateOptionsPayDate = {
                    change: function () {
                        var val = this.value();
                        if (val && val.gregoriandate)
                            $scope.newParentPayment.DateInsert = moment(val.gregoriandate).format('YYYY-MM-DD');
                        else
                            $scope.newParentPayment.DateInsert = val;
                    }
                }

                $scope.dateOptionsCheckPayDate = {
                    change: function () {
                        var val = this.value();
                        if (val && val.gregoriandate)
                            $scope.newCheck.DatePay = moment(val.gregoriandate).format('YYYY-MM-DD');
                        else
                            $scope.newCheck.DatePay = val;
                    }
                }

                $scope.saveParentPaymentEntity = function () {
                    if ($scope.newParentPaymentForm.$valid) {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/ParentPayments', $scope.newParentPayment).then(function (id) {
                            if (id) {
                                Notification.success("با موفقیت ثبت شد.");
                                $scope.showDetails($scope.selectedParent.Id);
                                $("#payByCash").hide();
                            }
                        }, function (err) {
                            Notification.error("اشکال در ثبت.");
                        });
                    }
                }

                $scope.saveCheckEntity = function () {
                    if ($scope.newCheckForm.$valid) {
                        dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Checks', $scope.newCheck).then(function (id) {
                            if (id) {
                                Notification.success("با موفقیت ثبت شد.");
                                $scope.showDetails($scope.selectedParent.Id);
                                $("#payByCheck").hide();
                            }
                        }, function (err) {
                            Notification.error("اشکال در ثبت.");
                        });
                    }
                }
            }


        }
    ]);
});