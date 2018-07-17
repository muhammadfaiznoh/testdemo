(function () {
    var _module = angular.module('controller');
    _module.controller('MapMainCtrl', function ($scope, $rootScope, $http, $interval, ControllerBase, $window, u, App, $compile, $cordovaGeolocation, $sce, $ionicModal, $ionicPlatform, $ionicActionSheet, $timeout, $ionDrawerVerticalDelegate, $ionicNavBarDelegate, $ionicPopup, $http, localStorage) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        
        var marker = null;
        var trafficLayer = new google.maps.TrafficLayer();
        var map;
        
        var images = [
	        "www/img/map_icon/inciddent.png",
	        "www/img/map_icon/Breakdown.png",
	        "www/img/map_icon/flood.png",
	        "www/img/map_icon/roadmaintenance.png",
	        "www/img/map_icon/landslide.png",
	        "www/img/map_icon/roadclosure.png",
	        "www/img/map_icon/fallentree.png"
        ];

        var div = document.getElementById("map_canvas");
        
        
        // Initialize the map view
        map = plugin.google.maps.Map.getMap(div);

        // Wait until the map is ready status.
        map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

        function onMapReady() {

            var posOptions = {
                timeout: 5000,
                enableHighAccuracy: true
            };
            $cordovaGeolocation.getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                var GOOGLE = new plugin.google.maps.LatLng(lat, long);
                map.setCenter(GOOGLE);

            }, function (err) {
                alert("Geolocation Error! " + err.message);
            });

            map.setMyLocationEnabled(true);
            map.setTrafficEnabled(true);
            map.setZoom(13);
        }

        function setupWatch(freq) {
            activeWatch = setInterval(watchLocation, freq);
        }

        function speedWatch(freq) {
            activeWatch = setInterval(watchSpeed, freq);
        }

        function watchSpeed() {
            var options = {
                enableHighAccuracy: true,
                timeout: 2000,
                maximumAge: 0,
                desiredAccuracy: 0,
            }
            var spd = navigator.geolocation.getCurrentPosition(updateSpeed, onLocationError, options);
        }

        function updateSpeed(position) {
            var newSpeed = position.coords.speed;
            if (newSpeed == null) {
                $scope.speeds = 0;
            } else if (newSpeed < 0) {
                $scope.speeds = 0;
            } else {
                $scope.speeds = Math.round(newSpeed * 3.6);
            }
        }

        function watchLocation() {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
                desiredAccuracy: 0,
            };
            var gcp = navigator.geolocation.getCurrentPosition(
                updateUserLoc, onLocationError, options);
        }
        function updateUserLoc(position) {
            var testData;
            var vDetectionRadious = 5;
            var newPoint = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            var markerVMS = [];
            var speed = position.coords.speed;
            var mapData = $http.get(App.apiEndPoint + "json_boundry1?").then(function (res) {
                _.each(res.data, function (o) {
                    //alert(sessionStorage.MapFilterCCTV + " :" + sessionStorage.MapFilterVMS + " :" + sessionStorage.MapFilterParking + " :" + sessionStorage.MapFilterIncident + " :" + sessionStorage.MapFilterEvent);
                    if (o.CCTV && sessionStorage.MapFilterCCTV == "true") {
                        _.each(o.CCTV, function (cctv) {
                            var radlat1 = Math.PI * position.coords.latitude / 180
                            var radlat2 = Math.PI * cctv.latitude / 180
                            var radlon1 = Math.PI * position.coords.longitude / 180
                            var radlon2 = Math.PI * cctv.longitude / 180
                            var theta = position.coords.longitude - cctv.longitude
                            var radtheta = Math.PI * theta / 180
                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                            dist = Math.acos(dist)
                            dist = dist * 180 / Math.PI
                            dist = dist * 60 * 1.1515
                            dist = dist * 1.609344
                            if (dist <= vDetectionRadious) { 
                                var cctvLoc = new plugin.google.maps.LatLng(cctv.latitude, cctv.longitude);
                                map.addMarker({
                                    'position': cctvLoc,
                                    'icon': {
                                        'url': "www/img/map_icon/cctv.png"
                                    }
                                }, function (marker) {
                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                                        showModalMessage(null, null, null, cctv.url);
                                        //swal({ title:"", imageUrl:cctv.url, imageSize: '250x250', timer:5000, showConfirmButton:false, height:300 });
                                    });
                                });
                            }
                        });
                    }
                    if (o.VMS && sessionStorage.MapFilterVMS == "true") {
                        _.each(o.VMS, function (vms) {
                            var radlat1 = Math.PI * position.coords.latitude / 180
                            var radlat2 = Math.PI * vms.latitude / 180
                            var radlon1 = Math.PI * position.coords.longitude / 180
                            var radlon2 = Math.PI * vms.longitude / 180
                            var theta = position.coords.longitude - vms.longitude
                            var radtheta = Math.PI * theta / 180
                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                            dist = Math.acos(dist)
                            dist = dist * 180 / Math.PI
                            dist = dist * 60 * 1.1515
                            dist = dist * 1.609344
                            if (dist <= vDetectionRadious) {                                
                                var vPosition = new plugin.google.maps.LatLng(vms.latitude, vms.longitude);
                                map.addMarker({
                                    'position': vPosition,
                                    'icon': {
                                        'url': "www/img/map_icon/vms.png"
                                    }
                                }, function (marker) {
                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                                        var DisplayText = vms.content.replace(";", "\r\n").replace(";", "\r\n").replace(";", "\r\n").replace(";", "\r\n").replace(";", "\r\n").replace(";", "\r\n").replace(";", "\r\n");
                                        showModalMessage(vms.id, DisplayText, null, null);
                                        //swal({ title:vms.id, text:DisplayText, timer:5000, showConfirmButton:false });
                                    });
                                });
                            }
                        });
                    }
                    if (o.PARKING && sessionStorage.MapFilterParking == "true") {
                        _.each(o.PARKING, function (park) {
                            var radlat1 = Math.PI * position.coords.latitude / 180
                            var radlat2 = Math.PI * park.latitude / 180
                            var radlon1 = Math.PI * position.coords.longitude / 180
                            var radlon2 = Math.PI * park.longitude / 180
                            var theta = position.coords.longitude - park.longitude
                            var radtheta = Math.PI * theta / 180
                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                            dist = Math.acos(dist)
                            dist = dist * 180 / Math.PI
                            dist = dist * 60 * 1.1515
                            dist = dist * 1.609344
                            if (dist <= vDetectionRadious) {
                                var parkLoc = new plugin.google.maps.LatLng(park.latitude, park.longitude);
                                map.addMarker({
                                    'position': parkLoc,
                                    'icon': {
                                        'url': "www/img/map_icon/parking.png"
                                    },
                                }, function(marker) {
                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                                        showModalMessage(park.content, null, null, park.url);
                                        //swal({ title:park.content, imageUrl:park.url, imageSize: '200x100', timer:5000, showConfirmButton:false });
                                    });
                                });
                            }
                        });
                    }
                    if (o.INCIDENT && sessionStorage.MapFilterIncident == "true") {
                        _.each(o.INCIDENT, function (inc) {
                            var radlat1 = Math.PI * position.coords.latitude / 180
                            var radlat2 = Math.PI * inc.latitude / 180
                            var radlon1 = Math.PI * position.coords.longitude / 180
                            var radlon2 = Math.PI * inc.longitude / 180
                            var theta = position.coords.longitude - inc.longitude
                            var radtheta = Math.PI * theta / 180
                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                            dist = Math.acos(dist)
                            dist = dist * 180 / Math.PI
                            dist = dist * 60 * 1.1515
                            dist = dist * 1.609344
                            if (dist <= vDetectionRadious) {
                                var incLoc = new plugin.google.maps.LatLng(inc.latitude, inc.longitude);
                                map.addMarker({
                                    'position': incLoc,
                                    'icon': {
                                        'url': inc.url
                                    }
                                }, function(marker) {
                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                                        showModalMessage(inc.id, inc.content, null, inc.url);
                                        //swal({ title:inc.id, text:inc.content, imageUrl:inc.url, timer:5000, showConfirmButton:false });
                                    });
                                });
                            }
                        });
                    }
                    /*
                    if (o.TRAFFIC) {
                        _.each(o.TRAFFIC, function (tra) {
                            var radlat1 = Math.PI * position.coords.latitude / 180
                            var radlat2 = Math.PI * tra.latitude / 180
                            var radlon1 = Math.PI * position.coords.longitude / 180
                            var radlon2 = Math.PI * tra.longitude / 180
                            var theta = position.coords.longitude - tra.longitude
                            var radtheta = Math.PI * theta / 180
                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                            dist = Math.acos(dist)
                            dist = dist * 180 / Math.PI
                            dist = dist * 60 * 1.1515
                            dist = dist * 1.609344
                            if (dist <= vDetectionRadious) {

                                var traLoc = new plugin.google.maps.LatLng(tra.latitude, tra.longitude);
                                map.addMarker({
                                    'position': traLoc,
                                    'icon': {
                                        'url': images[0]
                                    }
                                }, function(marker) {
                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                                        swal({ title:tra.id, text:tra.content, imageUrl:tra.url, timer:5000, showConfirmButton:false });
                                    });
                                });
                            }
                        });
                    }
                    */
                    if (o.EVENT && sessionStorage.MapFilterEvent == "true") {
                        _.each(o.EVENT, function (evt) {
                            var radlat1 = Math.PI * position.coords.latitude / 180
                            var radlat2 = Math.PI * evt.latitude / 180
                            var radlon1 = Math.PI * position.coords.longitude / 180
                            var radlon2 = Math.PI * evt.longitude / 180
                            var theta = position.coords.longitude - evt.longitude
                            var radtheta = Math.PI * theta / 180
                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                            dist = Math.acos(dist)
                            dist = dist * 180 / Math.PI
                            dist = dist * 60 * 1.1515
                            dist = dist * 1.609344
                            if (dist <= vDetectionRadious) {

                                var evtLoc = new plugin.google.maps.LatLng(evt.latitude, evt.longitude);
                                map.addMarker({
                                    'position': evtLoc,
                                    'icon': {
                                        'url': images[5]
                                    }
                                }, function(marker) {
                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                                        showModalMessage(evt.id, "Road Closure:" + "<br/>" + evt.content + "<br/>Start: " + evt.start_date + " " + evt.start_time + "<br/>End: " + evt.end_date + " " + evt.end_time, null, null);
                                        //swal({ html:true, title:evt.id, text:"Road Closure:" + "<br/>" + evt.content + "<br/>Start: " + evt.start_date + " " + evt.start_time + "<br/>End: " + evt.end_date + " " + evt.end_time, timer:5000, showConfirmButton:false });
                                    });
                                });
                            }
                        });
                    }

                });
            });
            map.clear();
        }

        function logout() {
            clearInterval(activeWatch);
        }
        $rootScope.$on("DrawerClosed", function () {
            $scope.drwClosed();
        });

        $rootScope.$on("DrawerOpened", function () {
            $scope.drwOpened();
        });

        $scope.drwOpened = function () {
            map.setClickable(false);
        }
        $scope.drwClosed = function () {
            map.setClickable(true);
        }

        $scope.showModal = function (templateUrl, urlImage, location, id, content) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    animation: 'slide-in-down'
                }).then(function (modal) {
                    $scope.modal = modal;
                    console.log
                    $scope.dataimg = urlImage;
                    $scope.location = location;
                    $scope.id = id;
                    $scope.content = content;
                    $scope.modal.show();
                });
            }
            // Close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        };
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (!sessionStorage.MapFilterCCTV) {
                sessionStorage.MapFilterCCTV = "true";
            }
            if (!sessionStorage.MapFilterVMS) {
                sessionStorage.MapFilterVMS = "true";
            }
            if (!sessionStorage.MapFilterParking) {
                sessionStorage.MapFilterParking = "true";
            }
            if (!sessionStorage.MapFilterIncident) {
                sessionStorage.MapFilterIncident = "true";
            }
            if (!sessionStorage.MapFilterEvent) {
                sessionStorage.MapFilterEvent = "true";
            }
            
            setupWatch(10000);
            speedWatch(1000);
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                map.setClickable(true);


            }
        });

        function onLocationError() {
            console.log("error");
        }

        $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
            logout();
            marker.remove();
            map.remove();
        });
        var divMessage = document.getElementById("divMessage");
        divMessage.addEventListener("click", function() {
            divMessage.style.display = "none";
        });
        function showModalMessage(Title, MessageText, VideoUrl, ImageUrl) {        
            var divMessageTitle = document.getElementById("divMessageTitle");
            var divMessageVideo = document.getElementById("divMessageVideo");
            var divMessageImage = document.getElementById("divMessageImage");
            var divMessageText = document.getElementById("divMessageText");
            var vidMessage = document.getElementById("vidMessage");

            //Initalise
            divMessage.innerHTML = "";
            vidMessage.setAttribute("src", "");

            if (Title !== undefined && Title !== null && Title !== "") {
                divMessageTitle.innerHTML = Title;
                divMessageTitle.style.display = "block";
            } else {
                divMessageTitle.innerHTML = "";
                divMessageTitle.style.display = "none";
            }
            if (MessageText !== undefined && MessageText !== null && MessageText !== "") {
                divMessageText.innerHTML = MessageText;
                divMessageText.style.display = "block";
            } else {
                divMessageText.innerHTML = "";
                divMessageText.style.display = "none";
            }
            if (VideoUrl !== undefined && VideoUrl !== null && VideoUrl !== "") {
                divMessageVideo.setAttribute("src", VideoUrl);
                divMessageVideo.style.display = "block";
            } else {
                divMessageVideo.setAttribute("src", "");
                divMessageVideo.style.display =  "none";
            }
            if (ImageUrl !== undefined && ImageUrl !== null && ImageUrl !== "") {
                divMessageImage.setAttribute("src", ImageUrl);
                divMessageImage.style.display = "block";
            } else {
                divMessageImage.setAttribute("src", "");
                divMessageImage.style.display = "none";
            }
        }
    });
})();