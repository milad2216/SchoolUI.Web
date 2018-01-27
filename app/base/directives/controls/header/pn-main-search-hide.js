
define(['angularAMD'], function (control) {
    control.directive('pnMainSearchHide', ['$rootScope', '$window', '$timeout', 'variables', function factory($rootScope, $window, $timeout, variables) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
              
            },
            template: '<i class="md-icon header_main_search_close material-icons" ng-click="hideSearch()">&#xE5CD;</i>',
            link: function ($scope, el, attr) {
                $scope.hideSearch = function () {
                    var $header_main = $('#header_main');

                    $header_main
                        .children('.header_main_search_form')
                        .velocity("transition.slideUpBigOut", {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            begin: function () {
                                $header_main.velocity("reverse");
                                $rootScope.mainSearchActive = false;
                            },
                            complete: function () {
                                $header_main
                                    .children('.header_main_content')
                                    .velocity("transition.slideDownBigIn", {
                                        duration: 280,
                                        easing: variables.easing_swiftOut,
                                        complete: function () {
                                            $('.header_main_search_input').blur().val('');
                                        }
                                    })
                            }
                        });

                };
            }
        }
    }]);
});