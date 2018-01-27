define(['angularAMD'], function (control) {
	control.directive('pnPageAsideToggle', ['$window', '$timeout', function factory($window, $timeout) {
    
			return {
              restrict: 'A',
              link: function (scope, elem, attrs) {
                    $(elem).on('click',function() {
                        $('body').toggleClass('page_aside_collapsed');
                        $('body').toggleClass('cartable_open');
                    })
                }
            }


}]);
});