let _       = require('lodash')
    , async     = require('async')
    , logger    = require('../utils/logger')
    , shell     = require('../utils/execHardFail.js')
    , glob      = require('glob')


module.exports = function createAndPublishRPM(results, callback) {

    let new_version         = _.get(results, 'new_version')
    let artifactory_folder  = _.get(results, 'is_release') ? 'libs-releases-local' : 'libs-snapshots-local';
    let rpm_version         = new_version.replace('-', '.')

    logger('creating rpm now')
    shell(`grunt create-rpm:${rpm_version}`)

    let rpm_file_name = `bodhi-catalyst-comm-${rpm_version}-1.x86_64.rpm`;

    logger('sending rpm to artifactory')

    shell(`curl -isv -X PUT -f -u rbcbuild:#rbcpw! --data-binary @${rpm_file_name} https://rbcplatform.artifactoryonline.com/rbcplatform/${artifactory_folder}/com/rbcplatform/bodhi-catalyst-comm/${new_version}/${rpm_file_name}`)

    callback(null, `Published ${rpm_file_name}`)
};



