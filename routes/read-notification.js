const plantbase = require("../providers/Plantbase");

module.exports = function(app) {
    app.post("/api/read-notification", async (req, res) => {
        try {
            if(!req.user) {
                throw new Error("Please login to continue");
            }
            const result = await plantbase.readNotification(req.user._id, req.body.notification_id);
            res.json({ success: result });
        } catch(e) {
            res.json({ error: e.message })
        }
    });
}