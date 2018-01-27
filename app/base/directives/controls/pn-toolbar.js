
define(['angularAMD'], function (control) {
    control.directive('pnToolbar', ["pn.toolbar.service",
        function (toolbarService) {
            return {
                restrict: 'EA',
                replace: true,
                templateUrl: '/app/base/partials/directives/pn-toolbar.html',
                controller: ['$scope', '$element', '$attrs',
                    function ($scope, $element, $attrs) {

                    $scope.DoInsert = function () {
                        toolbarService.DoInsert();
                    }

                    $scope.DoEdit = function () {
                        toolbarService.DoEdit();
                    }

                    $scope.DoDelete = function () {
                        toolbarService.DoDelete();
                    }

                    $scope.DoApplay = function () {
                        toolbarService.DoApplay();
                    }
                    $scope.DoCancel = function () {
                        toolbarService.DoCancel();
                    }
                    $scope.DoReport = function () {
                        toolbarService.DoArchive();
                    }

                    $scope.DoArchive = function () {
                        toolbarService.DoInsert();
                    }
                    $scope.DoWorkflow = function () {
                        toolbarService.DoWorkflow();
                    }
                    $scope.DoRefresh = function () {
                        toolbarService.DoRefresh();
                    }
                    $scope.DoLoadlog = function () {
                        toolbarService.DoLoadlog();
                    }
                    $scope.DoLog = function () {
                        toolbarService.DoLog();
                    }

                        $scope.DoBtnUser1 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser1();
                        }
                        $scope.DoBtnUser2 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser2();
                        }
                        $scope.DoBtnUser3 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser3();
                        }
                        $scope.DoBtnUser4 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser4();
                        }
                        $scope.DoBtnUser5 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser5();
                        }
                        $scope.DoBtnUser6 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser6();
                        }
                        $scope.DoBtnUser7 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser7();
                        }
                        $scope.DoBtnUser8 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser8();
                        }
                        $scope.DoBtnUser9 = function () {
                            var formScope = getActiveFormScope();
                            formScope.doBtnUser9();
                        }
                        $scope.$on("toolbar:doEdit", function () {
                            $scope.DoEdit();
                        });
                        $scope.$on("toolbar:doInsert", function () {
                            $scope.DoInsert();
                        });
                        $scope.$on("toolbar:doDelete", function () {
                            $scope.DoDelete();
                        });
                        $scope.$on("toolbar:doApplay", function () {
                            $scope.DoApplay();
                        });
                        $scope.$on("toolbar:doCancel", function () {
                            $scope.DoCancel();
                        });
                        $scope.$on("toolbar:DoBtnUser1", function () {
                            $scope.DoBtnUser1();
                        });
                        $scope.$on("toolbar:DoBtnUser2", function () {
                            $scope.DoBtnUser2();
                        });
                        $scope.formInfo = function () {
                            var formDetails = [$rootScope.currentForm.title,
                            $rootScope.currentForm.action,
                            $rootScope.currentForm.systemTotalCode,
                            $rootScope.currentForm.featureId].join(',');
                        }

                    //})();

                    $scope.setEnableApplyAndCancelButton = function (stausButton) {
                        angular.forEach($rootScope.currentTab.toolbar, function (item, index) {
                            if (item.LatinName == 'Cancel' || item.LatinName == 'Apply' ||
                                item.LatinName == 'Delete' || item.LatinName == 'Add' || item.LatinName == 'Edit') {

                                if (stausButton) {
                                    item.Disabled = '';
                                }
                                else {
                                    item.Disabled = 'disabled';
                                }
                            }
                        });
                    };


                    $scope.setEnableButton = function (stausButton) {
                        for (var i = 0; i < $rootScope.currentTab.toolbar.length; i++) {
                            $rootScope.currentTab.toolbar[i].Disabled = "";
                            if (!stausButton && $rootScope.currentTab.toolbar[i].Order < 1004) {
                                $rootScope.currentTab.toolbar[i].Disabled = "disabled";
                            }
                            else if (stausButton && $rootScope.currentTab.toolbar[i].Order > 1003 && $rootScope.currentTab.toolbar[i].Order < 1006) {
                                $rootScope.currentTab.toolbar[i].Disabled = "disabled";
                            }
                        }
                    };

                    $scope.$on("toolbar:DoRibbonFalse", function () {
                        $rootScope.currentTab.mode = "";
                        $scope.SetEnableButton(false);
                    });
                    $scope.$on("toolbar:DoRibbonTrue", function () {
                        $rootScope.currentTab.mode = "";
                        $scope.SetEnableButton(true);

                    });
                    $scope.$on("toolbar:DoMainOperationTrue", function () {
                        $scope.SetEnableApplyAndCancelButton(true);
                    });
                    $scope.$on("toolbar:DoMainOperationFalse", function () {
                        $scope.SetEnableApplyAndCancelButton(false);
                    });
                    $scope.$on("toolbar:DoAddAndDeleteFalse", function () {
                        $scope.SetEnableAddAndDeleteButton(false);
                    });
                    $scope.$on("toolbar:DoUser1AndUser2False", function () {
                        $scope.SetEnableExtraButton(false);
                    });
                    $scope.$on("toolbar:DoUser1AndUser2True", function () {
                        $scope.SetEnableExtraButton(true);
                    });
                    $scope.SetEnableButton = function (stausButton) {

                        angular.forEach($rootScope.currentTab.toolbar, function (item, index) {

                            if (item.LatinName == 'Delete' || item.LatinName == 'Add' || item.LatinName == 'Edit') {
                                if (stausButton == true) {
                                    item.Disabled = '';
                                }
                                else {
                                    item.Disabled = 'disabled';
                                }
                            }
                            else if (item.LatinName == 'Cancel' || item.LatinName == 'Apply') {
                                if (stausButton == true) {
                                    item.Disabled = 'disabled';
                                }
                                else {
                                    item.Disabled = '';
                                }
                            }
                        });

                    };
                    $scope.SetEnableAddAndDeleteButton = function (stausButton) {
                        angular.forEach($rootScope.currentTab.toolbar, function (item, index) {
                            if (item.LatinName == 'Cancel' || item.LatinName == 'Apply' ||
                                item.LatinName == 'Delete' || item.LatinName == 'Add') {

                                if (stausButton) {
                                    item.Disabled = '';
                                }
                                else {
                                    item.Disabled = 'disabled';
                                }
                            }
                        });

                    };
                    $scope.SetEnableApplyAndCancelButton = function (stausButton) {
                        angular.forEach($rootScope.currentTab.toolbar, function (item, index) {
                            if (item.LatinName == 'Cancel' || item.LatinName == 'Apply' ||
                                item.LatinName == 'Delete' || item.LatinName == 'Add' || item.LatinName == 'Edit') {

                                if (stausButton) {
                                    item.Disabled = '';
                                }
                                else {
                                    item.Disabled = 'disabled';
                                }
                            }
                        });

                    };
                    $scope.SetEnableExtraButton = function (stausButton) {
                        angular.forEach($rootScope.currentTab.toolbar, function (item, index) {
                            if (item.LatinName == 'User1' || item.LatinName == 'User2' || item.LatinName == 'User3' || item.LatinName == 'User4') {
                                if (stausButton) {
                                    item.Disabled = '';
                                }
                                else {
                                    item.Disabled = 'disabled';
                                }
                            }
                        });

                    };

                    if ($attrs.status) {
                        $attrs.$observe('status', function (tool) {
                            if (tool) {
                                var tools = tool.split(',');
                                for (var i = 0; i < tools.length; i++) {
                                    switch (tools[i].toLowerCase()) {
                                        case "doribbonfalse":
                                            $rootScope.currentTab.mode = "";
                                            $scope.SetEnableButton(false); break;

                                        case "doribbontrue":
                                            $rootScope.currentTab.mode = "";
                                            $scope.SetEnableButton(true); break;

                                        case "domainoperationtrue":
                                            $scope.SetEnableApplyAndCancelButton(true); break;

                                        case "domainoperationfalse":
                                            $scope.SetEnableApplyAndCancelButton(false); break;

                                        case "doaddanddeletefalse":
                                            $scope.SetEnableAddAndDeleteButton(false); break;

                                        case "douser1anduser2false":
                                            $scope.SetEnableExtraButton(false); break;

                                        case "douser1anduser2true":
                                            $scope.SetEnableExtraButton(true); break;

                                        case "doedit": $scope.DoEdit(); break;
                                        case "doinsert": $scope.DoInsert(); break;
                                        case "dodelete": $scope.DoDelete(); break;
                                        case "doapplay": $scope.DoApplay(); break;
                                        case "docancel": $scope.DoCancel(); break;
                                        case "dobtnuser1": $scope.DoBtnUser1(); break;
                                        case "dobtnuser2": $scope.DoBtnUser2(); break;
                                    }
                                }
                            }
                        });
                    }





                    //$scope.$watch("$root.currentTab", function (newValue, oldValue) {
                    //    if (newValue) {
                    //        getToolbar();
                    //    }
                    //}, true);
                }]
            };
        }]);
});