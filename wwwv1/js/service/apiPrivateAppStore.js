(function () {
    var _module = angular.module('apiPrivateAppStore', []);
    
    _module.service('apiPrivateAppStore', function(App, $http, Error){
        var _self = this;
        this.get = function (appid, os) {
            var _self = this;
            var option = {
                cache: false,
                isapi: false
            };
            var url = sprintf(App.privateAppStoreApiEndPoint + 'app.php?appid=%s&platform=%s', appid, os);
            return $http.get(url, option).then(function(result){
                if(!result.data || result.data.error_exist) {
                    throw new Error('Unable to retrive app version');
                }else{
                    return result.data.result;
                }
            });
        }
        return this; 
    });
}());
