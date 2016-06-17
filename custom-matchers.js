module.exports = {
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
        return {
            compare: function(actual, expected) {
                var result = {};

                if (!actual.wasCalled) {
                    return {
                        pass: false,
                        message: 'Expected ' + actual.method + ' ' + actual.url + ' to err but not called'
                    }
                }

                result.pass = (actual.response.data >= 400 && actual.response.data < 600);

                if (result.pass) {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' not to err but did';
                } else {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' to err but didn\'t';
                }

                return result;
            }
        }
    },
    toRedirect: function() {
        return {
            compare: function(actual, expected) {
                var result = {};

                if (!actual.wasCalled) {
                    return {
                        pass: false,
                        message: 'Expected ' + actual.method + ' ' + actual.url + ' to redirect but not called'
                    }
                }

                result.pass = (actual.response.data >= 300 && actual.response.data < 400);

                if (result.pass) {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' not to redirect but did';
                } else {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' to redirect but didn\'t';
                }

                return result;
            }
        }
    },
    toSucceed: function() {
        return {
            compare: function(actual, expected) {
                var result = {};

                if (!actual.wasCalled) {
                    return {
                        pass: false,
                        message: 'Expected ' + actual.method + ' ' + actual.url + ' to succeed but not called'
                    }
                }

                result.pass = (actual.response.data >= 200 && actual.response.data < 300);

                if (result.pass) {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' not to succeed but did';
                } else {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' to succeed but didn\'t';
                }

                return result;
            }
        }
    },
    toRespondWith: function() {
        return {
            compare: function(actual, expected) {
                var result = {};

                if (!actual.wasCalled) {
                    return {
                        pass: false,
                        message: 'Expected ' + actual.method + ' ' + actual.url + ' to respond with status code ' + expected + ' but not called'
                    }
                }

                // TODO is this the best way to compare the data?
                result.pass = actual.response.data === expected;

                if (result.pass) {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' not to respond with ' + expected + ' but did';
                } else {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' to respond with ' + expected + ' but responded with ' + actual.response.data;
                }

                return result;
            }
        }
    },
    toRespondWithStatusCode: function() {
        return {
            compare: function(actual, expected) {
                var result = {};

                if (!actual.wasCalled) {
                    return {
                        pass: false,
                        message: 'Expected ' + actual.method + ' ' + actual.url + ' to respond with status code ' + expected + ' but not called'
                    }
                }

                result.pass = actual.response.status === expected;

                if (result.pass) {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' not to respond with status code ' + expected + ' but did';
                } else {
                    result.message = 'Expected ' + actual.method + ' ' + actual.url + ' to respond with status code ' + expected + ' but responded with ' + actual.response.status;
                }

                return result;
            }
        }
    }
};