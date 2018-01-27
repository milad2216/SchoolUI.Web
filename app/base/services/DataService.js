define(['angularAMD'], function (app) {
    app.service('dataService', ['$state', '$http', '$q', '$rootScope', '$httpParamSerializerJQLike', function ($state, $http, $q, $rootScope, $httpParamSerializerJQLike) {

        return {

            getData: function (url, filterInfo) {

                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                $http({
                    Method: 'GET', url: url, params: filterInfo, headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).success(function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            },

            updateEntity: function (url, entity) {


                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                $http.put(url, entity, {
                    headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).success(function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
                //blockUI.start();
                //var deferred = $q.defer();
                //var then = this;
                //$http.put(url, entity).success(function (response) {
                //    deferred.resolve(response);
                //    //blockUI.stop();
                //});
                //return deferred.promise;
            },
            addEntity: function (url, entity) {

                var then = this;
                var deferred = $q.defer();

                var aut = JSON.parse(localStorage.getItem("lt"));
                $http.post(url, entity, {
                    headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).success(function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
                //blockUI.start();
                //var deferred = $q.defer();
                //var then = this;
                //$http.post(url, entity).success(function (response) {
                //    deferred.resolve(response);
                //});
                //return deferred.promise;
            },
            postData: function (url, data) {

                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                $http({
                    Method: 'POST', url: url, params: data, headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).success(function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
                //blockUI.start();
                //var deferred = $q.defer();
                //var then = this;
                //$http.post(url, data).success(function (response) {
                //    deferred.resolve(response);
                //    //blockUI.stop();
                //});
                //return deferred.promise;
            },
            deleteEntity: function (url, id) {

                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                $http({
                    Method: 'DELETE', url: url + '/' + id, headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).success(function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
                //blockUI.start();
                //var deferred = $q.defer();
                //var then = this;
                //$http.delete(url + id).success(function (response) {
                //    deferred.resolve(response);
                //});
                //return deferred.promise;
            },
            postUnauthorizedData: function (url, data) {

                //var then = this;
                //var deferred = $q.defer();
                //$http({
                //    Method: 'POST', url: url, params: data, headers: {
                //        'Content-Type': 'application/x-www-form-urlencoded'
                //    }
                //}).success(function (response) {
                //    deferred.resolve(response);
                //});
                //return deferred.promise;
                //blockUI.start();
                var deferred = $q.defer();
                var then = this;
                var parsed = [];
                angular.forEach(data, function (value, key) {
                    parsed.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                });
                var parsedData = parsed.join('&');
                $http.post(url, parsedData,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (response) {
                        deferred.resolve(response);
                        //blockUI.stop();
                    });
                return deferred.promise;
            }
        }
    }])
});

