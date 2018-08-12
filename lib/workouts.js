const request = require('request-promise-native'),
    common = require('./common')

let workouts = (params) => {
    let url = `${common.urls.api}${common.urls.paths.activitiesList}`
    return request.get({url: url, qs: params, json: true})
}

module.exports = workouts