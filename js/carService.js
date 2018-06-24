define(['./template.js', './clientStorage.js'], function(template, clientStorage) {
    var apiUrlPath = 'linkdozasobu';
    var apiUrlLatest = apiUrlPath + 'linkdozasobu';
    var apiUrlCar = apiUrlPath + 'linkdozasobu';

    function loadMoreRequest() {
        fetchPromise()
        .then(function(data) {
            document.getElementById('status').innerHTML = data;
            loadMore();
        })
    }

    function fetchPromise() {
        return new Promise(function(response, reject) {
            fetch(apiUrlLatest + "?carId=" + clientStorage.getLastCarId())
            .then(function (response) {
                return response.json();
            })
            .then(function(data) {
                clientStorage.addCars(data.cars)
                .then(function() {
                    data.cars.forEach(preCacheDetailsPage);
                    response("ONLINE");
                }); 
            })
            .catch(function() {
                response("OFFLINE");
            })

            setTimeout(function(){
                response("OFFLINE");
            }, 3000);
        })
    }

    function preCacheDetailsPage(car) {
        if ('serviceWorker' in navigator) {
            var carDetailsUrl = apiUrlCar + car.value.details_id;
            
            window.caches.open('carDealsCachePagesV1').
            then(function(cache) {
                cache.match(carDetailsUrl).then(function(response) {
                    if(!response) {
                        cache.add(new Request(carDetailsUrl));
                    }
                })
            })
        }
    }

    function loadMore() {
        clientStorage.getCars().then(function(cars) {
            template.appendCars(cars);
        });
    }

    function loadCarPage(carId) {
        fetch(apiUrlCar + carId)
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            document.body.insertAdjacentHTML('beforeend', data);
        })
        .catch(function() {
            alert("Bład pobierania samochodu");
        })
    }

    return {
        loadMoreRequest: loadMoreRequest,
        loadCarPage: loadCarPage
    }
});