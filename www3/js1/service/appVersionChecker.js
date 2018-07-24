(function () {
    var _module = angular.module('appVersionChecker', []);
    _module.service('appVersionChecker',function(SemanticVersion, apiPrivateAppStore, App, $interval,popup, u){
        var _self = this;
        this.appid = '';
        this.os = '';
        this.appstore = {};
        this.current = {};
        this.timer = null;
        this.timerInterval = 3*60 * 1000;
        this._hasNewVersion = false;
        this.init = function(appid, os, version) {
            this.appid = appid;
            this.os = os;
            this.version = version;
            this.current.version = version;
            this.startTimer();
        }
        
        this.startTimer = function() {
            var _self = this;
            if(_self.timer) $interval.cancel(_self.timer);
            _self.check();
            _self.timer = $interval(_self.check, _self.timerInterval);
        }
        
        this.getHasNewVersion = function() {
            return this._hasNewVersion;
        }
        
        this.getNewVersionBadgeNumber = function() {
            return 1;
        }
        this.getCurrentVersion = function() {
            return this.current.version;
        }
        
        this.getDownloadUrl = function() {
            return this.appstore.downloadsrc;
        }
        
        this.check = function() {
            var _self = this;
            _self.get().then(function(result){
                
                var appstoreversion = new SemanticVersion(_self.appstore.version);
                var currentversion = new SemanticVersion(_self.current.version);
                 _self._hasNewVersion = appstoreversion.compare(currentversion) > 0;
            });
        }
        
        this.get = function() {
            var _self = this;
            return apiPrivateAppStore.get(this.appid, this.os).then(function(result){
                angular.extend(_self.appstore, result);
                return result;
            });
        }
        
        this.promptDownload = function() {
            var _self = this;
            var msg = '';
            var btn = '';
            if(this.getHasNewVersion()) {
                msg = sprintf('Latest version ready for download.<br>version %s ', this.appstore.version);
                btn = '<small>download</small>';
            }else{
                msg = sprintf('You are using latest version.<br>version %s ', this.appstore.version);
                btn = '<small>Redownload</small>';
            }
              u.popup.show({
                template: msg,
                title: 'Version Check',
                buttons: [
                  { text: 'Cancel' },
                  {
                    text: '<b>'+btn+'</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return 1;
                    }
                  }
                ]
              }).then(function(data){
                  if(data) {
                      window.open(_self.getDownloadUrl(), "_system");
                  }
              });
        }
        
        return this;
    });
}());