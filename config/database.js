const crypto = require('crypto').randomBytes(64).toString('hex');


module.exports = {

    uri: "mongodb://0.0.0.0:27017/rentsnapp",
    //uri:"mongodb+srv://behemoth7:cruzerblade@cluster0.umpvpgs.mongodb.net/?retryWrites=true&w=majority",
    secret: crypto,
    db: 'rentsnapp'
}