define(['angularAMD'], function (control) {
    control.directive('pnButton', function () {
        return {
            restrict: 'E',
            replace: true,
			template: '<input type="submit"  class="md-btn md-btn-wave waves-effect waves-button mousetrap"  translate/>'
        };
    });
});