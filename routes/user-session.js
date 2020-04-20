module.exports = function(app) {
    app.get("/api/session", async (req, res) => {
        try {
            if(req.user) {
                res.json({ session: req.user });
            } else {
                res.json({ session: false })
            }
        } catch(e) {
            console.error(e);
            res.json({ error: e.message })
        }
    });
}