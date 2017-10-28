(function() {
    "use strict";

    var json    = require('json-update')
        , _     = require('lodash')
        , logger= require('./utils/logger.js')

    module.exports = function updateVersionInPkgFn(version_name) {

        version_name = version_name || 'new_version';

        return function updateVersionInPkg(deps, callback) {

            var new_version = _.get(deps, version_name, '');

            json.update('package.json', { version: new_version }, function(err, obj) {

                logger('Updated package.json...');

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