module.exports = function(app, root_path, doneCb) {

	console.log('Checking if new or upgrade...');

    // Dependencies
    var request     = require('request'),
        _           = require('lodash'),
        node_url    = require('url');

    var is_new = true;

    // TODO

    console.log(app, is_new, root_path);

    doneCb(null, app, is_new, root_path);
};