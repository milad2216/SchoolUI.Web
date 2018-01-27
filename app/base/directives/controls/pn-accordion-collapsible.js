define(['angularAMD'], function (control) {
    control.directive('pnAccordionCollapsible', function () {
        return {
            require: '^pnAccordion',
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                itemDisabled: '=',
                initiallyOpen: '=',
                onOpen: '&',
                onClose: '&'
            },

            link: function (scope, element, attrs, accordionController) {

                scope.itemTitle = _t(attrs.itemTitle);
                scope.isOpenned = (scope.initiallyOpen) ? true : false;

                accordionController.addCollapsibleItem(scope);
                if (scope.isOpenned)
                    scope.icon = scope.openIcon;
                else
                    scope.icon = scope.closeIcon;



                if (scope.isOpenned !== undefined) {
                    scope.$watch('isOpenned', function () {
                        if (scope.isOpenned) {
                            if (scope.onOpen) {
                                scope.onOpen();
                            }
                        } else {
                            if (scope.onClose) {
                                scope.onClose();
                            }


                        }

                    });

                }

                scope.toggleCollapsibleItem = function () {

                    if (scope.itemDisabled)
                        return;

                    if (!scope.isOpenned) {
                        accordionController.openCollapsibleItem(this);
                        scope.icon = scope.openIcon;
                    }
                    else {
                        scope.isOpenned = false;
                        scope.icon = scope.closeIcon;
                    }
                };

            },
            template: '<div class="collapsible-item" ng-class="{open: isOpenned}"><div class="title" ng-class="{disabled: itemDisabled}" ng-click="toggleCollapsibleItem()">{{itemTitle}}<i class="{{icon}} icon"></i></div><div class="body"><div class="panel-body" ng-transclude></div></div></div>'
        };
    });
});