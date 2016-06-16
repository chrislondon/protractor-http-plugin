'use strict';

var ngTestHttp = {
    addMockModule: function () {
        browser.addMockModule('ngTestHttp', function() {
            angular.module('ngTestHttp', [])
                .config(function($provide) {
                    console.error('HERE WE GO');
                });
            // ngTestHttp.mockModules_.addMockModule
        });
    },

    addAsDependencyForModule: function(module) {
        browser.addMockModule('ngTestHttp', function (module) {
            angular.module(module).requires.push('ngTestHttp');
        }, module);
    }
};

module.exports = ngTestHttp;