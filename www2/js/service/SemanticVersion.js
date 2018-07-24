(function () {
    var _module = angular.module('SemanticVersion', []);
    _module.factory('SemanticVersion', function(){
        var con = function(str){
            str = str || "0.0.0";
            var ret = {};
            var splits = str.split(".");
            ret.major = splits.length>0 ? parseInt(splits[0]) : 0;
            ret.minor = splits.length>1 ? parseInt(splits[1]) : 0;
            ret.patch = splits.length>2 ? parseInt(splits[2]) : 0;
            ret.toString = function() {
                return this.major+'.'+this.minor+'.'+this.patch;
            }
            ret.compare = function(right) {
                var left = this;
                if(left.major==right.major){
                    if(left.minor==right.minor){
                        if(left.patch==right.patch) return 0;
                        else return left.patch>right.patch ? 1 : -1;
                    }else return left.minor>right.minor ? 1 : -1;
                }else return left.major>right.major ? 1 : -1;
            }
            return ret;
        }
        console.log(new con(''));
        return con;
    });
}());