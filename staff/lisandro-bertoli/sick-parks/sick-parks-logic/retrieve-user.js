const context = require('./context')
const fetch = require('node-fetch')

module.exports = function retrieveUser() {

    return (async () => {

        const token = await this.storage.getItem('token')
        const response = await fetch(`${this.API_URL}/users`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json()
        const { error: _error } = data

        if (_error) throw new Error(_error)
        debugger
        const { name, surname, email, contributions, image, allowLocation, notifications } = data

        return { name, surname, email, contributions, image, allowLocation, notifications }

    })()
}.bind(context)