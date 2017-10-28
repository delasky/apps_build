const _ = require('lodash')
const async = require('async')
const pkg = require('../../package.json')
const build = require('../buildPublishTestEachEnv/build.js')
const test = require('./alt-test.js')
const createRPM = require('./createRPM.js')

module.exports = function(deps, callback) {
    var is_release            = _.get(deps, 'is_release')
        , new_version   = _.get(deps, 'new_version', '');

    var app_name        = _.get(pkg, 'name');

    async.auto({
        new_version         : async.constant(new_version)
        , is_release        : async.constant(is_release)
        , build             : [build]
        , test              : ['build', test]
        , createRPM         : ['new_version', 'is_release', 'build', 'test', createRPM]
    }, function(err, result) {
        if (err) {
            console.log('ERR', err)
            callback(err)
        } else {
            callback()
        }
    })

}
