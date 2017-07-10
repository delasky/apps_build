(function() {
    "use strict";

    var sh  = require('shelljs');
    var _   = require('lodash');

    module.exports = function() {

        var command_results = sh.exec.apply({}, arguments);

        if (command_results.code !== 0) {

            sh.echo('Command: ' + _.values(arguments).join(' ') + ' failed!');

            sh.echo('Exiting...');
            process.exit(1);
        }

        return command_results;

    };

})();

