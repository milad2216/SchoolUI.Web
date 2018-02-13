debugger
define(['angularAMD'], function (angularAMD) {
    var app = angular.module("app", [
        'ui.router',
        'ngSanitize',
        'ngAnimate',
        'ui-notification',
        'ui.bootstrap',
        'blockUI',
        'kendo.directives'
    ])

    app.config(function ($logProvider) {
        $logProvider.debugEnabled(false);
    });

    app.config(function (blockUIConfigProvider) {
        blockUIConfigProvider.message("");
        blockUIConfigProvider.delay(1);
        blockUIConfigProvider.autoBlock(false);
    });

    app.config(["NotificationProvider", function (notificationProvider) {
        notificationProvider.options.positionX = "right";
        notificationProvider.options.positionY = "top";
        //    = {
        //    delay: 5e3,
        //    startTop: 10,
        //    startRight: 10,
        //    verticalSpacing: 10,
        //    horizontalSpacing: 10,
        //    positionX: "right",
        //    positionY: "top",
        //    replaceMessage: !1,
        //    templateUrl: "angular-ui-notification.html"
        //}
        notificationProvider.setOptions(notificationProvider.options);
    }]);

    app.config(function ($controllerProvider, $provide, $compileProvider, $filterProvider, $httpProvider) {
        app.register = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };

    });
    app.config(["$locationProvider", '$provide', function ($locationProvider, $provide) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $locationProvider.hashPrefix('!');


    }]);
    app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/main"),
        $stateProvider
            .state('teacherSearch', angularAMD.route(
                {
                    url: '/teacherSearch',
                    controller: 'teacherSearchController',
                    controllerUrl: '/app/base/views/schoolManager/teacher/teacherSearchController.js',
                    templateUrl: '/app/base/views/schoolManager/teacher/teacherSearch.html'

                }))
            .state('teacherCrud', angularAMD.route(
                {
                    url: '/teacherCrud',
                    controller: 'teacherCrudController',
                    controllerUrl: '/app/base/views/schoolManager/teacher/teacherCrudController.js',
                    templateUrl: '/app/base/views/schoolManager/teacher/teacherCrud.html',
                    params: {
                        teacher: {},
                        mode: "create"
                    }

                }))
            .state('payment', angularAMD.route(
                {
                    url: '/payment',
                    controller: 'paymentController',
                    controllerUrl: '/app/base/views/schoolManager/payment/paymentController.js',
                    templateUrl: '/app/base/views/schoolManager/payment/payment.html',
                    params: {

                    }
                }))
          .state('login', angularAMD.route(
                {
                    title: 'ورود به سیستم',
                    url: '/login',
                    controller: 'loginController',
                    controllerUrl: '/app/base/views/login/loginController.js',
                    views: {
                        'login': {
                            templateUrl: '/app/base/views/login/login.html',
                        },
                    }
                }))
            .state('schoolClasses', angularAMD.route(
                {
                    url: '/schoolClasses',
                    controller: 'schoolClassesController',
                    controllerUrl: '/app/base/views/schoolManager/SchoolClasses/schoolClassesController.js',
                    templateUrl: '/app/base/views/schoolManager/SchoolClasses/schoolClasses.html'

                }))
            .state('studentSearch', angularAMD.route(
                {
                    url: '/studentSearch',
                    controller: 'studentSearchController',
                    controllerUrl: '/app/base/views/schoolManager/student/studentSearchController.js',
                    templateUrl: '/app/base/views/schoolManager/student/studentSearch.html'

                }))
            .state('studentCrud', angularAMD.route(
                {
                    url: '/studentCrud',
                    controller: 'studentCrudController',
                    controllerUrl: '/app/base/views/schoolManager/student/studentCrudController.js',
                    templateUrl: '/app/base/views/schoolManager/student/studentCrud.html',
                    params: {
                        student: {},
                        mode: "create"
                    }

                }))
            .state('employeeSearch', angularAMD.route(
                {
                    url: '/employeeSearch',
                    controller: 'employeeSearchController',
                    controllerUrl: '/app/base/views/schoolManager/employee/employeeSearchController.js',
                    templateUrl: '/app/base/views/schoolManager/employee/employeeSearch.html'

                }))
            .state('employeeCrud', angularAMD.route(
                {
                    url: '/employeeCrud',
                    controller: 'employeeCrudController',
                    controllerUrl: '/app/base/views/schoolManager/employee/employeeCrudController.js',
                    templateUrl: '/app/base/views/schoolManager/employee/employeeCrud.html',
                    params: {
                        employee: {},
                        mode: "create"
                    }

                }))
            .state('driverSearch', angularAMD.route(
                {
                    url: '/driverSearch',
                    controller: 'driverSearchController',
                    controllerUrl: '/app/base/views/schoolManager/driver/driverSearchController.js',
                    templateUrl: '/app/base/views/schoolManager/driver/driverSearch.html'

                }))
            .state('driverCrud', angularAMD.route(
                {
                    url: '/driverCrud',
                    controller: 'driverCrudController',
                    controllerUrl: '/app/base/views/schoolManager/driver/driverCrudController.js',
                    templateUrl: '/app/base/views/schoolManager/driver/driverCrud.html',
                    params: {
                        driver: {},
                        mode: "create"
                    }

                }))
            .state('gradeAcademicYear', angularAMD.route(
                {
                    url: '/gradeAcademicYear',
                    controller: 'gradeAcademicYearController',
                    controllerUrl: '/app/base/views/schoolManager/gradeAcademicYear/gradeAcademicYearController.js',
                    templateUrl: '/app/base/views/schoolManager/gradeAcademicYear/gradeAcademicYear.html'

                }))
            .state('main', angularAMD.route(
                {
                    url: '/main',
                    controller: 'mainController',
                    controllerUrl: '/app/base/views/main/mainController.js',
                    templateUrl: '/app/base/views/main/main.html'

                }))
            .state('schoolCourse', angularAMD.route(
                {
                    url: '/schoolCourse',
                    controller: 'schoolCourseController',
                    controllerUrl: '/app/base/views/schoolManager/schoolCourse/schoolCourseController.js',
                    templateUrl: '/app/base/views/schoolManager/schoolCourse/schoolCourse.html'

                }))
            .state('property', angularAMD.route(
                {
                    url: '/property',
                    controller: 'propertyController',
                    controllerUrl: '/app/base/views/schoolManager/property/propertyController.js',
                    templateUrl: '/app/base/views/schoolManager/property/property.html'

                }))
            .state('studentRequestSearch', angularAMD.route(
                {
                    url: '/studentRequestSearch',
                    controller: 'studentRequestSearchController',
                    controllerUrl: '/app/base/views/student/request/studentRequestSearchController.js',
                    templateUrl: '/app/base/views/student/request/studentRequestSearch.html'

                }))
            .state('studentRequestCrud', angularAMD.route(
                {
                    url: '/studentRequestCrud',
                    controller: 'studentRequestCrudController',
                    controllerUrl: '/app/base/views/student/request/studentRequestCrudController.js',
                    templateUrl: '/app/base/views/student/request/studentRequestCrud.html',
                    params: {
                        studentRequest: {},
                        mode: "create"
                    }

                }))
            .state('payItemSearch', angularAMD.route(
                {
                    url: '/payItemSearch',
                    controller: 'payItemSearchController',
                    controllerUrl: '/app/base/views/schoolManager/payItem/payItemSearchController.js',
                    templateUrl: '/app/base/views/schoolManager/payItem/payItemSearch.html'

                }))
            .state('payItemCrud', angularAMD.route(
                {
                    url: '/payItemCrud',
                    controller: 'payItemCrudController',
                    controllerUrl: '/app/base/views/schoolManager/payItem/payItemCrudController.js',
                    templateUrl: '/app/base/views/schoolManager/payItem/payItemCrud.html',
                    params: {
                        payItem: {},
                        mode: "create"
                    }

                }))
            .state('disciplineItemSearch', angularAMD.route(
                {
                    url: '/disciplineItemSearch',
                    controller: 'disciplineItemSearchController',
                    controllerUrl: '/app/base/views/schoolManager/disciplineItem/disciplineItemSearchController.js',
                    templateUrl: '/app/base/views/schoolManager/disciplineItem/disciplineItemSearch.html'

                }))
            .state('disciplineItemCrud', angularAMD.route(
                {
                    url: '/disciplineItemCrud',
                    controller: 'disciplineItemCrudController',
                    controllerUrl: '/app/base/views/schoolManager/disciplineItem/disciplineItemCrudController.js',
                    templateUrl: '/app/base/views/schoolManager/disciplineItem/disciplineItemCrud.html',
                    params: {
                        disciplineItem: {},
                        mode: "create"
                    }

                }))
            .state('message', angularAMD.route(
                {
                    url: '/message',
                    controller: 'messageController',
                    controllerUrl: '/app/base/views/message/messageController.js',
                    templateUrl: '/app/base/views/message/message.html'
                }))
            .state('requestManagmentSearch', angularAMD.route(
                {
                    url: '/requestManagmentSearch',
                    controller: 'requestManagmentSearchController',
                    controllerUrl: '/app/base/views/schoolManager/requestManagment/requestManagmentSearchController.js',
                    templateUrl: '/app/base/views/schoolManager/requestManagment/requestManagmentSearch.html'

                }))
            .state('requestView', angularAMD.route(
                {
                    url: '/requestView',
                    controller: 'requestViewController',
                    controllerUrl: '/app/base/views/schoolManager/requestManagment/requestViewController.js',
                    templateUrl: '/app/base/views/schoolManager/requestManagment/requestView.html',
                    params: {
                        studentRequest: {},
                        mode: "view"
                    }
                }))
            .state('rollCall', angularAMD.route(
                {
                    url: '/rollCall',
                    controller: 'rollCallController',
                    controllerUrl: '/app/base/views/schoolManager/rollCall/rollCallController.js',
                    templateUrl: '/app/base/views/schoolManager/rollCall/rollCall.html'
                }))
            .state('teacherSchoolClass', angularAMD.route(
                {
                    url: '/teacherSchoolClass',
                    controller: 'teacherSchoolClassController',
                    controllerUrl: '/app/base/views/teacher/teacherSchoolClass/teacherSchoolClassController.js',
                    templateUrl: '/app/base/views/teacher/teacherSchoolClass/teacherSchoolClass.html'
                }))
            .state('questionSearch', angularAMD.route(
                {
                    url: '/questionSearch',
                    controller: 'questionSearchController',
                    controllerUrl: '/app/base/views/teacher/question/questionSearchController.js',
                    templateUrl: '/app/base/views/teacher/question/questionSearch.html'
                }))
            .state('questionCrud', angularAMD.route(
                {
                    url: '/questionCrud',
                    controller: 'questionCrudController',
                    controllerUrl: '/app/base/views/teacher/question/questionCrudController.js',
                    templateUrl: '/app/base/views/teacher/question/questionCrud.html',
                    params: {
                        disciplineItem: {},
                        mode: "create"
                    }

                }))
    }]);

    app.constant('variables', {
        header_main_height: 48,
        easing_swiftOut: [0.4, 0, 0.2, 1],
        bez_easing_swiftOut: "bez_0p4,0,0.2,1"
    });
    app.constant('RESOURCES', (function () {
        // Define your variable
        //var resource = 'http://localhost:8080';
        var resource = 'http://rubikplus.somee.com';
        // Use the variable in your constants
        return {
            USERS_DOMAIN: resource,
            USERS_API: resource + '/users',
            BASIC_INFO: resource + '/api/info'
        }
    })());
    app.run(['$rootScope', '$state', '$stateParams', '$http', '$window', '$timeout', 'dataService', 'RESOURCES',
        function ($rootScope, $state, $stateParams, $http, $window, $timeout, dataService, RESOURCES) {

            $rootScope.statusforlayout = false;
            $rootScope.statusforlogin = false;
            var firstLoad = true;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                debugger;
                var lt = localStorage.getItem('lt');
                if (!fromState.name && firstLoad) {
                    firstLoad = false;
                    event.preventDefault();
                    dataService.getData(RESOURCES.USERS_DOMAIN + "/api/CheckLogin").then(function (data) {
                        debugger;
                        $rootScope.statusforlayout = true;
                        $rootScope.statusforlogin = false;
                        $state.go("main");
                    }, function (err) {
                        debugger;
                        $rootScope.statusforlayout = false;
                        $rootScope.statusforlogin = true;
                        $state.go("login");
                    })
                }

            })


            var w = angular.element($window);
            $rootScope.largeScreen = w.width() >= 1220;

            w.on('resize', function () {
                return $rootScope.largeScreen = w.width() >= 1220;
            });
            $rootScope.primarySidebarOpen = $rootScope.largeScreen;
        }
    ])

    var indexController = function ($scope, $rootScope, $http, $state) {
        debugger

        $scope.closeTab = function () {
            $state.featureTab.Show = false;
            //$state.go("main");
        }

        $scope.logout = function () {
            debugger
            localStorage.removeItem('lt');
            $rootScope.statusforlayout = false;
            $rootScope.statusforlogin = true;
            $state.go("login");
        }

        $scope.clickAction = function (data) {
            debugger
            $scope.featureTab = { Title: data.Title, Show: true }
        }

        $scope.initializeController = function () {
            debugger;

        }
    };
    app.config(function ($httpProvider) {
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
    });

    //app.config(["$httpProvider",
    //function ($httpProvider) {
    //    $httpProvider.responseInterceptors.push(function ($q) {
    //        return {
    //            'requestError': function (rejection) {
    //                // handle same as below
    //            },

    //            'responseError': function (rejection) {
    //                if (canRecover(rejection)) {
    //                    // if you can recover then don't call q.reject()
    //                    // will go to success handlers
    //                    return responseOrNewPromise;
    //                }

    //                // !!Important Must use promise api's q.reject()
    //                // to properly implement this interceptor
    //                // or the response will go the success handler of the caller
    //                return $q.reject(rejection);
    //            }
    //        };
    //    });
    //}
    //]);

    indexController.$inject = ['$scope', '$rootScope', '$http', '$state'];
    app.controller("mainController", indexController);

    app.bootstrap = function () {
        angularAMD.bootstrap(app);
    };
    return app;
});
