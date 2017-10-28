module.exports = function(actions, doneCb) {

    // Dependencies
    var async   = require('async'),
        _       = require('lodash');

    console.log('Starting post type install actions...');
    var sendActionToServer = _.partialRight(this.helpers.sendActionToServer, this.env);

    async.eachSeries(actions.postActions, sendActionToServer, done);

    // Helper Function
    function done(err) {

        if (err) {
            doneCb(err);
        }

        doneCb(null, actions);
    }

};