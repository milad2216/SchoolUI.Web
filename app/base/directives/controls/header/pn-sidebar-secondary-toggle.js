
define(['angularAMD'], function (control) {
    control.directive('pnSidebarSecondaryToggle', ['$rootScope', '$window', '$timeout', function factory($rootScope, $window, $timeout) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
            },
			template: '<a href="#" id="sSwitch_secondary" class="pull-right sSwitch sSwitch_right" ng-show="true" ng-click="toggleSecondarySidebar($event)" data-uk-tooltip="{pos:"right"}" title="Mailbox"><span class="sSwitchIcon"></span></a>',
            link: function ($scope, $elem, $attrs) {
				$scope.toggleSecondarySidebar = function ($event) {
					$event.preventDefault();
					$rootScope.secondarySidebarActive = !$rootScope.secondarySidebarActive;
                };
            }
        }
    }]);
});