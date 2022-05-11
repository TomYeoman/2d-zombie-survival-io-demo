// ignoring certain data from the sever b/c we will be predicting these properties on the client
const ignoreProps = ['x', 'y', 'rotation']
const shouldIgnore = (myId, update) => {
    if (update.nid === myId) {
        if (ignoreProps.indexOf(update.prop) !== -1) {
            return true
        }
    }
    return false
}

export default shouldIgnore