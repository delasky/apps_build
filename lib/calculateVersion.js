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
        var build_version_path = process.env.WORKSPACE+'/build_version.txt'

        let version_string = `build_version = ${new_version}`
        console.log('**** writing build_version.txt', build_version_path)
        fse.writeFile(build_version_path, version_string, 'utf8', function(err) {
            if (err) {
                console.log('***** err writing version to jenkins description')
            }
        })

    }


    callback(null, new_version);
};
