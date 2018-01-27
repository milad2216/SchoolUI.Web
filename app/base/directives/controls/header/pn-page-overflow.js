define(['angularAMD'], function (control) {
    control.directive('pnPageOverflow', ['$rootScope', '$timeout', 'variables', '$window', function factory($rootScope, $timeout, variables, $window) {
		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var w = angular.element($window);

				function calculateHeight() {
					var viewportHeight = w.height(),
						overflowTop = $(elem).offset().top,
						height = viewportHeight - overflowTop;

					if ($(elem).children('.uk-overflow-container').length) {
						$(elem).children('.uk-overflow-container').height(height);
					} else {
						$(elem).height(height);
					}

				}
				calculateHeight();
				w.on('debouncedresize', function () {
					calculateHeight();
				});

			}
		}
	}]);
});