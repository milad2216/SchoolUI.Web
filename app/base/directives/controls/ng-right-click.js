define(['angularAMD'], function (control) {
    control.directive('ngRightClick', function ($parse) {

        //return function (scope, element, attrs) {
        //    var fn = $parse(attrs.ngRightClick);
        //    element.bind('contextmenu', function (event) {
        //        scope.$apply(function () {
        //            event.preventDefault();
        //            fn(scope, { $event: event });
        //        });
        //    });
        //};

        return {
            restrict: 'EA',
            replace: true,
            scope: {
               // oneAtATime: '@',
            },
            link: function (scope, element, attrs) {
                var isThereChildren = function (row) {
                    return row && row.rows && row.rows.length > 0 ? true : false;
                }
                scope.OnRowRightClick = function (e) {
                    if (e.row) {
                        for (var i = 0; i < scope.rowContextMenu.lenght; i++) {
                            if (scope.rowContextMenu[i].key === 'CLEAR_CHILD')
                                scope.rowContextMenu[i].enabled = isThereChilderen(e.row)
                        }
                    }
                }
                }
             }

    });
});