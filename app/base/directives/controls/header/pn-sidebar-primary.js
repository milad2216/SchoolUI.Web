
define(['angularAMD'], function (control) {
    control.directive('pnSidebarPrimary', ['$rootScope',
		'$window',
		'$timeout',
		'variables', function factory($rootScope, $window, $timeout, variables) {
		return {
			restrict: 'A',
			replace: true,
			scope: 'true',
			link: function (scope, el, attr) {
				$rootScope.$watch('slimSidebarActive', function (status) {
					if (status) {
						var $body = $('body');
                        $('#sidebar_main')
							.mouseenter(function () {
								$body.removeClass('sidebar_slim_inactive');
								$body.addClass('sidebar_slim_active');
							})
							.mouseleave(function () {
								$body.addClass('sidebar_slim_inactive');
								$body.removeClass('sidebar_slim_active');
							})
					}
				});

			}		}
	}]);
});