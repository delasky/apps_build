module.exports = function(also_publish_global, app, env, root_path, cb) {

    // Dependencies
    var helpers = require('../utils.js'),
        async   = require('async'),
        _       = require('lodash');

    // For binding to actions
    var self = {
        helpers: helpers,
        env: env
    };

    // Actions
    var newOrUpgrade        = require('./actions/newOrUpgrade.js').bind(self, app, root_path),
        processPackageJson  = require('./actions/processPackageJson.js').bind(self),
        checkActions        = require('./actions/checkActions.js').bind(self),
        checkTypes          = require('./actions/checkTypes.js').bind(self),
        checkEnums          = require('./actions/checkEnums.js').bind(self),
//        sendPreActions      = require('./actions/sendPreActions.js').bind(self);
        sendTypeActions     = require('./actions/sendTypeActions.js').bind(self);
//        sendPostActions     = require('./actions/sendPostActions.js').bind(self);

//    sendPreActions          = _.partialRight(sendPreActions, also_publish_global);
    sendTypeActions         = _.partialRight(sendTypeActions, also_publish_global);
//    sendPostActions         = _.partialRight(sendPostActions, also_publish_global);

    var pipeline = [
        newOrUpgrade,
        processPackageJson,
        checkActions,
        checkTypes,
        checkEnums,
//        sendPreActions,
        sendTypeActions,
//        sendPostActions
    ];


    async.waterfall(pipeline, cb);

};