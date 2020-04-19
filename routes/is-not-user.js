const plantbase = require("../providers/Plantbase");
const path = require("path");

function sendFile(res, filename) {
    res.sendFile(path.join(__dirname+'/../public/'+filename));
}

module.exports = function(app) {

    app.get("/login", plantbase.isNotLoggedIn, (req, res) => sendFile(res, "login.html"));
    app.get("/register", plantbase.isNotLoggedIn, (req, res) => sendFile(res, "register.html"));

}