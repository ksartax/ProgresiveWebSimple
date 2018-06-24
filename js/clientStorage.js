define([], function() {
    var limit = 3;
    var lastItemId = null;

    var carsInstance = localforage.createInstance({
        name: 'cars'
    });

    function addCars(newCars) {
        return new Promise(function(resolve, reject) {
            carsInstance.setItems(newCars)
            .then(function() {
                resolve();
            });    
        })
    }

    function getLastCarId() {
        return lastItemId;
    }

    function getCars() {
        return new Promise(function(resolve, reject) {
            carsInstance
            .keys()
            .then(function(keys) {
                var index = keys.indexOf(lastItemId);
                if (index == -1) {
                    index = keys.length;
                }
                if (index == 0) {
                    resolve([]);
                    return; 
                }

                var keys = keys.splice(index - limit, limit);
                carsInstance
                .getItems(keys)
                .then(function(result) {
                    var returnArr = Object
                        .keys(result)
                        .map(function(k){
                            return result[k]
                        })
                        .reverse();

                    lastItemId = returnArr[returnArr.length - 1].id;    
                     
                    resolve(returnArr);
                })
            }) 
        });
    }

    return {
        addCars: addCars,
        getCars: getCars,
        getLastCarId: getLastCarId
    }

});