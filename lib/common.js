 const urls = {
        api: 'https://api.mobile.endomondo.com/',
        paths: {
            auth: 'mobile/auth',
            activitiesList: 'mobile/api/workout/list',
            activity: {
                get: 'mobile/api/workout/get',
                post: 'mobile/track'
            }
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