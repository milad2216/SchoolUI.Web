define([], function () {

    var services = angular.module("routeResolverServices", []);
    var pagetitle = '';
    services.provider("routeResolver", function () {
        this.$get = function () {
            return this;
        };

        this.routeConfig = function () {
        }();

        this.route = function (routeConfig) {
            var stateProviderRefrence = undefined;
            var routes = {};
            var register = function (action, routeDefn) {
                routes[action] = routeDefn;
            };
            var resolveSubSystem = function (action, title, path, param) {
                if (action && !routes[action]) {
                    var routeDef = {};
                    routeDef.pagetitle = title;
                    routeDef.sticky = true;
                    routeDef.tabMenu = false;
                    routeDef.url = path.split('/').pop().replace("Controller", "");
                    routeDef.deepStateRedirect = true;
                    routeDef.params = { data: param };
                    routeDef.views = {};
                    routeDef.views[action] = {
                        controller: path.split('/').pop(),
                    };
                    routeDef.resolve = {
                        load: ["$q", "$rootScope", "$location", "$window", function ($q, $rootScope, $location, $window) {
                            var dependency = [path + ".js"];
                            pagetitle = title;
                            return resolveDependencies($q, $rootScope, $location, $window, dependency);
                        }]
                    };
                    register(action, routeDef);
                    this.stateProviderRefrence.state(action, routeDef);
                    this.futureState.resolve();
                }
            };

            var resolveSystemFeature = function (data, param) {
                if (data.SystemFeatureViewAction && !routes[data.SystemFeatureViewAction]) {
                    var routeDef = {};
                    routeDef.pagetitle = data.SystemFeatureTitle;
                    routeDef.sticky = data.Sticky;
                    routeDef.tabMenu = data.TabMenu;
                    routeDef.url = data.Url;
                    routeDef.stickyGateway = data.StickyGateWay;
                    routeDef.deepStateRedirect = true;
                    routeDef.params = { data: param };
                    routeDef.views = {};
                    routeDef.views[data.SystemFeatureViewAction] = {
                        templateUrl: data.Path ? data.Path.replace("controllers", "views") + "/" + data.View + ".html" : "",
                        controller: data.Controller + "Controller",
                    };
                    
                    routeDef.resolve = {
                        load: ["$q", "$rootScope", "$location", "$window", function ($q, $rootScope, $location, $window) {
                            var dependency = [data.Path + "/" + data.Controller + "Controller.js"];
                            pagetitle = data.SystemFeatureTitle;
                            return resolveDependencies($q, $rootScope, $location, $window, dependency);
                        }]
                    };
                    register(data.SystemFeatureViewAction, routeDef);
                    this.stateProviderRefrence.state(data.SystemFeatureViewAction, routeDef);
                    this.futureState.resolve();
                }
            };

            var resolveDependencies = function ($q, $rootScope, $location, $window, dependencies) {
                var defer = $q.defer();
                $window.document.title = _t(pagetitle);
                require(dependencies, function () {
                    defer.resolve();
                    $rootScope.$apply();
                });
                return defer.promise;
            };

            return {
                resolveSubSystem: resolveSubSystem,
                register: register,
                resolveSystemFeature: resolveSystemFeature,
                routes: routes
            };

        }(this.routeConfig);

    });

})




