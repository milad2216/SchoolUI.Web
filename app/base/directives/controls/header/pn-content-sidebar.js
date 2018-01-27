define(['angularAMD'], function (control) {
    control.register.directive('pnContentSidebar', ['$rootScope', function factory($rootScope) {
        return {
            restrict: 'A',
            replace: false,
            scope: {

			},
            link: function (scope, el, attr) {

                if (!$rootScope.header_double_height) {
                    $rootScope.$watch('hide_content_sidebar', function () {
                        if ($rootScope.hide_content_sidebar) {
                            $('#page_content').css('max-height', $('html').height() - 40);
                            $('html').css({
                                'paddingRight': scrollbarWidth(),
                                'overflow': 'hidden'
                            });
                        } else {
                            $('#page_content').css('max-height', '');
                            $('html').css({
                                'paddingRight': '',
                                'overflow': ''
                            });
                        }
                    });

                }
            }
		}
		
    }]);
});




             