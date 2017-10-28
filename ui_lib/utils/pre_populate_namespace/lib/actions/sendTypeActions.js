module.exports = function(actions, doneCb, also_publish_global) {

    // Dependencies
    var async   = require('async'),
        _       = require('lodash');

    console.log('Starting type install actions...');
    var sendTypeActionToServer = _.partialRight(this.helpers.sendTypeActionToServer, this.env, also_publish_global);

    async.eachSeries(actions.typeActions, sendTypeActionToServer, done);

    // Helper Function
    function done(err) {

        if (err) {
            doneCb(err);
        }

        doneCb(null, actions);
    }

};