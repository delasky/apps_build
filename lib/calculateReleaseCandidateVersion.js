module.exports = function(deps, callback) {
    'use strict';

    console.log('*** Calculating release candidate version...');

    // Dependencies
    var bumpMinorVersion = require('../utils/bumpMinorVersion.js');

    var version     = deps.version;
    var date        = deps.date;
    var release_candidate_version;

    // Create release version
    release_candidate_version = bumpMinorVersion(version, 'should_keep_patch') + '-release.' + date;

    console.log('*** release candidate version>>>', release_candidate_version);

    callback(null, release_candidate_version);

};
