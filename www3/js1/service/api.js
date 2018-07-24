(function () {
    var _module = angular.module('api', []);


    //    _module.constant('PropertyType', {
    //        Commercial: 0,
    //        Hotel: 1,
    //        Residential: 2
    //    });
    //
    //    _module.constant('ImageType', {
    //        CoverBig: 0,
    //        CoverSmall: 1,
    //        Gallery: 2,
    //        Construction: 3,
    //        Specification: 4
    //    });
    //
    //    _module.constant('FeedbackFormCategory', {
    //        Project: 0,
    //        Event: 1,
    //        Agent: 2,
    //        Program: 3,
    //        Schedule: 4,
    //        Voucher: 5
    //    });
    //
    //    _module.constant('FormFieldType', {
    //        TextBox: 0,
    //        TextArea: 1,
    //        RadioButton: 2,
    //        CheckBox: 3,
    //        DropDownList: 4,
    //        Signature: 5,
    //        Upload: 6,
    //        Number: 100,
    //        Calendar: 101,
    //        Phone: 102,
    //        IC: 103,
    //        Purchaser: 104,
    //        Solicitor: 105,
    //        Nationality: 106,
    //        MultiSelect: 107,
    //        PageBreak: 1000,
    //
    //    });

    //    _module.constant('ClickMode', {
    //        ClickShowDetail: "ClickShowDetail",
    //        ClickOpenUrl: "ClickOpenUrl",
    //        ClickNoAction: "ClickNoAction"
    //    });
    //
    //    _module.constant('ProSyncVisibilityMode', {
    //        WhatsNew: 1,
    //        Voucher: 2,
    //        ShowOnWhatsNewWithVoucher: 3
    //    })



    _module.service('apiAuth', function ($injector, App, localStorage) {
        this.authorizate = function () {
            var $http = $http || $injector.get('$http');
            var $httpParamSerializer = $httpParamSerializer || $injector.get('$httpParamSerializer');
            return $http({
                isapi: true,
                ignoreAuthModule: true,
                method: 'POST',
                url: App.authorizateApiEndPoint + 'Token',
                data: $httpParamSerializer({
                    username: App.apiUserUsername,
                    password: App.apiUserPassword,
                    grant_type: 'password'
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (data) {
                App.token = data;
                localStorage.setObject('token', data);
            });
        }

        this.retryHttpRequest = function (_config) {
            var $http = $http || $injector.get('$http');
            var config = _.extend({}, _config);
            config.cache = false;
            config.ignoreAuthModule = true;
            return $http(config);
        }

        this.authorizateAndRetryHttpRequest = function (_config) {
            var _self = this;
            return _self.authorizate().then(function () {
                return _self.retryHttpRequest(_config);
            });
        };
    });
    /* ==========================================================================
       interceptor. logging / change response object / error object / retry http if 401
       ========================================================================== */
    _module.config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, App, ErrorDomain, Error, apiAuth) {
            var filterUrls = [App.apiEndPoint, App.resourceEndPoint, App.authorizateApiEndPoint, App.privateAppStoreApiEndPoint];

            function createErrorFromResponse(resp) {
                console.log('resp', resp);
                var ret = null;
                if (resp.data) {
                    var json = resp.data;
                    if (!ret && resp.data.hasOwnProperty('error')) {
                        ret = new Error(
                            json.error_description || (json.error),
                            ErrorDomain.ServerInfracture,
                            0
                        );
                    }
                    if (!ret && resp.data.hasOwnProperty('ErrorCode')) {
                        ret = new Error(
                            json.Message || ('ErrorCode : ' + json.ErrorCode),
                            ErrorDomain.ServerInfracture,
                            json.ErrorCode
                        );
                    }
                    if (!ret && resp.data.hasOwnProperty('Message')) {
                        ret = new Error(
                            json.Message || "Unable to interprete server reply",
                            ErrorDomain.ClientHTTP,
                            resp.status
                        );
                    }
                    if (!ret) {
                        ret = new Error(
                            "Unable to interprete server reply",
                            ErrorDomain.ClientHTTP,
                            resp.status
                        );
                    }
                } else {
                    if (!ret && resp.status === 0) {
                        if (resp.config && (typeof resp.config.timeout == 'object')) {
                            if (resp.config.timeout.$$state.status == 1) {
                                ret = new Error(
                                    "Cancel HTTP",
                                    ErrorDomain.ClientApplicationCancelHTTP,
                                    0
                                );
                            }
                        }
                        if (!ret) {
                            ret = new Error(
                                "Unable to connect to server",
                                ErrorDomain.ClientHTTP,
                                resp.status
                            );
                        }
                    }
                    if (!ret) {
                        ret = new Error(
                            resp.statsText,
                            ErrorDomain.ClientHTTP,
                            resp.status
                        );
                    }
                }
                return ret;
            }
            return {
                'request': function (config) {
                    var url = config.url;
                    var matchFilter = config && config.isapi;
                    if (matchFilter) {
                        var token = App.token && App.token.access_token ? App.token.access_token : "undefined";
                        //if (App.debug.api.interceptor) console.log('request', config);
                        config.headers.Authorization = 'Bearer ' + token;
                        return config;
                    } else {
                        return config;
                    }
                },
                'requestError': function (rejection) {
                    var url = rejection.config.url;
                    var matchFilter = rejection.config && rejection.config.isapi;
                    if (matchFilter) {
                        if (App.debug.api.interceptor) console.log('requestError', rejection);
                        return $q.reject(rejection);
                    } else {
                        return $q.reject(rejection);
                    }
                },
                'response': function (resp) {
                    var url = resp.config.url;
                    var matchFilter = resp.config && resp.config.isapi;
                    if (matchFilter) {
                        if (App.debug.api.interceptor) console.log('response', resp);
                        return resp.data;
                    } else {
                        return resp;
                    }
                },
                'responseError': function (resp) {
                    var url = resp && resp.config ? resp.config.url : '';
                    var matchFilter = resp.config && resp.config.isapi;
                    if (matchFilter) {
                        if (!resp.config.ignoreAuthModule && resp.status == 401) {
                            return apiAuth.authorizateAndRetryHttpRequest(resp.config);
                        } else {
                            var error = createErrorFromResponse(resp);
                            if (App.debug.api.interceptor) console.log('responseError', error);
                            return $q.reject(error);
                        }
                    } else {
                        return $q.reject(resp);
                    }
                }
            };
        });
    });
    /* ==========================================================================
       API Base Class
       ========================================================================== */
    _module.factory('apiBase', function ($q, $http, App, localStorage) {
        function apiBase() {
            var _this = this;
            this.values = [];
            this._useCache = false;
        }
        apiBase.prototype.useCache = function (b) {
            this._useCache = (b === null) || (b === undefined) ? true : !!b;
            return this;
        }
        apiBase.prototype.useCancelPromise = function (b) {
            this._useCancelPromise = b;
            return this;
        }
        apiBase.prototype.add = function (key, val) {
            var arr = val;
            var _self = this;
            if (!(val instanceof Array)) arr = [val];
            _.each(arr, function (o) {
                _self.values.push(o);
            });
        }
        apiBase.prototype.addOrUpdate = function (key, val) {
            var arr = val;
            var _self = this;
            if (!(val instanceof Array)) arr = [val];
            _.each(arr, function (o) {
                var found = _.find(_self.values, function (o2) {
                    return o2[key] == o[key];
                });
                if (found) {
                    _.extend(found, val);
                } else {
                    _self.values.push(val);
                }
            });
        }
        apiBase.prototype.loadFromStorage = function () {

        }
        apiBase.prototype.saveToStorage = function () {

        }
        apiBase.prototype.http = function (option) {
            var _self = this;
            option = _.extend(option || {}, {
                cache: this._useCache,
                isapi: true
            });
            if (this._useCancelPromise !== undefined) {
                option.timeout = this._useCancelPromise
            }
            return $http(option).finally(function () {
                _self._useCancelPromise = undefined;
            });
        }
        apiBase.prototype.httpget = function (url, option) {
            var _self = this;
            option = _.extend(option || {}, {
                cache: this._useCache,
                isapi: true
            });
            if (this._useCancelPromise !== undefined) {
                option.timeout = this._useCancelPromise
            }
            return $http.get(url, option).finally(function () {
                _self._useCancelPromise = undefined;
            });
        }
        apiBase.prototype.httppost = function (url, data, option) {
            var _self = this;
            option = _.extend(option || {}, {
                cache: this._useCache,
                isapi: true
            });
            if (this._useCancelPromise !== undefined) {
                option.timeout = this._useCancelPromise
            }
            return $http.post(url, data, option).finally(function () {
                _self._useCancelPromise = undefined;
            });
        }
        return apiBase;
    });
    /* ==========================================================================
       API
       ========================================================================== */
    //    _module.factory('apiProject', function ($http, apiBase, App) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.query = function () { //
    //
    //            return this.httpget(App.apiEndPoint + 'AppProject/GetUnBlockProjects').then(function (result) {
    //                return _.filter(result, function (o) {
    //                    return o.ShowAtDirectorApp;
    //                })
    //            });
    //        }
    //        api.prototype.getById = function (id) {
    //            return this.httpget(App.apiEndPoint + sprintf('AppProject/%s', id)).then(function (data) {
    //                data.ProjectId = data.Id;
    //                return data;
    //            });
    //        }
    //        api.prototype.getRate = function (where) {
    //            if (where.Customer)
    //                return this.httpget(App.apiEndPoint + sprintf('Rate/GetProject?iProjectID=%s&iCustomerID=%s', where.Project.ProjectId, where.Customer.CustomerId)).then(function (data) {
    //                    data.ProjectId = data.ProjectID;
    //                    return data;
    //                });
    //            else
    //                return this.get(where.Project.ProjectId).then(function (data) {
    //                    return {
    //                        ProjectId: data.ProjectId,
    //                        Total5: data.Star5,
    //                        Total4: data.Star4,
    //                        Total3: data.Star3,
    //                        Total2: data.Star2,
    //                        Total1: data.Star1,
    //                        AverRate: data.StarAve,
    //                        Total: data.StarTotal
    //                    };
    //                });
    //        }
    //        api.prototype.setRate = function (data) {
    //            return this.httpget(App.apiEndPoint + sprintf('Rate/UpdateProjectRate?iProjectId=%s&iCustomerID=%s&iRateValue=%s', data.Project.ProjectId, data.Customer.CustomerId, data.value));
    //        }
    //        return new api();
    //    })

    //    _module.factory('apiCustomerProjectFeedbackFormTemplate', function ($http, apiBase, App) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.get = function () {
    //            return this.httpget(App.apiEndPoint + 'CustomerProjectFeedBackForm/GetFeedBackForm');
    //        }
    //        return new api();
    //    })
    //
    _module.factory('apiBounds', function ($http, App) {
            var data = [];

            return {
                getData: function () {
                    return $http.get("http://ibsb.dlinkddns.com/edrive/api/json_boundry1?lat1=" + swlat + "&lng1=" + swlng + "&lat2=" + nelat + "&lng2=" + nelng).then(function (response) {
                        data = response;
                        return data;
                    });
                }
            }
        })
        //
        //    _module.factory('apiProgramFeedbackFormTemplate', function ($http, apiBase, App) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.get = function () {
        //            return this.httpget(App.apiEndPoint + 'CustomerProjectFeedBackForm/GetProgramFeedBackForm');
        //        }
        //        return new api();
        //    })
        //
        //    _module.factory('apiProgramFeedbackForm', function ($http, apiBase, App) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.submit = function (data) {
        //            return this.httppost(App.apiEndPoint + 'CustomerProjectFeedBackForm/UpdateProgramFeedbackForm', data);
        //        }
        //        return new api();
        //    })
        //
        //    _module.factory('apiCustomerEventFeedbackFormTemplate', function ($http, apiBase, App) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.get = function () {
        //            return this.httpget(App.apiEndPoint + 'CustomerEventFeedBackForm/GetFeedBackForm');
        //        }
        //        return new api();
        //    })
        //
        //    _module.factory('apiCustomerEventFeedbackForm', function ($http, apiBase, App) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.submit = function (data) {
        //            return this.httppost(App.apiEndPoint + 'CustomerEventFeedBackForm/UpdateFeedbackForm', data);
        //        }
        //        return new api();
        //    })
        //
        //    _module.factory('apiCustomerSysUserFeedbackFormTemplate', function ($http, apiBase, App) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.get = function () {
        //            return this.httpget(App.apiEndPoint + 'CustomerSysUserFeedBackForm/GetFeedBackForm');
        //        }
        //        return new api();
        //    })
        //
        //    _module.factory('apiCustomerSysUserFeedbackForm', function ($http, apiBase, App) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.submit = function (data) {
        //            return this.httppost(App.apiEndPoint + 'CustomerSysUserFeedBackForm/UpdateFeedbackForm', data);
        //        }
        //        return new api();
        //    })
        //
        //
        //    _module.factory('apiCustomer', function ($http, $q, apiBase, App, Error, ErrorDomain, localStorage) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.login = function (data) {
        //            if (!data.email || !data.password) return $q.reject(new Error('Username and password must not empty'));
        //            return this.httpget(App.apiEndPoint + sprintf('AppCustomer/GetByEmailAndPass?email=%s&pass=%s', data.email, data.password)).then(function (data) {
        //                if (data == null) throw new Error('Username doesn\'t match with password');
        //                else {
        //                    App.user = data;
        //                    localStorage.setObject('user', data);
        //                    return data;
        //                }
        //            });
        //        }
        //        api.prototype.add = function (data) {
        //            return this.httppost(App.apiEndPoint + 'AppCustomer/Add', {
        //                'params': data
        //            });
        //        }
        //        api.prototype.save = function (data) {
        //            return this.httppost(App.apiEndPoint + sprintf('AppCustomer/%s/Edit', data.IC), {
        //                'params': data
        //            });
        //        }
        //        api.prototype.forgetPassword = function (data) {
        //            return this.httpget(App.apiEndPoint + sprintf('AppEmail/ForgetPassWord?email=%s', data.Customer.Email));
        //        }
        //        return new api();
        //    })
        //
        //    _module.factory('apiUnit', function ($http, apiBase, App, apiProject, $q, Error) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.query = function (where) {
        //            if (!where.Customer) {
        //                return $q(function (a, b) {
        //                    b(new Error("Invalid parameter where, missing where.Customer"));
        //                });
        //            }
        //
        //            var api1 = apiProject.query();
        //            var api2 = this.httpget(App.apiEndPoint + sprintf('AppCustomer/%s/Units', where.Customer.IC));
        //
        //            return $q.all([api1, api2]).then(function (results) {
        //                var customerProjects = results[0];
        //                var projects = results[1];
        //                var units = [];
        //                _.each(customerProjects, function (customerProject) {
        //                    var customerUnits = [];
        //                    var found = _.find(projects, function (project) {
        //                        return customerProject.ProjectId == project.ProjectId;
        //                    });
        //                    customerUnits = _.each(customerProject.Units, function (unit) {
        //                        unit.project = found;
        //                    });
        //                    units = units.concat(customerUnits);
        //                });
        //                return units;
        //            });
        //        }
        //        return new api();
        //    })



    _module.factory('apiLogin', function ($http, apiBase, App, Error, ErrorDomain, $q, localStorage) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.login = function (data) {
            if (!data.username || !data.password) {
                return $q(function (a, b) {
                    b(new Error("Username and password must not empty"));
                });
            }
            var data = {
                fullname: data.username,
                password: data.password
            };

            console.log("Username", data.username);
            return this.httpget(App.apiEndPoint + 'muser.php').then(function (data) {
                if (data == null) throw new Error('Username doesn\'t match with password');
                else {
                    App.user = data;
                    localStorage.setObject('user', data);
                    return data;
                }
            }).catch(function (error) {
                if (error.domain == ErrorDomain.ServerInfracture && error.code == 1) {
                    throw new Error("Username doesn\'t match with password");
                } else {
                    throw error;
                }
            });
        }

        api.prototype.logout = function () {
            App.user = null;
            localStorage.setObject('user', null);
            App.token = null;
            localStorage.setObject('token', null);
        }

        //        api.prototype.query = function (where) {
        //            var self = this;
        //            where = where || {};
        //            if (where.hasOwnProperty('Customer'))
        //                return this.httpget(App.apiEndPoint + sprintf('AppCustomer/%s/Agents', where.Customer.IC));
        //            else if (where.hasOwnProperty('Project'))
        //                return this.httpget(App.apiEndPoint + sprintf('AppUser/GetByProjectId?iProjectID=%s', where.Project.ProjectId));
        //            else if (where.hasOwnProperty('AssociateUnit'))
        //                return this.httpget(App.apiEndPoint + sprintf('AppUser/GetByUnitId?iUnitID=%s', where.AssociateUnit.UnitId));
        //            else {
        //                return this.httpget(App.apiEndPoint + sprintf('AppUser/GetAllUsers'));
        //            }
        //        }
        //        api.prototype.get = function (id) {
        //            return this.httpget(App.apiEndPoint + sprintf('AppUser/%s', id));
        //        }
        //        api.prototype.getRate = function (where) {
        //            if (where.Customer)
        //                return this.httpget(App.apiEndPoint + sprintf('api/Rate/GetSysUser?iSysUserID=%s&iCustomerID=%s', where.Consultant.UserId, where.Customer.CustomerId)).then(function (data) {
        //                    data.UserId = data.SystemUserID;
        //                    return data;
        //                })
        //            else
        //                return this.get(where.Consultant.UserId).then(function (data) {
        //                    return {
        //                        UserId: data.UserId,
        //                        Total5: data.Star5,
        //                        Total4: data.Star4,
        //                        Total3: data.Star3,
        //                        Total2: data.Star2,
        //                        Total1: data.Star1,
        //                        AverRate: data.StarAve,
        //                        Total: data.StarTotal
        //                    };
        //                });
        //        }
        //        api.prototype.setRate = function (data) {
        //            return this.httpget(App.apiEndPoint + sprintf('Rate/UpdateSysUser?iSysUserID=%s&iCustomerID=%s&iRateValue=%s', data.Consultant.UserId, data.Customer.CustomerId, data.value));
        //        }
        return new api();
    })



    _module.factory('apiAppUser', function (apiLogin) {
        return apiLogin;
    })


    //    _module.factory('apiConstruction', function ($http, apiBase, App, Error, $q) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.query = function (where) {
    //            if (where.hasOwnProperty('Project'))
    //                return this.httpget(App.apiEndPoint + sprintf('AppProject/GetContructions?projectid=%s', where.Project.ProjectId));
    //            else {
    //                return $q.reject(new Error('Unimplemented'));
    //            }
    //        }
    //        return new api();
    //    })

    //    _module.factory('apiWhatsNew', function ($http, apiBase, App, Error, $q, ImageType, ProSyncVisibilityMode) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.mapModel = function (o) {
    //            o.startTime = o.StartTimeUtc ? new Date(o.StartTimeUtc) : null;
    //            o.endTime = o.EndTimeUtc ? new Date(o.EndTimeUtc) : null;
    //            if (o.startTime && o.endTime) {
    //                var _start = moment(o.startTime);
    //                var _end = moment(o.endTime);
    //                if (_start.format('D MMM YYYY') == _end.format('D MMM YYYY')) {
    //                    _start = _start.format('D MMM YYYY');
    //                    o.startEndPeriod = _start;
    //                } else if (_start.format('MMM YYYY') == _end.format('MMM YYYY')) {
    //                    _start = _start.format('D');
    //                    _end = _end.format('D MMM YYYY');
    //                    o.startEndPeriod = _start + ' - ' + _end;
    //                } else if (_start.format('YYYY') == _end.format('YYYY')) {
    //                    _start = _start.format('D MMM');
    //                    _end = _end.format('D MMM YYYY');
    //                    o.startEndPeriod = _start + ' - ' + _end;
    //                } else {
    //                    _start = _start.format('D MMM YYYY');
    //                    _end = _end.format('D MMM YYYY');
    //                    o.startEndPeriod = _start + ' - ' + _end;
    //                }
    //            } else if (o.startTime) {
    //                var _start = moment(o.startTime);
    //                _start = _start.format('D MMM YYYY');
    //                o.startEndPeriod = 'From ' + _start;
    //            } else if (!o.endTime) {
    //                var _end = moment(o.endTime);
    //                _end = _end.format('D MMM YYYY');
    //                o.startEndPeriod = 'Until ' + _start;
    //            } else {
    //                o.startEndPeriod = '';
    //            }
    //            var photo = _.find(o.PhotoList, function (p) {
    //                return p.ImageType == ImageType.CoverBig;
    //            });
    //            o.voucherBigPhotoResourceKey = photo ? photo.ResourceKey : null;
    //            o.voucherBigPhotoWidth = photo ? photo.Width : 0;
    //            o.voucherBigPhotoHeight = photo ? photo.Height : 0;
    //
    //            photo = _.find(o.PhotoList, function (p) {
    //                return p.ImageType == ImageType.CoverSmall;
    //            });
    //            o.voucherSmallPhotoResourceKey = photo ? photo.ResourceKey : null;
    //            o.voucherSmallPhotoWidth = photo ? photo.Width : 0;
    //            o.voucherSmallPhotoHeight = photo ? photo.Height : 0;
    //            return o;
    //        }
    //        api.prototype.mapModels = function (arr) {
    //            var _self = this;
    //            return _.map(arr, function (o) {
    //                return _self.mapModel(o);
    //            });
    //        }
    //        api.prototype.mapModelToRateModel = function (data) {
    //            return {
    //                VoucherId: data.VoucherId,
    //                Total5: data.Star5,
    //                Total4: data.Star4,
    //                Total3: data.Star3,
    //                Total2: data.Star2,
    //                Total1: data.Star1,
    //                AverRate: data.StarAve,
    //                Total: data.StarTotal,
    //                RateValue: null
    //            };
    //        }
    //        api.prototype.mapRateToRateModel = function (data) {
    //            if (!data) return null;
    //            else {
    //                return {
    //                    VoucherId: data.VoucherId,
    //                    Total5: data.TotalStar5,
    //                    Total4: data.TotalStar4,
    //                    Total3: data.TotalStar3,
    //                    Total2: data.TotalStar2,
    //                    Total1: data.TotalStar1,
    //                    AverRate: data.AverageStar,
    //                    Total: data.TotalStar,
    //                    RateValue: data.RatingValue
    //                };
    //            }
    //        }
    //        api.prototype.query = function (data) {
    //            var _self = this;
    //            var BirthdayVoucher = data ? data.BirthdayVoucher : undefined;
    //            return this.httpget(App.apiEndPoint + 'WhatNews/GetVouchers').then(function (data) {
    //                var data = _.filter(data, function (o) {
    //                    return o.ProSyncVisibility == ProSyncVisibilityMode.ShowOnWhatsNewWithVoucher || o.ProSyncVisibility == ProSyncVisibilityMode.WhatsNew;
    //                });
    //                return _.map(data, function (o) {
    //                    return _self.mapModel(o);
    //                });
    //            });
    //        }
    //        api.prototype.get = function (id) {
    //            var _self = this;
    //            return this.query().then(function (result) {
    //                return _.find(result, function (o) {
    //                    return id == o.VoucherId;
    //                });
    //            });
    //        }
    //        api.prototype.attemp = function (data) {
    //            return this.httpget(App.apiEndPoint + sprintf('Rating/AttendVoucher?VoucherId=%s&CustomerId=%s', data.Voucher.VoucherId, data.Customer.CustomerId));
    //        }
    //        api.prototype.unattemp = function (data) {
    //            return this.httpget(App.apiEndPoint + sprintf('Rating/UnAttendVoucher?VoucherId=%s&CustomerId=%s', data.Voucher.VoucherId, data.Customer.CustomerId));
    //        }
    //        api.prototype.getAttemp = function (data) {
    //            return this.getRate(where);
    //        }
    //        api.prototype.getRate = function (where) {
    //            var _self = this;
    //            if (where.Customer)
    //                return this.httpget(App.apiEndPoint + sprintf('Rating/GetVoucher?VoucherId=%s&CustomerId=%s', where.Voucher.VoucherId, where.Customer.CustomerId)).then(function (data) {
    //                    return _self.mapRateToRateModel(data);
    //                });
    //            else
    //                return this.get(where.Voucher.VoucherId).then(function (data) {
    //                    return _self.mapModelToRateModel(data);
    //                });
    //        }
    //        api.prototype.setRate = function (data) {
    //            var _self = this;
    //            var data = {
    //                "VoucherRatingId": 1,
    //                "CustomerId": data.Customer.CustomerId,
    //                "VoucherId": data.Voucher.VoucherId,
    //                "RatingValue": data.value,
    //                "Remark": "sample string 5",
    //                "TotalStar5": 6,
    //                "TotalStar4": 7,
    //                "TotalStar3": 8,
    //                "TotalStar2": 9,
    //                "TotalStar1": 10,
    //                "AverageStar": 11.1,
    //                "TotalStar": 12,
    //                "AttendRecordDate": "2016-01-13T17:45:48.4189453+08:00",
    //                "Attend": true,
    //                "TotalAttend": 14,
    //                "RecordDate": "2016-01-13T17:45:48.4189453+08:00"
    //            }
    //            return this.httppost(App.apiEndPoint + 'Rating/Voucher', data).then(function (data) {
    //                return _self.mapRateToRateModel(data);
    //            });
    //        }
    //        return new api();
    //    })




    //    _module.factory('apiVoucher', function ($http, apiBase, App, Error, $q, ImageType, ProSyncVisibilityMode) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.mapModel = function (o) {
    //            o.startTime = o.StartTimeUtc ? new Date(o.StartTimeUtc) : null;
    //            o.endTime = o.EndTimeUtc ? new Date(o.EndTimeUtc) : null;
    //            if (o.startTime && o.endTime) {
    //                var _start = moment(o.startTime);
    //                var _end = moment(o.endTime);
    //                if (_start.format('D MMM YYYY') == _end.format('D MMM YYYY')) {
    //                    _start = _start.format('D MMM YYYY');
    //                    o.startEndPeriod = _start;
    //                } else if (_start.format('MMM YYYY') == _end.format('MMM YYYY')) {
    //                    _start = _start.format('D');
    //                    _end = _end.format('D MMM YYYY');
    //                    o.startEndPeriod = _start + ' - ' + _end;
    //                } else if (_start.format('YYYY') == _end.format('YYYY')) {
    //                    _start = _start.format('D MMM');
    //                    _end = _end.format('D MMM YYYY');
    //                    o.startEndPeriod = _start + ' - ' + _end;
    //                } else {
    //                    _start = _start.format('D MMM YYYY');
    //                    _end = _end.format('D MMM YYYY');
    //                    o.startEndPeriod = _start + ' - ' + _end;
    //                }
    //            } else if (o.startTime) {
    //                var _start = moment(o.startTime);
    //                _start = _start.format('D MMM YYYY');
    //                o.startEndPeriod = 'From ' + _start;
    //            } else if (!o.endTime) {
    //                var _end = moment(o.endTime);
    //                _end = _end.format('D MMM YYYY');
    //                o.startEndPeriod = 'Until ' + _start;
    //            } else {
    //                o.startEndPeriod = '';
    //            }
    //            var photo = _.find(o.PhotoList, function (p) {
    //                return p.ImageType == ImageType.CoverBig;
    //            });
    //            o.voucherBigPhotoResourceKey = photo ? photo.ResourceKey : null;
    //            o.voucherBigPhotoWidth = photo ? photo.Width : 0;
    //            o.voucherBigPhotoHeight = photo ? photo.Height : 0;
    //
    //            photo = _.find(o.PhotoList, function (p) {
    //                return p.ImageType == ImageType.CoverSmall;
    //            });
    //            o.voucherSmallPhotoResourceKey = photo ? photo.ResourceKey : null;
    //            o.voucherSmallPhotoWidth = photo ? photo.Width : 0;
    //            o.voucherSmallPhotoHeight = photo ? photo.Height : 0;
    //            return o;
    //        }
    //        api.prototype.mapModels = function (arr) {
    //            var _self = this;
    //            return _.map(arr, function (o) {
    //                return _self.mapModel(o);
    //            });
    //        }
    //        api.prototype.mapModelToRateModel = function (data) {
    //            return {
    //                VoucherId: data.VoucherId,
    //                Total5: data.Star5,
    //                Total4: data.Star4,
    //                Total3: data.Star3,
    //                Total2: data.Star2,
    //                Total1: data.Star1,
    //                AverRate: data.StarAve,
    //                Total: data.StarTotal,
    //                RateValue: null
    //            };
    //        }
    //        api.prototype.mapRateToRateModel = function (data) {
    //            if (!data) return null;
    //            else {
    //                return {
    //                    VoucherId: data.VoucherId,
    //                    Total5: data.TotalStar5,
    //                    Total4: data.TotalStar4,
    //                    Total3: data.TotalStar3,
    //                    Total2: data.TotalStar2,
    //                    Total1: data.TotalStar1,
    //                    AverRate: data.AverageStar,
    //                    Total: data.TotalStar,
    //                    RateValue: data.RatingValue
    //                };
    //            }
    //        }
    //        api.prototype.query = function (data) {
    //            var _self = this;
    //            var BirthdayVoucher = data ? data.BirthdayVoucher : undefined;
    //            return this.httpget(App.apiEndPoint + 'WhatNews/GetVouchers').then(function (data) {
    //                var data = _.filter(data, function (o) {
    //                    var ret = true;
    //                    if (BirthdayVoucher === undefined) {
    //                        ret = ret && true;
    //                    } else if (BirthdayVoucher) {
    //                        ret = ret && data.BirthdayVoucher;
    //                    } else {
    //                        ret = ret && !data.BirthdayVoucher;
    //                    }
    //                    ret = ret && (data.ProSyncVisibility == ProSyncVisibilityMode.ShowOnWhatsNewWithVoucher || data.ProSyncVisibility == ProSyncVisibilityMode.Voucher);
    //                    return ret;
    //                });
    //                return _.map(data, function (o) {
    //                    return _self.mapModel(o);
    //                });
    //            });
    //        }
    //        api.prototype.get = function (id) {
    //            var _self = this;
    //            return this.query().then(function (result) {
    //                return _.find(result, function (o) {
    //                    return id == o.VoucherId;
    //                });
    //            });
    //        }
    //        api.prototype.attemp = function (data) {
    //            return this.httpget(App.apiEndPoint + sprintf('Rating/AttendVoucher?VoucherId=%s&CustomerId=%s', data.Voucher.VoucherId, data.Customer.CustomerId));
    //        }
    //        api.prototype.unattemp = function (data) {
    //            return this.httpget(App.apiEndPoint + sprintf('Rating/UnAttendVoucher?VoucherId=%s&CustomerId=%s', data.Voucher.VoucherId, data.Customer.CustomerId));
    //        }
    //        api.prototype.getAttemp = function (data) {
    //            return this.getRate(where);
    //        }
    //        api.prototype.getRate = function (where) {
    //            var _self = this;
    //            if (where.Customer)
    //                return this.httpget(App.apiEndPoint + sprintf('Rating/GetVoucher?VoucherId=%s&CustomerId=%s', where.Voucher.VoucherId, where.Customer.CustomerId)).then(function (data) {
    //                    return _self.mapRateToRateModel(data);
    //                });
    //            else
    //                return this.get(where.Voucher.VoucherId).then(function (data) {
    //                    return _self.mapModelToRateModel(data);
    //                });
    //        }
    //        api.prototype.setRate = function (data) {
    //            var _self = this;
    //            var data = {
    //                "VoucherRatingId": 1,
    //                "CustomerId": data.Customer.CustomerId,
    //                "VoucherId": data.Voucher.VoucherId,
    //                "RatingValue": data.value,
    //                "Remark": "sample string 5",
    //                "TotalStar5": 6,
    //                "TotalStar4": 7,
    //                "TotalStar3": 8,
    //                "TotalStar2": 9,
    //                "TotalStar1": 10,
    //                "AverageStar": 11.1,
    //                "TotalStar": 12,
    //                "AttendRecordDate": "2016-01-13T17:45:48.4189453+08:00",
    //                "Attend": true,
    //                "TotalAttend": 14,
    //                "RecordDate": "2016-01-13T17:45:48.4189453+08:00"
    //            }
    //            return this.httppost(App.apiEndPoint + 'Rating/Voucher', data).then(function (data) {
    //                return _self.mapRateToRateModel(data);
    //            });
    //        }
    //        return new api();
    //    })




    //
    //    _module.factory('apiTier', function ($http, apiBase, App, Error, $q, tierlogic) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.query = function () {
    //            var data = {
    //                TierIds: null,
    //                TierLevelIds: null,
    //                ParentTierIds: null
    //            };
    //            return this.httppost(App.apiEndPoint + 'Tier/GetTierList', data).then(function (data) {
    //                var ret = _.filter(data, function (o) {
    //                    return o.HasCommissionProfile && o.Name && o.Name.indexOf("201") < 0 && o.Name.indexOf("200") < 0;
    //                });
    //                var branchTiers = _.filter(data, function (o) {
    //                    return o.TierLevelName && o.TierLevelName.toLowerCase() == 'branch';
    //                });
    //                tierlogic.setTiers(data);
    //                _.each(ret, function (o) {
    //                    o.branch = tierlogic.getParentTierInTiers(o, branchTiers);
    //                });
    //                return ret;
    //            });
    //        }
    //        return new api();
    //    })

    //    _module.factory('apiTeamSalesReport', function ($http, apiBase, App, Error, $q) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.getDetails = function (data) {
    //            return this.httppost(App.apiEndPoint + 'TeamSalesReport/GetDetails', data);
    //        }
    //        api.prototype.getTeamSoldUnit = function (data) {
    //            return this.httpget(App.apiEndPoint + sprintf('TeamSalesReport/GetTeamSoldUnit?id=%s&projectId=%s&status=%s&startDate=%s&endDate=%s', data.id, data.projectId, data.status, data.startDate, data.endDate));
    //        }
    //        api.prototype.getAgentsByTierId = function (data) {
    //            var data = {
    //
    //            };
    //            return this.httpget(App.apiEndPoint + sprintf('GetAgentsByTierId?id=%s&datetimeFrom=%s&datetimeto=%s', data.id, data.datetimefrom, data.datetimeto));
    //        }
    //        return new api();
    //    })
    //
    //    _module.factory('apiDirectorSalesReport', function ($http, apiBase, App, Error, $q) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.getDetails = function (data) {
    //            return this.httppost(App.apiEndPoint + 'DirectorSalesReport/GetDetails', data);
    //        }
    //        api.prototype.getProjectSummaryPieChart = function (data) {
    //            return this.httppost(App.apiEndPoint + 'DirectorSalesReport/GetProjectSummaryPieChart', data);
    //        }
    //        return new api();
    //    })
    //
    //
    //    _module.factory('apiSPASummary', function ($http, apiBase, App, Error, $q) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.getSPASummary = function (data) {
    //            return this.httppost(App.apiEndPoint + 'SPASummary/GetSPASummary', data);
    //        }
    //        return new api();
    //    })
    //    
    //    _module.factory('apiUser', function ($http, apiBase, App, Error, $q) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.getUserDetails = function (data) {
    //            return this.httppost('data/user.json');
    //        }
    //        return new api();
    //    })
    //
    //
    //
    //    _module.factory('apiAnnouncement', function ($http, apiBase, App, apiProject, $q, Error) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.query = function (data) {
    //            return this.httppost(App.apiEndPoint + 'Announcement/CreateAnnouncement', data);
    //            
    //        }
    //        return new api();
    //    })
    //
    //
    _module.factory('apiCctv', function ($http, apiBase, App, Error, $q) {
            function api() {}
            api.prototype = new apiBase();
            api.prototype.GetCCTV = function (data) {

                return this.httpget(App.apiEndPoint + 'jcctv');
            }
            console.log(api.prototype.GetCCTV);
            return new api();
        })
        //
        //    _module.factory('apiAchievement', function ($http, apiBase, App, Error, $q) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.query = function (where) {
        //            return this.httpget(App.apiEndPoint + 'Achievement/GetAll');
        //        }
        //        api.prototype.get = function (id) {
        //            return this.httppost(App.apiEndPoint + sprintf('Achievement/GetByAchievementId?achievementId=%s', id));
        //        }
        //        return new api();
        //    })
        //
        //    _module.factory('apiAchievementProgress', function ($http, apiBase, App, Error, $q) {
        //        function api() {}
        //        api.prototype = new apiBase();
        //        api.prototype.query = function (data) {
        //            return this.httppost(App.apiEndPoint + 'Achievement/GetProgress', data);
        //        }
        //        return new api();
        //    });

    //    _module.factory('apiProducerRanks', function ($http, apiBase, App, Error, $q) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.query = function (data) {
    //            var data2 = {
    //                currencyCode: "MYR",
    //                teamIdFilter: null,
    //                userIdFilter: null,
    //                startDateFilter: null,
    //                endDateFilter: null
    //            }
    //            angular.extend(data2, data);
    //
    //            return this.httppost(App.apiEndPoint + 'ProducerRank/GetProducerRanks', data2);
    //        }
    //        return new api();
    //    })
    _module.factory('apiSignUp1', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (data) {
            var data = {
                fullname: "Tester",
                email: "tester@gmail.com"
            }


            return this.httppost(App.apiEndPoint + '/signup1.php', data);
        }
        return new api();
    })
    _module.factory('apiCamera', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (data) {
            return this.httpget('data/camera.json');
        }
        return new api();
    });
    _module.factory('apiInfoTraffic', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (data) {
            return this.httpget('data/InfoTraffic.json');
        }
        return new api();
    });
    _module.factory('apiEvent', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (data) {
            return this.httpget('data/Event.json');
        }
        return new api();
    });
    _module.factory('apiParking', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (data) {
            return this.httpget('data/parking.json');
        }
        return new api();
    });
    _module.factory('apiUserDetail', function ($http, apiBase, App, Error, $q) {
        function api() {}
        api.prototype = new apiBase();
        api.prototype.query = function (data) {
            var data2 = {
                    //                currencyCode: "MYR",
                    //                teamIdFilter: null,
                    //                userIdFilter: null,
                    //                startDateFilter: null,
                    //                endDateFilter: null
                }
                //            angular.extend(data2, data);

            return this.httppost('data/user.json', data);
        }
        return new api();
    })

    //
    //    _module.factory('apiSpaRanks', function ($http, apiBase, App, Error, $q) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.query = function (data) {
    //            var data2 = {
    //                currencyCode: "MYR",
    //                teamIdFilter: null,
    //                userIdFilter: null,
    //                startDateFilter: null,
    //                endDateFilter: null
    //            }
    //            angular.extend(data2, data);
    //
    //            return this.httppost(App.apiEndPoint + 'SpaRank/GetSpaRanks', data2);
    //        }
    //        return new api();
    //    })

    //    _module.factory('apiCountry', function ($http, apiBase, App, Error, $q) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.query = function () {
    //            return this.httpget(App.apiEndPoint + 'Country');
    //        }
    //        return new api();
    //    })

    //    _module.factory('apiTitle', function ($q, apiBase) {
    //        function api() {}
    //        api.prototype = new apiBase();
    //        api.prototype.query = function () {
    //            return $q(function (resolve, reject) {
    //                resolve(["Mr.", "Ms.", "Madam", "Dato", "Datin", "Datuk", "Tan Sri", "Puan Sri", "Dato' Sri", "Datuk Seri"]);
    //            });
    //        }
    //        return new api();
    //    });
}());