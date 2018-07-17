(function () {
    var _module = angular.module('popup', []);
    _module.factory('popup', [
        '$ionicPopup',
        '$q',
        function ($ionicPopup, $q) {

            var firstDeferred = $q.defer();
            firstDeferred.resolve();

            var lastPopupPromise = firstDeferred.promise;

            return {
                'alert': function (object) {
                    var deferred = $q.defer();

                    lastPopupPromise.then(function () {
                        $ionicPopup.alert(object).then(function (res) {
                            deferred.resolve(res);
                        });
                    });

                    lastPopupPromise = deferred.promise;

                    return deferred.promise;
                },
                'show': function(object) {
                    var deferred = $q.defer();

                    lastPopupPromise.then(function () {
                        $ionicPopup.show(object).then(function (res) {
                            deferred.resolve(res);
                        });
                    });

                    lastPopupPromise = deferred.promise;

                    return deferred.promise;
                },
                
                'error': function (object) {
                    var deferred = $q.defer();
                    var popupObject = {
                        'template': null,
                        'buttons': [{
                            'text': 'CLOSE',
                            'type': 'button-energized'
                        }]
                    }
                    if(typeof object == 'string') {
                        popupObject.title = object;               
                    }else if(object.description){
                        popupObject.title = object.description;  
                    }else{
                        popupObject.title = JSON.stringify(object); 
                    }
                    lastPopupPromise.then(function () {
                        $ionicPopup.alert(popupObject).then(function (res) {
                            deferred.resolve(res);
                        });
                    });
                    lastPopupPromise = deferred.promise;
                    return deferred.promise;
                }
            };
        }
    ])
}());