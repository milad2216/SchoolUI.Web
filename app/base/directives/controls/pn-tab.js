define(['angularAMD'], function (app) {
    app.directive('pnTab', ["$rootScope", "pn.route.helper", "pn.remote.service", "pn.array", "$compile", "$state",
        function ($rootScope, routeHelper, pnRemoteService, pnarray, $compile, $state) {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    data: "=",
                    route: "=",
                    dir: "@",
                    onTabClick: "&",
                },
                templateUrl: '/app/base/partials/directives/pn-tab.html',
                controller: function ($scope) {
                  
                    $scope.$state = $state;
                    if (!$scope.data) {
                        $scope.data = { fixedTabs: [] };
                    }
                    $scope.tabClick = function ($event, tab, key) {
                        setTimeout(function () {
                            var elements = $('.acitveForm:visible').find('[required-message]');
                            $('.acitveForm:visible').find(".required").remove();
                            elements.each(function (index, value) {
                                switch (value.tagName.toLowerCase()) {
                                    case "input":
                                        $('<span/>', {
                                            class: 'required',
                                        }).appendTo(value.parentElement);
                                        break;

                                    case "pn-combo-box":

                                        $('<span/>', {
                                            class: 'required',
                                        }).appendTo(value.parentElement);
                                        break;

                                    case "pn-date-picker":

                                        $('<span/>', {
                                            class: 'required',
                                        }).appendTo(value.parentElement);
                                        break;


                                    case "pn-lookup":

                                        $('<span/>', {
                                            class: 'required',
                                        }).appendTo(value.parentElement);
                                        break;
                                }
                            })

                        }, 100)

                        var hasClass = $($event.currentTarget).closest("li").hasClass("active-tab");
                        if (!hasClass) {
                            if ($scope.onTabClick({ route: tab.SystemFeatureViewAction, key: key }) === "stop") {
                                $event.preventDefault();
                            }
                            else if (tab.Toolbar) {
                                $rootScope.currentTab.toolbar = tab.Toolbar;
                            }
                        }
                    }
                },

                compile: function (tElem, tAttrs) {
                    return {
                        post: function (scope, iElem, iAttrs) {
                            if (scope.data.fixedTabs.length > 0) {
                                var action = scope.data.fixedTabs[0];
                                $state.go(action.SystemFeatureViewAction);
                                if (action.Toolbar && action.Toolbar.length > 0) {
                                    $rootScope.currentTab.toolbar = action.Toolbar;
                                }
                            }
                        }
                    }
                }
            };
        }
    ]);
});