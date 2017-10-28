module.exports = function(actions, doneCb) {

    // Dependencies
    var async   = require('async'),
        _       = require('lodash');

    var helpers = this.helpers,
        env     = this.env;

    console.log('Starting pre type install actions...');

    var sendActionToServer = _.partialRight(helpers.sendActionToServer, env);

    async.eachSeries(actions.preActions, sendActionToServer, done);

    // Helper Function
    function done(err) {

        if (err) {
            doneCb(err);
        }

        doneCb(null, actions);
    }

};