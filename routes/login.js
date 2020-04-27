const plantbase = require("../providers/Plantbase");

module.exports = function (app) {
    app.post("/api/login", async (req, res) => {
        try {
            const login = await plantbase.loginUser(req);
            if (login) {
                res.json({
                    success: req.user,
                    redirect: req.body.referrer ||  "/my-gardens"
                });
            }
        } catch (e) {
            res.json({
                error: e.message
            })
        }
    });
}