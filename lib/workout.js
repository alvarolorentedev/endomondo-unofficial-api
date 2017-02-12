'use strict'

var request = require('request'),
    common = require('./common'),
    apiUrl = common.urls.api,
    paths = common.urls.paths

function getQueryString(params){
    //workoutId
    //workout
    
    return {
        authToken: params.authToken,
        workoutId: params.workoutId,
        fields: params.fields || undefined
    }
}

function workout(params) {
    return new Promise((resolve, reject) =>{ 
    var qs = getQueryString(params)
    var url = apiUrl + paths.activity

    request.get({ url: url, qs: qs }, (err, response, body) => {
        if(err)
            reject(err)
        else
            resolve(JSON.parse(body))
        });
    })
}

module.exports = workout