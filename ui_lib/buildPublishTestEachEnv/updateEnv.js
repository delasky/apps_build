(function() {
    "use strict";

    var json        = require('json-update')
        , path      = require('path')
        , paths     = require('../paths.js')
        , logger    = require('../utils/logger.js')

    module.exports = function updateEnv(env) {

        return function(callback) {

            json.update('dist/public/config.json', { env: env }, function(err, obj) {

                logger('*** Updating config.json...');

                if (typeof err !== "undefined" && err !== null) {
                    logger("Error updating json: " + err.message);
                    callback("Error updating json: " + err.message);

                } else {
                    callback();
                }

            });

        };

    };

})();
