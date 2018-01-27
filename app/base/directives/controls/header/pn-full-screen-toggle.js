
define(['angularAMD'], function (control) {
    control.directive('pnFullScreenToggle', ['$rootScope', '$window', '$timeout', 'variables', function factory($rootScope, $window, $timeout, variables) {
        return {
            restrict: 'A',
            replace: false,
            scope: {
            },
            link: function ($scope, elem, attrs) {
                $(elem).on('click', function (e) {
                    e.preventDefault();
                    screenfull.toggle();
                    $(window).resize();
                });
         

            }
        }
    }]);
});