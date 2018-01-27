define(['angularAMD'], function (control) {
    control.directive('pnAutoComplete', ['$rootScope', '$timeout', 'localStorageService', 'AuthToken',
        function factory($rootScope, $timeout, localStorageService, tokenKey) {
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
                        dataSource: {
                            type: "json",
                            serverFiltering: true,
                            transport: {
                                read: {
                                    url: $scope.dataSource.transport.read.url,
                                    data: $scope.dataSource.transport.read.data,
                                    type: "POST",
                                    contentType: "application/json",
                                    //beforeSend: function (req) {
                                    //    req.setRequestHeader('Auth-Token', localStorageService.get(tokenKey));
                                    //},
                                },
                                parameterMap: function (data, operation) {
                                   
                                    //diablo
                                    if (operation === "read") {
                                        data.filter.filters.push(
                                            {
                                                field: "SystemFeatureKey",
                                                ignoreCase: true,
                                                operator: "eq",
                                                value: $rootScope.currentTab.FormId// "c8853876-6789-e611-80fa-000c29c9d3ad"
                                            });
                                        return angular.toJson(data);
                                    }
                                }
                            },
                            schema: { data: "Entities" }
                        }
                    }).data("kendoAutoComplete");

                    $(ac).ready(function () {
                        $scope.onAutoCompleteReady({ autocomplete: element.find("input").data("kendoAutoComplete") });
                    });
                    $scope.$watch('disabled', function () {
                        if (angular.isDefined($scope.disabled)) {
                            if ($scope.disabled == true)
                                ac.enable(false);
                            else
                                ac.enable(true);
                        }

                    });
                }
            }
        }]);
});