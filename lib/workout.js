'use strict'

var request = require('request'),
    moment = require('moment'),
    common = require('./common'),
    apiUrl = common.urls.api,
    paths = common.urls.paths,
    regex = common.regex.workout,
    handleError = common.handleError

function getQueryString(params){
    return {
        authToken: params.authToken,
        workoutId: params.workoutId,
        fields: params.fields || [
			'device', 'simple','basic', 'motivation', 'interval',
			'hr_zones', 'weather', 'polyline_encoded_small', 'points',
			'lcp_count', 'tagged_users', 'pictures', 'feed'
		].join(",")
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

function convertWorkout(workoutPoints){
    //{time};{inst};{lat};{lng};{dist};{speed};{alt};{hr};
    //'2017-02-02 10:10:10 UTC;3;41.385064;2.173403;1.5;;;;'
    var points = ''
    for(var workoutPoint of workoutPoints){
        points +=   moment.utc(workoutPoint.time).format('YYYY-MM-DD hh:mm:ss UTC') + ';' +
                    workoutPoint.inst + ';' +
                    workoutPoint.latitude + ';' +
                    workoutPoint.longitude + ';' +
                    workoutPoint.distance.toFixed(2) + ';' +
                    workoutPoint.speed + ';'
                    workoutPoint.altitude + ';' +
                    workoutPoint.heartRate + '\n'
    }
    return points.replace(/undefined/g,'');
}

function postQueryString(params){
    var points = params.points ? params.points : [{time: params.time, distance: params.distance, inst: 3}]
    return {
        authToken: params.authToken,
        duration: params.duration,
        trackPoints: convertWorkout(points),
        workoutId: params.workoutId || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    }
}

function workoutAdd(params) {
    return new Promise((resolve, reject) =>{ 
    var qs = postQueryString(params)
    var url = apiUrl + paths.activity.post

    request.post({ url: url, qs: qs}, (err, response, body) => {
        if (err || !regex.isOk.test(body))
            reject(handleError(err))
        else
            resolve({workoutId: qs.workoutId})
        });
    })
}

module.exports = {
    get: workoutGet,
    set: workoutAdd
}