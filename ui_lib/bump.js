// npm run bump -- -v --setversion=version --commit_message=something

(function() {
    "use strict";

    var json    = require('json-update')
        , _     = require('lodash')
        , argv  = require('yargs').argv
        , exec  = require('./utils/execHardFail.js')
        , logger= require('./utils/logger.js')

    var new_version                 = _.get(argv, 'setversion')
        , default_commit_message    = '":rotating_light: Bumped to ' + new_version + ' :rotating_light:"'
        , commit_message            = _.get(argv, 'commit_message', default_commit_message)
        , current_branch            = _.get(argv, 'current_branch', 'dev')

    if (!new_version) {
        logger('No bump version specified!');
        process.exit(1);
        return;
    }

    json.update('package.json', { version: new_version }, function(err, obj) {

        logger('*** Updated package.json...', obj);

        if (typeof err !== "undefined" && err !== null) {
            logger("Error updating json: " + err.message);
            process.exit(1);

        } else {

            // git add
            exec('git add package.json');

            // git commit
            exec('git commit -m "' + commit_message + '" -n');

            // git push
            exec(`git push origin ${current_branch}`);

        }

    });

})();
