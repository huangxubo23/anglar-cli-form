function objectToArray(obj) {
    let arr = Object.keys(obj).map(key => obj[key]);
    return arr;
}

module.exports.objectToArray = objectToArray;