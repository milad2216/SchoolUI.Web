define(['angularAMD'], function (app) {
    app.service("pn.menu.service", ['pn.tab.helper', 'infWebAccess', '$rootScope', 'routeResolver', "pn.remote.service",   "localStorageService",
        function (tabHelper, WebAccess, $rootScope, routeResolver, remoteService, localStorageService) {
                
        getMenu = function () {
            remoteService.post(null, WebAccess + 'api/Menu/Menu').then(function (loadDataResult) {
                var menu = loadDataResult.Entity;
                if ($rootScope.sections)
                    return;
                $rootScope.sections  = menu;
                var i, j, k, allTabsRoutes = [];
                for (i = 0; i < $rootScope.sections.length; i++) {
                    for (j = 0; j < $rootScope.sections [i].FeaturesGroup.length; j++) {
                        for (k = 0; k < $rootScope.sections [i].FeaturesGroup[j].Features.length; k++) {
                            allTabsRoutes.push($rootScope.sections [i].FeaturesGroup[j].Features[k].SystemFeatureViewAction);
                        }
                    }
                }

                var uiTabs = [];
                for (route in routeResolver.route.routes) {
                    if (routeResolver.route.routes.hasOwnProperty(route)) {
                        var routeDefn = routeResolver.route.routes[route];
                        if ((allTabsRoutes.indexOf(route) > -1 || routeDefn.sticky === true) && routeDefn.sticky !== false) {
                            routeDefn.views = {};
                            routeDefn.views[route] = {
                                controller: routeDefn.controller,
                                templateUrl: routeDefn.templateUrl
                            };

                            routeDefn.sticky = true;
                            routeDefn.deepStateRedirect = true;
                            delete routeDefn.controller;
                            delete routeDefn.templateUrl;

                            if (routeDefn.tabMenu !== false)
                                uiTabs.push(route);
                        }
                        $rootScope.uiTabsGateways = uiTabs;
                        routeResolver.route.stateProviderRefrence.state(route, routeDefn);

                        if (routeDefn.stickyGateway) {
                            var routeDefnClone = angular.copy(routeDefn);

                            routeDefnClone.url = routeDefn.url + '_dummy';

                            if (routeDefn.stickyGateway.length > 0) {

                                routeDefn.actualRoute = routeDefn.stickyGateway;
                            } else {
                                routeResolver.route.stateProviderRefrence.state(route + "_dummy", routeDefnClone);
                            }
                        }
                    }
                    routeResolver.route.futureState.resolve();
                };

            });
        }

        return {
            getMenu
        }

    }]);
});
