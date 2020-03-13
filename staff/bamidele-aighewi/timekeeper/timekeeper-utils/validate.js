const { ContentError } = require('timekeeper-errors')
const moment = require('moment')
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

module.exports = {
    string(target, name, empty = true) {
        this.type(target, name, String)

        if (empty && !target.trim()) throw new ContentError(`${name} is empty`)
    },

    number(target, name) {
        // this.type(target, name, Number)
        if (!/^\d+$/.test(target)) throw new TypeError(`${name} ${target} is not a number`)
    },

    boolean(target, name) {
        this.type(target, name, Boolean)
    },

    token(token) {
        if (typeof atob !== 'function') throw new Error('atob function not found')

        const [header, payload, signature] = token.split('.')
        if (!header || !payload || !signature) throw new Error('invalid token')
        const { sub } = JSON.parse(atob(payload))
        if (!sub) throw new Error('no user id in token')
    },

    email(target) {
        if (!EMAIL_REGEX.test(target)) throw new ContentError(`${target} is not an e-mail`)
    },

    date(target, format = "YYYY-MM-DD") {
        if (!moment(target, format).isValid()) throw new TypeError(`${target} is not a valid date`)
    },

    type(target, name, type) {
        if (type === String || type === Number || type === Boolean) {
            type = type.name.toLowerCase()

            if (typeof target !== type) throw new TypeError(`${name} ${target} is not a ${type}`)
        } else if (!(target instanceof type)) throw new TypeError(`${name} ${target} is not a ${type.name}`)
    },

    url(target) {
        if (!URL_REGEX.test(target)) throw new ContentError(`${target} is not a valid url`)
    }
}