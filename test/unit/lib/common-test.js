const common = require('../../../lib/common'),
    faker = require('faker')

describe('common should', () => {
    test('export urls for the service', async () => {
        let expectedUrl = {
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
        expect(common.urls).toEqual(expectedUrl)
    })

    test('export regex for workout', async () => {
        let expectedWorkoutRegex = {
            isOk: /OK\n/,
        }
        expect(common.regex.workout).toEqual(expectedWorkoutRegex)
    })

    test('export regex for auth', async () => {
        let expectedAuthRegex = {
            isOk: /OK\n/,
            authToken: /authToken=(.*?)\n/,
            measure: /measure=(.*?)\n/,
            displayName: /displayName=(.*?)\n/,
            userId: /userId=(.*?)\n/,
            facebookConnected: /facebookConnected=(.*?)\n/,
            secureToken: /secureToken=(.*?)\n/
        }
        expect(common.regex.auth).toEqual(expectedAuthRegex)
    })

    test('handle error should use same error than passed', async () => {
        let errorExpected = faker.random.uuid()
        let error = common.handleError(errorExpected)
        expect(error).toEqual(errorExpected)
    })
    test('handle error should return specific string if no error passed', async () => {
        let error = common.handleError()
        expect(error).toEqual('result body is not compliant')
    })
})