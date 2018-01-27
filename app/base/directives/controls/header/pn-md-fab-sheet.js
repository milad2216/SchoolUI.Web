define(['angularAMD'], function (control) {
    control.directive('pnMdFabSheet', ['variables', '$document', '$rootScope',
        function factory(variables, $document, $rootScope) {
            return {
                restrict: 'EA',
                replace: 'true',
                scope: {
                    apiFabSheet: "=?",
                    // item: "="
                },
                templateUrl: '/app/base/partials/directives/pn-mdFabSheet.html',
                link: function (scope, elem, attrs, vm) {


                    scope.safeApply = function (fn) {
                        var phase = this.$root.$$phase;
                        if (phase === '$apply' || phase=== '$digest') {
                            if (fn && (typeof (fn) === 'function')) {
                                fn();
                            }
                        } else {
                            this.$apply(fn);
                        }
                    };


                    var list = localStorage.getItem("destinationMenu");
                    if (list) {
                        scope.destination = JSON.parse(list);
                    }
                    scope.destination;
                    scope.removeitem = function (index) {
                        scope.destination.splice(index, 1);
                        localStorage.setItem("destinationMenu", JSON.stringify(scope.destination));
                    }
                    scope.apiFabSheet = {
                        useful_menu: function (param) {

                            scope.safeApply(function () {
                                if (scope.destination.length >= 1) {
                                    var state = $.grep(scope.destination, function (obj) {
                                        return obj.SystemFeatureViewAction.toLowerCase() === param.SystemFeatureViewAction.toLowerCase()
                                    })[0];
                                    if (state) {
                                        return;
                                    }
                                }
                                scope.destination.push(param);
                                localStorage.setItem("destinationMenu", JSON.stringify(scope.destination));
                            })
                        }
                    }

                    scope.featureClickUseMnu = function (param) {
                      
                        var data = {
                            TotalCode: param.TotalCode,
                            Key: param.Key,
                        }
                        
                    }

                    var $fab_sheet = $(elem);
                    $fab_sheet
                        .children('i')

                        .on('click', function (e) {
                            e.preventDefault();

                            var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                            $fab_sheet.addClass('md-fab-animated');

                            setTimeout(function () {
                                $fab_sheet
                                    .width('240px')
                                    .height(sheetItems * 40 + 8);
                            }, 140);

                            setTimeout(function () {
                                $fab_sheet.addClass('md-fab-active');
                            }, 280);

                        });
                    $($document).on('click scroll', function (e) {
                        if ($fab_sheet.hasClass('md-fab-active')) {
                            if (!$(e.target).closest($fab_sheet).length) {

                                $fab_sheet
                                    .css({
                                        'height': '',
                                        'width': ''
                                    })
                                    .removeClass('md-fab-active');

                                setTimeout(function () {
                                    $fab_sheet.removeClass('md-fab-animated');
                                }, 140);

                            }
                        }
                    });

                    scope.$applyAsync(function () {


                        //var useful_menu = localStorage.getItem("useful_menu");

                        //if (useful_menu) {
                        //	var items = JSON.parse(useful_menu);
                        //                      scope.destination = items;
                        //                      if (scope.destination.length <= 0) {

                        //		$rootScope.usefulmenu = false
                        //	} else {
                        //		$rootScope.usefulmenu = true
                        //	}	
                        //                  } 

                    });

                }
            }

        }]);
});