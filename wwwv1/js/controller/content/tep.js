(function () {
    var _module = angular.module('controller');
    _module.controller('MapMainCtrl', function ($scope, $interval, ControllerBase, $window, u, App, $compile, $cordovaGeolocation, $sce, $ionicModal, $ionicPlatform, $ionicActionSheet, $timeout, $ionDrawerVerticalDelegate, $ionicNavBarDelegate, $ionicPopup, $http, localStorage, $cordovaLaunchNavigator) {
        ControllerBase($scope, 'mapmain');
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

        var marker = null;
        //        var trafficLayer = new google.maps.TrafficLayer();
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

        var isEnabled = true;
        var div = document.getElementById("map_canvas");
        map = plugin.google.maps.Map.getMap(div);
        map.setMyLocationEnabled(isEnabled);
        map.setTrafficEnabled(isEnabled);
        map.one(plugin.google.maps.event.MAP_READY, onceEnterPage);
        function initMap() {



            console.log("Code Entered Here!!!");
            
            console.log("Code exit Here!!!");
            //              setupWatch(10000);
        }

        function onceEnterPage() {
            var options = {
                enableHighAccuracy: true,
                timeout: 50000,
                maximumAge: 0,
                desiredAccuracy: 0,
            };
            var gcp = navigator.geolocation.getCurrentPosition(
                animateOnce, onLocationError, options);

        }

        function animateOnce(position) {
            console.log("Check : ", position.coords.latitude);
            var CamLoc = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log("animation running");
            map.animateCamera({
                target: CamLoc,
                zoom: 18,
                tilt: 75,
                bearing: 0,
                duration: 5000
            });
            console.log("animation ends");
        }



//        $scope.dialNumber = function (number) {
//            window.open('tel:' + number, '_system');
//        }
//        $scope.toggleDrawer = function (state) {
//            $ionDrawerVerticalDelegate.toggleDrawer().then(function () {
//                $scope.isDrawer();
//            });
//        }
//
//        $scope.isDrawer = function () {
//            var drwState = $ionDrawerVerticalDelegate.getState();
//            if (drwState == 'opened') {
//                map.setClickable(false);
//            } else if (drwState == 'closed') {
//                map.setClickable(true);
//            }
//        }
//        $ionicModal.fromTemplateUrl('templates/common/modal_autocomplete.html', {
//            scope: $scope,
//            animation: 'slide-in-down'
//        }).then(function (modal) {
//            $scope.modal = modal;
//
//        });
//        $scope.sleep = function () {
//            if (ionic.Platform.isAndroid()) {
//                ionic.Platform.exitApp();
//            } else if (ionic.Platform.isIOS()) {
//                u.$state.go('tab.sleepmode');
//                $ionDrawerVerticalDelegate.closeDrawer();
//                map.setClickable(true);
//            }
//        }
//
//        $scope.openModal = function () {
//
//            $scope.modal.show();
//        };
//
//        $scope.closeModal = function () {
//            $scope.modal.hide();
//        };
//
//        $scope.closeDrawer = function () {
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//            console.log("Closed");
//        }
//
//        $scope.actionDirections = function () {
//            u.$state.go("tab.directions")
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//
//        }
//
//        $scope.actionHighlight = function () {
//            u.$state.go("tab.highlight");
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//        }
//        $scope.actionCCTV = function () {
//            u.$state.go("tab.cameralist");
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//        }
//        $scope.actionParking = function () {
//            u.$state.go("tab.parking");
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//        }
//        $scope.actionERT = function () {
//            u.$state.go("ert");
//
//        }
//        $scope.actionReport = function () {
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//        }
//        $scope.actionSetting = function () {
//            u.$state.go("tab.setting");
//            console.log("click");
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//        }
//        $scope.actionVMS = function () {
//            u.$state.go("tab.vms");
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//        }
//
//        $scope.actionSleep = function () {
//            u.$state.go("tab.sleepmode");
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//        }
//        $scope.actionTTS = function () {
//            u.$state.go("tab.TTS");
//
//            $ionDrawerVerticalDelegate.closeDrawer();
//            map.setClickable(true);
//        }
//
//
//
//
//
//        //        // stop watching
//        function onLocationError() {
//            console.log("error");
//        }
//
//
//        //        function initialise() {
//        //
//        //            map.addEventListener(plugin.google.maps.event.MAP_READY, onceEnterPage);
//        //
//        //
//        //        }
//        //
//        //        function onMapCameraChanged(position) {
//        //            var map = this;
//        //            console.log("stringCamera", JSON.stringify(position));
//        //            var camJSON = JSON.stringify(position);
//        //            var lat = camJSON.lat;
//        //            var lng = camJSON.lng;
//        //            var camPoint = new plugin.google.maps.LatLng(lat, lng)
//        //            var latLngBounds = new plugin.google.maps.LatLngBounds(camPoint);
//        //
//        //            var bounds = {
//        //                north: latLngBounds.northeast.lat,
//        //                south: latLngBounds.southwest.lat,
//        //                east: latLngBounds.northeast.lng,
//        //                west: latLngBounds.southwest.lng
//        //            };
//        //
//        //            testData = $http.post("http://ibsb.dlinkddns.com/edrive_new/api/json_boundry1?lat1=" + bounds.south + "&lng1=" + bounds.west + "&lat2=" + bounds.north + "&lng2=" + bounds.east).success(function (response) {
//        //                console.log("retrun data", JSON.stringify(response));
//        //            });
//        //        }
//
//        //        function setupWatch(freq) {
//        //            // global var here so it can be cleared on logout (or whenever).
//        //            activeWatch = setInterval(watchLocation, freq);
//        //        }
//
//        //        function watchLocation() {
//        //            var options = {
//        //                enableHighAccuracy: true,
//        //                timeout: 5000,
//        //                maximumAge: 0,
//        //                desiredAccuracy: 0,
//        //            };
//        //            var gcp = navigator.geolocation.getCurrentPosition(
//        //                updateUserLoc, onLocationError, options);
//        //        }
//
        function logout() {
            clearInterval(activeWatch);
        }
//
//        //        function updateUserLoc(position) {
//        //            var testData;
//        //            var newPoint = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude)
//        //
//        //            var speed = position.coords.speed;
//        //            $scope.heading = position.coords.heading;
//        //            console.log("headings : ", heading);
//
//
//
//        //            var mapData = $http.get("http://ibsb.dlinkddns.com/edrive_new/api/json_boundry1?").then(function (res) {
//        //
//        //                _.each(res.data, function (o) {
//        //                    if (o.CCTV) {
//        //                        _.each(o.CCTV, function (i) {
//        //                            var radlat1 = Math.PI * position.coords.latitude / 180
//        //                            var radlat2 = Math.PI * i.latitude / 180
//        //                            var radlon1 = Math.PI * position.coords.longitude / 180
//        //                            var radlon2 = Math.PI * i.longitude / 180
//        //                            var theta = position.coords.longitude - i.longitude
//        //                            var radtheta = Math.PI * theta / 180
//        //                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//        //                            dist = Math.acos(dist)
//        //                            dist = dist * 180 / Math.PI
//        //                            dist = dist * 60 * 1.1515 // by metre
//        //                            dist = dist * 1.609344 // by Kilometre
//        //                            if (dist <= 5) {
//        //                                var cctvLoc = new plugin.google.maps.LatLng(i.latitude, i.longitude);
//        //                                map.addMarker({
//        //                                    'position': cctvLoc,
//        //                                    'icon': {
//        //                                        'url': "www/img/map_icon/cctv.png"
//        //                                    }
//        //                                });
//        //                            }
//        //
//        //                        });
//        //                    }
//        //                    if (o.VMS) {
//        //                        _.each(o.VMS, function (vms) {
//        //                            var radlat1 = Math.PI * position.coords.latitude / 180
//        //                            var radlat2 = Math.PI * vms.latitude / 180
//        //                            var radlon1 = Math.PI * position.coords.longitude / 180
//        //                            var radlon2 = Math.PI * vms.longitude / 180
//        //                            var theta = position.coords.longitude - vms.longitude
//        //                            var radtheta = Math.PI * theta / 180
//        //                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//        //                            dist = Math.acos(dist)
//        //                            dist = dist * 180 / Math.PI
//        //                            dist = dist * 60 * 1.1515
//        //                            dist = dist * 1.609344
//        //                            if (dist <= 5) {
//        //                                var vmsLoc = new plugin.google.maps.LatLng(vms.latitude, vms.longitude);
//        //                                map.addMarker({
//        //                                    'position': vmsLoc,
//        //                                    'icon': {
//        //                                        'url': "www/img/map_icon/vms.png"
//        //                                    }
//        //                                }, function (marker) {
//        //
//        //                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
//        //                                        $scope.showModal('www/templates/common/modal-map-vms.html', url, vms.location, vms.id, vms.content);
//        //
//        //                                    });
//        //                                });
//        //                            }
//        //                        });
//        //                    }
//        //                    if (o.PARKING) {
//        //                        _.each(o.PARKING, function (park) {
//        //                            var radlat1 = Math.PI * position.coords.latitude / 180
//        //                            var radlat2 = Math.PI * park.latitude / 180
//        //                            var radlon1 = Math.PI * position.coords.longitude / 180
//        //                            var radlon2 = Math.PI * park.longitude / 180
//        //                            var theta = position.coords.longitude - park.longitude
//        //                            var radtheta = Math.PI * theta / 180
//        //                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//        //                            dist = Math.acos(dist)
//        //                            dist = dist * 180 / Math.PI
//        //                            dist = dist * 60 * 1.1515
//        //                            dist = dist * 1.609344
//        //                            if (dist <= 5) {
//        //                                var parkLoc = new plugin.google.maps.LatLng(park.latitude, park.longitude);
//        //                                map.addMarker({
//        //                                    'position': parkLoc,
//        //                                    'icon': {
//        //                                        'url': "www/img/map_icon/parking.png"
//        //                                    }
//        //                                });
//        //                            }
//        //
//        //                        });
//        //                    }
//        //                    if (o.INCIDENT) {
//        //                        _.each(o.INCIDENT, function (inc) {
//        //                            var radlat1 = Math.PI * position.coords.latitude / 180
//        //                            var radlat2 = Math.PI * inc.latitude / 180
//        //                            var radlon1 = Math.PI * position.coords.longitude / 180
//        //                            var radlon2 = Math.PI * inc.longitude / 180
//        //                            var theta = position.coords.longitude - inc.longitude
//        //                            var radtheta = Math.PI * theta / 180
//        //                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//        //                            dist = Math.acos(dist)
//        //                            dist = dist * 180 / Math.PI
//        //                            dist = dist * 60 * 1.1515
//        //                            dist = dist * 1.609344
//        //                            if (dist <= 5) {
//        //
//        //                                var incLoc = new plugin.google.maps.LatLng(inc.latitude, inc.longitude);
//        //                                map.addMarker({
//        //                                    'position': incLoc,
//        //                                    'icon': {
//        //                                        'url': images[inc.id - 1]
//        //                                    }
//        //                                });
//        //
//        //                            }
//        //                        });
//        //                    }
//        //                    if (o.TRAFFIC) {
//        //                        _.each(o.TRAFFIC, function (tra) {
//        //                            var radlat1 = Math.PI * position.coords.latitude / 180
//        //                            var radlat2 = Math.PI * tra.latitude / 180
//        //                            var radlon1 = Math.PI * position.coords.longitude / 180
//        //                            var radlon2 = Math.PI * tra.longitude / 180
//        //                            var theta = position.coords.longitude - tra.longitude
//        //                            var radtheta = Math.PI * theta / 180
//        //                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//        //                            dist = Math.acos(dist)
//        //                            dist = dist * 180 / Math.PI
//        //                            dist = dist * 60 * 1.1515
//        //                            dist = dist * 1.609344
//        //                            if (dist <= 5) {
//        //
//        //                                var traLoc = new plugin.google.maps.LatLng(tra.latitude, tra.longitude);
//        //                                map.addMarker({
//        //                                    'position': traLoc,
//        //                                    'icon': {
//        //                                        'url': images[tra.id - 1]
//        //                                    }
//        //                                });
//        //
//        //                            }
//        //                        });
//        //                    }
//        //
//        //
//        //
//        //                });
//        //            })
//
//        //            if (speed == null) {
//        //                $scope.speeds = 0;
//        //            } else if (speed < 0) {
//        //                $scope.speeds = 0;
//        //            } else {
//        //
//        //                $scope.speeds = Math.round(speed * 3.6);
//        //            }
//        //            marker.remove();
//        //}
//
//        var storage = localStorage.getObject('test');
//
//
//        $scope.$o n('$ionicView.beforeEnter', function (viewInfo, state) {
//            $ionDrawerVerticalDelegate.closeDrawer();
//            //            initLocationProcedure();
//            if (['none', 'forward', 'swap', 'enter', 'back'].indexOf(state.direction) >= 0) {
//                initMap();
//                //                initMap();
//                var storage = localStorage.getObject('userDetails');
//                $scope.blacklist = storage.blacklist_flag;
//                console.log($scope.blacklist);
//                $scope.staff = storage.staff;
//                if ($scope.blacklist == "N") {
//                    $scope.authorize = true;
//                } else if ($scope.blacklist == "Y") {
//                    $scope.authorize = false;
//                }
//                console.log("enter initmap");
//
//                if (storage.session == 1) {
//                    map.setClickable(false);
//
//                    swal({
//                        title: "<small><b>DISCLAIMER</b></small> ",
//                        text: "<small><span><strong>DO NOT USE THIS APPLICATION WHILE DRIVING.</strong></span><span> eDrive not be responsible &amp; liable for any loss, damage or injury rising from the use of this application while driving</span></div></small>",
//                        html: true,
//                        showCancelButton: false,
//                        confirmButtonColor: "#F99F1E",
//                        confirmButtonText: "CLOSE",
//                        closeOnConfirm: false
//
//                    });
//
//                    localStorage.setObject('test', {
//                        session: 2
//                    });
//
//                }
//
//            }
//        });
//        $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
//            logout();
//            marker.remove();
//            map.remove();
//        });
//
//        $scope.showModal = function (templateUrl, urlImage, location, id, content) {
//                $ionicModal.fromTemplateUrl(templateUrl, {
//                    scope: $scope,
//                    animation: 'slide-in-down'
//                }).then(function (modal) {
//                    $scope.modal = modal;
//                    console.log
//                    $scope.dataimg = urlImage;
//                    $scope.location = location;
//                    $scope.id = id;
//                    $scope.content = content;
//                    $scope.modal.show();
//                });
//            }
//            // Close the modal
//        $scope.closeModal = function () {
//            $scope.modal.hide();
//            $scope.modal.remove()
//        };
//        $scope.tabExpand = function (index) {
//            console.log('Tab ' + index + ' expanded');
//        };
//        $scope.tabCollapse = function (index) {
//            console.log('Tab ' + index + ' collapsed');
//        };
//


    });
})();