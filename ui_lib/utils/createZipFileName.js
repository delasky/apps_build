(function() {
    "use strict";

    var _ = require('lodash');

    module.exports = function createZipFileName(app_name, new_version) {

        var parts_of_filename   = _.compact([app_name, new_version])
            , filename          = parts_of_filename.join('-') + '.zip';

        return filename;
    };

})();