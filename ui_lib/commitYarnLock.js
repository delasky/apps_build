(function() {
    "use strict";

    var exec = require('./utils/execHardFail.js');
    var _ = require('lodash')

    module.exports = function commitYarnLock(deps, callback) {

        console.log(deps.dependencies)

        if (_.get(deps, 'dependencies.length') > 0) {
            exec('git add yarn.lock && git commit -m "[update] yarn.lock: add internal dependencies"');
        }


        callback();

    };

})();
