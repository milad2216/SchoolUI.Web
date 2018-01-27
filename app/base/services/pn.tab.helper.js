define(['angularAMD'], function (app) {
	app.service("pn.tab.helper", ["$rootScope", "routeResolver", function ($rootScope, routeResolver ) {
	    return {
	        registerAndOpen: function (actionBase, action, route, data, title, systemId, featureId, SystemKey, FormId) {
	            var state = this.register(actionBase, action, route, data, title, systemId, featureId, SystemKey, FormId);
	            $rootScope.add("", state, $rootScope.CurrentTabState.systemTotalCode, $rootScope.CurrentTabState.featureId)
	        },
			register: function (actionBase, action, route, data, title, systemId, featureId, SystemKey, FormId) {
				var newState;
				var routeDefn = routeResolver.route.dynamicRegisterWithRoute(
                                                actionBase,
                                                action,
												route,
                                                data,
                                                function (state) {
                                                	newState = state
                                                }
                                            );
				$rootScope.uiTabsGateways[newState] = routeDefn;

				var tabItem = {
					title: title,
					action: newState,
					systemId: systemId,
					featureNo: featureId,
					isActive: false,
					SystemKey: SystemKey,
					FormId: FormId,
					toolbar: angular.copy($rootScope.tabItems[0].toolbar)
				};

				$rootScope.tabItems.push(tabItem);

			    ////
				//$state.current.pnRegions = {
				//    'Reg0': 1,
				//    'Reg1': 0,
				//    'Reg2': 2,
				//    'Reg3': 0,
				//    'Reg4': 1,
				//};
			    ////


				return newState;
			}
			
		};
	}])
});