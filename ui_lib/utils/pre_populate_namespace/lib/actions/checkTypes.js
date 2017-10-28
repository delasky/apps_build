module.exports = function(actions, doneCb) {

    console.log('Checking types...');

    // Dependencies
    var request     = require('request'),
        _           = require('lodash'),
        path        = require('path');

    var env = this.env;

    // Create url => TODO: abstract this out!!
    var where_clause = {
        name: {
            $in: actions.appTypes
        }
    };
    var fields = 'fields=name,sys_id';
    var params = ['where=' + JSON.stringify(where_clause), fields].join('&');
    var url = env.host + '/' + path.join(env.namespace, '/resources', '/BodhiType') + '?' + params;

    console.log('url', url);
    console.log(env);

    // Send get request
    request.get(url, onGetResponse).auth(env.username, env.password);





    // Helper Function
    function onGetResponse(err, response, body) {

        if (err || _.get(response, 'statusCode') !== 200) {
            console.log('err>>>', err);
            console.log('statusCode>>>', response.statusCode);
            console.log('body>>>', body);

            return doneCb('Failed to get types.');

        } else {
            // This will determine whether we need to put/post a type.
            console.log('body', body);
            actions.appTypesByName = _.reduce(JSON.parse(body), function(mem, type) {
                _.set(mem, [type.name, 'sys_id'].join('.'), type.sys_id);

                return mem;
            }, actions.appTypesByName);

            console.log(actions.appTypesByName);

            return doneCb(null, actions);
        }

    }

};