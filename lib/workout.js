'use strict'

var request = require('request'),
    common = require('./common'),
    apiUrl = common.urls.api,
    paths = common.urls.paths

function getQueryString(params){
    return {
        authToken: params.authToken,
        workoutId: params.workoutId,
        fields: params.fields || undefined
    }
}

function workoutGet(params) {
    return new Promise((resolve, reject) =>{ 
    var qs = getQueryString(params)
    var url = apiUrl + paths.activity.get

    request.get({ url: url, qs: qs }, (err, response, body) => {
        if(err)
            reject(err)
        else
            resolve(JSON.parse(body))
        });
    })
}

function getWorkoutParams(params){
    return{
        workoutId: params.id,
        sport: params.sport || 0,
        duration: params.duration || 0,
        gzip: params.gzip || true,
        audioMessage: params.audioMessage || false,
        goalType: params.goalType || 'BASIC',
        extendedResponse: params.extendedResponse || undefined,
        calories: params.calories || undefined,
        hydration: params.hydration || undefined
    }
}

function workoutAdd(params) {
    return new Promise((resolve, reject) =>{ 
    var qs = getQueryString(params)
    var url = apiUrl + paths.activity.post

    request.post({ url: url, qs: { authToken: params.authToken , userId: params.userId }}, (err, response, body) => {
        if(err)
            reject(err)
        else
            resolve(JSON.parse(body))
        });
    })
}

module.exports = {
    get: workoutGet,
    add: workoutAdd
}