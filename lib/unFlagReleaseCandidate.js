(function() {
    "use strict";

    var json    = require('json-update')
        , _     = require('lodash')

    module.exports = function unFlagReleaseCandidate(deps, callback) {

        json.update('package.json', { is_release_candidate: false }, function(err, obj) {

            console.log('*** Successfully unflagged as a release candidate!');

            if (typeof err !== "undefined" && err !== null) {
                console.log("Error updating json: " + err.message);
                callback("Error updating json: " + err.message);

            } else {
                callback();
            }

        });

    };


})();