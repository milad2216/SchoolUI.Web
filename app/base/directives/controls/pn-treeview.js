define(['angularAMD'], function (control) {
    control.directive("pnTreeview", [defFunc]);
    function defFunc() {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                config: "=?",
                onReady: '&',
				api: "=?",
				disable: '=?ngDisabled'
            },
            template: '<div class="k-rtl k-content" ><div class="relative"><div ng-class="{\'disabletreeview \':disable}"></div><ul kendo-tree-view="Kendo" k-options="config" class="pn-treeview"></ul></div></div>',
            controller: function ($scope) {
                if ($scope.config) {
                    if ($scope.config && $scope.config.dataSource) {
                        $scope.config.dataSource.requestEnd = function (e) {
                            $scope.disable = false;
                        }
                        $scope.config.dataSource.requestStart = function (e) {
                            $scope.disable = true;
                        }
                    }
                }
            },
            link: function (scope, element, attrs) {

                var trvw = $(element);

                scope.$watch("scope.config", function (newValue, oldValue) {
                    if (newValue)
                        scope.Kendo.setOption(newValue);
                });

                scope.$on('kendoRendered', function () {
                    scope.onReady({ kendo: scope.Kendo, option: scope.option });
                });

                var gridOverlay = null;

                scope.api = {
                    disable: function (status) {

                        if ($(trvw[0])) {
                            var checkboxes = $(trvw[0]).find('.k-item input[type="checkbox"]');
                            if (checkboxes)
                                checkboxes.attr("disabled", status);
                        }

                        //if (status) {
                        //   gridOverlay = $("<div  class='hidetree'/>").css({
                        //        position: "absolute",
                        //        width: "100%",
                        //        height: "100%",
                        //        left: 0,
                        //        top: 2,
                        //        cursor: "not-allowed",
                        //        opacity: 0.3,
                        //        background: "#f1f1f1",
                        //        zIndex: 1000000
                        //    });
                        //   gridOverlay.appendTo(scope.Kendo.element);
                        //} else if (gridOverlay) {
                        //    gridOverlay.remove();
                        //    gridOverlay = null;
                        //}      

                    },
                    hide: function (status) {
                        if(status)
                            $(trvw[0]).hide();
                        else
                            $(trvw[0]).show();
                    }
                }

            },
        };
    }
});