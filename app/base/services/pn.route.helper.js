define(['angularAMD'], function (app) {
    app.service("pn.route.helper", ['pn.array', "$q", "variables", "$state", "infWebAccess", "$rootScope", "routeResolver", 'pn.remote.service', '$stickyState', '$deepStateRedirect', 'Notification',
        function (pnarray, $q, variables, $state, infWebAccess, $rootScope, routeResolver, remoteService, $stickyState, $deepStateRedirect, notify) {

            getActiveFormScope = function () {
                var form = $('.acitveForm:visible');
                return angular.element(form).scope();
            };

            resolveSubSystem = function () {
                var defferd = $q.defer();
                $rootScope.openedTaps = [];
                $rootScope.tabItems = [];
                remoteService.post(null, infWebAccess + 'api/Menu/Menu').then(function (loadDataResult) {

                    var route = routeResolver.route;
                   
                    $rootScope.sections = loadDataResult.Entity;


                    $rootScope.uiTabsGateways = [];
                    loadDataResult.Entity.Items.forEach(function (item) {
                        route.resolveSubSystem(item.SystemAction, item.SystemTitle, item.SystemPath, { Key: item.SystemKey, TotalCode: item.SystemTotalCode });
                        $rootScope.uiTabsGateways.push(item.SystemAction);
                    });
                    $state.go("home.tab");
                    defferd.resolve($rootScope.sections.Toolbar);
                });
                return defferd.promise;
            };

            resolveSystemFeature = function (data) {
                var defferd = $q.defer();
                var featureGroups = [];
                remoteService.post({ "SystemGuid": data.Key }, infWebAccess + 'api/Menu/GetSystemFeatureMenu', 'myBlockUI-'+data.Key).then(function (loadDataResult) {
                    var route = routeResolver.route;
                    angular.forEach(loadDataResult.Entity.FeaturesGroup, function (fg) {

                        featureGroups.push(fg);
                        angular.forEach(fg.Features, function (f) {
                            var tabItem = null;

                            if (f.Childs.length > 0) {
                                f.Childs.forEach(function (item) {
                                    if (item.SystemFeatureViewAction) {
                                        createItemForState(item, data, route);
                                    }
                                });
                            }
                            else {
                                if (f.SystemFeatureViewAction) {
                                    createItemForState(f, data, route);
                                }
                            }
                        });
                    });
                    var index = $rootScope.sections.Items.findIndex(x => x.SystemKey == data.Key);
                    if (index > -1) {
                        $rootScope.sections.Items[index].FeatureGroup = featureGroups;
                    }
                    defferd.resolve(true);
                });
                return defferd.promise;
            };

            resolveUserControl = function (mapping) {
                var route = routeResolver.route;
                mapping.forEach(function (row) {
                    var tab = {
                        SystemFeatureTitle: row.pageTitle,
                        SystemFeatureViewAction: row.systemAction,
                        Sticky: row.sticky,
                        TabMenu: row.tabMenu,
                        Url: row.url,
                        StickyGateWay: row.stickyGateWay,
                        Path: "app/directives/user.components/" + row.folder + "/controllers/" + row.controller,
                        View: row.view,
                        Controller: row.controller + "Controller",
                    }
                    route.resolveSystemFeature(tab, null);
                });

            };

            createItemForState = function (f, data, route) {
                if (!route) {
                    route = routeResolver.route;
                }
                if (!route.routes[f.SystemFeatureViewAction]) {
                    var tabItem = {
                        title: f.SystemFeatureTitle,
                        action: f.SystemFeatureViewAction,
                        systemTotalCode: data.TotalCode,
                        featureId: f.SystemFeatureNO,
                        isActive: false,
                        systemKey: data.Key,
                        FormId: f.SystemFeaturePkey,
                        toolbar: f.Toolbar
                    };
                    if (f.Tabs.length > 0) {
                        tabItem.Tabs = [];
                        getTabRecursive(f.Tabs, tabItem.Tabs);
                    }
                    $rootScope.uiTabsGateways.push(f.SystemFeatureViewAction);
                    route.resolveSystemFeature(f, tabItem);
                    $rootScope.tabItems.push(tabItem);
                    if (tabItem.Tabs) {

                        tabItem.Tabs.forEach(function (tab) {
                            tab.Tabs = null;
                            route.resolveSystemFeature(tab, null);
                        });
                    }
                }
            }

            getTabRecursive = function (tabs, tabsFlat) {

                tabs.forEach(function (tab) {
                    tabsFlat.push(tab);
                    if (tab.Tabs) {
                     if (tab.Tabs.length > 0) {
                                            getTabRecursive(tab.Tabs, tabsFlat);
                                        }
                    }
                   
                });
            };

            featureClick = function (title, action, systemTotalCode, featureId, systemKey) {
                if ($rootScope.openedTaps.length >= 10) {
                    notify.error('لطفا قبل از باز نمودن تب جدید تب های قبلی را ببندید');
                    return
                }

                for (var i = 0; i < $rootScope.tabItems.length; i++) {
                    if ($rootScope.tabItems[i].action == action) {
                        $rootScope.tabItems[i].isActive = true;

                        var isExists = true;
                        $rootScope.openedTaps.map(function (item) {
                            if (item.FormId == $rootScope.tabItems[i].FormId)
                                isExists = false;
                        });
                        var tab = angular.copy($rootScope.tabItems[i]);
                        if (isExists) {
                            $rootScope.openedTaps.push(tab);
                            onClickTab(tab);
                        }
                        else {
                            var openedTap = $.grep($rootScope.openedTaps, function (item) { return item.action == action })[0];
                            onClickTab(openedTap);
                        }
                        $state.go(action);
                    }
                }
                setTimeout(function () {
                    $(".pn-tab-container").css("margin-top", $(".pn-tab-header").height() + 10)
                }, 100)

            };

            onClickTab = function (tab) {
                $rootScope.currentTab = tab;
                $rootScope.CurrentTabState = {
                    title: tab.title,
                    action: tab.action,
                    systemTotalCode: tab.systemTotalCode,
                    featureId: tab.featureId,
                    systemKey: tab.systemKey
                };
                angular.forEach($rootScope.openedTaps, function (tabItem) {
                    if (tab.action === tabItem.action) {
                        tabItem.isActive = true;
                    }
                    else {
                        tabItem.isActive = false;
                    }
                });
                //localStorage.setItem('currentTabs', JSON.stringify(tab));
                //

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

                }, 1000)

                //

            };

            close = function (tab) {
                DoDispose().then(function (result) {
                    if (result) {
                        var sc = { action: tab.action }
                        var rs = pnarray.serach($rootScope.openedTaps, sc);
                        var index = rs.index;
                        var len = $rootScope.openedTaps.length - 1;

                        var nextTabAfterClose;
                        var activeIndex;
                        var currentTab;

                        if (len === index) {

                            if (index === 0) {
                                $rootScope.openedTaps.splice(0, 1);
                                currentTab = "home";
                                $state.go(currentTab);
                                localStorage.setItem('currentTabs', JSON.stringify([]));;
                            } else {
                                currentTab = $rootScope.openedTaps[len - 1].action;
                                if (len === 0) {
                                    nextTabAfterClose = 0;
                                } else {
                                    nextTabAfterClose = len - 1;
                                }
                                activeIndex = $rootScope.openedTaps[nextTabAfterClose];
                                onClickTab(activeIndex);
                                $rootScope.openedTaps.splice(index, 1);
                                $state.go(currentTab);
                                //removeFromOpenedTabs(tab.action);
                            }
                        } else {
                            if (index === 0) {
                                nextTabAfterClose = 1;
                            } else {
                                nextTabAfterClose = index + 1;
                            }
                            activeIndex = $rootScope.openedTaps[nextTabAfterClose];
                            onClickTab(activeIndex);
                            $rootScope.openedTaps.splice(index, 1);
                            currentTab = $rootScope.openedTaps[index].action;
                            $state.go(currentTab);
                            //removeFromOpenedTabs(tab.action);

                        }

                        setTimeout(function () {
                            $(".pn-tab-container").css("margin-top", $(".pn-tab-header").height() + 10)
                        }, 100);

                        setTimeout(function () {
                            $stickyState.reset(tab.action);
                            $deepStateRedirect.reset(tab.action);

                        }, 0);

                    }
                });
            };

            DoDispose = function () {
                $rootScope.currentTab.mode = "DoDispose";
                var defferd = $q.defer();
                var formScope = getActiveFormScope();
                if (formScope != undefined && formScope.doDispose != undefined) {
                    formScope.doDispose().then(function (result) {
                        defferd.resolve(result);
                    });
                } else {
                    defferd.resolve(true);
                }
                return defferd.promise;
            };


            return {
                createItemForState: createItemForState,
                resolveUserControl: resolveUserControl,
                DoDispose: DoDispose,
                close: close,
                onClickTab: onClickTab,
                featureClick: featureClick,
                resolveSystemFeature: resolveSystemFeature,
                resolveSubSystem: resolveSubSystem,
                getActiveFormScope: getActiveFormScope
            };
        }])
});