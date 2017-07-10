(function() {
    "use strict";

    var _           = require('lodash');
    var exec        = require('../utils/execHardFail.js'),
        sh          = require('shelljs');

    module.exports = function eachDirectoryRelease(deps, callback) {

        var release_version             = _.get(deps, 'release_version');
        var project_dirs                = _.get(deps, 'project_dirs');
        var job_type                    = _.get(deps, 'job_type');

        project_dirs.forEach(function(directory_name) {

            console.log('*** Starting yarn and release task for ' + directory_name + '...');

            // Move directories
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

            // Run release task
            console.log('*** Starting yarn task for ' + directory_name + '...');
            exec('npm run release --' +
                    ' --release_version=' + release_version +
                    ' --job_type=' + job_type +
                    ' -v'
            );
            // NOTE: not all apps will need this task but all repos will need to expose the release script in package.json
                // It is up to the individual apps to decide if it needs it, not this builds script repo.
                // If a repo does not need it, it should explicitly deal w/ it in its release task!

        });

        console.log('*** Finished yarn and deploy for all apps.');
        callback();

    };

})();

