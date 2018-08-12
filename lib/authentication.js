const request = require('request-promise-native'),
    common = require('./common'),
    regex = common.regex.auth,
    uuid = require('uuid/v1')

const convert = (params) => {
    return {
        email: params.email,
        password: params.password,
        deviceId: params.uuid || uuid(),
        country: params.country || 'US',
        action: params.action || 'pair'
    }
}

const parse = (body) => ({
    authToken: regex.authToken.exec(body)[1],
    measure: regex.measure.exec(body)[1],
    displayName: regex.displayName.exec(body)[1],
    userId: regex.userId.exec(body)[1],
    facebookConnected: regex.facebookConnected.exec(body)[1],
    secureToken: regex.secureToken.exec(body)[1],
})

const authenticate = async (params) => {
    let url = `${common.urls.api}${common.urls.paths.auth}`
    let body = await request.get({url: url, qs: convert(params)})
    if(!regex.isOk.test(body))
        return Promise.reject(common.handleError())
    return parse(body)
}

module.exports = authenticate