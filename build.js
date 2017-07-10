(function() {
    "use strict";

    var async   = require('async');
    var _       = require('lodash');
    var request = require('request');
    var projects= require('./projects.json');
    var pkg     = require('./package.json');

    // SERVICES
    var calculateVersion                = require('./lib/calculateVersion.js');
    var calculateEnv                    = require('./lib/calculateEnv.js');
    var eachDirectory                   = require('./lib/eachDirectory.js');
    var bumpDirectories                 = require('./lib/bumpDirectories.js');
    var checkoutCreateHotfixBranch      = require('./lib/checkoutCreateHotfixBranch');
    var readProjects                    = require('./lib/readProjects.js')
    var mergeBranches                   = require('./lib/mergeBranches.js');

    // CONSTANTS
    var VERSION             = _.get(pkg, 'version');
    var JOB_TYPE            = process.argv[2];
    var IS_RELEASE          = JOB_TYPE === 'release' || JOB_TYPE === 'hotfix_release';

    console.log('*** Current Version>>>', VERSION);
    console.log('*** JOB_TYPE>>>', JOB_TYPE);


    var asyncifyNoop = async.asyncify(_.noop);

    async.auto({
        job_type                : async.constant(JOB_TYPE)
        , is_release            : async.constant(IS_RELEASE)
        , path                  : async.constant(process.env.WORKSPACE)
        , date                  : async.constant(new Date().getTime())
        , project_dirs          : async.constant(projects)
        , hotfix_branches       : [
            'project_dirs', 'job_type', JOB_TYPE === 'hotfix_snapshot' ? checkoutCreateHotfixBranch : asyncifyNoop
        ]
        , version               : async.constant(VERSION)
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
            'new_version', 'job_type', 'project_dirs', 'each_directory', bumpDirectories
        ]
        , merge_branches        : [
            'job_type', 'project_dirs', 'each_bump', 'new_version', 'is_release', IS_RELEASE ? mergeBranches : asyncifyNoop
        ]
    });

})();

