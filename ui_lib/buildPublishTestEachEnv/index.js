(function() {
    "use strict";

    var _       = require('lodash')
        , async = require('async')

    var updateEnv               = require('./updateEnv.js')
        // , prepopulateNamespace  = require('../utils/pre_populate_namespace')
        , build                 = require('./build.js')
        , rmZip                 = require('./rmZip.js')
        , test                  = require('./test.js')
        , createZip             = require('./createZip.js')
        , publish               = require('./publish.js')
        , sendToArtifactory     = require('./../sendToArtifactory.js')
        , createZipFileName     = require('../utils/createZipFileName.js')
        , pkg                   = require('../../package.json')

    module.exports = function buildPublishTestEachEnv(deps, callback) {

        var envs            = _.get(deps, 'envs', [])

            , new_version   = _.get(deps, 'new_version', '');

        var app_name        = _.get(pkg, 'name');

        async.series([
            build,
            test,
            function(cb) {
                console.log('**********')
                console.log('ENVS', envs)
                console.log('**********')
                async.mapSeries(envs, (env, mapCallback) => {

                    console.log('**********')
                    console.log('ENV', env)
                    console.log('**********')
                    var zip_file_name = createZipFileName(app_name, new_version);

                    async.series([
                        updateEnv(env),
                        createZip(zip_file_name),
                        publish(env, zip_file_name),
                        env === 'prd' ? sendToArtifactory(app_name, new_version, zip_file_name) : async.asyncify(_.noop),
                        rmZip(zip_file_name)
                    ], mapCallback);

                }, (err, results) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb()
                    }
                })
            },

        ], (err) => {
            if (err) {
                callback(err)
            } else {
                callback()
            }
        })



        // async.mapSeries(envs, function(env, mapCallback) {
        //
        //     var zip_file_name = createZipFileName(app_name, new_version);
        //
        //     async.series([
        //         updateEnv(env),
        //         // prepopulateNamespace(true, env),
        //         // build,
        //         // test,
        //         createZip(zip_file_name),
        //         publish(env, zip_file_name),
        //             env === 'prd' ? sendToArtifactory(app_name, new_version, zip_file_name) : async.asyncify(_.noop)
        //     ], mapCallback);
        //
        //
        // }, callback);

    };

})();


// TODO

// CONTINUE HERE!
    // nothing has been implemented yet - just planned

// 1. release job [2]
    // this will have to be an entirely different flow...
    // tell the difference through the job_type param

// 2. snapshot job + release candidate [1] [DONE]
    // this will be an extra task at the end only for release candidate

// 3. snapshot job [1] [DONE]
    // will just not run the last task...
