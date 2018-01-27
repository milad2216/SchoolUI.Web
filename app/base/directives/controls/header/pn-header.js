define(['angularAMD','base/directives/controls/header/pn-sidebar-primary'], function (control) {
	control.directive('pnHeader', ['$timeout', '$window', '$state', '$rootScope',
		function factory($timeout, $window, $state, $rootScope ) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                usefulMenu: "&",
                logout2: "&"
            },
            templateUrl: '/app/base/partials/directives/header.html',
            link: function ($scope, $elem, $attrs) {
                debugger
                $scope.useFulMenu = function () {
                    $scope.usefulMenu();
                }

                $scope.logout = function () {
                    $scope.logout2();
                }

                $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function () {
                    $timeout(function () {
                        $($window).resize();
                    }, 280)
                });

                // autocomplete
                $('.header_main_search_form').on('click', '#autocomplete_results .item', function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    $state.go($this.attr('href'));
                    $('.header_main_search_input').val('');
				})

				
                //
                $scope.toggleCheatSheet = function () {
                    hotkeys.toggleCheatSheet();
                }
                //
            }
        }
        }]);
	
});