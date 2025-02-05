//
// Based on the spec at http://www.w3.org/TR/cors/
// The test numbers correspond to steps in the specification
//
/* eslint-env mocha */

var request = require('supertest')
var should = require('should')
var test = require('./test')

describe('CORS: simple / actual requests', function () {
  it('6.1.1 Does not set headers if Origin is missing', function (done) {
    var server = test.corsServer({
      origins: ['http://api.myapp.com', 'http://www.myapp.com']
    })
    request(server)
      .get('/test')
      .expect(test.noHeader('access-control-allow-origin'))
      .expect(200)
      .end(done)
  })

  it('6.1.2 Does not set headers if Origin does not match', function (done) {
    var server = test.corsServer({
      origins: ['http://api.myapp.com', 'http://www.myapp.com']
    })
    request(server)
      .get('/test')
      .set('Origin', 'http://random-website.com')
      .expect(test.noHeader('access-control-allow-origin'))
      .expect(200)
      .end(done)
  })

  it('6.1.3 Sets Allow-Origin headers if the Origin matches', function (done) {
    var server = test.corsServer({
      origins: ['http://api.myapp.com', 'http://www.myapp.com']
    })
    request(server)
      .get('/test')
      .set('Origin', 'http://api.myapp.com')
      .expect('access-control-allow-origin', 'http://api.myapp.com')
      .expect(200)
      .end(done)
  })

  it('6.1.3 Does not set Access-Control-Allow-Credentials header if Origin is *', function (done) {
    should.throws(function () {
      test.corsServer({
        origins: ['*'],
        credentials: true
      })
    })
    done()
  })

  it('6.1.3 Sets Access-Control-Allow-Credentials header if configured', function (done) {
    var server = test.corsServer({
      origins: ['http://api.myapp.com'],
      credentials: true
    })
    request(server)
      .get('/test')
      .set('Origin', 'http://api.myapp.com')
      .expect('access-control-allow-credentials', 'true')
      .expect(200)
      .end(done)
  })

  it('6.1.4 Does not set exposed headers if empty', function (done) {
    var server = test.corsServer({
      origins: ['http://api.myapp.com', 'http://www.myapp.com']
    })
    request(server)
      .get('/test')
      .set('Origin', 'http://api.myapp.com')
      .expect('access-control-allow-origin', 'http://api.myapp.com')
      .expect('access-control-expose-headers', /api-version/) // defaults
      .expect(200)
      .end(done)
  })

  it('6.1.4 Sets exposed headers if configured', function (done) {
    var server = test.corsServer({
      origins: ['http://api.myapp.com', 'http://www.myapp.com'],
      exposeHeaders: ['HeaderA', 'HeaderB']
    })
    request(server)
      .get('/test')
      .set('Origin', 'http://api.myapp.com')
      .expect('access-control-allow-origin', 'http://api.myapp.com')
      .expect('access-control-expose-headers', /HeaderA, HeaderB/) // custom
      .expect('access-control-expose-headers', /api-version/) // defaults
      .expect(200)
      .end(done)
  })

  it('Does not throw if "origins" option left undefined', function () {
    should.doesNotThrow(function createServer () {
      test.corsServer({})
    })
  })
})
