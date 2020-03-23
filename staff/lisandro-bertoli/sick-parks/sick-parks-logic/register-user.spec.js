const { registerUser } = require('.')
const { mongoose, models: { User } } = require('sick-parks-data')
const { random } = Math
const { expect } = require('chai')
const bcrypt = require('bcryptjs')

const { TEST_MONGODB_URL: MONGODB_URL, TEST_API_URL: API_URL } = process.env

logic.__context__.API_URL = API_URL

describe('registerUser', () => {
    before(async () => {
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

        return await Promise.resolve(User.deleteMany())
    })


    let name, surname, email, password

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on new user', async () => {
        const response = await registerUser({ name, surname, email, password })

        expect(response).to.be.undefined

        const user = await User.findOne({ email })

        expect(user).to.exist
        expect(typeof user.id).to.equal('string')
        expect(user.name).to.equal(name)
        expect(user.surname).to.equal(surname)
        expect(user.email).to.equal(email)
        expect(user.created).to.be.an.instanceOf(Date)

        const validPassowrd = bcrypt.compare(password, user.password)
        expect(validPassowrd).to.be.ok // TODO encrypt this field!
    })

    describe('when user already exists', () => {
        beforeEach(async () => {
            await User.create({ name, surname, email, password })
        })

        it('should fail on already existing user', async () => {
            try {

                await registerUser({ name, surname, email, password })

                throw new Error('should not reach this point')
            } catch (error) {

                expect(error).to.exist
                expect(error.message).to.equal(`user ${email} already exists`)
            }

        })
    })

    after(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})