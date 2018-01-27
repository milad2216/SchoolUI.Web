define(['angularAMD'], function (control) {


    control.directive('pnRadio', function () {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                title: '@',
                name: '@'
            },
            template: '<div class="radio">' +
                        '<label><input type="radio" class="mousetrap" name="{{ name }}">{{title}}</label>' +
                        '</div>'
        };
    });

});