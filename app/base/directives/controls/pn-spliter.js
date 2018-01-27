define(['angularAMD'], function(control) {
    control.directive('pnSpliter', function factory($compile) {
        var directiveDefinitionObject = {
            template: function (element, attrs) {
                return "<div></<div>";
            },
            transclude:true,
            restrict: 'E',
            scope: {
                options: '=',
                value: '=',
                onDestory: '&'
            },
            link: function (scope, element, attrs, ctrl, transclude) {
                scope.options = angular.extend({}, scope.options, {
                    orientation: 'horizontal',
                    panes: [null, null]
                });

                element.find('div').replaceWith(transclude());
                var template = [
                    '<div kendo-splitter',
                    'k-options="options.kendoOptions"',
                    'k-panes="[null, null]"',
                    'k-orientation="horizontal"',
                    'ng-required="options.required"',
                    'ng-disabled="options.disabled" >',
                    element.html(),

                  // '<div ng-transclude></div>',
                   //'<div ng-transclude></div>',
                    '</div>'
                ].join(' ');
                
                console.log(template);

                element.html($compile(template)(scope));
                
                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });

                 
            }
        };
        return directiveDefinitionObject;
    });
});