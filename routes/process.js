module.exports = function(app) {
    app.get("/api/process", function(req, res){
        res.json(process.env);
    });
}