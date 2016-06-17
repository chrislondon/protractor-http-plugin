'use strict';

var HttpPlugin = function() { };

HttpPlugin.prototype.setup = function() {
    global.request = require('./request');
};

HttpPlugin.prototype.onPageStable = function() {
    browser.addMockModule('protractorHttpPlugin', function() {
        angular.module('protractorHttpPlugin', [])
            .config(function($provide) {
                // TODO instead of decorator should we use interceptor?
                $provide.decorator('$http', function($delegate, $q) {
                    var $http = $delegate;

                    var requests = {};

                    function addRequest(method, url, http, args) {
                        if (angular.isUndefined(requests[method])) {
                            requests[method] = {};
                        }

                        var promise = http.apply($http, args);

                        var request = {
                            method: method,
                            url: url,
                            wasCalled: true,
                            response: undefined,
                            promise: promise
                        };

                        requests[method][url] = request;

                        return promise;
                    }

                    var $protractorHttpPlugin = function(config) {
                        return addRequest(config.method, config.url, $http, arguments);
                    };

                    // Map rest of methods
                    Object.keys($http).filter(function(key) {
                        return (typeof $http[key] === 'function');
                    }).forEach(function(key) {
                        $protractorHttpPlugin[key] = $http[key];
                    });

                    // Override request methods
                    createShortMethods('get', 'delete', 'head', 'jsonp', 'post', 'put', 'patch');
                    function createShortMethods(key) {
                        angular.forEach(arguments, function(name) {
                            $protractorHttpPlugin[name] = function(url) {
                                return addRequest(name.toUpperCase(), url, $http[name], arguments);
                            };
                        });
                    }

                    // Query method history
                    $protractorHttpPlugin.getRequest = function(method, url) {
                        if (angular.isUndefined(requests[method]) || angular.isUndefined(requests[method][url])) {
                            return undefined;
                        }

                        var request = requests[method][url];

                        // Remove request once we got it so it doesn't accidently interfere with other tests.
                        // TODO should we force users to manually flush the tests?
                        requests[method][url] = undefined;

                        return request;
                    };

                    return $protractorHttpPlugin;
                });
            });
    });
};

var HttpPlugin = new HttpPlugin();

module.exports = HttpPlugin;