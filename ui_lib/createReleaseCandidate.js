(function() {
    "use strict";

    var _       = require('lodash')
        , async = require('async')

    var updateEnv               = require('./buildPublishTestEachEnv/updateEnv.js')
        , build                 = require('./buildPublishTestEachEnv/build.js')
        , test                  = require('./buildPublishTestEachEnv/test.js')
        , createZip             = require('./buildPublishTestEachEnv/createZip.js')
        , sendToArtifactory     = require('./sendToArtifactory.js')
        , createZipFileName     = require('./utils/createZipFileName.js')
        , updateVersionInPkg    = require('./updateVersionInPkg.js')
        , pkg                   = require('../package.json')
        , prepopulateNamespace  = require('./utils/pre_populate_namespace')

    module.exports = function createReleaseCandidate(deps, callback) {

        var envs                        = _.get(deps, 'envs', [])
            , release_candidate_version = _.get(deps, 'release_candidate_version', '')
            , new_version               = _.get(deps, 'new_version', '');

        var app_name        = _.get(pkg, 'name');

        var zip_file_name = createZipFileName(app_name, release_candidate_version);

        // Transform async.auto tasks into async.series tasks
        var updateVersionInPkgForSeries = _.partial(updateVersionInPkg('release_candidate_version'), {
            release_candidate_version: release_candidate_version,
            new_version: new_version
        });
        var sendToArtifactoryForSeries = _.partial(sendToArtifactory(app_name, release_candidate_version, zip_file_name), {});

        async.series([
            updateVersionInPkgForSeries
            , updateEnv('prd')
            , prepopulateNamespace(true, 'prd') // take this out once use app installer
            , build
            , test
            , createZip(zip_file_name)
            , sendToArtifactoryForSeries
        ], callback);

    };

})();
