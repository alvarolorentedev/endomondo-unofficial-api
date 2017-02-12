 const urls = {
        api: 'https://api.mobile.endomondo.com/',
        paths: {
            authUrl: 'mobile/auth',
            activitiesListUrl: 'mobile/api/workout/list',
            activity: 'mobile/api/workout/get'
        }
 }

 const regex = {
     auth: {
        isOk: /OK\n/,
        authToken: /authToken=(.*?)\n/,
        measure: /measure=(.*?)\n/,
        displayName: /displayName=(.*?)\n/,
        userId: /userId=(.*?)\n/,
        facebookConnected: /facebookConnected=(.*?)\n/,
        secureToken: /secureToken=(.*?)\n/
    }
 } 

 module.exports = {urls: urls, regex: regex}