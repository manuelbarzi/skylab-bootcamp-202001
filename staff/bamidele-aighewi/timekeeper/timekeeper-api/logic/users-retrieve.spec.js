require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Company, Event, WeekDay } } = require('timekeeper-data')
const { expect } = require('chai')
const unitFunction = require('./users-retrieve')
const {
    mongoose,
    utils: {
        roles: { CLIENT, WORKER },
        eventStates: { ACCEPTED, PENDING },
        eventTypes: { WORK_DAY, WORK_HOLIDAY, USER_HOLIDAY, USER_ABSENCE, USER_SIGN_IN_OUT }
    }
} = require('timekeeper-data')
const { v4: uuid } = require('uuid')
const { random } = Math

describe('usersRetrieve', () => {
    let owner, company

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()

        const user = await User.create({ name: 'Client-name', surname: 'Client-surname', email: 'client@mail.com', password: '123', role: CLIENT })
        owner = user.id

        const _company = await Company.create({ invite: uuid(), name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner, web: 'http://company.url', cif: 'P0080665C', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })
        company = _company.id

        user.company = company
        await user.save()

        const createUser = async (role, _company) => {
            let clientObj = {}
            clientObj.name = `name-${random()}`
            clientObj.surname = `surname-${random()}`
            clientObj.email = `email-${random()}@mail.com`
            clientObj.password = `password-${random()}`
            clientObj.role = role

            if (typeof _company !== 'undefined') clientObj.company = _company

            return User.create(clientObj)
        }


        let promises = Promise.resolve()

        for (let x = 0; x < 20; x++) {
            promises = promises
                .then(() => createUser(WORKER, company))
                .then(() => { return 'OKK!!!' })
        }

        return promises.then(() => { })
    })

    it('should successfully retrieve all users', async () => {
        const _users = await unitFunction(owner)
        expect(_users).to.exist
        expect(_users).to.be.an('array')
        expect(_users.length).to.equal(21)

        _users.forEach(_user => {
            expect(_user._id).not.to.exist
            expect(_user.id).to.be.string
        })
    })

    it('should fail on non-string user parameter', () => {
        const name = 'user'
        let target

        target = 1
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    after(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
        await mongoose.disconnect()
    })
})