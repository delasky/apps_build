module.exports = function(old_version, should_keep_patch) {

    "use strict";

    // Dependencies
    var _ = require('lodash');

    // Make sure old version does not have meta data
    old_version = _.get(old_version.split('-'), [0], old_version);

    // Create new version
    var old_version_split = old_version.split('.');
    var patch_version = should_keep_patch ? old_version_split[2] : 0;
    var new_version =
        old_version_split[0] + '.' +
        (parseInt(old_version_split[1]) + 1) + '.' +
        patch_version;

    return new_version;

};