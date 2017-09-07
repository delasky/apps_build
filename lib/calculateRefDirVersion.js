module.exports = function(deps, callback) {
    'use strict';

    console.log('*** Calculating version...');

    // Dependencies
    var bumpMinorVersion = require('../utils/bumpMinorVersion.js');
    var fse              = require('fs-extra');

    var ref_dir     = deps.ref_dir;

    fse.readJSON(`../${ref_dir}/package.json`, (err, pkg) => {
        if (err) {
            callback(err)
        } else {
            callback(null, pkg.version)

        }

    })
};
