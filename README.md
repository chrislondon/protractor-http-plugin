# Protractor HTTP Plugin
A protractor plugin that allows expecting http calls


## Installation


```sh
npm install --save-dev git+https://github.com/chrislondon/protractor-http-plugin.git
```


## Set up

```node
// protractor.conf.js

exports.config = {
    // ...
    plugins: [{
        path: 'node_modules/protractor-http-plugin/index.js'
    }]
}
```


## Usage Example


```node
describe('when testing', function() {

    it('should expect to make an http call', function() {
        expect(request('GET', 'http://example.com')).toBeCalled();
    });
    
    it('should expect to make an http call with certain data', function() {
        // NOT IMPLEMENTED
        expect(request('POST', 'http://example.com')).toBeCalledWith({ foo: 'bar' });
    });
    
    it('should expect http call to err (return 4XX or 5XX status code)', function() {
        expect(request('GET', 'http://example.com')).toErr();
    });
    
    it('should expect http call to succeed (return 2XX status code)', function() {
        expect(request('GET', 'http://example.com')).toSucceed();
    });
    
    it('should expect http call to redirect (return 3XX status code)', function() {
        expect(request('GET', 'http://example.com')).toRedirect();
    });
    
    it('should expect http call to respond with certain data', function() {
        expect(request('GET', 'http://example.com')).toRespondWith({ foo: 'bar' });
    });
    
    it('should expect http call to respond with specified status code', function() {
        expect(request('GET', 'http://example.com')).toRespondWithStatusCode(200);
    });

});
```