module.exports = function(app, is_new, root_path, doneCb) {

    var path = require('path'),
        helpers = this.helpers;

    console.log('Processing package.json...');
    // TODO: how do you tell the difference b/t new and update?
    var typesInfo = app.settings ? app.settings.install : null;
//    var typesInfo = app.settings ? (app.settings.install ? (!is_new ? app.settings.install.upgrade : app.settings.install.new) : null) : null;
    var publicPath = helpers.getPublicPathFromInfo(app);

    var preActions      = [],
        typeActions     = [],
        postActions     = [],
        appTypes        = [],
        appEnums        = [],
        appTypesByName  = {},
        appEnumsByName  = {};


    // Process pre type install
    var preTypeInstall = typesInfo["pre-type-install"];
    if (preTypeInstall) {
        preTypeInstall.forEach(function (info) {
            if (helpers.doesActionHavePublicPath(info, publicPath)) {
                preActions.push({
                    type: 'action',
                    info: info,
                    file_path: path.join(root_path, publicPath, info.object || '')
                });
            }
        });
    }

    // Process type install
    var model = typesInfo["new"]["model"];
    if (model && model.length) {

        if (!publicPath) {
            console.log('No public path provided! Will skip model installs.');

        } else {

            model.forEach(function (info) {
                if (info.type == "enumeration") {
                    var action = {
                        type: 'enum',
                        info: info,
                        file_path: path.join(root_path, publicPath, info.object || '')
                    };
                    typeActions.push(action);
                    appEnums.push(info.name);
                    appEnumsByName[info.name] = action;

                } else if (info.type == "embedded_type" || info.type == "custom_type") {
                    var action = {
                        type: 'type',
                        info: info,
                        file_path: path.join(root_path, publicPath, info.object || '')
                    };
                    typeActions.push(action);
                    appTypesByName[info.name] = action;
                    appTypes.push(info.name);
                }
            });
        }
    }

    // Process post type install
    var postTypeInstall = typesInfo["post-type-install"];
    if (postTypeInstall) {
        postTypeInstall.forEach(function (info) {
            if (helpers.doesActionHavePublicPath(info, publicPath)) {
                postActions.push({
                    type: 'action',
                    info: info,
                    file_path: path.join(root_path, publicPath, info.object || '')
                });
            }
        });
    }

    doneCb(null, {
        preActions      : preActions,
        typeActions     : typeActions,
        postActions     : postActions,
        appTypes        : appTypes,
        appEnums        : appEnums,
        appTypesByName  : appTypesByName,
        appEnumsByName  : appEnumsByName
    });

};