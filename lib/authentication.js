'use strict'

var request = require('request'),
    common = require('./common'),
    apiUrl = common.urls.api,
    paths = common.urls.paths,
    regex = common.regex.auth,
    handleError = common.handleError,
    createuuid = require('uuidv5'),
    os = require( 'os' ),
    uuid = createuuid( 'dns', os.hostname() )

function getQueryString(params){
    return {
        email: params.email,
        password: params.password,
        deviceId: params.uuid || uuid,
        country: params.country || 'ES',
        action: params.action || 'pair'
    }
}

function authenticate(params){
    return new Promise((resolve, reject) =>{
        var qs = getQueryString(params)
        var url = apiUrl + paths.auth

        request.get({ url:url, qs:qs }, (err, response, body) => {
            if (err || !regex.isOk.test(body))
                reject(handleError(err))
            else
                resolve({
                        authToken: regex.authToken.exec(body)[1],
                        measure: regex.measure.exec(body)[1],
                        displayName: regex.displayName.exec(body)[1],
                        userId: regex.userId.exec(body)[1],
                        facebookConnected: regex.facebookConnected.exec(body)[1],
                        secureToken: regex.secureToken.exec(body)[1],
                })
        })
    })
}

module.exports = authenticate