'use strict';

var HttpPlugin = function() { };

var customMatchers = {
    toBeCalled: function() {
        return {
            compare: function(actual) {
                var result = {};

                result.pass = actual.wasCalled;

                if (result.pass) {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' not to be called but was called'
                } else {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' to be called'
                }

                return result;
            }
        }
    },
    toBeCalledWith: function() {
        throw new Error('Not implemented');
    },
    toErr: function() {
        throw new Error('Not implemented');
    },
    toSucceed: function() {
        throw new Error('Not implemented');
    },
    toRespondWith: function() {
        throw new Error('Not implemented');
    },
    toRespondWithStatusCode: function() {
        throw new Error('Not implemented');
    }
};

HttpPlugin.prototype.setup = function() {
    global.request = function(method, url) {
        // TODO figure out if there is a better way to inject matchers
        jasmine.addMatchers(customMatchers);

        return browser.executeAsyncScript(function(method, url, callback) {
            var $injector = angular.element(document.body).injector();
            var $http = $injector.get('$http');
            var request = $http.getRequest(method, url) || {
                    method: method,
                    url: url,
                    wasCalled: false
                };

            callback(request);
        }, method, url);
    }
};

HttpPlugin.prototype.onPageStable = function() {
    browser.addMockModule('protractorHttpPlugin', function() {
        angular.module('protractorHttpPlugin', [])
            .config(function($provide) {
                $provide.decorator('$http', function($delegate, $q) {
                    var $http = $delegate;

                    var requests = {};

                    function addRequest(method, url) {
                        if (angular.isUndefined(requests[method])) {
                            requests[method] = {};
                        }

                        requests[method][url] = {
                            method: method,
                            url: url,
                            wasCalled: true
                        };
                    }

                    var $protractorHttpPlugin = function(config) {
                        addRequest(config.method, config.url);
                        return $http.apply($http, arguments);
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
                                addRequest(name.toUpperCase(), url);
                                return $http[name].apply($http, arguments);
                            };
                        });
                    }

                    // Query method history
                    $protractorHttpPlugin.getRequest = function(method, url) {
                        if (angular.isUndefined(requests[method])) {
                            return undefined;
                        }

                        return requests[method][url];
                    };

                    return $protractorHttpPlugin;
                });
            });
    });
};

var HttpPlugin = new HttpPlugin();

module.exports = HttpPlugin;