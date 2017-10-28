module.exports = function(actions, doneCb) {

    console.log('Checking enums...');

    // Dependencies
    var request     = require('request'),
        _           = require('lodash'),
        path        = require('path');

    var env = this.env;

    // Create url => TODO: abstract this out!!
    var where_clause = {
        name: {
            $in: actions.appEnums
        }
    };
    var fields = 'fields=name,sys_id';
    var params = ['where=' + JSON.stringify(where_clause), fields].join('&');
    var url = env.host + '/' + path.join(env.namespace, '/enums') + '?' + params;

    // Send get request
    request.get(url, onGetResponse).auth(env.username, env.password);





    // Helper Function
    function onGetResponse(err, response, body) {

        if (err || _.get(response, 'statusCode') !== 200) {
            return doneCb('Failed to get enums.');

        } else {
            // This will determine whether we need to put/post a type.
            console.log('body', body);
            actions.appEnumsByName = _.reduce(JSON.parse(body), function(mem, type) {
                _.set(mem, [type.name, 'sys_id'].join('.'), type.sys_id);

                return mem;
            }, actions.appEnumsByName);

            console.log(actions.appEnumsByName);

            return doneCb(null, actions);
        }

    }

};
