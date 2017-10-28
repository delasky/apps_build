/**
 * `npm run release -- --release_version --job_type
 */
(function() {
    "use strict";

    // Dependencies
    const exec              = require('./utils/execHardFail.js')
        , logger            = require('./utils/logger.js')
        , argv              = require('yargs').argv
        , _                 = require('lodash')
        , createZipFileName = require('./utils/createZipFileName.js')
        , publish           = require('./buildPublishTestEachEnv/publish.js')

    const pkg   = require('../package.json');

    // Vars
    const release_version   = _.get(argv, 'release_version');
    const app_name          = _.get(pkg, 'name');
    const new_version       = release_version;
    const zip_file_name     = createZipFileName(app_name, new_version);

    // Get from artifactory
    exec(`curl -u rbcbuild:#rbcpw! https://rbcplatform.artifactoryonline.com/rbcplatform/libs-releases-local/com/rbcplatform/${app_name}/${new_version}/${zip_file_name} -o ${zip_file_name}`);

    // publish it
    publish('dev', zip_file_name)();

})();
