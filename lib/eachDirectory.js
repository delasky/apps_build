(function() {
    "use strict";

    var _           = require('lodash');
    var exec        = require('../utils/execHardFail.js'),
        sh          = require('shelljs');

    module.exports = function eachDirectory(deps, callback) {

        var new_version                 = _.get(deps, 'new_version');
        var project_dirs                = _.get(deps, 'project_dirs');
        var environments                = _.get(deps, 'environments');
        var job_type                    = _.get(deps, 'job_type');

        project_dirs.forEach(function(directory_name) {

            console.log('*** Starting yarn and deploy task for ' + directory_name + '...');

            // Move directories
            // process.env.WORKSPACE = '/Users/bodhideveloper/rbc';
            process.chdir(process.env.WORKSPACE + '/' + directory_name);
            exec('echo $PWD');

            // Get vars
            console.log('*** Checking if branch behind...');
            var local   = sh.exec('git rev-parse @').stdout,
                master  = sh.exec('git rev-parse master').stdout,
                base    = sh.exec('git merge-base @ master').stdout;

            // Exit if branch behind master
            // like if a hotfix was merged onto master but not onto dev
            if (local !== master && local === base) {
                console.log('*** Branch is behind!');
                process.exit(1);
            }

            // Install dependencies
            console.log('*** Starting yarn install for ' + directory_name + '...');
            exec('yarn');

            // Run grunt tasks
            console.log('*** Starting deploy task for ' + directory_name + '...');

                exec('yarn run app-deploy -- ' +
                    '--new_version=' + new_version +
                    ' --environments=' + environments +
                    ' --job_type=' + job_type +
                    ' -v'
                );

        });

        console.log('*** Finished yarn and deploy for all apps.');
        callback();

    };

})();

