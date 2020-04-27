const { validate } = require('sick-parks-utils')
const { NotFoundError } = require('sick-parks-errors')
const fetch = require('node-fetch')
const context = require('./context')


/**
 * Search for the parks in storage that match the given query. 
 * Ordering them by distance.
 * 
 * @param {string} [query= ''] - the query for the search
 * @param {Array} location the location of the user
 *  
 * @returns {Array} list of matching results. Empty if no matches
 * 
 * 
 * @throws {ContentError} if params don't follow the format and content rules
 * @throws {TypeError} if query or location do not have the correct type
 * @throws {NotFoundError} if query returns no results
 */

module.exports = function (query = '', location) {
    validate.stringFrontend(query, 'query', false)
    validate.type(location, 'location', Array)
    location.forEach(coordinate => validate.type(coordinate, 'coordinate', Number))

    return (async () => {
        const response = await fetch(`${this.API_URL}/parks?q=${query}&location[]=${location[0]}&location[]=${location[1]}`)

        const data = await response.json()

        const { error, results } = data
        // TODO should throw NotFoundError on no results

        if (error) throw new NotFoundError(error)

        return results
    })()

}.bind(context)