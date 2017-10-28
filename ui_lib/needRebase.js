(function() {
    "use strict";

    var shell = require('shelljs');

    shell.config.silent = true;

    // Update remote refs
    shell.exec('git remote update');

    // Get latest remote dev commit hash
    const latest_remote_dev_commit = shell.exec('git rev-parse origin/dev');

    // Check if latest  remote dev commit hash is on current branch
    const fail = shell.exec(`git branch --contains ${latest_remote_dev_commit}`);

    // If cannot find the latest remote dev commit on current branch
        // need to rebase!
    if (fail.toString() === '' || fail.code !== 0) {
        console.log('');
        console.log('\x1b[31m%s\x1b[0m', `*** Your branch is behind remote dev! Please REBASE before making a PR! ***`);
        console.log('');
    }

})();