/*
 * skobbler Leaflet plugin 2.0
 * http://developer.skobbler.com/
 *
 * Copyright 2014, skobbler.com - dev@skobbler.com
 * Licensed under the MIT license.
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.L.Icon.Default.imagePath = ( typeof JS_basehref != 'undefined' ? JS_basehref : 'http://www.skobbler.com/' ) + 'images';

L.skobbler = module.exports = {
	config: require('./src/config'),
    map: require('./src/map')
};
},{"./src/config":2,"./src/map":3}],2:[function(require,module,exports){
'use strict';

module.exports = {
	
	VERSION: '2.0',

	TILE_URL: 'http://tiles{s}-{API_KEY}.'+ ( typeof JS_tileserver_host != 'undefined' ? JS_tileserver_host : 'skobblermaps.com' ) +'/TileService/tiles/2.0/{MAP_OPTIONS}/{MAP_STYLE}/{z}/{x}/{y}.png{SCALE_FACTOR}',
	REALREACH_URL: 'http://{API_KEY}.tor.skobbler.net/tor/RSngx/RealReach/json/18_0/en/{API_KEY}'
	
};
},{}],3:[function(require,module,exports){
'use strict';

var config = require('./config');

var LMap = L.Map.extend({
	
	options: {
		apiKey: '',
		
		mapStyle: 'day',			// day / lite / night / bike / outdoor
		bicycleLanes: true, 		// true / false
		onewayArrows: true, 		// true / false
		pois: 'all', 				// all / none / important
		primaryLanguage: 'en',		// en / de / fr / it / es / ru / tr
		fallbackLanguage: 'en',		// en / de / fr / it / es / ru / tr
		mapLabels: 'localNaming',	// localNaming / transliterationOnly / noTransliteration / nativeLocalized / transliterationNative
		retinaDisplay: 'auto',		// auto / yes / no
		
		zoomControl: true,					// true / false
		zoomControlPosition: 'top-left',	// top-left / top-right / bottom-right / bottom-left
		
		geolocation: true,						// true / false
		geolocationPosition: 'bottom-left',		// top-left / top-right / bottom-right / bottom-left
		
		fullscreen: false,
		
		center: [0,0],
		zoom: ''
	},

	initialize: function(id, options) {
		L.Util.setOptions(this, options);
		
		L.Map.prototype.initialize.call(this, id, options);
		
      	var tileLayer = new L.TileLayer(this._getURL(), {
            subdomains: [1,2,3,4],
            detectRetina: false,
            attribution: '<a href="http://developer.skobbler.com/" target="_blank">Scout</a>, <a href="http://www.leafletjs.com" target="_blank">Leaflet</a>, <a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
        });
        
        this.addLayer(tileLayer);
        if(typeof this.attributionControl != 'undefined') this.attributionControl.setPrefix(false);
        this._handleZoomControl(this.options.zoomControl, this.options.zoomControlPosition.split('-').join(''));
        
		if(this.options.fullscreen) this._initFullscreen(id);
	},
	
	_initFullscreen: function(mapId) {
		
		var self = this;
		
		// container
		$('<div/>', {
			'class': 'skobbler-fullscreen leaflet-control'
		}).appendTo('.leaflet-bottom.leaflet-left');
		
		L.DomEvent.disableClickPropagation(document.getElementsByClassName('skobbler-fullscreen leaflet-control')[0]);
		
			// trigger
			$('<a/>', {
				'href': '#'
			}).on('click',function(e){
				e.preventDefault();
				self._fullscreen(mapId);
			}).prependTo('.skobbler-fullscreen');
		
	},
	
	_fullscreen: function(mapId) {
		
		var map = $('#'+mapId);
		
		if(map.hasClass('skobbler-map-fullscreen')) {
			map.removeClass('skobbler-map-fullscreen');
		} else {
			map.addClass('skobbler-map-fullscreen');
		}
		
		this.invalidateSize();
		
	},
	
	_getURL: function() {
		var map_options = (this.options.bicycleLanes ? '1' : '0') +
			(this.options.onewayArrows ? '1' : '0') +
			'0' +
			this._mapPois(this.options.pois) +
			this._mapLanguage(this.options.primaryLanguage) +
			this._mapLanguage(this.options.fallbackLanguage) +
			this._mapMapLabels(this.options.mapLabels) +
			'0';
			
		var url = config.TILE_URL.
			replace('{API_KEY}',this.options.apiKey).
			replace('{MAP_OPTIONS}',map_options).
			replace('{MAP_STYLE}',this._mapMapStyle(this.options.mapStyle)).
			replace('{SCALE_FACTOR}',this._mapRetinaDisplay(this.options.retinaDisplay));
			
		return url;
	},
	
	_mapMapStyle: function(val) {
		switch (val) {
			case 'day': 	val = '0'; break;
            case 'lite': 	val = '7'; break;
            case 'night': 	val = '2'; break;
            case 'bike': 	val = '10'; break;
            case 'outdoor': val = '5'; break;
            default: 		val = '0'; break;
		}
		return val;
	},
	
	_mapPois: function(val) {
		switch (val) {
			case 'all': 		val = '2'; break;
			case 'none': 		val = '0'; break;
			case 'important': 	val = '1'; break;
			default: 			val = '0'; break;
		}
		return val;
	},
	
	_mapLanguage: function(val) {
		switch (val) {
			case 'en': 	val = '1'; break;
			case 'de': 	val = '2'; break;
			case 'fr': 	val = '3'; break;
			case 'it': 	val = '4'; break;
			case 'es': 	val = '5'; break;
			case 'ru': 	val = '6'; break;
			default: 	val = '1'; break;
		}
		return val;
	},
	
	_mapMapLabels: function(val) {
		switch (val) {
			case 'localNaming': 			val = '1010'; break;
			case 'transliterationOnly': 	val = '3211'; break;
			case 'noTransliteration': 		val = '3110'; break;
			case 'nativeLocalized': 		val = '1321'; break;
			case 'transliterationNative': 	val = '2320'; break;
			default: 						val = '1010'; break;
		}
		return val;
	},
	
	_mapRetinaDisplay: function(val) {
		return ( val == 'auto' ? ( window.devicePixelRatio && window.devicePixelRatio > 1 || L.Browser.retina ? '@2x' : '' ) : ( val == 'yes' ? '@2x' : '' ) );
	},
	
	_handleZoomControl: function(status, position) {
		if (status) {
			this.zoomControl.setPosition(position);
		}
	}
	
});

module.exports = function(id, options) {
    return new LMap(id, options);
};
},{"./config":2}]},{},[1]);