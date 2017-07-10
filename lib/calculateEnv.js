module.exports = function(deps, callback) {
    'use strict';

    console.log('*** Calculating environment...');

    var job_type    = deps.job_type;
    var envs;

    if (job_type === 'snapshot' || job_type === 'hotfix_snapshot') {
        envs = "qa,dev";

    } else {
        envs = "dev,qa";
    }

    console.log('*** envs>>>', envs);

    callback(null, envs);
};
