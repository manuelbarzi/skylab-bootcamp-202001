const { validate } = require('badabici-utils')
const { models: { User, Product } } = require('badabici-data')
const { NotAllowedError, NotFoundError } = require('badabici-errors')

module.exports = (id, productId, data) => {
    validate.string(productId, 'productId')
    validate.string(id, 'id')

    for (let key in data) {
        validate.string(data[key], `${key}`)
    }
    return (async () => {

        const user = await User.findById(id)

        if (!user) throw new NotFoundError('user does not exist')
        if (user.role !== 'superadmin') throw new NotAllowedError(`this user is not the superadmin`)

        const product = await Product.findByIdAndUpdate(productId, data)

        if (!product) throw new NotFoundError(`product with id ${productId} not found`)

        return
    })()
}