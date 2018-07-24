(function(){
    var _module = angular.module('value', []);
    _module.value('App', {
        device:{
        },
        token:{
        },
        debug: {
            api: {
                interceptor:true
            }
        },
        app: {
            appid:'',
            version:''
        },
        currency:{code:'MYR', name:'RM'},
        privateAppStoreApiEndPoint:'http://infradigital.com.my/appstore/cms/resources/',
        apiEndPoint:'http://58.26.9.230/edrive_new/api/',
        authorizateApiEndPoint:'http://rsakhidmat.com.my/api/',
        resourceEndPoint:'https://salesbooking.hattengrp.com/SalesPlatform/data/HATT/',
//        apiUserUsername:'hctestadmin',
//        apiUserPassword:'infraadmin',
//        apiUserUsername:'operator',
//        apiUserPassword:'1234',
        googleApiKey:'AIzaSyAZU6hYAxURw1ewJYV4OMLitTYd01xPb0I',
//        googleApiKey:'AIzaSyBEwq-YmTjhTLZVUSwJHVenBwLk-O0tMSE',
        placeholderGeneralLG: '../img/camhol.png',
        placeholderGeneralXS: '../img/camhol.png',
        placeholderAvatarLG: 'img/placeholder_people_lg.png',
        placeholderAvatarXS: 'img/placeholder_people_sm.png',
        collectionRepeatCardBottomMarginLarge: 20,
        collectionRepeatCardBottomMarginSmall: 10,
        collectionRepeatDividerHeight: 38,
        collectionRepeatCardLargeImageRatioLG:{
            ratio:1.66,
            width:1024
        },
        collectionRepeatCardLargeImageRatioXS:{
            ratio:1,
            width:480
        },
        pullToRefreshMinimumDelay:200,
        pullToRefreshCompletedTimeout:700,
        
        sideMenu : {
            xs: {break: 320, value: 280 },
            sm: {break: 400, value: 320 }
        },
        
        filterChangedLoadDelay:900,
        unitStatus : [
            {code: 0, name:'Available'},
            {code: 1, name:'Reserved'},
            {code: 2, name:'Sold'},
            {code: 3, name:'Confirmed Sold'},
            {code: 4, name:'Blocked'},
            {code: 5, name:'Total'},
            {code: 6, name:'Total SPA Signed'}
        ],
        refreshCompleteTimeout:1000,
        delayViewCreationTimeout:500,
        delayViewCreationInitDelay:2000,
        });
        _module.value('Intent', {
    });  
}());