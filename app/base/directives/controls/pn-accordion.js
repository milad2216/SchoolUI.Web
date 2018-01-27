define(['angularAMD'], function (control) {

    control.directive('pnAccordion', function () {

        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                oneAtATime: '@',
                closeIconClass: '@',
                openIconClass: '@',
            },

            controller: ['$scope', function ($scope) {
                var collapsibleItems = [];

                this.openCollapsibleItem = function (collapsibleItemToOpen) {

                    if ($scope.oneAtATime) {
                        angular.forEach(collapsibleItems, function (collapsibleItem) {
                            collapsibleItem.isOpenned = false;
                            collapsibleItem.icon = collapsibleItem.closeIcon;
                        });
                    }

                    collapsibleItemToOpen.isOpenned = true;
                };

                this.addCollapsibleItem = function (collapsibleItem) {
                    collapsibleItems.push(collapsibleItem);
                    if ($scope.closeIconClass !== undefined || $scope.openIconClass !== undefined) {
                        collapsibleItem.iconsType = 'class';
                        collapsibleItem.closeIcon = $scope.closeIconClass;
                        collapsibleItem.openIcon = $scope.openIconClass;
                    }
                    // collapsibleItem.iconIsOnLeft = $scope.iconPosition == 'right' ? true : false;
                };

            }],

            template: '<div  class="panel-group" id="accordion" ng-transclude></div>'
        };

    });

});