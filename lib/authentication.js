
const request = require('request-promise-native'),
    common = require('./common'),
    regex = common.regex.auth,
    createuuid = require('uuidv5'),
    os = require( 'os' ),
    uuid = createuuid( 'dns', os.hostname() )

const getQueryString = (params) => {
    return {
        email: params.email,
        password: params.password,
        deviceId: params.uuid || uuid,
        country: params.country || 'US',
        action: params.action || 'pair'
    }
}

const authenticate = async (params) => {
    let url = `${common.urls.api}${common.urls.paths.auth}`
    let query = getQueryString(params)
    let body  = await request.get({url: url, qs: query})
    if(!regex.isOk.test(body))
        return Promise.reject(common.handleError())
    return {
        authToken: regex.authToken.exec(body)[1],
        measure: regex.measure.exec(body)[1],
        displayName: regex.displayName.exec(body)[1],
        userId: regex.userId.exec(body)[1],
        facebookConnected: regex.facebookConnected.exec(body)[1],
        secureToken: regex.secureToken.exec(body)[1],
    }
}

module.exports = authenticate