define(['angularAMD'], function (control) {

    control.directive('pnCheckbox', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
             scope: { 
                 isChecked: '=?',
                 title: '@',
                  name: '@',
             },
             template: '<input type="checkbox" name="{{ name }}"  value="" class="checkbox" ng-class="{checked: isChecked}" ng-click="toggleMe()"></checkbox>',
          
            link: function(scope, elem, attrs) {
                scope.isChecked = true;

                scope.toggleMe = function() {
                    scope.isChecked = !(scope.isChecked);
                }
            }
        };
        });
});