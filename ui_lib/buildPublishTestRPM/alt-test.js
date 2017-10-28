(function() {
    "use strict";

    var exec = require('../utils/execHardFail.js');

    module.exports = function test(deps, callback) {

        exec('yarn run test');

        callback();

    };

})();
