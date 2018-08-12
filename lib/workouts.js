const request = require('request-promise-native'),
    common = require('./common')

let workouts = async (params) => {
    let url = `${common.urls.api}${common.urls.paths.activitiesList}`
    let body = await request.get({url: url, qs: params})
    return JSON.parse(body)
}

module.exports = workouts