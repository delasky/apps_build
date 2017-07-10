var readProjects = require('../lib/readProjects.js')
var sinon = require('sinon')
var mock = require('mock-fs')
var mockall = require('mock-all')
var expect = require('chai').expect

// how to test dirname????

describe('read projects', function() {
    beforeEach(function() {
        mock({
            workspace: {
                project_one: {},
                project_two: {},
                build_script: {}
            }
        })
    })
    it('returns list of projects in directory', function() {
        var deps = {
            path: 'workspace'
        }
        var cb = sinon.spy()
        var expectedResult = [ 'build_script', 'project_one', 'project_two' ]
        readProjects(deps, cb);
        expect(cb.calledWith(null, expectedResult)).to.be.true

    })
    afterEach(function() {
        mock.restore()
    })
})
