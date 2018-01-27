define(['angularAMD'], function (control) {
	control.directive('pnOnLastRepeat', ['$rootScope', '$timeout', function factory($rootScope, $timeout) {
		return function ($scope, $elem, $attrs) {
			
			if ($scope.$last) {
				$timeout(function () {
					$scope.$emit('pnOnLastRepeat', $elem, $attrs);
				})
			}
			
		};
	}]);
});