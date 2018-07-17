(function () {
    var _module = angular.module('controller');
    _module.controller('ChangePasswordCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $sce, localStorage, $ionicHistory, $window, $http, $ionicActionSheet, ImageService, $cordovaCamera, $stateParams, $timeout) {
    ControllerBase($scope, 'changepassword');
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if (['none', 'forward', 'swap', 'back'].indexOf(state.direction) >= 0) {
            $scope.isExpanded = false;

            var storage = localStorage.getObject('userDetails');
            $scope.changepassword = {}
            $scope.staff = storage.staff;
            $scope.name = storage.name;
            $scope.email = storage.email;
            $scope.phone = storage.phone_no;
            $scope.blacklist_flag = storage.blacklist_flag;
            $scope.password = "(unchanged)";
            if (storage.image == null) {
                $scope.image = null;
            } else {
                $scope.image = storage.image;
            }
        }
    });
    $scope.submit = function(password, confirmpassword) {
        //alert($scope.email + " : " + password + " : " + App.apiEndPoint + "changepassword");
        if (password != confirmpassword) {
            swal("Error", "New Password and Confirm Password must be the same !", "error");
            return;
        }
        $http.post(App.apiEndPoint + "changepassword", {
            email: $scope.email,
            password: password
        }).then(function(res) {
            if (res.data == "Success!") {
                swal("Updated!", "Your password is updated.", "success");
                localStorage.setObject('userDetails', {
                    name: $scope.name,
                    staff: $scope.staff,
                    password: password,
                    email: $scope.email,
                    phone_no: $scope.phone,
                    image: $scope.image,
                    blacklist_flag: $scope.blacklist_flag
                });
                u.$state.go('tab.profile');
            } else if (res == "ServerError"){
                swal("Warning!", "Server Error, Please contact Administrator", "error");
            } else if (res == "User Not Exist!"){
                swal("Warning!", "User does not exist, Please contact Administrator", "error");
            }
        }).error(function() {
            swal("Fail!", "Fail to update password, Please contact Administrator.", "error");
        });
    }
    $scope.back = function() {
        u.$state.go('tab.profile');
    }
    });
})(); 