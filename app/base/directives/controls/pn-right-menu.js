debugger
define(['angularAMD'], function (control) {
    control.directive('pnRightMenu', ['$rootScope', '$state', 'variables', "Notification",
        function ($rootScope, $state, variables, notify) {
            return {
                restrict: 'E',
                replace: false,
                scope: {
                    api: "=",
                    fabSheet: "&",
                    clickAction: "&"
                },
                templateUrl: '/app/base/partials/directives/pn-right-menu.html',
                controller: function ($scope) {
                    $rootScope.sections = [];
                    $rootScope.sections.push({
                        SystemTitle: "اطلاعات پایه", SystemKey: '05e77746-d179-e711-966b-000c29eedd59',
                        Childs: [{ Title: "کلاس", Action: "schoolClasses" }, { Title: "دانش آموز", Action: "studentSearch" },
                            { Title: "کارمند", Action: "employeeSearch" }, { Title: "معلم", Action: "teacherSearch" },
                            { Title: "راننده", Action: "driverSearch" }, { Title: "شهریه", Action: "gradeAcademicYear" },
                        { Title: "معلم کلاس", Action: "schoolCourse" }, { Title: "بایگانی", Action: "property" }]
                    });
                    $rootScope.sections.push({
                        SystemTitle: "مالی", SystemKey: '30f8678d-dffb-e611-ac4f-38d54778b1eb',
                        Childs: [{ Title: "ثبت چک", Action: "adminSearch" }, { Title: "پرداخت های غیر شهریه", Action: "admin" }]
                    });
                    $rootScope.sections.push({ SystemTitle: "مدیریت سیستم", SystemKey: '1f65a61c-ce79-e711-966b-000c29eedd59', Childs: [{ Title: "تست" }] });
                    $rootScope.sections.push({ SystemTitle: "گزارشات سیستم", SystemKey: '1a58337f-ea03-e711-ac51-38d54778b1eb', Childs: [{ Title: "تست" }] });
                },
                link: function ($scope, $elem, $attrs) {

                    $scope.safeApply = function (fn) {
                        var phase = this.$root.$$phase;
                        if (phase === '$apply' || phase === '$digest') {
                            if (fn && (typeof (fn) === 'function')) {
                                fn();
                            }
                        } else {
                            this.$apply(fn);
                        }
                    };
                    var setTimeoutDis = null;
                    $scope.menuTimeout = function () {
                        if (setTimeoutDis) {
                            clearTimeout(setTimeoutDis);
                        }
                        setTimeoutDis = setTimeout(function () {
                            $scope.safeApply(function () {

                                $scope.useful = false;
                            });
                        }, 30000);
                    }

                    $scope.api = {};


                    $scope.api.menuu = function () {

                        $scope.useful = $scope.useful === false ? true : false;
                        $scope.useful = true;
                        $scope.menuTimeout();

                    }

                    var usefullmenu = [];
                    $scope.addItem = function (item, system) {

                        $scope.useful = true;

                        $scope.menuTimeout();

                        item.TotalCode = system.SystemTotalCode;
                        item.Key = system.SystemKey;
                        $scope.fabSheet({ item: item });
                    }

                    $scope.submenuToggle = function ($event, status) {
                        $event.preventDefault();
                        var $sidebar_main = $('#sidebar_main');
                        var $this = $($event.currentTarget),
                            slideToogle = $this.next('ul').is(':visible') ? 'slideUp' : 'slideDown';
                        if (!status) {
                            $this.next('ul')
                                .velocity(slideToogle, {
                                    duration: 400,
                                    easing: variables.easing_swiftOut,
                                    begin: function () {
                                        if (slideToogle === 'slideUp') {
                                            $(this).closest('.submenu_trigger').removeClass('act_section')
                                        } else {

                                            $(this).closest('.submenu_trigger').addClass('act_section')
                                        }
                                    },
                                    complete: function () {
                                        if (slideToogle !== 'slideUp') {

                                            var scrollContainer = $sidebar_main.find(".scroll-content").length ? $sidebar_main.find(".scroll-content") : $sidebar_main.find(".scrollbar-inner");
                                            $this.closest('.act_section').velocity("scroll", {

                                                duration: 500,
                                                easing: variables.easing_swiftOut,
                                                container: scrollContainer
                                            });
                                        }
                                    }
                                });
                        }
                        else {
                            if (slideToogle === "slideUp") {
                                $this.next('ul').slideUp(100);
                                $this.next('ul').closest('.submenu_trigger').removeClass('act_section')
                            }
                            else {
                                $this.next('ul').slideDown(100);
                                $this.next('ul').closest('.submenu_trigger').addClass('act_section')
                            }
                        }
                    }

                    $scope.featureClick = function (action, title) {
                        if (action) {
                            $scope.clickAction({ data: { Action: action, Title: title } });
                            $state.go(action);
                        }
                    }

                }
            }
        }]);
});