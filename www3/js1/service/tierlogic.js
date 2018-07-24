    (function () {
    var _module = angular.module('tierlogic', []);
    _module.service('tierlogic',function(){
            var _self = this;
            this.setTiers = function(o) {
                this.tiers = o;
                this.tierMaps = [];
                _.each(this.tiers, function(k){
                    _self.tierMaps[k.TierId] = k;
                })
            }
            this.tierLevelNames = ['Branch',
                'Branch Division',
                'Branch Manager',
                'Manager',
                'Team Leader',
                'Senior Executive',
                'Executive',
                'External Team Level',
                'Migrated Level 201',
                'Test Level'
            ];
            this.hasSubTier = function(tier) {
                if(!tier)return false;
                return _.find(this.tiers, function(o){
                    return o.ParentTierId == tier.TierId;
                });
            }
            this.hasMoreThanOneMember = function(tier) {
                if(!tier)return false;
                var count = _.reduce(this.tiers, function(s,v){ return s + tier.TierId==v.TierId?1:0; }, 0);
                return count > 1;
            }
            this.isNotMigrationTier = function(o) {
                if(!o)return false;
                return o.Name && o.Name.indexOf("201")<0 && o.Name.indexOf("200")<0;
            }

            this.isNotInMigrationTier = function(o) {
                if(!o)return false;
                return this.isNotMigrationTier(this.tierMaps[o.TierId]);
            }
            this.tierLevelSortIndex = function(left) {
                if(!left || !left.TierLevelName)left = 999999;
                else {
                    left = this.tierLevelNames.indexOf(left.TierLevelName);
                    if(left<0)left = 1000000;
                }
                return left;
            }
            this.tierBranchTierLevelTierNameSortIndex = function(left) {
                var sort1 = left && left.branch ? left.branch.Name : "";
                var sort2 = this.tierLevelSortIndex(left);
                var sort3 = left && left.Name ? left.Name.toLowerCase() : "";
                return [sort1,sort2,sort3].join("_");;
            }
            this.compareTierLevel = function(left, right) {
                if(!left || !left.TierLevelName)left = 999999;
                else {
                    left = this.tierLevelNames.indexOf(left.TierLevelName);
                    if(left<0)left = 1000000;
                }
                if(!right || !right.Name)right = 999999;
                else {
                    right = this.tierLevelNames.indexOf(right.TierLevelName);
                    if(right<0)right = 1000000;
                }
                return left > right ? 1 : (left < right ? -1 : 0);
            }
            this.isSelfOrSubTierOfTier = function(left, right) {
                if (!left || !right) {
                    return false;
                } else if (left.ParentTierId == right.TierId) {
                    return true;
                } else if (left.TierId == right.TierId) {
                    return true;
                } else if (!left.ParentTierId && !this.tierMaps[left.ParentTierId]) {
                    return false;
                } else {
                    return this.isSelfOrSubTierOfTier(this.tierMaps[left.ParentTierId], right);
                }
            }
            this.getParentTierInTiers = function(tier, inTiers) {
                var ret = null;
                if (inTiers) {
                    for (var k = 0; k < inTiers.length; k++) {
                        if (this.isSelfOrSubTierOfTier(tier, inTiers[k])) {
                            ret = inTiers[k];
                            break;
                        }
                    }
                }
                return ret;
            }
            return this;
    });
}());