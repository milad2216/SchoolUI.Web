define(['angularAMD'], function(control) {
    control.register.directive('pnCalendar', function factory() {
        var directiveDefinitionObject = {
            template: function (element, attrs) {
                var calType = '<kendo-jalali-calendar';
                if (attrs.en !== undefined)
                    calType = '<kendo-calendar';
                var template = [
                    calType,
                    'ng-model="value"', 
                    'ng-required="options.required" ', 
                    'ng-disabled="options.disabled" ',
                    'k-options="options.kendoOptions"',
                    '></kendo-jalali-calendar>'
                ].join(' ');
                
                return template;
            },
            restrict: 'E',
            scope: {
                options: '=',
                value: '=',
                onDestory: '&'
            },
            link: function (scope, elem, attrs) {
                scope.options = scope.options || {};
                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });

                var def = { culture: 'fa-IR' };
                if (attrs.en !== undefined)
                    def.culture = 'en-US';

                scope.options.kendoOptions = angular.extend({}, scope.options.kendoOptions, def);

            }
        };
        return directiveDefinitionObject;
    });
});