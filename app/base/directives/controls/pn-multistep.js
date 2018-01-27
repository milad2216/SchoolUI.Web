define(['angularAMD'], function (control) {

    control.directive('pnMultistep', function () {

        return {
            replace: false,
            restrict: 'EA',
            scope: {
                items: "="
            },
            require: '?ngModel',
            template: '<nav ><ol class="cd-multi-steps text-top"><li ng-repeat="item in items"><a>{{item.name}}<span></span></a></li></ol></nav>',
            link: function ($scope, $elem, $attrs, ngModelCtrl) {
                ngModelCtrl.$render = function () {
                    $scope.init();
                }
                $scope.$applyAsync(function () {
                    $scope.init();
                });
                $scope.init = function () {
                    if ($elem.find('li').length > 0 && $scope.items && angular.isArray($scope.items) ) {
                        $elem.find('li').removeClass('current')
                        for (var i = 0; i < $scope.items.length; i++) {
                            $elem.find('li').eq(i).addClass('current');
                            if ($scope.items[i].value === ngModelCtrl.$viewValue) {
                                break;
                            }
                        }
                    }
                }
            },
        };
    });

});