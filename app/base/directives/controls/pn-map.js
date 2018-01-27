define(['angularAMD'], function (app) {
    
    if (navigator.onLine) {
        require(["https://maps.googleapis.com/maps/api/js?key=AIzaSyDGk6xA_GYUH-JS1GPpTY_rxCSv93WhXVc&language=fa&region=IR"], function () {
            registerPnMap();
        });
    }
    else {
       alert('offline')
    }

    function registerPnMap() {
        app.directive('pnMap',
            function () {
                return {
                    restrict: 'E', //Element Type
                    template: '<div id="map" style="height:200px"></div>', //Defining myApp div
                    //replace: true, //Allowing replacing
                    scope: {
                        lat: "=",
                        long: "=",
                        mapReadOnly: "=",
                        api: "=",
                        onChange: "&"
                    },
                    controller: function ($scope) {
                        var map;
                        var marker;

                        /////////////
                        $scope.safeApply = function (fn) {
                            var phase = this.$root.$$phase;
                            if (phase == '$apply' || phase == '$digest') {
                                if (fn && (typeof (fn) === 'function')) {
                                    fn();
                                }
                            } else {
                                this.$apply(fn);
                            }
                        };
                        //////////
                        $scope.api = {};
                        $scope.api.intializeMap = function () {
                            $scope.lat = 35.6892;
                            $scope.long = 51.3890;
                            $scope.initMap();
                        }

                        $scope.api.setLatLong = function (_lat, _long) {
                            $scope.lat = _lat;
                            $scope.long = _long;
                            $scope.initMap();
                        }

                        if ($scope.lat == null) {
                            $scope.lat = 35.6892;
                        }
                        if ($scope.long == null) {
                            $scope.long = 51.3890;
                        }
                        if ($scope.mapReadOnly == null) {
                            $scope.mapReadOnly = true;
                        }
                        $scope.blurMap = function () {
                            if ($scope.Latitude != "" && $scope.Longitude != "") {
                                initMap(parseFloat($scope.Latitude), parseFloat($scope.Longitude))
                            }
                        }

                        //$scope.$watch("lat", function () {
                        //    $scope.initMap();
                        //});

                        //$scope.$watch("long", function () {
                        //    $scope.initMap();
                        //});

                        $scope.initMap = function () {
                            if (angular.isUndefined($scope.lat) || $scope.lat == null) {
                                $scope.lat = 35.6892;
                            }
                            if (angular.isUndefined($scope.long) || $scope.long == null) {
                                $scope.long = 51.3890;
                            }

                            var cairo = { lat: parseFloat($scope.lat), lng: parseFloat($scope.long) };
                            map = new google.maps.Map(document.getElementById('map'), {
                                scaleControl: true,
                                center: cairo,
                                zoom: 12
                            });

                            var infowindow = new google.maps.InfoWindow;
                            marker = new google.maps.Marker({ map: map, draggable: true, position: cairo });
                            marker.addListener('click', function () {
                                infowindow.open(map, marker);
                            });

                            if (!$scope.mapReadOnly) {
                                marker.addListener('dragend', function (event) {
                                        $scope.lat = marker.position.lat();
                                        $scope.long = marker.position.lng();
                                        var latLog = { lat: $scope.lat, long: $scope.long };
                                        $scope.onChange({ latLon: latLog });
                                });
                            }

                            //  if (!$scope.mapReadOnly) {
                            //google.maps.event.addListener(map, 'click', function (event) {
                            // map.addListener('click', function (e) {


                            //alert("clicked");
                            //marker.setMap(null);
                            //marker = addMarker(e.latLng, 1);

                            //$scope.safeApply(function () {
                            //    $scope.lat = marker.position.lat();
                            //    $scope.long = marker.position.lng();
                            //});




                            // google.maps.event.addListener(marker, 'click', function () {


                            //alert(market.myLocationId);
                            //alert("in");


                            //    var _myMarkerItem = GetSystemMarkerItem(this.myLocationId);
                            //    var description = "";
                            //    if (_myMarkerItem != null) {
                            //        description = _myMarkerItem[3];
                            //    }
                            //    ////////
                            //    var contentString = '<div id="content" style="width:100%;direction:rtl;">' +
                            //'<div id="siteNotice">' +
                            //'</div>' +
                            //'<h1 id="firstHeading" class="firstHeading">توضیحات</h1>' +
                            //'<div id="bodyContent" style="width:100%;">' +
                            //'  <textarea style="width:90%;" type="text" id="DescriptionText' + this.myLocationId + '"  >' + description + ' </textarea>  </br>' +
                            //' <input type="button" value="ذخیره" style="width:120px;" onclick="SaveClick(' + this.myLocationId + ')" />   </br> </br>   ' +
                            // ' <input type="button" value="حذف" style="width:120px;" onclick="DeleteClick(' + this.myLocationId + ')" />   </br>  ' +
                            //'   </br>  ' +
                            //'</div>' +
                            //'</div>';

                            //    var infowindow = new google.maps.InfoWindow({
                            //        content: contentString
                            //    });

                            //    infowindow.open(map, this);
                            // });

                            //});

                            // }

                        }

                        $scope.initMap();


                        $scope.api.setLatLongs = function (data) {
                            data.forEach(function (item) {
                                var location = new google.maps.LatLng(item.Lati, item.Long);
                                addMarker(location);
                            });
                        }

                        function addMarker(location) {

                            var marker = new google.maps.Marker({
                                position: location,
                                map: map,
                                animation: google.maps.Animation.DROP,
                                icon: '/content/images/beachflag.png'
                            });

                            markerList.push(marker);
                        }

                        $scope.api.clearMarkers = function () {
                            if (markerList) {
                                for (var i = 0; i < markerList.length; i++) {
                                    markerList[i].setMap(null);
                                }
                            }
                        }



                    }],
                    //link: function (scope, element, attributes) {

                    //    //Initializing Coordinates
                    //    var myLatLng = new google.maps.LatLng(scope.lat, scope.lon);
                    //    var mapOptions = {
                    //        center: myLatLng, //Center of our map based on LatLong Coordinates
                    //        zoom: 12, //How much we want to initialize our zoom in the map
                    //        //Map type, you can check them in APIs documentation
                    //        mapTypeId: google.maps.MapTypeId.ROADMAP
                    //    };

                    //    //Attaching our features & options to the map
                    //    var map = new google.maps.Map(document.getElementById(attributes.id),
                    //                  mapOptions);
                    //    //Putting a marker on the center
                    //    var marker = new google.maps.Marker({
                    //        position: myLatLng,
                    //        map: map,
                    //        title: "My town"
                    //    });
                    //    marker.setMap(map); //Setting the marker up
                    //}
                };
            });
    }
    function offline() {
        app.directive('pnMap',
            function () {
                return {
                    restrict: 'E', //Element Type
                    template: '<div>offline</div>', //Defining myApp div
                    replace: true, //Allowing replacing
                    scope: {

                    }


                };
            });
    }

});