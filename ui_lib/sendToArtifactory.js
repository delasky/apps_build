(function() {
    "use strict";

    var exec    = require('./utils/execHardFail.js')
        , _       = require('lodash')

    module.exports = function sendToArtifactoryFn(app_name, new_version, zip_file_name) {

        return function sendToArtifactory(callback) {

            if (!zip_file_name) {
                callback('No zip file name!');

            } else {
                exec('curl -isv -X PUT' +
                    ' -f' +
                    ' -u rbcbuild:#rbcpw!' +
                    ' --data-binary @' + zip_file_name +
                    ' https://rbcplatform.artifactoryonline.com/rbcplatform/libs-releases-local/com/rbcplatform/' + app_name + '/' + new_version + '/' + zip_file_name);

                callback();
            }
        }

    };

})();
