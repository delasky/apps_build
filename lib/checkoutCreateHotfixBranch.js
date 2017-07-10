module.exports = function(dependencies, callback) {

    "use strict";

    // Dependencies
    var _               = require('lodash'),
        sh              = require('shelljs'),
        exec            = require('../utils/execHardFail.js');

    var job_type        = _.get(dependencies, 'job_type'),
        project_dirs    = _.get(dependencies, 'project_dirs');


    console.log('*** Starting checkout/create hotfix branches...');

    project_dirs.forEach(function(directory_name) {

        console.log('*** Starting checkoutCreateHotfixBranch task for ' + directory_name);

        // Move directories
        process.chdir(process.env.WORKSPACE + '/' + directory_name);

        var hotfix_exist = sh.exec('git branch --list hotfix').stdout;

        if (hotfix_exist) {
            // checkout
            exec('echo "git checkout hotfix"');
            exec('git checkout hotfix');

        } else {
            // create
            exec('echo "git checkout -b hotfix"');
            exec('git checkout -b hotfix');
        }

    });


    callback();

};