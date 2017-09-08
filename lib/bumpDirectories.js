(function() {

    "use strict";

    var _               = require('lodash');
    var exec            = require('../utils/execHardFail.js'),
        bumpPatchVersion= require('../utils/bumpPatchVersion.js');

    module.exports = function bumpDirectories(deps, callback) {

        console.log('*** Starting bumpDirectories task...');

        var project_dirs= _.get(deps, 'project_dirs');
        var JOB_TYPE    = _.get(deps, 'job_type');
        var NEW_VERSION = _.get(deps, 'new_version');
        var REF_DIR = _.get(deps, 'ref_dir')

        //this unecessarily bumps patch version so that the release version will never be X.X.0.
        var next_version = bumpPatchVersion(NEW_VERSION);
        console.log('*** next_version>>>', next_version);

        // Figure out bump_commit_message
        var bump_commit_message = '":rotating_light: ' + JOB_TYPE + ' ' + NEW_VERSION + ' ; Bumped to ' + next_version + ' :rotating_light:"';

        // Figure out prevent_conflict_commit_message
        var prevent_conflict_commit_message = '"Bumped to %VERSION% to prevent merge conflict in jenkins."';

        if (!REF_DIR) {
            console.log('*** Starting grunt bump for', 'build-script...');
            process.chdir(process.env.WORKSPACE + '/' + 'catalyst-build-script');
            exec('grunt bump -v --setversion=' + next_version + ' --commit_message=' + bump_commit_message);
        } else {
            console.log('skipping build-script bump')
        }

        console.log('*** Starting to write next-gen-build-script version to dirs...');
        project_dirs.forEach(function(directory_name) {

            console.log('*** Writing next version for ', directory_name, '...');
            process.chdir(process.env.WORKSPACE + '/' + directory_name);

            let current_branch = exec('git rev-parse --abbrev-ref HEAD').string().replace(/^\s+|\s+$/g, '')
            console.log('current branch => ', current_branch)
            let xy = exec(`git checkout -B ${current_branch} origin/${current_branch}`)

            exec('npm run bump -- --setversion=' + next_version + ' --current_branch=' + current_branch + '--commit_message=' + bump_commit_message);

            if (JOB_TYPE === 'release') {

                var hotfix_exist = exec('git branch --list hotfix').stdout;

                if (hotfix_exist) {
                    console.log('*** Starting bump of version of other branch to prevent merge conflicts...');
                    console.log("*** Checkout other branch: hotfix...");
                    exec('git checkout hotfix');
                    console.log('*** Set the version to next_version...');
                    exec('npm run bump -- --setversion=' + next_version + ' --commit_message=' + prevent_conflict_commit_message);
                    console.log(`*** Switching back to original branch: ${current_branch}...`);
                    exec(`git checkout ${current_branch}`);
                }

                //TODO i honestly have no idea whats happening here deo 9/7/2017
            } else if (JOB_TYPE === 'hotfix_release') {
                console.log('*** Starting bump of version of other branch to prevent merge conflicts...');
                console.log("*** Checkout other branch: dev...");
                exec('git checkout dev');
                console.log('*** Set the version to next_version...');
                exec('npm run bump -- -v --setversion=' + next_version + ' --commit_message=' + prevent_conflict_commit_message);
                console.log('*** Switching back to original branch: hotfix...');
                exec('git checkout hotfix');
            }

        });

        callback();

    };

})();
