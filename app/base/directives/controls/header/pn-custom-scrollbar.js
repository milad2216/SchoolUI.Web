
define(['angularAMD'], function (control) {
    control.directive('pnCustomScrollbar', ['$rootScope', '$timeout', function factory($rootScope, $timeout) {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            link: function ($scope, $elem, $attrs) {
				
                //check if mini sidebar is enabled

                if ($attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {

                    return;
                }

                $($elem)
                    .addClass('uk-height-1-1')
                    .wrapInner("<div class='scrollbar-inner'></div>");


                if (Modernizr.touch) {

                    $($elem).children('.scrollbar-inner').addClass('touchscroll');
                } else {
                    $timeout(function () {
                        $($elem).children('.scrollbar-inner').scrollbar({
                            //disableBodyScroll: true,
                            scrollx: false,
                            duration: 100
                        });
                    })
                }

            }

        }
    }]);
});