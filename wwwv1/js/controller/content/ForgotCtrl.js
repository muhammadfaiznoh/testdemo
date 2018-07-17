(function () {
    var _module = angular.module('controller');
    _module.controller('ForgotCtrl', function ($scope, ControllerBase, u, App, $http) {
        ControllerBase($scope, 'forgot');
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.userNew = {};

            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

            }
        });

        $scope.actionBack = function () {
            u.$state.go('home');
        }
        $scope.actionSubmit = function (email) {
            if (email == "") {
                swal({
                    title: "Error",
                    text: "Email is required",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonColor: "#F99F1E"
                });
            } else if (email == undefined) {
                swal({
                    title: "Error",
                    text: "Email is required",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonColor: "#F99F1E"
                });
            } else {
                $http.post(App.apiEndPoint + "forgotpass_v1", {
                    email: email
                }).then(function (res) {
                    var vReturn = res.data;
                    if (vReturn.trim() == "Success!") {
                        swal("Success", "Your temporary password has been sent to your email", "success");
                        u.$state.go('home');
                    } else {
                        swal("Warning", res.data, "warning");   
                    }
                }).error(function () {
                    alert("Fail Sent");
                });
            }
        }
    });
})();