const plantbase = require("../providers/Plantbase");
const {
    passport
} = require("../Database");

module.exports = function (app) {
    app.post("/api/login", async (req, res) => {
        try {
            console.log(req.body.username, req.body.password);
            const login = await plantbase.loginUser(req);
            if (login) {
                res.json({
                    success: req.user,
                    redirect: "/me.html"
                })
            }
        } catch (e) {
            console.error(e);
            res.json({
                error: e.message
            })
        }
    });
}