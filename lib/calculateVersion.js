module.exports = function(deps, callback) {
    'use strict';

    console.log('*** Calculating version...');

    // Dependencies
    var bumpMinorVersion = require('../utils/bumpMinorVersion.js');
    var fse              = require('fs-extra');

    var version     = deps.version;
    var date        = deps.date;
    var job_type    = deps.job_type;
    var new_version;

    if (job_type === 'snapshot' || job_type === 'hotfix_snapshot') {
        // Create snapshot version
        new_version = version + '-' + job_type + '.' + date;

    } else {
        // Create release version
        new_version = bumpMinorVersion(version);
    }

    console.log('*** new_version>>>', new_version);
    if (process.env.WORKSPACE) {
        var workspace = process.env.WORKSPACE

        let version_string = `build_version = ${new_version}`
        fse.outputFile(workspace+'/build_version.txt', version_string, 'utf8', function(err) {
            if (err) {
                console.log('***** err writing version to jenkins description')
            }
        })

    }


    callback(null, new_version);
};
