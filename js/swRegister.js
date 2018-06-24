define([], function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
        .register('sw.js')
        .then(function(swRegistration) {
            var serviceWorker;

            if (swRegistration.installing) {
                serviceWorker = swRegistration.installing;
                console.log("Instalowanie");
            } else if (swRegistration.waiting) {
                console.log("Czekanie");
                serviceWorker = swRegistration.waiting;
            } else if (swRegistration.active) {
                console.log("Aktywny");
                serviceWorker = swRegistration.active;
            }

            if (serviceWorker) {
                serviceWorker.addEventListener('statechange', function(e) {
                    console.log(e.target.state);
                });
            }

            swRegistration.addEventListener('updatefound', function(e) {
                swRegistration.installing.addEventListener('statechange', function(e) {
                    console.log('New Service worker state');
                })
                console.log("new Service worker found");
            })
            
            setInterval(function() {
                swRegistration.update();
            }, 5000)
        })
        .catch(function(error) {
            console.log(error);
        })

        navigator.serviceWorker.addEventListener('controllerchange', function(e) {
            console.log('Controller Change');
        })
    }
});