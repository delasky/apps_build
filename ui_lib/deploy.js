/**
 * `npm run deploy -- --environments=dev,qa,stg --new_version=0.0.1 --job_type=snapshot|release`
 */
(function() {

    "use strict";

    var argv    = require('yargs').argv
        , _     = require('lodash')
        , async = require('async')
        , pkg   = require('./../package.json')
        , logger= require('./utils/logger.js')

    // SERVICES
    var installInternalDeps         = require('./installInternalDeps.js')
        , commitYarnLock            = require('./commitYarnLock.js')
        , updateVersionInPkg        = require('./updateVersionInPkg.js')
        , buildPublishTestEachEnv   = require('./buildPublishTestEachEnv/index.js')
        , buildPublishTestRPM       = require('./buildPublishTestRPM')
        , createReleaseCandidate    = require('./createReleaseCandidate.js')

    // CONSTANTS
    var ENVS                        = _.get(argv, 'environments', '').split(',')
        , NEW_VERSION               = _.get(argv, 'new_version')
        , RELEASE_CANDIDATE_VERSION = _.get(argv, 'release_candidate_version')
        , IS_RELEASE                = _.get(argv, 'job_type') === 'release' || _.get(argv, 'job_type') === 'hotfix-release'

    logger('*** ENVS>>>', ENVS);
    logger('*** NEW_VERSION>>>', NEW_VERSION);
    logger('*** RELEASE_CANDIDATE_VERSION>>>', RELEASE_CANDIDATE_VERSION);

    var asyncifyNoop = async.asyncify(_.noop);

    async.auto({
          envs                          : async.constant(ENVS)
        , new_version                   : async.constant(NEW_VERSION)
        , is_release                    : async.constant(IS_RELEASE)
        , install_internal_deps         : ['new_version', installInternalDeps]
        , commit_yarn_lock              : ['install_internal_deps', commitYarnLock]
        , update_version_in_pkg         : ['new_version', updateVersionInPkg('new_version')]
        , build_publish_test_each_env   : ['new_version', 'envs', buildPublishTestEachEnv]
        // , buildPublishTestRPM           : ['new_version', 'is_release', buildPublishTestRPM]
    }, function(err, result) {

        if (err) {
            console.log('*** err>>>', err);
            console.log('*** Exiting...');
            process.exit(1);

        } else {
            console.log('*** Finished build script for ' + pkg.name + '!');
        }

    });

})();


    // non env specific subtasks
        // install internal dependencies[X]
        // commit yarn lock file        [X]
        // update version in package    [X]

    // env specific sub tasks
        // build
            // update env in config     [X]
            // create bundle (webpack)  [X]
        // test
            // in es6!  [X]
            // mocha    [X]
            // coverage [X]
        // zip dist     [X]
        // publish
            // publish mobile tier (mobile tier)    [X]
            // send to artifactory if zip           [X]
