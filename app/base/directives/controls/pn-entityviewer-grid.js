/*************** Example by Bahmanabadi */
// <pn-entityviewer-grid 
//                               ev-title="سایر اطلاعات" 
//                               ev-options="options" 
//                               ev-on-change="onChange(data)" 
//                               ev-on-ready="onEnityViewerReady()" 
//                               ev-height="calc(90vh - 350px)"
//                               ev-api="entityViwerApi"
//                               ev-completed="onCompleted()"

//                               gv-config="gridConfig"
//                               gv-class-names="k-gridwithheader"
//                               gv-columns="gridColumns"
//                               gv-on-kendo-ready="onKendoReady(kendo, options)"
//                               gv-selecteditems="selectedItems"
//                               gv-api="gridApi"
//                               gv-schema="gridSchema"

//                              on-selected-grid="onSelectedGrid(e)" 
//                              on-change-level="onChangeLevel(e)" 
//                              coding-config="treeConfig"
//                               >
//         </pn-entityviewer-grid>

define(['base/app'], function (app) {
    app.register.directive('pnEntityviewerGrid', [
        "pn.remote.service", "pn.array", "$http", "$compile", "$rootScope", "$state", "routeResolver",
        function (pnRemoteService, pnarray, $http, $compile, $rootScope, $state, routeResolver) {

            return {
                restrict: 'E',
                replace: false,
                scope: {
                    evTitle: '@',
                    evOptions: '=',
                    evOnChange: '&',
                    evOnReady: '&',
                    evApi: '=',
                    evHeight: '@',
                    evClassNames: "@",
                    evCompleted: '&',

                    gvConfig: "=",
                    gvColumns: "=",
                    gvSchema: "=",
                    gvToolbars: "=",
                    gvSelecteditems: "=",
                    gvParameters: "=",
                    gvApi: "=",
                    gvOnKendoReady: '&',
                    gvOnDblClick: '&',
                    gvOnKendoDataBound: '&',
                    gvOnSelectRow: "&",
                    gvClassNames: "@",

                    onSelectedGrid: "&",
                    onChangeLevel: "&",
                    codingConfig: "="//,
                    //trPageSize:"@"
                },
                templateUrl: '/app/base/partials/directives/pnEntityViewerGrid.html',
                controller: function ($scope) {
                    $scope.showEntityViewer = true;
                    $scope.options = $scope.evOptions;
                    $scope.entityViwerApi = $scope.evApi;
                    $scope.$watch('evOptions', function (newVal, oldVal) {

                        $scope.options = newVal;
                        // if ($scope.triggerViewer) {
                        //      $scope.triggerViewer.call($scope.evOptions);
                        //     // $rootScope.$broadcast('scanner-entityViewerFieldListChanged', $scope.evOptions);
                        // }
                        // else
                        // {

                        // }
                    });
                    // setInterval(function () {
                    //     console.log($scope.evOptions.metaDataUri);
                    //     $scope.$apply();
                    // },2000)


                    //properties
                    $scope.gridConfig = $scope.gvConfig;
                    $scope.gridColumns = $scope.gvColumns;
                    $scope.gridSchema = $scope.gvSchema;
                    $scope.gridApi = $scope.gvApi;
                    $scope.selectedItems = $scope.gvSelecteditems;
                    $scope.parameters = $scope.gvParameters;

                    $scope.gvClassNames = $scope.gvClassNames;
                    $scope.toolbars = $scope.gvToolbars;
                    // entity viewer
                    $scope.enityViewerTitle = $scope.evTitle;
                    $scope.viewerHeight = $scope.evHeight;
                    $scope.evClassNames = $scope.evClassNames;

                },
                link: function (scope, element, attrs, ctrl, transclude) {
                    scope.gridClass = "empolyee-css2 col-md-8";
                    var mode = $state.current.dataListType;
                    switch (mode) {
                        case "tree":
                            scope.showGrid = false;
                            scope.showTree = true;
                            // scope.showEntityViewer = true;
                            break;
                        case "table":
                            scope.showGrid = true;
                            scope.showTree = false;
                            scope.showEntityViewer = true;
                            break;
                    }

                    // tree 
                    scope.onSelectedGrid2 = function (e) {
                        scope.onSelectedGrid({ e: e });
                    };

                    scope.onChangeLevel2 = function (e) {
                        scope.onChangeLevel({ e: e });
                    };



                    // gridView
                    // functions
                    scope.onKendoReady = function (datakendo, gridOptions) {
                        scope.gvOnKendoReady({ kendo: datakendo, options: gridOptions });
                    }
                    scope.dblClick = function (data) {
                        scope.gvOnDblClick({ items: data });
                    }
                    scope.onKendoDataBound = function (data) {
                        scope.gvOnKendoDataBound({ kendo: data });
                    }
                    scope.onSelectRow = function (data) {
                        scope.gvOnSelectRow({ data: data });
                    }

                    scope.onChange = function (data) {
                        scope.evOnChange({ data: data });
                    };

                    scope.onReady = function () {

                        scope.evOnReady();
                        scope.showEntityViewer = true;
                    };

                    scope.$on('scanner-entityViewerApiChange', function (event, args) {
                        scope.evApi = args;
                    });

                    var entityViewerFieldListChanged = $rootScope.$on('scanner-entityViewerFieldListChanged', function (a, b) {
                        if (b == 1) {
                            scope.evCompleted();
                            scope.showEntityViewer = false;
                            scope.gridClass = scope.gridClass.replace("col-md-8", "col-md-12");
                        }
                        else {
                            scope.showEntityViewer = true;
                            scope.evCompleted();
                            scope.gridClass = scope.gridClass.replace("col-md-12", "col-md-8");
                        }

                    });

                    // scope.$watch('evApi', function (a,b) {
                    //     alert(['DIREC',scope.evApi.metaDataUri] );
                    // });

                    // scope.$watch('options', function (newVal, oldVal) {
                    //     scope.evOptions.metaDataUri = newVal;
                    //     console.log(['url', newVal]);
                    // }, true);

                    scope.$watch('gridConfig', function (newVal, oldVal) {
                        scope.gvConfig = newVal;
                    }, true);

                    scope.$watch('gridColumns', function (newVal, oldVal) {
                        scope.gvColumns = newVal;
                    }, true);


                    scope.$watch('gridSchema', function (newVal, oldVal) {
                        scope.gvSchema = newVal;
                    }, true);

                    scope.$watch('gridApi', function (newVal, oldVal) {
                        scope.gvApi = newVal;
                    }, true);


                    scope.$watch('selectedItems', function (newVal, oldVal) {
                        scope.gvSelecteditems = newVal;
                    }, true);

                    scope.$watch('parameters', function (newVal, oldVal) {
                        scope.gvParameters = newVal;
                    }, true);

                    scope.$watch('toolbars', function (newVal, oldVal) {
                        scope.gvToolbars = newVal;
                    }, true);
                    scope.$on('$destroy', function () {
                        entityViewerFieldListChanged();
                    })
                }
            };
        }])
});