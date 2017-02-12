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
     workout: {
         isOk: /OK\n/,
     },
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

 function handleError(error){
    if(error)
        return error
    return ('result body is not compliant')
}

 module.exports = {
     urls: urls, 
     regex: regex,
     handleError: handleError
    }