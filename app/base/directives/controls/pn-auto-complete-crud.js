define(['angularAMD','base/directives/controls/pn-auto-complete'], function (control) {
    control.directive('pnAutoCompleteCrud', ['$rootScope','$timeout', 'localStorageService', 'AuthToken', 'Notification', 'pn.remote.service',
        function factory($rootScope,$timeout, localStorageService, tokenKey, notify, remoteService) {
        return {
            restrict: 'E',
            scope: {
                dataSource: "=source",
                onAutoCompleteReady: "&",
                disabled: "=ngDisabled",
                api: "=",
                model: '=ngModel'
            },
            require: '?ngModel',
            templateUrl: '/app/base/partials/directives/pn-auto-complete-crud.html',
            link: function ($scope, element, attr, ngModelCtrl) {

                $scope.doInsertText = function () {
                    debugger;
                    if ($scope.model) {
                        //diablo
                        remoteService.post({ Description: $scope.model, SystemFeatureKey: $rootScope.currentTab.FormId }, $scope.dataSource.transport.create.url).then(function (data) {
                            var resultStatus = resultHandlerDesc(data);
                        });
                    }
                    else {
                        notify.error({ message: _t("message.youHavetoEnterDescription"), title: "" });
                    }
                }

                $scope.doDeleteText = function () {
                    if ($scope.model) {
                        remoteService.post({ Description: $scope.model }, $scope.dataSource.transport.destroy.url).then(function (data) {
                            var resultStatus = resultHandlerDesc(data)
                            if (resultStatus) {
                                $scope.model = "";
                            }
                        });
                    }
                    else {
                        notify.error({ message: _t("message.youHavetoEnterDescription"), title: "" });
                    }
                }

                var resultHandlerDesc = function (result) {
                    if (result.Success) {
                        notify.success({ message: _t("message.successFull"), title: "" });
                    }
                    else {
                        notify.error({ message: result.ErrorMessage, title: "" });
                        return false;
                    }
                    return true;
                }
            }
        }
    }]);
});