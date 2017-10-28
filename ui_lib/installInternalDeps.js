(function() {
    "use strict";

    var _       = require('lodash')
        , exec  = require('./utils/execHardFail.js')

    var dependencies = require('../internal_dependencies.json');

    module.exports = function installInternalDeps(deps, callback) {

        var new_version = _.get(deps, 'new_version');

        _.each(dependencies, function(dependency) {
            exec(`yarn add ${dependency}@${new_version}`);
        });

        callback(null, dependencies);

    };

})();
