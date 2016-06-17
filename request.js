module.exports = function(method, url) {
    // TODO figure out if there is a better way to inject matchers
    jasmine.addMatchers(require('./custom-matchers'));

    return browser.executeAsyncScript(function(method, url, callback) {
        var $injector = angular.element(document.body).injector();
        var $http = $injector.get('$http');

        var request = $http.getRequest(method, url);

        if (!request) {
            // Couldn't find request so return !wasCalled object
            callback({
                method: method,
                url: url,
                wasCalled: false
            });
        }

        // Make sure the request has finished before returning from this async request
        return request.promise.then(function(response) {
            request.response = response;
            callback(request);
            return response;
        }, function(response) {
            request.response = response;
            callback(request);
            return response;
        })
    }, method, url);
}