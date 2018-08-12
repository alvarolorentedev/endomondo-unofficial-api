jest.mock('../../../lib/common', () => ({
    urls: {
        api: 'https://api.mobile.endomondo.com/',
        paths: {
            activity: {
                get: 'mobile/api/workout/get',
                post: 'mobile/track'
            }
        }
    },
    regex: {
        workout: {
            isOk: /OK\n/,
        }
    },
    handleError: jest.fn()
}))
jest.mock('request-promise-native', () => ({ 
    get: jest.fn(), 
    post: jest.fn() 
}))

const workout = require('../../../lib/workout'),
    faker = require('faker'),
    request = require('request-promise-native'),
    common = require('../../../lib/common'),
    moment = require('moment')    

describe('workout should', () => {    
    beforeEach(() => {
        request.get.mockClear()
        request.get.mockImplementation(() => `{}`)
        request.post.mockClear()
        request.post.mockImplementation(() => `OK\n`)
    })

    test('request get is called with correct url', async () => {
        await workout.get({})
        expect(request.get.mock.calls[0][0].url).toEqual(`${common.urls.api}${common.urls.paths.activity.get}`)
    })

    test('request get is called with correct json parameter', async () => {
        await workout.get({})
        expect(request.get.mock.calls[0][0].json).toEqual(true)
    })

    test('request get is called with correct query parameters if all passed', async () => {
        let params = {
            authToken: faker.random.uuid(),
            workoutId: faker.random.uuid(),
            fields: faker.random.uuid(),
        }

        await workout.get(params)

        expect(request.get.mock.calls[0][0].qs).toEqual(params)
    })

    test('request get is called with default value for fields', async () => {
        let fields = 'device,simple,basic,motivation,interval,hr_zones,weather,polyline_encoded_small,points,lcp_count,tagged_users,pictures,feed'
        await workout.get({})

        expect(request.get.mock.calls[0][0].qs.fields).toEqual(fields)
    })

    test('request get returns json result', async () => {
        let expectedResult = { something : faker.random.uuid() }
        request.get.mockReturnValue(Promise.resolve(expectedResult))
        let result = await workout.get({})
        expect(result).toEqual(expectedResult)
    })

    test('request post is called with correct url', async () => {
        let params = {
            authToken: faker.random.uuid(),
            duration: faker.random.uuid(),
            workoutId: faker.random.uuid(),
            points: []
        }
        await workout.set(params)
        expect(request.post.mock.calls[0][0].url).toEqual(`${common.urls.api}${common.urls.paths.activity.post}`)
    })

    test('request post is called with auto-generated workoutId', async () => {
        let params = {
            points: []
        }
        await workout.set(params)
        expect(request.post.mock.calls[0][0].qs.workoutId).not.toBeUndefined()
    })

    test('request post is called with single parameter obtained from time and distance', async () => {
        let params = {
            time: faker.random.number(200),
            distance: faker.random.number(200),
        },
        formatedTime = moment.utc(params.time).format('YYYY-MM-DD hh:mm:ss UTC')
        expectedPoints = `${formatedTime};3;;;${params.distance.toFixed(2)};;;\n`

        await workout.set(params)
        expect(request.post.mock.calls[0][0].qs.trackPoints).toEqual(expectedPoints)
    })

    test('request post is called with correct query parameters if all passed', async () => {
        let point = {
            time: faker.date.recent(),
            inst: faker.random.number(20),
            distance: faker.random.number(200),
            speed: faker.random.number(200),
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
            altitude: faker.random.number(200),
            heartRate: faker.random.number(200),
        },
        params = {
            authToken: faker.random.uuid(),
            duration: faker.random.uuid(),
            workoutId: faker.random.uuid(),
            points: [point]
        },
        formatedTime = moment.utc(point.time).format('YYYY-MM-DD hh:mm:ss UTC')
        expectedPoints = `${formatedTime};${point.inst};${point.latitude};${point.longitude};${point.distance.toFixed(2)};${point.speed};${point.altitude};${point.heartRate}\n`

        await workout.set(params)

        expect(request.post.mock.calls[0][0].qs.authToken).toEqual(params.authToken)
        expect(request.post.mock.calls[0][0].qs.duration).toEqual(params.duration)
        expect(request.post.mock.calls[0][0].qs.workoutId).toEqual(params.workoutId)
        expect(request.post.mock.calls[0][0].qs.trackPoints).toEqual(expectedPoints)
    })

    test('request post is called with some parameters missing', async () => {
        let point = {
            time: faker.date.recent(),
            inst: faker.random.number(20),
            distance: faker.random.number(200)
        },
        params = {
            authToken: faker.random.uuid(),
            duration: faker.random.uuid(),
            workoutId: faker.random.uuid(),
            points: [point]
        },
        formatedTime = moment.utc(point.time).format('YYYY-MM-DD hh:mm:ss UTC')
        expectedPoints = `${formatedTime};${point.inst};;;${point.distance.toFixed(2)};;;\n`

        await workout.set(params)

        expect(request.post.mock.calls[0][0].qs.authToken).toEqual(params.authToken)
        expect(request.post.mock.calls[0][0].qs.duration).toEqual(params.duration)
        expect(request.post.mock.calls[0][0].qs.workoutId).toEqual(params.workoutId)
        expect(request.post.mock.calls[0][0].qs.trackPoints).toEqual(expectedPoints)
    })


    test('request post returns result with correct value', async () => {
        let params = {
            workoutId: faker.random.number(30000),
            time: faker.random.number(200),
            distance: faker.random.number(200),
        }
        request.post.mockReturnValue('OK\n')

        let result = await workout.set(params)
        expect(result).toEqual({ workoutId : params.workoutId })
    })

    test('request post is returns error in case of fail request', async () => {
        let params = {
            workoutId: faker.random.number(30000),
            time: faker.random.number(200),
            distance: faker.random.number(200),
        },
        expected = faker.random.uuid()
        common.handleError.mockReturnValue(expected)
        request.post.mockReturnValue('Fail\n')

        expect(workout.set(params)).rejects.toEqual(expected)
    })
})