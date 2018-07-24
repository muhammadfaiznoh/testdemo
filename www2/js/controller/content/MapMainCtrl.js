(function () {
    var _module = angular.module('controller');
    _module.controller('MapMainCtrl', function ($scope, $rootScope, $http, $interval, ControllerBase, $window, u, App, $compile, $cordovaGeolocation, $sce, $ionicModal, $ionicPlatform, $ionicActionSheet, $timeout, $ionDrawerVerticalDelegate, $ionicNavBarDelegate, $ionicPopup, $http, localStorage) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
//        $ionicHistory.clearCache();
//            $ionicHistory.clearHistory();
        var marker = null;
        var trafficLayer = new google.maps.TrafficLayer();
        var map;
        
        var images = [
	        "www/img/map_icon/inciddent.png",
	        "www/img/map_icon/Breakdown.png",
	        "www/img/map_icon/lighthouse.png",
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
//                map.setCenter(GOOGLE);
               map.moveCamera({
    target: GOOGLE,
    zoom: 7
  });

                
                              }, function (err) {
                alert("Geolocation Error! " + err.message);
            });
 
            map.setMyLocationEnabled(true);
            map.setTrafficEnabled(true);
            map.setZoom(7);
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
                timeout: 10000,
                maximumAge: 0,
                desiredAccuracy: 0,
            };
            var gcp = navigator.geolocation.getCurrentPosition(
                updateUserLoc, onLocationError, options);
        }
        function updateUserLoc(position) {
            var testData;
            var vDetectionRadious = 500;
            var newPoint = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            var markerVMS = [];
            var speed = position.coords.speed;
//            map.addEventListener("click", function(e) {
//               document.getElementById("divMessageModal").style.display = "none"; 
//            });
            var mapData = $http.get(App.apiEndPoint + "json_boundry1?").then(function (res) {
                _.each(res.data, function (o) {
                    //alert(sessionStorage.MapFilterCCTV + " :" + sessionStorage.MapFilterVMS + " :" + sessionStorage.MapFilterParking + " :" + sessionStorage.MapFilterIncident + " :" + sessionStorage.MapFilterEvent);
                    // if (o.CCTV && sessionStorage.MapFilterCCTV == "true") {
                    //     _.each(o.CCTV, function (cctv) {
                    //         var radlat1 = Math.PI * position.coords.latitude / 180
                    //         var radlat2 = Math.PI * cctv.latitude / 180
                    //         var radlon1 = Math.PI * position.coords.longitude / 180
                    //         var radlon2 = Math.PI * cctv.longitude / 180
                    //         var theta = position.coords.longitude - cctv.longitude
                    //         var radtheta = Math.PI * theta / 180
                    //         var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                    //         dist = Math.acos(dist)
                    //         dist = dist * 180 / Math.PI
                    //         dist = dist * 60 * 1.1515
                    //         dist = dist * 1.609344
                    //         if (dist <= vDetectionRadious) { 
                    //             var cctvLoc = new plugin.google.maps.LatLng(cctv.latitude, cctv.longitude);
                    //             map.addMarker({
                    //                 'position': cctvLoc,
                    //                 'icon': {
                    //                     'url': "www/img/map_icon/lighthouse.png"
                    //                 }
                    //             }, function (marker) {
                    //                 marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                    //                   $scope.PromptModal("CCTV", null, null, cctv.url, null, "20px", null);
                    //                 });
                    //             });
                    //         }
                    //     });
                    // }
//                     if (o.VMS && sessionStorage.MapFilterVMS == "true") {
//                         _.each(o.VMS, function (vms) {
//                             var radlat1 = Math.PI * position.coords.latitude / 180
//                             var radlat2 = Math.PI * vms.latitude / 180
//                             var radlon1 = Math.PI * position.coords.longitude / 180
//                             var radlon2 = Math.PI * vms.longitude / 180
//                             var theta = position.coords.longitude - vms.longitude
//                             var radtheta = Math.PI * theta / 180
//                             var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//                             dist = Math.acos(dist)
//                             dist = dist * 180 / Math.PI
//                             dist = dist * 60 * 1.1515
//                             dist = dist * 1.609344
//                             if (dist <= vDetectionRadious) {                                
//                                 var vPosition = new plugin.google.maps.LatLng(vms.latitude, vms.longitude);
//                                     map.addMarker({
//                                     'position': vPosition,
                                    
                                  
//                                     'icon': {
//                                         'url': "www/img/map_icon/vms.png"
//                                     }
//                                 }, function (marker) {
                                     
//                                        //   marker.setAnimation(plugin.google.maps.Animation.BOUNCE);
//                                      //'animation' : plugin.google.maps.Animation.BOUNCE,
                                   
                                   
//                                     marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
//                                         var DisplayText = vms.content.replace(", ", "\r\n").replace(", ", "\r\n").replace("; ", "\r\n\n").replace(", ", "\r\n").replace(", ", "\r\n").replace("; ", "\r\n\n").replace(", ", "\r\n").replace(", ", "\r\n").replace("; ", "\r\n\n").replace(", ", "\r\n").replace(", ", "\r\n").replace("; ", "\r\n\n").replace(", ", "\r\n").replace(", ", "\r\n").replace("; ", "\r\n\n").replace(", ", "\r\n").replace(", ", "\r\n").replace("; ", "\r\n\n").replace(", ", "\r\n").replace(", ", "\r\n").replace("; ", "\r\n\n").replace(", ", "\r\n").replace(", ", "\r\n")
//                                         ;
// //                                        swal({ title:vms.id, text:DisplayText, timer:5000, showConfirmButton:false });
//                                          $scope.PromptModal("VMS", vms.id+ "\r\n" + "\r\n" , DisplayText, null, null, "20px", null);
//                                     });
//                                 });
  
//                             }
//                         });
//                     }
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
                                        'url': "img/map_icon/lighthouse.png"
                                    },
                                }, function(marker) {
                                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
//                                        swal({ title:park.content, imageUrl:park.url, imageSize: '200x100', timer:5000, showConfirmButton:false });
                                         $scope.PromptModal("PARKING", null,  "\r\n" +park.content+ "\r\n" + "\r\n" , park.url, null, null, "30px");
                                    });
                                });
                            }
                        });
                    }
