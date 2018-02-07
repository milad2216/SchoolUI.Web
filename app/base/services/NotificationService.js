define(['angularAMD'], function (app) {
    app.service('notificationService', ['$state', '$q', '$rootScope', 'Notification', function ($state, $q, $rootScope, Notification) {
        
        return {

            showSingle: function (message, type) {
                Notification;
            },

            updateEntity: function (url, entity) {


                blockUI.start();
                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                $http.put(url, entity, {
                    headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    deferred.resolve(response.data);
                    blockUI.stop();
                }, function (er) {

                    deferred.reject(DispatchErrReponse(er));
                    blockUI.stop();
                });
                return deferred.promise;
            },

            patchEntity: function (url, entity) {


                blockUI.start();
                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                $http.patch(url, entity, {
                    headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    deferred.resolve(response.data);
                    blockUI.stop();
                }, function (er) {
                    deferred.reject(DispatchErrReponse(er));
                    blockUI.stop();
                });
                return deferred.promise;
            },
            addEntity: function (url, entity) {

                blockUI.start();
                var then = this;
                var deferred = $q.defer();

                var aut = JSON.parse(localStorage.getItem("lt"));
                $http.post(url, entity, {
                    headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    deferred.resolve(response.data);
                    blockUI.stop();
                }, function (er) {
                    deferred.reject(DispatchErrReponse(er));
                    blockUI.stop();
                });
                return deferred.promise;
            },
            postData: function (url, data) {

                blockUI.start();
                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                $http({
                    Method: 'POST', url: url, params: data, headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    deferred.resolve(response.data);
                    blockUI.stop();
                }, function (er) {
                    deferred.reject(DispatchErrReponse(er));
                    blockUI.stop();
                });
                return deferred.promise;
            },
            deleteEntity: function (url, id) {

                blockUI.start();
                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                $http({
                    Method: 'DELETE', url: url + '/' + id, headers: {
                        'Authorization': aut.token_type + ' ' + aut.access_token,
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    deferred.resolve(response.data);
                    blockUI.stop();
                }, function (er) {
                    deferred.reject(DispatchErrReponse(er));
                    blockUI.stop();
                });
                return deferred.promise;
            },
            postUnauthorizedData: function (url, data) {

                blockUI.start();
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
                    }).then(function (response) {
                        deferred.resolve(response.data);
                        blockUI.stop();
                    }, function (er) {
                        deferred.reject(DispatchErrReponse(er));
                        blockUI.stop();
                    });
                return deferred.promise;
            }
        }
    }])
});

