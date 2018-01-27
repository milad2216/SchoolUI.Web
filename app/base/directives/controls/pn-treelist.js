define(['angularAMD'], function (control) {
    control.directive("pnTreelist", [defFunc]);

    function defFunc() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                Config: "=config",
                onReady: '&',
                onDatabound: '&',
                api: "=?",
                disable: '=?ngDisabled'
            },
            template: '<div class="relative"><div ng-class="{\'disabletreeview \':disable}"></div><div kendo-tree-list="Kendo" class="k-rtl" k-options="Config"></div></div>',
            link: function (scope, element, attrs) {
              
                scope.$watch(scope.Config, function (newValue, oldValue) {
                    if (newValue)
                        scope.Kendo.setOption(newValue);
                   
                });

            },
            controller: function ($scope) {
                $scope.api = {};
                var gridOverlay;
                $scope.api = {
                    refresh: function () {
                        $scope.Kendo.dataSource.read();
                    },
                    setActive: function (isActive) {

                        if (isActive && gridOverlay) {
                            gridOverlay.remove();
                            gridOverlay = null;
                            return;

                        }
                        if (!isActive && !gridOverlay) {
                            gridOverlay = $("<div  />").css({
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                left: 0,
                                top: 2,
                                cursor: "not-allowed",
                                opacity: 0.3,
                                background: "#ffffff",
                                zIndex: 1000000
                            });
                            gridOverlay.appendTo($scope.Kendo.element);
                        }
                    },
                    selectFirstRow: function () {
                        $scope.Kendo.select($scope.Kendo.tbody.find('tr:first'));
                    }
                };
                $scope.$on('kendoWidgetCreated', function () {
                    $scope.onReady({ kendo: $scope.Kendo, option: $scope.Config, api: $scope.api });

                });
            }
        };
    }
});