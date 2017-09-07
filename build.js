/*
 *
 * entry point for the catalyst-build-script system. arguments can be passed in via command line args
 *
 * --job_type=snapshot|release|hotfix|hotfix-release
 * --projects=<app folders in the jenkins workspace, comma separated>
 * --ref_dir=<name of the reference directory. this is the directory that will 
 *  control versioning for all apps in the project. If not specified the 
 *  catalyst-build-script dir will be used>
 */
(function() {
    "use strict";
    var argv        = require('yargs').array('projects').argv
    var async   = require('async');
    var _       = require('lodash');
    var request = require('request');
    var projects= require('./projects.json');
    var pkg     = require('./package.json');

    // SERVICES
    var calculateVersion                = require('./lib/calculateVersion.js');
    var calculateRefDirVersion          = require('./lib/calculateRefDirVersion.js');
    var calculateEnv                    = require('./lib/calculateEnv.js');
    var eachDirectory                   = require('./lib/eachDirectory.js');
    var bumpDirectories                 = require('./lib/bumpDirectories.js');
    var checkoutCreateHotfixBranch      = require('./lib/checkoutCreateHotfixBranch');
    var readProjects                    = require('./lib/readProjects.js')
    var mergeBranches                   = require('./lib/mergeBranches.js');

    // CONSTANTS
    var JOB_TYPE            = argv.job_type;
    var PROJECT_DIRS        = argv.projects;
    var IS_RELEASE          = JOB_TYPE === 'release' || JOB_TYPE === 'hotfix_release';
    var REF_DIR             = argv.ref_dir
    var VERSION             = _.get(pkg, 'version');

    console.log('*** ref dir', REF_DIR)
    console.log('*** Current Version>>>', VERSION);
    console.log('*** JOB_TYPE>>>', JOB_TYPE);

    var asyncifyNoop = async.asyncify(_.noop);

    async.auto({
        job_type                : async.constant(JOB_TYPE)
        , is_release            : async.constant(IS_RELEASE)
        , path                  : async.constant(process.env.WORKSPACE)
        , date                  : async.constant(new Date().getTime())
        , project_dirs          : async.constant(PROJECT_DIRS)
        , ref_dir               : async.constant(REF_DIR)
        , hotfix_branches       : [
            'project_dirs', 'job_type', JOB_TYPE === 'hotfix_snapshot' ? checkoutCreateHotfixBranch : asyncifyNoop
        ]
        , version               : REF_DIR ? ['ref_dir', calculateRefDirVersion ] : async.constant(VERSION)
        , environments          : [
            'job_type', calculateEnv
        ]
        , new_version           : [
            'job_type', 'version', 'date', calculateVersion
        ]
        , each_directory        : [
            'job_type', 'new_version', 'project_dirs', 'environments', eachDirectory
        ]
        , each_bump             : [
            'ref_dir', 'new_version', 'job_type', 'project_dirs', 'each_directory', IS_RELEASE ? bumpDirectories : asyncifyNoop
        ]
        , merge_branches        : [
            'job_type', 'project_dirs', 'each_bump', 'new_version', 'is_release', IS_RELEASE ? mergeBranches : asyncifyNoop
        ]
    });

})();

