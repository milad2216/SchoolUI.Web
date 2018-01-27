define(['angularAMD'], function (control) {
    control.directive('pnDiagram', function factory() {
        var rnd = parseInt(Math.random() * 100);
        var directiveDefinitionObject = {
            //            template: '<textarea  class="mousetrap" kendo-diagram ' +
            //                        ' k-ng-model="value" ' +
            //                        ' k-data-source="source" ' +
            //                        ' k-options="options.kendoOptions">' +
            //                        ' </textarea>',
            template: `<div id="diagram${rnd}" kendo-diagram k-options="options"></div>`,
            restrict: 'E',
            scope: {
                options: '=',
                setting: '=',
                api: '=',
                //value: '=ngModel',
                onDestory: '&',
                source: '=',
                dataSource: "=",
                connectionsDataSource: "=",
                data: "=",
                itemRotate: '&',
                pan: '&',
                select: '&',
                zoomStart: '&',
                zoomEnd: '&',
                click: '&',
                dataBound: '&',
                edit: '&',
                add: '&',
                mouseEnter: '&',
                mouseLeave: '&',
                remove: '&',
                cancel: '&',
                drag: '&',
                dragStart: '&',
                dragEnd: '&'
            },
            link: function (scope, elem, attrs) {
            }

            };

        return directiveDefinitionObject;
    });
});