//                     if (o.INCIDENT && sessionStorage.MapFilterIncident == "true") {
//                         _.each(o.INCIDENT, function (inc) {
//                             var radlat1 = Math.PI * position.coords.latitude / 180
//                             var radlat2 = Math.PI * inc.latitude / 180
//                             var radlon1 = Math.PI * position.coords.longitude / 180
//                             var radlon2 = Math.PI * inc.longitude / 180
//                             var theta = position.coords.longitude - inc.longitude
//                             var radtheta = Math.PI * theta / 180
//                             var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//                             dist = Math.acos(dist)
//                             dist = dist * 180 / Math.PI
//                             dist = dist * 60 * 1.1515
//                             dist = dist * 1.609344
//                             if (dist <= vDetectionRadious) {
//                                 var incLoc = new plugin.google.maps.LatLng(inc.latitude, inc.longitude);
//                                 map.addMarker({
//                                     'position': incLoc,
                                    
//                                     'icon': {
//                                         'url': inc.url
//                                     }
//                                 }, function(marker) {
                                   
//                                     marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
// //                                        swal({ title:inc.id, text:inc.content, imageUrl:inc.url, timer:5000, showConfirmButton:false });
//                                         $scope.PromptModal("INCIDENT",  "\r\n" +inc.id, "\r\n" +inc.content, inc.url+ "\r\n" , null, "20px", null);
//                                     });
//                                 });
//                             }
//                         });
//                     }
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
//                                        swal({ html:true, title:evt.id, text:"Road Closure:" + "<br/>" + evt.content + "<br/>Start: " + evt.start_date + " " + evt.start_time + "<br/>End: " + evt.end_date + " " + evt.end_time, timer:5000, showConfirmButton:false });
                                        $scope.PromptModal("EVENT", evt.id,  "\r\n" +"Road Closure:" + "\r\n" + evt.content +"\r\n\n"+ "Start: " + evt.start_date + " " + evt.start_time +"\r\n"+ "End: " + evt.end_date + " " + evt.end_time, null, null, "20px", null);
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
        
        $scope.CloseMessageModal = function(){
            document.getElementById("divMessageModal").style.display = "none";
        }
        $scope.PromptModal = function(ModalType, Title, Message, ImageUrl, VideoUrl, TitleTextSize, MessageTextSize){
            
            var vParent = document.getElementById("divMessageModal");
            vParent.innerHTML = "";
            vParent.setAttribute("style", "position:absolute;width:100%;height:100%;top:0px;left:0px;,z-index:5;display:none");
            vParent.addEventListener("click", function() {
                vParent.style.display = "none";
            });
            var vContent = document.createElement("div");
            vContent.setAttribute("style", "margin:0 auto;margin-top:50px;width:80%;background-color:white");
            switch(ModalType) {
                case "CCTV":
                    var vImage = document.createElement("img");
                    vImage.setAttribute("style", "width:100%")
                    vImage.src = ImageUrl;
                    vContent.appendChild(vImage);
                    break;
                case "VMS":
                    var vTitle = document.createElement("div");
                    vTitle.setAttribute("style", "font-weight: bold;text-align: center;width:100%;text-align:center;font-size:" + TitleTextSize);
                      
                    var vTitleText = document.createTextNode(Title);
                    var vMessage = document.createElement("div");
                    vMessage.setAttribute("style", "width:100%;text-align:center;font-size:" + MessageTextSize);
                    
                    var vMessageText = document.createTextNode(Message);
                    vMessage.appendChild(vMessageText);
                    vTitle.appendChild(vTitleText); 
                    vContent.appendChild(vTitle);
                    vContent.appendChild(vMessage);

                    break;
                case "PARKING":
                    var vImage = document.createElement("img");
                    vImage.setAttribute("style", "width:100%")
                    vImage.src = ImageUrl;
                    var vMessage = document.createElement("div");
                    vMessage.setAttribute("style", "font-weight: bold;width:100%;text-align:center;font-size:" + MessageTextSize);
                    var vMessageText = document.createTextNode(Message);
                    vMessage.appendChild(vMessageText);

                    vContent.appendChild(vImage);
                    vContent.appendChild(vMessage);
                    break;
                case "INCIDENT":
                    var vTitle = document.createElement("div");
                    vTitle.setAttribute("style", "font-weight: bold;width:100%;text-align:center;font-size:" + TitleTextSize);
                    var vTitleText = document.createTextNode(Title);
                    var vImage = document.createElement("img");
                    vImage.setAttribute("style", "width:15%;display: block;margin: auto;")
                    vImage.src = ImageUrl;
                    var vMessage = document.createElement("div");
                    vMessage.setAttribute("style", "width:100%;text-align:center;font-size:" + MessageTextSize);
                    var vMessageText = document.createTextNode(Message);
                    vMessage.appendChild(vMessageText);
                     vTitle.appendChild(vTitleText);
                    vContent.appendChild(vImage);
                    vContent.appendChild(vTitle);
                    vContent.appendChild(vMessage);
//                    vMessage.appendChild(vMessageText);
//                    vTitle.appendChild(vTitleText);
//                    vContent.appendChild(vImage);
                     
//                    vContent.appendChild(vMessage);
                    //vContent.appendChild(vMessage);
                   
                    break;
                case "TRAFFIC":
                    var vTitle = document.createElement("div");
                    vTitle.setAttribute("style", "font-weight: bold;width:100%;text-align:center;font-size:" + TitleTextSize);
                    var vTitleText = document.createTextNode(Title);
                    var vImage = document.createElement("img");
                    vImage.setAttribute("style", "width:100%")
                    vImage.src = ImageUrl;
                    var vMessage = document.createElement("div");
                    vMessage.setAttribute("style", "width:100%;font-size:" + MessageTextSize);
                    var vMessageText = document.createTextNode(Message);
                    vMessage.appendChild(vMessageText);
                    vTitle.appendChild(vTitleText);
                    vContent.appendChild(vTitle);
                    vContent.appendChild(vImage);
                    vContent.appendChild(vMessage);
                    break;
                case "EVENT":
                    var vTitle = document.createElement("div");
                    vTitle.setAttribute("style", "font-weight: bold;width:100%;text-align:center;font-size:" + TitleTextSize);
                    var vTitleText = document.createTextNode(Title);
                    var vMessage = document.createElement("div");
                    vMessage.setAttribute("style", "width:100%;font-size:" + MessageTextSize);
                    var vMessageText = document.createTextNode(Message);
                    vMessage.appendChild(vMessageText);
                    vTitle.appendChild(vTitleText);
                    vContent.appendChild(vTitle);
                    vContent.appendChild(vMessage);
                    break;
            }
            vParent.appendChild(vContent);
            vParent.style.display = "block";
           
        }

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

    });
})();