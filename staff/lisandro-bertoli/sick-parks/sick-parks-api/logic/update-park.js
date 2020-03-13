const { validate } = require('sick-parks-utils')
const { models: { Park } } = require('sick-parks-data')
const { NotAllowedError, NotFoundError } = require('sick-parks-errors')


module.exports = (userId, parkId, updates) => {
    validate.string(userId, 'userId')
    validate.string(parkId, 'parkId')


    return (async () => {
        const park = await Park.findById(parkId)
        if (!park) throw new NotFoundError(`park ${parkId} does not exist`)

        if (park.creator._id.toString() !== userId) throw new NotAllowedError(`user ${userId} did not create this park`)

        for (key in updates) {
            if (!park[key]) throw new NotAllowedError(`field ${key} is not a valid`)
            park[key] = updates[key]
        }

        await park.save()
    })()
}