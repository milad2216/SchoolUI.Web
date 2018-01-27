define(['angularAMD'], function (control) {
    control.directive('pnPassword', function () {
        return {
            restrict: 'A',
            replace: 'true',
            scope: {
                title: '@',
                name: '@'
            },
            template: '<input type="password" class="form-control mousetrap"  name="{{ name }}" />'
        };
    });
});