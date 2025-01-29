module.exports = function (app) {
    app.get('/', (req, res) => {
        let users = require('./../../server').users
        res.json(users);
    })
}