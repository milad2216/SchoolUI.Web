define(['angularAMD'], function (app) {
    app.factory("pn.remote.service", ["$http", "$q", "localStorageService", "AuthToken", "AuthRefreshToken", "$state", "Notification", "PREFIX_RESPONSE", "userMgmtWebAccess", "pn.errorHandler", "ClientID","blockUI",
        function ($http, $q, localStorageService, tokenKey, refreshTokenKey, $state, notification, PREFIX_RESPONSE, WebAccess, errorHandler, clientID, blockUI) {

            var xhrProto = XMLHttpRequest.prototype,
                origOpen = xhrProto.open;

            xhrProto.open = function (method, url) {
                this._url = url;
                return origOpen.apply(this, arguments);
            };
            var apiPattern = /\/api\//;
            (function (send) {
                XMLHttpRequest.prototype.send = function (data) {
                    if (this._url && apiPattern.test(this._url)) {
                        if (this._url.indexOf("10.1.80.44:9000") > -1) {
                            send.call(this, data);
                            return;
                        }
                        this.setRequestHeader(tokenKey, localStorageService.get(tokenKey));
                        this.setRequestHeader(refreshTokenKey, localStorageService.get(refreshTokenKey));
                        this.setRequestHeader(clientID, localStorageService.get(clientID));


                        this.withCredentials = false;
                        this.orgOnload = this.onload;
                        this.onload = function () {

                            var token = this.getResponseHeader(tokenKey.toLocaleLowerCase())
                            if (token != null) {
                                localStorageService.set(tokenKey, token);
                            }

                            if (this.status == 401) {
                                if (this.replay) {

                                } else if (this.refreshToken) {

                                } else {
                                    //todo Mr.Panahi
                                    $state.go("login");
                                }
                            }
                            else if (this.status == 500) {
                                var _response = JSON.parse(this.response);
                                if (!_response.Success)
                                    //todo 
                                    errorHandler.ShowError(_response);

                            }
                            if (this.orgOnload)
                                this.orgOnload.call(null, arguments);
                        }
                    }
                    send.call(this, data);

                };

            })(XMLHttpRequest.prototype.send);


            function createErrorHandler(defferd) {
                return function errorHandler(response) {
                    if (response) {
                        if (response.Message)
                            notification.error(response.Message);
                        if (response.StackTrace) {
                            notification.error(response.StackTrace);
                        }

                    }

                    defferd.reject(response);
                }
            }
            function callBackData(setMethod, listApi) {
                var fn = function (res) {
                    return res;
                };
                var promises = [];
                for (var i = 0; i < listApi.length; i++) {
                    promises.push(this.post({}, listApi[i]).then(fn))
                }
                return $q.all(promises).then(function (data) {
                    return setMethod(data);
                });
            }
            function callBackDataParameters(setMethod, listApi) {
                var fn = function (res) {
                    return res;
                };
                var promises = [];
                for (var i = 0; i < listApi.length; i++) {
                    promises.push(this.post(listApi[i].parameters, listApi[i].url).then(fn))
                }
                return $q.all(promises).then(function (data) {
                    return setMethod(data);
                });
            }

            function get(id, url) {
                var defferd = $q.defer();
                if (id != null) {
                    $http.get(url + '?id=' + id)
                        .success(function (result) { defferd.resolve(result); })
                        .error(createErrorHandler(defferd));
                    return defferd.promise;
                }
                else {
                    $http.get(url)
                        .success(function (result) { defferd.resolve(result); })
                        .error(createErrorHandler(defferd));
                    return defferd.promise;
                }
            }
            function post(entity, url, element) {
                var defferd = $q.defer();
                if (!element)
                {
                    element = "main2";
                }
                
                    
                var myBlockUI = blockUI.instances.get(element);
                myBlockUI.start();
                var getRequest = function () {
                    var request = {
                        method: 'POST',
                        url: url,
                        headers: {}
                    };

                    if (entity != null) {
                        request.data = JSON.stringify(entity);
                    }
                    return request;
                }


                var renewLogin = function () {
                    var defferdRenew = $q.defer();
                    var request = {
                        method: 'POST',
                        url: WebAccess + "api/Login/reNewLogin",
                        headers: {}
                    };
                    request.headers[refreshTokenKey] = localStorageService.get(refreshTokenKey);

                    $http(request)
                        .success(function (result, status, headers, config) {
                            var token = headers()[tokenKey.toLocaleLowerCase()];
                            localStorageService.set(tokenKey, token);
                            defferdRenew.resolve(result);
                        })
                        .error(errorHandlerGenerator(defferdRenew));
                    return defferdRenew.promise;
                }

                var errorHandlerGenerator = function (defferd, on401) {
                    return function (response) {
                        if (response && response.Code) {
                            switch (response.Code) {
                                case 401:
                                    if (!on401) {
                                        defferd.reject(response);
                                        $state.go("login");
                                    } else {
                                        on401(defferd, response);
                                    }
                                    break;
                                case 500:
                                    pnErrorHandler.ShowError(response.Message);
                                    defferd.reject(response);
                                    break;
                            }
                        } else {
                            defferd.reject(response);
                        }
                        myBlockUI.stop()
                    }
                };

                var successHandlerGenerator = function (defferd) {
                    return function (result, status, headers, config) {
                        result[PREFIX_RESPONSE + "status"] = status;
                        result[PREFIX_RESPONSE + "headers"] = headers;
                        result[PREFIX_RESPONSE + "config"] = config;
                        myBlockUI.stop();

                        defferd.resolve(result);
                    }
                }

                $http(getRequest())
                    .success(successHandlerGenerator(defferd))
                    .error(errorHandlerGenerator(defferd, function (defferd, response) {
                        localStorageService.clearAll();
                        $state.go("login");
                    }));

                return defferd.promise;
            }

            return {
                get: get,
                post: post,
                callBackData: callBackData,
                callBackDataParameters: callBackDataParameters, 
              
            }

        }]);
});
