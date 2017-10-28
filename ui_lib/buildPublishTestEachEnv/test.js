
(function() {
    "use strict";

    var exec = require('../utils/execHardFail.js');

    module.exports = function test(callback) {

        console.log('************')
        console.log('TESTING')
        console.log('***********')

        exec('yarn run test');

        callback();

    };

})();
