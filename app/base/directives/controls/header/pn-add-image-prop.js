﻿define(['angularAMD'], function (control) {
	control.directive('pnAddImageProp', ['$timeout','utils', function factory($rootScope, $timeout) {
		return {
			restrict: 'A',
			link: function ($scope, $elem, $attrs) {
				$elem.on('load', function () {
					$timeout(function () {
						var w = !utils.isHighDensity() ? $($elem).actual('width') : $($elem).actual('width') / 2,
							h = !utils.isHighDensity() ? $($elem).actual('height') : $($elem).actual('height') / 2;
						$($elem).attr('width', w).attr('height', h);
					})
				});
			}
		};
	}]);
});