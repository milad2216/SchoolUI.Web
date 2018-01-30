﻿debugger
define(['angularAMD'], function (angularAMD) {
    var app = angular.module("app", [
        'ui.router',
        'ngSanitize',
        'ngAnimate',
        'ui-notification',
        'ui.bootstrap',
        'blockUI',
        'kendo.directives',
    ])

    app.config(function ($logProvider) {
        $logProvider.debugEnabled(false);
    });

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
        $urlRouterProvider.otherwise("main"),
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
            .state('adminSearch', angularAMD.route(
                {
                    url: '/adminSearch',
                    controller: 'adminSearchController',
                    controllerUrl: '/app/base/views/admin/main/adminSearchController.js',
                    templateUrl: '/app/base/views/admin/main/adminSearch.html',
                    params: {

                    }
                }))
             //.state('adminSearch.milad', angularAMD.route(
             //   {
             //      url : '',
             //       controllerUrl: '/app/base/views/admin/child/adminChild1SearchController.js',
             //       views: {
             //           'majid': {
             //                controller: 'adminChild1SearchController',
             //               templateUrl: '/app/base/views/admin/child/adminChild1Search.html',
             //           }
             //       }
             //   }))
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
    app.run(['$rootScope', '$state', '$stateParams', '$http', '$window', '$timeout',
        function ($rootScope, $state, $stateParams, $http, $window, $timeout) {

            $rootScope.statusforlayout = false;
            $rootScope.statusforlogin = false;
            var firstLoad = true;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                debugger;
                var lt = localStorage.getItem('lt');
                if (!fromState.name && firstLoad) {
                    firstLoad = false;
                    var lt = localStorage.getItem('lt');
                    event.preventDefault();
                    if (lt) {
                        $rootScope.statusforlayout = true;
                        $rootScope.statusforlogin = false;
                        $state.go("main");
                    }
                    else {
                        $rootScope.statusforlayout = false;
                        $rootScope.statusforlogin = true;
                        $state.go("login");
                    }
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
