const plantbase = require("../providers/Plantbase");

module.exports = function (app) {
    app.post("/api/register", async (req, res) => {
        try {
            const result = await plantbase.registerUser(req);
            if (result) {
                res.json({
                    success: result,
                    redirect: req.body.referrer ||  "/"
                });
            }
        } catch (e) {
            res.json({
                error: e.message
            })
        }
    });
}