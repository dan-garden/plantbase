const plantbase = require("../providers/Plantbase");
const path = require("path");

function sendFile(res, filename) {
    res.sendFile(path.join(__dirname+'/../public/'+filename));
}

module.exports = function(app) {

    app.get("/my-gardens", plantbase.isLoggedIn, (req, res) => sendFile(res, "my-gardens.html"));

}