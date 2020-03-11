const { companyUpdate } = require('../../logic')
const { ContentError } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: userId } } = req

    try {
        // const _date = date ? new Date(date) : date

        companyUpdate(userId, req.body)
            .then(() => res.status(201).end())
            .catch(error => {
                let status = 400

                const { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        if (error instanceof TypeError || error instanceof ContentError)
            status = 406 // not acceptable

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}