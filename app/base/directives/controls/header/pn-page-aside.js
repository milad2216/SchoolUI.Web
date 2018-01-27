define(['angularAMD'], function (control) {
	control.directive('pnPageAside', ['$timeout', '$window', function factory($timeout, $window) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var w = angular.element($window);

				function calculateHeight() {
					var viewportHeight = w.height(),
						asideTop = $(elem).offset().top;
					$(elem).height(viewportHeight - asideTop);
				}
				calculateHeight();
                w.on('resize', function () {
					calculateHeight();
				});
			}
		}
		
	}]);
});