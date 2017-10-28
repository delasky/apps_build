module.exports = (function() {
    // Dependencies
    var _           = require('lodash'),
        request     = require('request'),
        node_url    = require('url'),
        path        = require('path'),
        fs          = require('fs');

    function createEnv(host, namespace, username, password) {
        return {
            host:       host,
            namespace:  namespace,
            username:   username,
            password:   password
        };
    }

    function isNewTypesRequired(app) {
        if (!app.settings)
            return false;

        var req = app.settings.new_type_required;
        if (req === null || req === undefined)
            return false;

        return (req === true || req === 'true' || req === 'TRUE');
    }

    function getFile(file_path) {

        console.log('Getting file at ' + file_path + ' ...');

        try {
            return fs.readFileSync(file_path, "utf8");

        } catch (e) {
            return undefined;
        }
    }

    function doesActionHavePublicPath(info, publicPath) {
        if (_.has(info.object) && !publicPath) {
            console.log('No public path provided! Will skip ' + info.action + ' to ' + info.path);
            return false;

        } else {
            return true;
        }
    }

    function getPublicPathFromInfo(appInfo) {
        if (!appInfo || !appInfo.settings)
            return null;

        var publicPath = appInfo.settings.public_path;

        if (typeof publicPath == 'string' || publicPath instanceof String) {
            publicPath = publicPath.trim();

            if (publicPath.length == 0)
                publicPath = null;

            var paths = publicPath.split('/');
            var correctedPaths = [];

            paths.forEach(function(p) {
                if (!p)
                    return;
                correctedPaths.push(p);
            });

            publicPath = correctedPaths.join('/');
        } else
            publicPath = null;

        return publicPath;
    }



    // Helper Function
    var write = function(method, path, name, typeInfoName, data, env, cb) {

        // Safeguards
        cb              = cb || function(){};
        name            = name || '';
        typeInfoName    = typeInfoName || '';
        if (!path)      return cb('Missing path, unable to write!');
        if (!method)    return cb('Missing method, unable to write!');
        if (!data)      return cb('Missing data, unable to write!');
        if (!env)       return cb('Missing env, unable to write!');

        request({
            method: method,
            url: path,
            json: true,
            body: data,
            auth: {
                user: env.username,
                pass: env.password
            }
        }, done);

        // Helper Function
        function done(err, response, body) {

            if (err ||
                (method === 'post' && _.get(response, 'statusCode') !== 201) ||
                (method === 'put' && _.get(response, 'statusCode') !== 204)) {

                console.log(err);
                console.log('method', method);
                console.log('path', path);
                console.log('body', body);
                console.log('res', response.statusCode);
                console.log('data', data);

                console.log('FAILED TO ' + method + ' ' + name + ' to /' + typeInfoName);
                return cb();
//                return cb('Failed to ' + method + ' ' + name + ' to /' + typeInfoName);

            } else {

                console.log('Successfully ' + method + ' ' + name + ' to /' + typeInfoName);
                return cb();
            }
        }
    };


    return {
        createEnv:                  createEnv,
        isNewTypesRequired:         isNewTypesRequired,
        getFile:                    getFile,
        doesActionHavePublicPath:   doesActionHavePublicPath,
        getPublicPathFromInfo:      getPublicPathFromInfo,
        sendTypeActionToServer: function(actionInfo, cb, env, publish_global) {
            var method = null;
            var path = null;
            var typeInfoName = null;
            var name = null;

            var namespace = env.namespace;

            var data = getFile(actionInfo.file_path);
            if (!data) {
                return cb('Could not find file at ' + actionInfo.path || actionInfo.object + '.');
                
            } else {
                data = JSON.parse(data);
            }

            if (actionInfo.type == 'type') {
                data.namespace = namespace;
                typeInfoName = 'type';
                method = actionInfo.sys_id ? 'put' : 'post';
                path = env.host + "/" + namespace + "/types";
                // if (method === 'put') path = [path, actionInfo.info.name].join('/');
                name = actionInfo.info.name;

            } else if (actionInfo.type == 'enum') {
                data.namespace = namespace;
                typeInfoName = 'enumeration';
                method = actionInfo.sys_id ? 'put' : 'post';
                path = env.host + "/" + namespace + "/enums";
                name = actionInfo.info.name;
            }

            write(method, path, name, typeInfoName, data, env, done);


            // Helper Function
            function done(err) {
                if (err) {
                   cb(err);

                } else if (publish_global) {

                    var base_env = _.cloneDeep(env);
                    base_env.namespace = 'base';

                    write(method, path, name, typeInfoName, data, base_env, cb);
                } else {
                    cb();
                }
            }
        },
        sendActionToServer: function(actionInfo, cb, env) {
            var method = null;
            var path = null;
            var typeInfoName = null;
            var name = null;

            var namespace = env.namespace;

            var data = getFile(actionInfo.file_path);
            if (!data) {
                return cb('Could not find file at ' + actionInfo.path || actionInfo.object + '.');

            } else {
                data = JSON.parse(data);
            }

            if (actionInfo.info.action == 'POST') {
                name = actionInfo.info.object;
                typeInfoName = 'POST action';
                method = 'post';
                if (actionInfo.info.path.indexOf('/') == 0)
                    path = env.host + "/" + namespace + actionInfo.info.path;
                else
                    path = env.host + "/" + namespace + "/" + actionInfo.info.path;
            } else {
                // TODO
            }

            write(method, path, name, typeInfoName, data, env, done);


            // Helper Function
            function done(publish_to_global) {
                if (publish_to_global) {

                    var base_env = _.cloneDeep(env);
                    base_env.namespace = 'base';

                    write(method, path, name, typeInfoName, data, base_env, cb);

                } else {
                    cb();
                }
            }
        }
    };
})();