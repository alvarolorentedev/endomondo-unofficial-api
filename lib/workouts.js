'use strict'

var request = require('request'),
    common = require('./common'),
    apiUrl = common.urls.api,
    paths = common.urls.paths

function getQueryString(params){
    return {
        authToken: params.authToken,
        fields: params.fields || undefined,
        maxResults: params.maxResults || undefined,
        deflate: params.deflate || undefined,
        compression: params.compression || undefined,
        before: params.before || undefined,
        after: params.after || undefined,
    }
}

function workouts(params) {
    return new Promise((resolve, reject) =>{ 
    var qs = getQueryString(params)
    var url = apiUrl + paths.activitiesListUrl

    request.get({ url: url, qs: qs }, (err, response, body) => {
        if(err)
            reject(err)
        else
            resolve(JSON.parse(body))
        });
    })
}

module.exports = workouts