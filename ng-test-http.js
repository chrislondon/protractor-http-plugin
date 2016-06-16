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
    }
};

module.exports = ngTestHttp;