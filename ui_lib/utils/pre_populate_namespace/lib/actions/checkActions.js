module.exports = function(actions, doneCb) {
//    if (actions.preActions.length === 0 &&
//        actions.typeActions.length === 0 &&
//        actions.postActions.length === 0) {
//
//        doneCb({err: 'NO_ACTION', msg: 'No actions needs to be done.'});
//
//    } else {
        doneCb(null, actions);
//    }
};