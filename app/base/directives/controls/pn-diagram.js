/*<button class='move-diagram k-button' data-move="80" data-orientation="x"><==</button>
            <button class='move-diagram k-button' data-move="-80" data-orientation="x">==></button>  */
define(['angularAMD'], function (control) {
    control.directive('pnDiagram', function factory() {
        var rnd = parseInt(Math.random() * 100);
        var directiveDefinitionObject = {
            //            template: '<textarea  class="mousetrap" kendo-diagram ' +
            //                        ' k-ng-model="value" ' +
            //                        ' k-data-source="source" ' +
            //                        ' k-options="options.kendoOptions">' +
            //                        ' </textarea>',
            template: `<div class="wrapperKendoUIDiagram">
<div class="col-lg-12" style="right: 0;z-index: 8;top:32px;">
                <button class='zoom-in k-button'>بزرگنمایی (+)</button>
                <button class='zoom-out k-button'>کوچکنمایی (-)</button>
                <button class='focus k-button'>مرکز</button>              
</div>
<div id="diagram${rnd}" style="border: 2px dotted #93b36c !important;" ></div></div>`,
            restrict: 'E',
            scope: {
                options: '=',
                setting: '=',
                api: '=',
                //value: '=ngModel',
                // onDestory: '&',
                source: '=',
                dataSource: "=",
                connectionsDataSource: "=",
                data: "=",
                dblclick: "&",
                remove: '&',
                //itemRotate: '&',
                //pan: '&',
                select: '&',
                //zoomStart: '&',
                zoomEnd: '&',
                boxRemoved: "&",
                //click: '&',
                //dataBound: '&',
                edit: '&',
                edit2: '&'
                //add: '&',
                //mouseEnter: '&',
                //mouseLeave: '&',

                //cancel: '&',
                //drag: '&',
                //dragStart: '&',
                //dragEnd: '&'
            },
            link: function (scope, elem, attrs) {
                function moveDiagram(but) {
                    var diagram = $(`#diagram${rnd}`).getKendoDiagram();
                    var pan = diagram._pan;//diagram.pan();
                    var moveCoef = $(but).data('move');
                    var orientation = $(but).data('orientation');
                    pan[orientation] = pan[orientation] + parseInt(moveCoef);
                    diagram.pan(pan);
                    //console.log('pan-> ' + moveCoef + ' orientation->' + orientation)
                }

                function applyZoom(zoom) {
                    scope.safeApply(function () {
                        scope.api.zoomNumber = zoom;
                    });
                }

                function loadDiagram(shape, connections) {
                    $(`#diagram${rnd}`).kendoDiagram({
                        dataSource: ({
                            data: shape,
                            schema: {
                                model: {
                                    id: "Index",
                                    fields: {
                                        Index: { type: "number", editable: false },
                                        Desc: { type: "string" }
                                    }
                                }
                            }
                        }),
                        connectionsDataSource: ({
                            data: connections,
                            schema: {
                                model: {
                                    id: "Index",
                                    fields: {
                                        Index: { from: "Index", type: "number", editable: false },
                                        from: { from: "FromShapeIndex", type: "number" },
                                        to: { from: "ToShapeIndex", type: "number" },
                                        fromX: { from: "FromPointX", type: "number" },
                                        fromY: { from: "FromPointY", type: "number" },
                                        toX: { from: "ToPointX", type: "number" },
                                        toY: { from: "ToPointY", type: "number" }
                                    }
                                }
                            }
                        }),
                        layout: false,
                        editable: {
                            tools: false,
                            drag: true,
                            resize: true,
                            remove: true,
                            rotate: false
                        },
                        pannable: true,
                        //zoomRate: 0, // for scroll
                        zoomMax: 1.5,
                        zoomMin: 0.1,
                        theme: "metro",
                        remove: function (e) {
                            //e.shape.connectors[2].connections.length
                            var result = scope.remove({ $event: e });
                            if (!result) {
                                e.preventDefault();
                            }
                            else {
                                scope.api.removeConnection(e.shape.dataItem.Index);
                            }
                        },
                        dataBound: function (e) {
                            //var that = this;
                            //setTimeout(function () {
                            //    that.bringIntoView(that.shapes);
                            //}, 0);
                            //kendoConsole.log("Diagram data bound");
                        },
                        select: function (e) {
                            if (e.selected[0]) {
                                selected = e.selected[0].dataItem;
                            }
                            scope.select({ $event: e });
                        },
                        shapeDefaults: {
                            editable: {
                                tools: [{
                                    type: "button",
                                    name: "delete",
                                    tooltip: 'حذف',
                                    title: 'حذف',
                                }, {
                                    type: "button",
                                    text: '<span class="k-sprite k-icon k-i-pencil"></span>',
                                    click: function (e) {
                                        var selected = angular.element(`#diagram${rnd}`).data("kendoDiagram").select();
                                        scope.edit({ $event: selected[0] });
                                        //var content = $("#content").val();
                                        //for (var idx = 0; idx < selected.length; idx++) {
                                        //    selected[idx].content(content);
                                        //}
                                    }
                                },
                                {
                                    type: "button",
                                    text: '<span class="fa fa-outdent"></span>',
                                    tooltip: 'تشکیلات تفصیلی',
                                    title: 'تشکیلات تفصیلی',
                                    click: function (e) {
                                        var selected = angular.element(`#diagram${rnd}`).data("kendoDiagram").select();
                                        scope.edit2({ $event: selected[0] });
                                        //var content = $("#content").val();
                                        //for (var idx = 0; idx < selected.length; idx++) {
                                        //    selected[idx].content(content);
                                        //}
                                    }
                                }
                                ]
                            },
                            connectors: [{ name: "bottom" }, { name: "top" }, { name: "left" }, { name: "right" },
                            { name: "auto", position: function (shape) { return shape.bounds().bottom(); } }],
                            visual: visualTemplate
                        },
                        connectionDefaults: {
                            stroke: {
                                color: "#979797",
                                width: 2
                            }
                        },
                        zoomEnd: function (e) {
                            var zoom = e.zoom;
                            applyZoom(zoom);
                        },
                        mouseEnter: function (e) { },
                        mouseLeave: function (e) { },
                        dataBound: function (e) {

                        }
                    });
                    var diagram = $(`#diagram${rnd}`).getKendoDiagram();
                    diagram.bringIntoView(diagram.shapes);

                    var objs = angular.element('g[transform]:gt(0)');
                    objs.unbind('dblclick').bind('dblclick', function ($event, data) {
                        scope.dblclick({ selected: selected });
                    });

                    $(".zoom-in").unbind('click').bind('click', function () {
                        var diagram = $(`#diagram${rnd}`).getKendoDiagram();
                        var point = diagram.boundingBox().center();
                        diagram.zoom(diagram.zoom() + 0.1, { point: new kendo.dataviz.diagram.Point(point.x, point.y) })
                        applyZoom(diagram.zoom());
                    });


                    $(".zoom-out").unbind('click').bind('click', function () {
                        var diagram = $(`#diagram${rnd}`).getKendoDiagram();
                        var point = diagram.boundingBox().center();
                        diagram.zoom(diagram.zoom() - 0.1, { point: new kendo.dataviz.diagram.Point(point.x, point.y) })
                        applyZoom(diagram.zoom());
                    });


                    $('.focus').off('click').on('click', function () {
                        var diagram = $(`#diagram${rnd}`).getKendoDiagram();
                        if (diagram.shapes.length > 0) {
                            //  var num = Math.ceil(diagram.shapes.length * 0.50);
                            diagram.bringIntoView(diagram.shapes);
                        }
                    })


                    $('.move-diagram').off('click').on('click', function (e) {
                        moveDiagram(e.currentTarget);
                    })

                }

                var diagram = '';
                scope.api = {};
                scope.api.zoomNumber = 0;
                var serviceRoot = scope.setting.baseURL;
                var selected = null;
                scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase === '$apply' || phase === '$digest')
                        this.$eval(fn);
                    else
                        this.$apply(fn);
                };
                scope.options = scope.options;

                scope.api.remove = function (e) {
                    scope.options.remove(e);
                };
                scope.api.reLoad = function () {

                }

                scope.api.reCreate = function () {
                    var cns = scope.api.getConnections();
                    var shps = scope.api.getShapes();
                    var BoxLists = [],
                        DataConnections = [],
                        result = {};
                    for (var i = 0; i < shps.length; i++) {
                        BoxLists.push(shps[i].dataItem);
                    }
                    for (var i = 0; i < cns.length; i++) {
                        DataConnections.push({ "Index": i, "FromShapeIndex": cns[i].from.dataItem.Index, "ToShapeIndex": cns[i].to.dataItem.Index, "Text": null });
                    }
                    result.BoxLists = BoxLists;
                    result.DataConnections = DataConnections;
                    scope.api.setData(result);
                };

                scope.api.removeConnection = function (selectedIndex) {
                    var cns = scope.api.getConnections();
                    var shps = scope.api.getShapes();
                    var BoxLists = [],
                        DataConnections = [],
                        result = {};
                    var j = 0;
                    for (var i = 0; i < cns.length; i++) {
                        if (cns[i].to.dataItem.Index != selectedIndex) {
                            DataConnections.push({ "Index": j, "FromShapeIndex": cns[i].from.dataItem.Index, "ToShapeIndex": cns[i].to.dataItem.Index, "Text": null });
                            j++;
                        }
                    }
                    for (var i = 0; i < shps.length; i++) {
                        if (shps[i].dataItem.Index != selectedIndex)
                            BoxLists.push(shps[i].dataItem);
                    }
                    result.BoxLists = BoxLists;
                    result.DataConnections = DataConnections;
                    scope.api.setData(result);
                }

                scope.api.addShape = function (obj) {
                    diagram = angular.element(`#diagram${rnd}`).data("kendoDiagram");
                    var Point = kendo.dataviz.diagram.Point;
                    var x = obj.x, y = obj.y;
                    delete obj.x;
                    delete obj.y;
                    var shape = diagram.addShape({
                        dataItem: obj
                    });
                    shape.position(new Point(x, y));
                }
                scope.api.getConnections = function () {
                    diagram = angular.element(`#diagram${rnd}`).data("kendoDiagram");
                    return diagram.connections;
                }
                scope.api.getShapes = function () {
                    diagram = angular.element(`#diagram${rnd}`).data("kendoDiagram");
                    if (diagram)
                        return diagram.shapes;
                    return [];
                }
                scope.api.addConnection = function (from, fromDir, to, toDir) {
                    diagram = angular.element(`#diagram${rnd}`).data("kendoDiagram");
                    var shapes = diagram.shapes;
                    var total = shapes.length;
                    var fromIndex = from;
                    var toIndex = to;
                    if (fromIndex < total && toIndex < total) {
                        if (fromDir != null && toDir != null) {
                            diagram.connect(shapes[fromIndex].getConnector(fromDir), shapes[toIndex].getConnector(toDir));
                        }
                        else if (fromDir != null) {
                            diagram.connect(shapes[fromIndex].getConnector(fromDir), shapes[toIndex]);
                        }
                        else if (toDir != null) {
                            diagram.connect(shapes[fromIndex], shapes[toIndex].getConnector(toDir));
                        }
                        else {
                            diagram.connect(shapes[fromIndex].getConnector('Bottom'), shapes[toIndex].getConnector('Top'));
                        }
                    }
                }
                function onDataBound(e) {
                    this.bringIntoView(this.shapes);
                }
                scope.api.setData = function (data) {
                    loadDiagram(data.BoxLists, data.DataConnections);
                };

                scope.api.setText = function () {
                    $("g text", $diag).each(function () {
                        var $text = $(this);
                        var textWidth = $text[0].clientWidth;
                        var newWidth = $text.parent().parent()[0].getBoundingClientRect().width;
                        if (textWidth < newWidth) {
                            var matrix = $($text[0]).attr('transform').replace(/[^0-9\-.,]/g, '').split(',');
                            var newMatrix = `matrix(${matrix[0]},${matrix[1]},${matrix[2]},${matrix[3]},${(newWidth - textWidth - 10)},${matrix[5]})`;
                            $($text[0]).attr('transform', newMatrix);
                        }
                    });
                    diagram = angular.element(`#diagram${rnd}`).data("kendoDiagram");
                    diagram.layout(
                        {
                            subtype: "down",
                            type: "tree",
                            horizontalSeparation: 30,
                            verticalSeparation: 20,
                            //justifyContent: "right",
                        }
                    );
                };
                scope.api.render = function () {
                    diagram = angular.element(`#diagram${rnd}`).data("kendoDiagram");
                    $diag = angular.element(`#diagram${rnd}`);
                    $("g text", $diag).each(function () {
                        var $text = $(this);
                        //$text.attr("text-anchor", "end");
                        var path = $text.prev().attr("d");
                        if (path && path.length > 0) {
                            var newWidth = $text.parent().parent()[0].getBoundingClientRect().width;
                            var currentWidth = $text.prev()[0].getBoundingClientRect().width;
                            if (path.match(/L\s([\d\.]+)\s/)) { //path.match(/L\s(\d+)\s/)) {
                                var widthInPath = path.match(/L\s([\d\.]+)\s/)[1]
                                var fixedWidth = (newWidth / currentWidth) * widthInPath;
                                var r = new RegExp(widthInPath, 'g');
                                var newPath = path.replace(r, fixedWidth);
                                $text.prev().attr("d", newPath);
                            }
                        }
                    });
                    //$diag.getKendoDiagram().layout({
                    //    subtype: "down",
                    //    type: "tree",
                    //    horizontalSeparation: 30,
                    //    verticalSeparation: 20
                    //});
                    var gTagWidth = angular.element('svg > g')[0].getBoundingClientRect().width;
                    var offsetx = Math.floor((angular.element(`#diagram${rnd}`).width() - gTagWidth) / 2);
                    diagram.layout(
                        {
                            subtype: "down",
                            type: "tree",
                            horizontalSeparation: 30,
                            verticalSeparation: 20,
                            grid: {
                                offsetX: offsetx,
                                offsetY: 20
                            }
                            //justifyContent: "right",
                        }
                    );
                    //  scope.api.setText();


                }

                function visualTemplate(options) {
                    var dataviz = kendo.dataviz;
                    var dataItem = options.dataItem ? options.dataItem : options;
                    var g = new dataviz.diagram.Group();
                    //var layout = new dataviz.diagram.Layout(new dataviz.diagram.Rect(0, 0, '198', '65'), {
                    //    //alignContent: "right",
                    //    //justifyContent: "right",
                    //    //alignItems: 'right',
                    //    spacing: 10
                    //});

                    //var layout = new dataviz.diagram.Layout({
                    //    subtype: "down",
                    //    type: "tree",
                    //    horizontalSeparation: 30,
                    //    verticalSeparation: 20
                    //    //justifyContent: "right",
                    //});

                    // if (dataItem.Index == 0) {
                    //g.append(new dataviz.diagram.Circle({
                    //    radius: 60,
                    //    stroke: {
                    //        width: 2,
                    //        color: dataItem.Color || "#586477"
                    //    },
                    //    fill: "#e8eff7"
                    //}));
                    //g.append(new dataviz.diagram.TextBlock({
                    //    text: dataItem.Desc,
                    //    x: 75,
                    //    y: 45,
                    //    fill: "#2EA1D7"
                    //}));
                    //  } else {
                    g.append(new dataviz.diagram.Rectangle({
                        width: 210,
                        height: 75,
                        stroke: {
                            width: 0
                        },
                        fill: {
                            gradient: {
                                type: "down",
                                stops: [{
                                    color: "#85929E",//dataItem.colorScheme,
                                    offset: 0,
                                    opacity: 0.5
                                }, {
                                    color: "#85929E",//dataItem.colorScheme,
                                    offset: 1,
                                    opacity: 1
                                }]
                            }
                        }
                    }));
                    //g.append(layout);
                    //layout.reflow();
                    if (dataItem.Desc.length > 20) {
                        var textLayout = new dataviz.diagram.Layout(new dataviz.diagram.Rect(15, 0, 200, 60), {
                            alignContent: "right",
                            justifyContent: "right",
                            spacing: 4,
                            color: "#FFF",
                            wrap: true
                        });
                        dataItem.Desc = dataItem.Desc; //"مرکز امور بین الملل و تست شماره یک و تست شماره دو ";
                        var texts = dataItem.Desc.split(" ");

                        for (var i = texts.length; i >= 0; i--) { //0; i < texts.length;i++){ //
                            if (texts[i] != "" && texts[i] != " ") {
                                textLayout.append(new dataviz.diagram.TextBlock({
                                    text: texts[i],
                                    fill: "#fff"
                                }));
                            }
                        }
                        textLayout.reflow();
                        g.append(textLayout);
                    }
                    else {
                        g.append(new dataviz.diagram.TextBlock({
                            text: dataItem.Desc,
                            x: 50,
                            y: 25,
                            //   height: 60,
                            fill: "#fff"
                        }));
                    }

                    switch (dataItem.BoxTypeCode) {
                        case 1:
                            g.append(new dataviz.diagram.Rectangle({
                                width: 11,
                                height: 74,
                                fill: dataItem.Color,
                                stroke: {
                                    width: 0
                                },
                                fill: "#303F74"
                            }));
                            break;
                        case 2:
                            g.append(new dataviz.diagram.Rectangle({
                                width: 11,
                                height: 74,
                                fill: dataItem.Color,
                                stroke: {
                                    width: 0
                                },
                                fill: "#AA8B39"
                            }));
                            break;
                        case 3:
                            g.append(new dataviz.diagram.Rectangle({
                                width: 11,
                                height: 74,
                                fill: dataItem.Color,
                                stroke: {
                                    width: 0
                                },
                                fill: "#AA3C39"
                            }));
                            break;
                        case 4:
                            g.append(new dataviz.diagram.Rectangle({
                                width: 11,
                                height: 74,
                                fill: dataItem.Color,
                                stroke: {
                                    width: 0
                                },
                                fill: "#41621A"
                            }));
                            break;

                    }

                    //  }
                    if (dataItem.IsSubChart) {
                        g.append(new dataviz.diagram.Image({
                            source: "/content/images/icons/mgmt/OrgChart.png",
                            x: 12,
                            y: 5,
                            width: 20,
                            height: 20
                        }));
                    }
                    return g;
                }
                scope.$on('$destroy', function () {
                    // scope.onDestory();
                    scope.options = null;
                });

            }
        };

        return directiveDefinitionObject;
    });
});
// diagram = angular.element(`#diagram${rnd}`).data("kendoDiagram");
                    // //diagram.options.visual = visualTemplate;
                    // diagram.setDataSource(data.BoxLists);
                    ///* diagram.setConnectionsDataSource(data.DataConnections);*/
                    // //debugger;
                    //// scope.options = xtest(data.BoxLists, data.DataConnections);
                    // //$(`#diagram${rnd}`).kendoDiagram(xtest(data.BoxLists, data.DataConnections));
                    // $(`#diagram${rnd}`).kendoDiagram({
                    //     dataSource: data.BoxLists,
                    //     connectionsDataSource: data.DataConnections,
                    //     layout: false,
                    //     shapeDefaults: {
                    //         visual: visualTemplate//,
                    //         //content: {
                    //         //    template: "#= dataItem.Desc #",
                    //         //    fontSize: 17
                    //         //}
                    //     },
                    //     connectionDefaults: {
                    //         stroke: {
                    //             color: "#586477",
                    //             width: 2
                    //         }
                    //     },
                    //     dataBound: onDataBound
                    // });
                    // debugger;
                    // var diagram = $(`#diagram${rnd}`).getKendoDiagram();

                /*var xtest = function () {
                    return {
                        dataSource: new kendo.data.HierarchicalDataSource({
                            data: [] || list,

                            schema: {
                                model: {
                                    id: "Index",
                                    fields: {
                                        Index: { type: "number", editable: false },
                                        Desc: { type: "string" }
                                    }
                                }
                            }
                        }),
                        connectionsDataSource: ({
                            data: [] || cn //scope.connectionsDataSource,
                            //[{ "Index": 1, "FromShapeIndex": 0, "ToShapeIndex": 1, "Text": null }, { "Index": 1, "FromShapeIndex": 0, "ToShapeIndex": 2, "Text": null }]
                            ,
                            schema: {
                                model: {
                                    id: "Index",
                                    fields: {
                                        Index: { from: "Index", type: "number", editable: false },
                                        from: { from: "FromShapeIndex", type: "number" },
                                        to: { from: "ToShapeIndex", type: "number" },
                                        fromX: { from: "FromPointX", type: "number" },
                                        fromY: { from: "FromPointY", type: "number" },
                                        toX: { from: "ToPointX", type: "number" },
                                        toY: { from: "ToPointY", type: "number" }
                                    }
                                }
                            }
                        }),
                        editable: {
                            drag: true,
                            remove: true,
                            resize: true,
                            rotate: true

                        },
                        pannable: true,
                        remove: function (e) {
                            //e.shape.connectors[2].connections.length
                            var result = scope.remove({ $event: e });
                            if (!result)
                                e.preventDefault();
                        },
                        dataBound: function (e) {
                            //var that = this;
                            //setTimeout(function () {
                            //    that.bringIntoView(that.shapes);
                            //}, 0);
                            //kendoConsole.log("Diagram data bound");
                        },
                        select: function (e) {
                            if (e.selected[0]) {
                                selected = e.selected[0].dataItem;
                            }
                            scope.select({ $event: e });
                        },
                        //mouseEnter: function (e) {
                        //    if (e.item instanceof kendo.dataviz.diagram.Shape) {
                        //        e.item.shapeVisual.children[0].redraw({
                        //            fill: "black",
                        //            stroke: {
                        //                width: 3,
                        //                color: "red"
                        //            }
                        //        });
                        //    }
                        //},
                        //mouseLeave: function (e) {
                        //    if (e.item instanceof kendo.dataviz.diagram.Shape) {
                        //        e.item.shapeVisual.children[0].redraw({
                        //            stroke: {
                        //                width: 0,
                        //                color: "none"
                        //            },
                        //            fill: "#000",
                        //        });
                        //    }
                        //},
                        layout: false/* {
                        type: "tree",
                        subtype: "down",
                        horizontalSeparation: 30,
                        verticalSeparation: 20,
                        grid: {
                            offsetX: 400,
                            offsetY: 20
                        }
                    },
                        shapeDefaults: {
                            editable: {
                                tools: [{
                                    name: "delete"
                                }, {
                                    type: "button",
                                    text: "ویرایش",
                                    click: function (e) {
                                        var selected = angular.element(`#diagram${rnd}`).data("kendoDiagram").select();
                                        scope.edit({ $event: selected[0] });
                                        //var content = $("#content").val();
                                        //for (var idx = 0; idx < selected.length; idx++) {
                                        //    selected[idx].content(content);
                                        //}
                                    }
                                }]
                            },
                            connectors: [{ name: "bottom" }, { name: "top" }, //{ name: "left" }, { name: "right" },
                            { name: "auto", position: function (shape) { return shape.bounds().bottom(); } }],
                            visual: visualTemplate
                        },
                        connectionDefaults: {
                            stroke: {
                                color: "#979797",
                                width: 2
                            }
                        },
                        zoomEnd: function (e) {
                            var zoom = e.zoom;
                            scope.safeApply(function () {
                                scope.api.zoomNumber = zoom;
                            });
                        }
                        //  dataBound: onDataBound
                    }
                };*/