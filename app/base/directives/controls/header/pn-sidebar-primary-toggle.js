
define(['angularAMD'], function (control) {

    control.directive('pnSidebarPrimaryToggle', ['$rootScope', '$window', '$timeout', function factory($rootScope, $window, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            template: '<a id="sSwitch_primary" href="#" class="sSwitch sSwitch_left2" ng-click="togglePrimarySidebar($event)" ng-hide="miniSidebarActive || slimSidebarActive "><span class="sSwitchIcon"></span></a>',
            link: function ($scope, $elem, $attrs) {
				$scope.togglePrimarySidebar = function ($event) {
					$event.preventDefault();
                    if ($rootScope.primarySidebarActive) {
                        $rootScope.primarySidebarHiding = true;
                        if ($rootScope.largeScreen) {
                            $timeout(function () {
                                $rootScope.primarySidebarHiding = false;
                                $(window).resize();
                            }, 290);
                        }
                    } else {
                        if ($rootScope.largeScreen) {
                            $timeout(function () {
                                $(window).resize();
                            }, 290);
                        }
                    }

                    $rootScope.primarySidebarActive = !$rootScope.primarySidebarActive;

                    if (!$rootScope.largeScreen) {
                        $rootScope.hide_content_sidebar = $rootScope.primarySidebarActive ? true : false;
                    }

					if ($rootScope.primarySidebarOpen) {
						$rootScope.secondarySidebarActive = false;
						$rootScope.primarySidebarOpen = false;
                        $rootScope.primarySidebarActive = false;
                    }
                };
            }
        }
    }]);
});