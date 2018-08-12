jest.mock('../../../lib/common', () => ({
    urls: {
        api: 'https://api.mobile.endomondo.com/',
        paths: {
            auth: 'mobile/auth'
        }
    },
    regex: {
        auth: {
            isOk: /OK\n/,
            authToken: /authToken=(.*?)\n/,
            measure: /measure=(.*?)\n/,
            displayName: /displayName=(.*?)\n/,
            userId: /userId=(.*?)\n/,
            facebookConnected: /facebookConnected=(.*?)\n/,
            secureToken: /secureToken=(.*?)\n/
        }
    },
    handleError: jest.fn()
}))
jest.mock('request-promise-native', () => ({ get: jest.fn() }))
jest.mock('uuid/v1', () => jest.fn())

const authenticate = require('../../../lib/authentication'),
    faker = require('faker'),
    request = require('request-promise-native'),
    common = require('../../../lib/common'),
    uuid = require('uuid/v1')

describe('authenticate should', () => {    
    beforeEach(() => {
        uuid.mockReturnValue(faker.random.uuid())
        request.get.mockClear()
        request.get.mockImplementation(() => 
        `
        OK\n
        authToken=pepe\n
        measure=pepe\n
        displayName=pepe\n
        userId=pepe\n
        facebookConnected=pepe\n
        secureToken=pepe\n
        `)

    })
    test('request get is called with correct url', async () => {

        await authenticate({})

        expect(request.get.mock.calls[0][0].url).toEqual(`${common.urls.api}${common.urls.paths.auth}`)
    })

    test('request get is called with correct query parameters if all passed', async () => {
        let params = {
            email: faker.random.uuid(),
            password: faker.random.uuid(),
            uuid: faker.random.uuid(),
            country: faker.random.uuid(),
            action: faker.random.uuid()
        }

        await authenticate(params)

        expect(request.get.mock.calls[0][0].qs.email).toEqual(params.email)
        expect(request.get.mock.calls[0][0].qs.password).toEqual(params.password)
        expect(request.get.mock.calls[0][0].qs.deviceId).toEqual(params.uuid)
        expect(request.get.mock.calls[0][0].qs.country).toEqual(params.country)
        expect(request.get.mock.calls[0][0].qs.action).toEqual(params.action)
    })

    test('request get is called with default parameter for country as US', async () => {
        authenticate({})

        await expect(request.get.mock.calls[0][0].qs.country).toEqual('US')
    })

    test('request get is called with default parameter for action as pair', async () => {
        authenticate({})

        await expect(request.get.mock.calls[0][0].qs.action).toEqual('pair')
    })

    test('request get is called with default parameter for uuid', async () => {
        let expected = faker.random.uuid()
        uuid.mockReturnValue(expected)

        authenticate({})

        await expect(request.get.mock.calls[0][0].qs.deviceId).toEqual(expected)
    })

    test('request get response is not Ok', async () => {
        let expected = faker.random.uuid()
        common.handleError.mockReturnValue(expected)
        request.get.mockImplementation(() => 'Fail\n')
        expect(authenticate({})).rejects.toEqual(expected)
    })

    test('request get response should return mapped object', async () => {
        let authToken= faker.random.uuid()
        let measure= faker.random.uuid()
        let displayName= faker.random.uuid()
        let userId= faker.random.uuid()
        let facebookConnected= faker.random.uuid()
        let secureToken= faker.random.uuid()
        request.get.mockImplementation(() => `
        OK\n
        authToken=${authToken}\n
        measure=${measure}\n
        displayName=${displayName}\n
        userId=${userId}\n
        facebookConnected=${facebookConnected}\n
        secureToken=${secureToken}\n
        `)

        let result = await authenticate({})

        expect(result).toEqual({
            authToken: authToken,
            measure: measure,
            displayName: displayName,
            userId: userId,
            facebookConnected: facebookConnected,
            secureToken: secureToken,
        })
    })
})