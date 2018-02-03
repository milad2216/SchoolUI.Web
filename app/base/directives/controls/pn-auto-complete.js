define(['angularAMD'], function (control) {
    control.directive('pnAutoComplete', ['$rootScope', '$timeout',
        function factory($rootScope, $timeout) {
            return {
                restrict: 'E',
                scope: {
                    dataSource: "=source",
                    onAutoCompleteReady: "&",
                    disabled: "=",
                    api: "=",
                    model: '=ngModel'
                },
                require: '?ngModel',
                template: '<input class="form-control mousetrap" ng-model="model" />',
                link: function ($scope, element, attr, ngModelCtrl) {
                    debugger;
                    var ac = element.find("input").kendoAutoComplete({
                        dataTextField: $scope.dataSource.text,
                        placeholder: $scope.dataSource.placeholder,
                        filter: "contains",
                        minLength: 3,
                        template: $scope.dataSource.template,
                        dataSource: {
                            type: "json",
                            serverFiltering: true,
                            transport: {
                                read: {
                                    url: $scope.dataSource.transport.read.url,
                                    data: $scope.dataSource.transport.read.data,
                                    beforeSend : $scope.dataSource.transport.read.beforeSend,
                                    type: $scope.dataSource.transport.read.type,
                                    contentType: "application/json",
                                    //beforeSend: function (req) {
                                    //    req.setRequestHeader('Auth-Token', localStorageService.get(tokenKey));
                                    //},
                                },
                                
                            },
                            schema: { data: "Items" }
                        }
                    }).data("kendoAutoComplete");

                    $(ac).ready(function () {
                        $scope.onAutoCompleteReady({ autocomplete: element.find("input").data("kendoAutoComplete") });
                    });
                    $scope.$watch('disabled', function () {
                        if (angular.isDefined($scope.disabled)) {
                            if ($scope.disabled === true)
                                ac.enable(false);
                            else
                                ac.enable(true);
                        }

                    });
                }
            }
        }]);
});