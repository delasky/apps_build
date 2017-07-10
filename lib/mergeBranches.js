(function() {
    "use strict";

    var _               = require('lodash');
    var sh              = require('shelljs');
    var pkg             = require('../package.json');

    module.exports = function mergeBranches(deps, callback) {


        var FailedRepoFactory   = failedRepoFactory();
        var exec                = FailedRepoFactory.exec,
            getFailedRepos      = FailedRepoFactory.getFailedRepos;

        var project_dirs        = _.get(deps, 'project_dirs');
        var JOB_TYPE            = _.get(deps, 'job_type');
        var new_version     = _.get(deps, 'new_version');

        var branch_to_merge     = '';

        var release_patch_version   = getPatchVersion(new_version)
            , current_patch_version = getPatchVersion(_.get(pkg, 'version'));

        if (release_patch_version < current_patch_version) {
            // release candidate is not the latest on dev
            console.log('');
            console.log('');
            console.log('********************************');
            console.log('Release candidate is not the latest on dev!');
            console.log('Please merge all the repos into master up to the release candidate commit.');
            console.log('');
            console.log('For each repo, run the following on the master branch:');
            console.log('git merge [COMMIT]');
            console.log('where [COMMIT] is the commit hash of the release candidate.');
            console.log('********************************');
            console.log('');
            console.log('');

            callback();


        } else {
            project_dirs.forEach(function(directory_name) {

                console.log('*** Starting to merge branches for ' + directory_name + '...');

                // Move directories
                process.chdir(process.env.WORKSPACE + '/' + directory_name);

                // Bump version and push to bitbucket
                if (JOB_TYPE === 'release') {

                    branch_to_merge = 'FROM DEV INTO MASTER';

                    exec(directory_name, 'echo "git checkout master"');
                    exec(directory_name, 'git checkout master');

                    exec(directory_name, 'echo "git pull"');
                    exec(directory_name, 'git pull');

                    exec(directory_name, 'echo "git merge dev --no-ff"');
                    exec(directory_name, 'git merge dev --no-ff');

                    exec(directory_name, 'echo "git push"');
                    exec(directory_name, 'git push');

                } else if (JOB_TYPE === 'hotfix_release') {

                    branch_to_merge = 'FROM HOTFIX INTO DEV';

                    exec(directory_name, 'echo "git checkout master"');
                    exec(directory_name, 'git checkout master');

                    exec(directory_name, 'echo "git pull"');
                    exec(directory_name, 'git pull');

                    exec(directory_name, 'echo "git merge hotfix --no-ff"');
                    exec(directory_name, 'git merge hotfix --no-ff');

                    exec(directory_name, 'echo "git checkout dev"');
                    exec(directory_name, 'git checkout dev');

                    exec(directory_name, 'echo "git pull"');
                    exec(directory_name, 'git pull');

                    exec(directory_name, 'echo "git merge hotfix --no-ff"');
                    exec(directory_name, 'git merge hotfix --no-ff');

                    exec(directory_name, 'echo "git push"');
                    exec(directory_name, 'git push');

                }

            });


            console.log('');
            console.log('');
            console.log('********************************');
            console.log('PLEASE MERGE THE FOLLOWING REPOS:');
            console.log(getFailedRepos());
            console.log(branch_to_merge);
            console.log('********************************');
            console.log('');
            console.log('');

            console.log('*** Finished merging all apps...');

            callback();

        }


    };


    // Helper Function
    function getPatchVersion(version) {

        version = version || '';

        var semver  = _.get(version.split('-'), 0, ''),
            patch   = _.get(semver.split('.'), 2, '');

        return patch;
    }

    function failedRepoFactory() {

        var failed_repos = Object(null);

        return {
            getFailedRepos: function() {
                return _.keys(failed_repos);
            },
            exec: function(directory_name, command) {

                if (sh.exec(command).code !== 0) {
                    console.log('"' + command + '" failed!');
                    _.set(failed_repos, directory_name, true);
                }

            }
        };

    }


})();
