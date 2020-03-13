require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { Park } } = require('sick-parks-data')

const { NotFoundError } = require('sick-parks-errors')
const { expect } = require('chai')
const { random } = Math
const retrieveParkLocation = require('./retrieve-park-location')


describe.only('retrieveParkLocation', () => {
    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Park.deleteMany()
    })

    let parkName, size, level, location

    beforeEach(() => {

        parkName = `parkName-${random()}`
        size = `l`
        description = `${random()}`
        resort = `${random()}`
        level = `begginer`
        location = {
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            1.06292724609375,
                            42.413318349422475
                        ],
                        [
                            1.42547607421875,
                            42.31997030030749
                        ],
                        [
                            1.28265380859375,
                            42.45791402988027
                        ],
                        [
                            1.06292724609375,
                            42.413318349422475
                        ]
                    ]
                ]
            }
        }
    })

    describe('when park exists', () => {
        let parkId

        beforeEach(async () => {
            const park = await Park.create({ name: parkName, size, level, resort, description, location })
            parkId = park.id
        })

        it('should succeed on correct id', async () => {
            debugger
            const result = await retrieveParkLocation({ parkId })

            expect(result.name).to.equal(parkName)
            expect(result.id).to.equal(parkId)
            expect(result.resort).to.equal(resort)
            expect(result.location).to.deep.equal(location)

        })
    })
    describe('when park does not exist', () => {
        let parkId
        beforeEach(async () => {

            const park = await Park.create({ name: parkName, size, level, resort, description, location })
            parkId = park._id.toString()
            await Park.deleteOne({ _id: parkId })
            return
        })

        it('should fail on wrong id', async () => {
            try {
                await retrieveParkLocation({ parkId })
                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal(`park ${parkId} does not exist`)
            }
        })

        it('should fail on non string id', () => {
            let parkId = 1
            expect(() => {
                retrieveParkLocation({ parkId })
            }).to.throw(TypeError, `parkId ${parkId} is not a string`)

            parkId = undefined
            expect(() => {
                retrieveParkLocation({ parkId })
            }).to.throw(TypeError, `parkId ${parkId} is not a string`)

            parkId = true
            expect(() => {
                retrieveParkLocation({ parkId })
            }).to.throw(TypeError, `parkId ${parkId} is not a string`)
        })
    })

    after(() => Park.deleteMany().then(() => mongoose.disconnect()))
})