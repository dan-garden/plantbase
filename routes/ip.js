module.exports = function(app) {
    app.get('/api/ip', (req, res) => {
        res.json({ IP_ADDR: req.clientIp })
    })
}