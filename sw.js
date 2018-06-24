'use strict';
//new
var carDealsCacheName = 'carDealsCacheV1';
var carDearsCachePageName = 'carDealsCachePagesV1';
var carDealsCacheImageName = 'carDealsCacheImagesV1';

var latestPath = 'linkdozasobu';
var imagePath = 'linkdozasobu';
var carPath = 'linkdozasobu';

var carDealsCacheFiles = [
    'js/app.js',
    'js/carService.js',
    'js/clientStorage.js',
    'js/template.js',
    './',
    'node_modules/es6-promise/dist/es6-promise.min.js',
    'node_modules/es6-promise/dist/es6-promise.map',
    'resources/fetch.js',
    'node_modules/localforage/dist/localforage.min.js',
    'node_modules/localforage-getitems/dist/localforage-getitems.js',
    'node_modules/localforage-setitems/dist/localforage-setitems.js',
    'resources/material-design-light/material.red-indigo.min.css',
    'resources/material-design-light/material.min.js',
    'node_modules/systemjs/dist/system.js',
];

self.addEventListener('install', function(event){
    console.log('From SW: install Event', event);
    self.skipWaiting();
    event.waitUntil(
        caches.open(carDealsCacheName)
        .then(function(cache) {
            return cache.addAll(carDealsCacheFiles);
        })    
    );
})

self.addEventListener('activate', function(event) {
    console.log('From SW: Active State', event);
    self.clients.claim();
    event.waitUntil(
        caches.keys()
        .then(function(cacheKeys) {
            var deletePromises = [];

            for(var i = 0; i<cacheKeys.length; i++) {
                if (cacheKeys[i] != carDealsCacheName &&
                    cacheKeys[i] != carDearsCachePageName &&
                    cacheKeys[i] != carDealsCacheImageName) {
                        deletePromises.push(caches.delete(cacheKeys[i]));
                    }
            }

            return Promise.all(deletePromises);
        })
    )
})

self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);
    var requestPath = requestUrl.pathname;
    var fileName = requestPath.substring(requestPath.lastIndexOf('/' + 1));

    if (requestPath == latestPath || fileName == 'sw.js') {
       event.respondWith(fetch(event.request));  
    } else if (requestPath == imagePath) {
        event.respondWith(networkFirstStrategy(event.request));
    } else {
        event.respondWith(cahceFirstStrategy(event.request));
    }
});

function networkFirstStrategy(request) {
    return fetchRequestAndCache(request).catch(function(response) {
        return caches.match(request);
    });
}

function cahceFirstStrategy(request) {
    return caches.match(request)
            .then(function(cacheRespond) {
                return cacheRespond || fetchRequestAndCache(request);
            })
}

function fetchRequestAndCache(request) {
    return fetch(request).then(function(networkRespond) {
        caches.open(getCacheName(request)).then(function(cache) {
            cache.put(request, networkRespond);
        })
        return networkRespond.clone();
    });
}

function getCacheName(request) {
    var requestUrl = new URL(request.url);
    var requestPath = requestUrl.pathname;

    if (requestPath == imagePath) {
        return carDealsCacheImageName;
    } else if (requestPath == carPath) {
        return carDearsCachePageName
    } else {
        return carDealsCacheName;
    }
}