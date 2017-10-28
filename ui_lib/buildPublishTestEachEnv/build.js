(function() {
    "use strict";

    let webpack     = require('webpack')
        , path      = require('path')
        , paths     = require('../paths.js')
        , exec      = require('../utils/execHardFail.js')
        , logger    = require('../utils/logger.js')

    let webpack_config_path = path.resolve(__dirname, '..', '..', paths.WEBPACK_CONFIG);

    module.exports = function build(callback) {

        console.log('***********')
        console.log('BUILDING')
        console.log('***********')

        webpack(require(webpack_config_path), function(err, stats) {

            logger(stats.toString());

            if (err) {
                console.error(err.stack || err);
                if (err.details) {
                    console.error(err.details);
                }
                callback(err);

            } else {

                // Copy package.json and LICENSE to
                exec('cp package.json dist/');
                exec('cp LICENSE dist/');
                exec('cp -R public dist/');

                console.log('contents of dist folder')
                exec('ls dist/')

                callback();

            }

        });
    };

})();
