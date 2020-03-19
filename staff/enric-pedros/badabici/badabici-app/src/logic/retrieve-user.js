const { validate } = require('badabici-utils')
const { NotAllowedError } = require('badabici-errors')
require('dotenv').config()

const API_URL = process.env.REACT_APP_API_URL

module.exports = token => {
    validate.string(token, 'token')
    validate.token(token)

    return (async () => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const { status } = await response
    
        if (status === 200) {
            const user = await response.json()

            return user
        }

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 401) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')
    })()
}