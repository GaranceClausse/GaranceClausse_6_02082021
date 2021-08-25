const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 6 * 60 * 1000,
    max: 3,
    message: "Compte bloqué pour 6 minutes : tentatives de connexion trop nombreuses"
})

module.exports = { limiter }