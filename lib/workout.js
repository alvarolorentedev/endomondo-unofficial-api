const request = require('request-promise-native'),
    defaultFields = 'device,simple,basic,motivation,interval,hr_zones,weather,polyline_encoded_small,points,lcp_count,tagged_users,pictures,feed'
    moment = require('moment'),
    common = require('./common'),
    regex = common.regex.workout

const convertGet = (params) => ({
    authToken: params.authToken,
    workoutId: params.workoutId,
    fields: params.fields || defaultFields
})

const convertSetPoints = (points) => {
    return points.map(point => {
        let time = moment.utc(point.time).format('YYYY-MM-DD hh:mm:ss UTC')
        let expectedPoints = `${time};${point.inst};${point.latitude};${point.longitude};${point.distance.toFixed(2)};${point.speed};${point.altitude};${point.heartRate}\n`
        return expectedPoints.replace(/undefined/g,'')
    }).join('\n')
}

const convertSet = (params) => {
    let points = params.points || [{time: params.time, distance: params.distance, inst: 3}]
    return {
        authToken: params.authToken,
        duration: params.duration,
        workoutId: params.workoutId || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        trackPoints: convertSetPoints(points)
    }
}

const get = (params) => {
    let url = `${common.urls.api}${common.urls.paths.activity.get}`
    return request.get({url, qs: convertGet(params), json: true})
}

const set = async (params) => {
    let url = `${common.urls.api}${common.urls.paths.activity.post}`
    let qs = convertSet(params)
    let result = await request.post({url, qs })
    if(!regex.isOk.test(result))
        return Promise.reject(common.handleError())
    return { workoutId : qs.workoutId }
}

const remove = (params) => {
    let url = `${common.urls.api}${common.urls.paths.activity.delete}`
    return request.delete({ url, qs: convertGet(params), json: true })
}

module.exports = { get, set, remove}