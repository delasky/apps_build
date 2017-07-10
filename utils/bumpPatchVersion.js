module.exports = function(old_version) {

    "use strict";

    // Dependencies
    var _ = require('lodash');

    // Make sure old version does not have meta data
    old_version = _.get(old_version.split('-'), [0], old_version);

    // Create new version
    var old_version_split = old_version.split('.');
    var new_version =
        old_version_split[0] + '.' +
        old_version_split[1] + '.' +
        (parseInt(old_version_split[2]) + 1);

    return new_version;

};