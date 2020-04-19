module.exports = function(app) {
    app.get("/api/session", async (req, res) => {
        try {
            res.json(req.user);
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}