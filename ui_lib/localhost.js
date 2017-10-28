(function() {
    "use strict";

    var updateEnv = require('./buildPublishTestEachEnv/updateEnv.js')
        , path      = require('path')
        , paths     = require('./paths.js')
        , argv      = require('yargs').argv
        , _         = require('lodash')

    const Webpack           = require("webpack");
    const WebpackDevServer  = require("webpack-dev-server");

    var webpack_server_config_path = path.resolve(__dirname, '..', paths.WEBPACK_SERVER_CONFIG);

        console.log('argv', argv)
        var env         = _.get(argv, 'env', 'dev')
            , local     = _.get(argv, 'local')


        if (local) {
            // TODO: use local service
                // else default to remote
        } else {
            console.log('Using remote service...');
        }

        updateEnv(env)(function(err) {

            if (err) {
                console.log('err>>>', err);
                process.exit(1);

            } else {
                console.log('Pointing to ' + env + ' environment...');

                const compiler = Webpack(require(webpack_server_config_path));
                const server = new WebpackDevServer(compiler, {
                    stats: {
                        colors: true,
                        hot: true
                    }
                    // disableHostCheck: true
                });

                server.listen(8080, "127.0.0.1", function() {
                    console.log("Starting server on http://localhost:8080");
                });

            }

        });

//                    exec('webpack-dev-server --config ' + webpack_server_config_path);


})();
