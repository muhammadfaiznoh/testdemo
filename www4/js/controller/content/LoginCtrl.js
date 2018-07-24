(function () {
    var _module = angular.module('controller');
    _module.controller('LoginCtrl', function ($scope, ControllerBase, u, App, $http, $q, UserService, $ionicLoading, localStorage, $cordovaOauth) {
        ControllerBase($scope, 'login');
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.loading = null;
            $scope.loginData = {};
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

                $scope.data = {};
            }
        });
        $scope.actionTwitter = function () {
            $cordovaOauth.twitter("rrRMNGVTOzfPnnIZkgVWJF1Bq", "7FKt75OxHkheYoamb99NYZw3tX0bbHaZ2xCRX47ZJ10KGPkPoC").then(function (result) {
                console.log("Response Object -> " + JSON.stringify(result));
            }, function (error) {
                console.log("Error -> " + error);
            });
        }
        $scope.actionSubmit = function () {
            if ($scope.loginData.email == "" || $scope.loginData.password == "") {
                swal({
                    title: "Error",
                    text: "Email & password must not empty",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonColor: "#F99F1E"
                });
            } else if ($scope.loginData.email == undefined || $scope.loginData.password == undefined) {
                swal({
                    title: "Error",
                    text: "Email & password must not empty",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonColor: "#F99F1E"
                });
            } else {
                 let myData = JSON.stringify({
        email: $scope.loginData.email,
        password: $scope.loginData.password
      });
                console.log(myData);
                $http.post(App.apiEndPoint + "login", myData).then(function (res) {
                    
                    var results;
                    results = res.data.split(",");
                    console.log("array : ", results);
                    $scope.items = res;

                    console.log($scope.loginData.email);
                    console.log($scope.loginData.password);
                    if (results[0] == "Y") {
                        console.log("publicUser");
                        if (results[6] != "data:image/jpeg;base64" && results[6] != "NULL") {
                            $scope.data_image = atob(results[6]);
                        } else {
                            if (results[7] != "undefined") {
                                $scope.data_image = results[7];
                            } else {
                                $scope.data_image = null;
                            }
                        }
                        localStorage.setObject('userDetails', {
                            staff: false,
                            name: results[1],
                            password: $scope.loginData.password,
                            email: results[3],
                            phone_no: results[4],
                            blacklist_flag: results[5],
                           
                            image: $scope.data_image
                        });
                        localStorage.setObject('test', {
                            session: 1
                        });
                        swal({
                            title: "Success!",
                            text: $scope.loginData.email,
                            timer: 2500,
                            type: "success",
                            showConfirmButton: false
                        }, function () {
                            swal.close();
                            //                            u.$state.go('tab.mapmain');
                            var applaunchCount = localStorage.getObject('launchCount');

                            //Check if it already exists or not
                            if (applaunchCount) {
                                var count = applaunchCount
                                console.log("value1", count);
                                u.$state.go('tab.mapmain');
                                //This is a second time launch, and count = applaunchCount
                            } else {
                                //Local storage is not set, hence first time launch. set the local storage item
                                var datas = localStorage.setObject('launchCount', 1);
                                console.log("value2", datas);

                                u.$state.go('tab.guide');
                            }

                        });

                    } else 
                        if (results[0] == "N") {
                        //alert("Staff");
                        console.log("staff");
                        if (results[6] != "data:image/jpeg;base64" && results[6] != "NULL") {
                            $scope.data_image = atob(results[6]);
                        } else {
                            if (results[7] != "undefined") {
                                $scope.data_image = results[7];
                            } else {
                                $scope.data_image = null;
                            }
                        }
                        localStorage.setObject('userDetails', {
                            staff: true,
                            name: results[1],
                            password: $scope.loginData.password,
                            email: results[3],
                            phone_no: results[4],
                            team: results[5],
                            image: $scope.data_image,
                            session: 1
                        });
                        $http.get(App.apiEndPoint + "jincident").then(function (res) {
                            $scope.items = res.data;
                            $scope.joblist = _.filter($scope.items, function (a) {
                                if (a.assigned_to == results[5] && a.status == "Approve") {
                                    return a.assigned_to == results[5];
                                }
                            });
                            if ($scope.joblist != null) {
                                var vERTObject = document.getElementById("ERTButton");
                                if (vERTObject != null) {
                                    var vJobNumber = document.getElementById("JobNumber");
                                    if (vJobNumber != null) {
                                        vJobNumber.parentNode.removeChild(vJobNumber);
                                    }
                                    if ($scope.joblist.length > 0) {
                                        var vDisplayObject = document.createElement("div");
                                        var vDisplayText = document.createTextNode($scope.joblist.length);
                                        vDisplayObject.appendChild(vDisplayText);
                                        var rect = vERTObject.getBoundingClientRect();
                                        var leftPos = document.documentElement.clientWidth - 30;
                                        vDisplayObject.setAttribute("id", "JobNumber");
                                        vDisplayObject.style.position = "absolute";
                                        vDisplayObject.style.left = leftPos + 'px';
                                        vDisplayObject.style.top = '0px';
                                        vDisplayObject.style.color = "Red";
                                        vDisplayObject.style.zIndex = "1";
                                        vERTObject.appendChild(vDisplayObject);
                                    }
                                }
                            }
                        });
                        swal({
                            title: "Success!",
                            text: $scope.loginData.email,
                            timer: 2500,
                            type: "success",
                            showConfirmButton: false
                        }, function () {
                            swal.close();
                            var applaunchCount = localStorage.getObject('launchCount');

                            //Check if it already exists or not
                            if (applaunchCount) {
                                var count = applaunchCount
                                console.log("value1", count);
                                u.$state.go('tab.mapmain');
                                //This is a second time launch, and count = applaunchCount
                            } else {
                                //Local storage is not set, hence first time launch. set the local storage item
                                var datas = localStorage.setObject('launchCount', 1);
                                console.log("value2", datas);

                                u.$state.go('tab.guide');
                            }
                        });
                    } else if (res.data == "Username and password is incorrect!") {
                        swal({
                            title: "Error",
                            text: res.data,
                            type: "error",
                            showConfirmButton: true,
                            confirmButtonColor: "#F99F1E"
                        });
                    }
                });
            }
        }
        $scope.actionSocial = function () {
            //            u.$state.go('verify');
            	
            $cordovaOauth.twitter("rrRMNGVTOzfPnnIZkgVWJF1Bq", 	"7FKt75OxHkheYoamb99NYZw3tX0bbHaZ2xCRX47ZJ10KGPkPoC").then(function (result) {
                console.log("Response Object -> " + JSON.stringify(result));
            }, function (error) {
                console.log("Error -> " + error);
            });
        }
        $scope.actionCreate = function () {
            u.$state.go('signup');
        }
        $scope.actionForgot = function () {
            u.$state.go('forgot');
        }
        $scope.actionBack = function () {
            var applaunchCount = localStorage.getObject('launchCount');

            //Check if it already exists or not
            if (applaunchCount) {
                var count = applaunchCount
                console.log("value1", count);
                u.$state.go('tab.mapmain');
                //This is a second time launch, and count = applaunchCount
            } else {
                //Local storage is not set, hence first time launch. set the local storage item
                var datas = localStorage.setObject('launchCount', 1);
                console.log("value2", datas);

                u.$state.go('tab.guide');
            }
            
        }
        $scope.actionSocialFB = function () {
            $cordovaOauth.facebook("132695477152102", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function (result) {
                console.log("Response Object -> " + JSON.stringify(result));
            }, function (error) {
                console.log("Error -> " + error);
            });
        }

    });
})();