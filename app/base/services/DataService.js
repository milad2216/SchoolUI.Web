define(['angularAMD'], function (app) {
    app.service('dataService', ['$state', '$http', '$q', '$rootScope', '$httpParamSerializerJQLike', 'blockUI', 'Notification', function ($state, $http, $q, $rootScope, $httpParamSerializerJQLike, blockUI, Notification) {
        var DispatchErrReponse = function (er) {
            if (er.status === 400 || er.status === 500) {
                if (er.data.ErrorMessage) {
                    Notification.error(er.data.ErrorMessage)
                }
                angular.forEach(er.data.ModelState, function (value, key) {
                    Notification.error(value[0]);
                });
                if (er.data.error_description) {
                    Notification.error(er.data.error_description);
                }
            } else
                if (er.status === 401) {
                    $state.go("main");
                }
            return er;
        }
        return {
            DispatchErrReponseForKendo: function (e) {
                if (e.xhr.status === 400 || e.xhr.status === 500) {
                    if (e.xhr.responseJSON.Message) {
                        Notification.error(e.xhr.responseJSON.Message)
                    }
                    angular.forEach(e.xhr.responseJSON.ModelState, function (value, key) {
                        Notification.error(value[0]);
                    });
                } else
                    if (e.xhr.status === 401) {
                        $state.go("main");
                    }
                return DispatchErrReponse(e);
            },
            getData: function (url, filterInfo) {
                blockUI.start();
                var then = this;
                var deferred = $q.defer();
                var aut = JSON.parse(localStorage.getItem("lt"));
                if (!aut) {
                    aut = {
                        token_type: "",
                        access_token: ""
                    }
                }
                $http({
                    Method: 'GET', url: url, params: filterInfo, headers: {
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

