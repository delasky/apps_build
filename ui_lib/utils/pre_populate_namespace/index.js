
// TODO:
// use findup to make sure that we can always find
// package.json and public/
(function() {
    "use strict";

    // Dependencies
    var fs      = require('fs'),
        findup  = require('findup'),
        _       = require('lodash');

    var helpers             = require('./utils.js'),
        isNewTypesRequired  = helpers.isNewTypesRequired,
        installTypes        = require('./lib/installTypes.js'),
        envs                = require('../../buildPublishTestEachEnv/envs.json');

    module.exports = function prePopulateForPublish(also_publish_global, env_name) {

        var env = _.get(envs, env_name);

        var host        = _.get(env, 'host')
            , namespace = _.get(env, 'namespace')
            , username  = _.get(env, 'username')
            , password  = _.get(env, 'password')

        return function (finishCb) {

            // Safeguards
            finishCb = finishCb || _.noop;
            if (!host)          return finishCb('No host specified!');
            if (!namespace)     return finishCb('No namespace specified!');
            if (!username)      return finishCb('No username specified!');
            if (!password)      return finishCb('No password specified!');

            // Main

            console.log('Starting pre populate for publish...');


            // Sync version
            try {
                var dir = findup.sync(__dirname, 'package.json');

                var path_to_pkg = require('path').join(dir, '/package.json');
                var app = helpers.getFile(path_to_pkg);

                if (app) {

                    console.log('Found path to package.json.');

                    app = JSON.parse(app);

                    if (isNewTypesRequired(app)) {
                        installTypes(also_publish_global, app, env, dir, finishCb);

                    } else {
                        finishCb(null, 'No new types are required for this app.');
                    }

                } else {
                    finishCb('Package.json was not found at the following location ' + path_to_pkg);
                }


            } catch (e) {
                console.log(e);
                console.log('Could not find package.json');
            }


            // findup(__dirname, 'package.json', function(err, dir) {

            //     console.log('got here...');
            //     console.log(err);
            //     console.log(dir);

            //     if (err) {
            //         console.log(err);
            //         console.log('Could not find package.json');

            //     } else {
            //         var path_to_pkg = require('path').join(dir, '/package.json');
            //         var app = helpers.getFile(path_to_pkg);

            //         if (app) {

            //             console.log('Found path to package.json.');

            //             app = JSON.parse(app);

            //             if (isNewTypesRequired(app)) {
            //                 var env = createEnv(host, namespace, username, password);
            //                 installTypes(also_publish_global, app, env, dir, finishCb);

            //             } else {
            //                 finishCb('No new types are required for this app.');
            //             }

            //         } else {
            //             finishCb('Package.json was not found at the following location ' + path_to_pkg);
            //         }

            //     }
            // });


        };
    };

//    function prePopulateForInstall(path_to_pkg, finishCb) {
//
//        // Safeguards
//        finishCb = finishCb || function(){};
//
//        // Main
//        var app = helpers.getFile(path_to_pkg);
//
//        if (app) {
//            app = JSON.parse(app);
//
//        } else {
//            finishCb();
//        }
//
//        if (app && isNewTypesRequired(app)) {
//            var actions = getAllInstallActions([app]);
//
//            executeAllTypesActions(actions, progressCb, finishCb);    // for install/update???
//
//        } else {
//            finishCb();
//        }
//
//        // Helper Fn
//        function progressCb() {
//            // This gets called whenever an action completes
//            // For UI purposes...
//        }
//
//    }

//    function prePopulateForUpdate(path_to_pkg, finishCb) {
//        // TODO
//    }


//    return {
//        prePopulateForInstall: prePopulateForInstall,
//        prePopulateForUpdate: prePopulateForUpdate,
//        prePopulateForPublish: prePopulateForPublish
//    }
})();

