const plantbase = require("../providers/Plantbase");

module.exports = function (app) {
    // app.get("/api/login", async (req, res) => {
    //     try {
    //         if(req.query.username && req.query.password) {
    //             const login = await plantbase.loginUser(req);
    //             if(login) {
    //                 res.json(req.user)
    //             } else {
    //                 res.json({ error: "Username or password entered incorrectly" })
    //             }
    //         }
    //     } catch(e) {
    //         console.error(e);
    //         res.json({ error: e.message })
    //     }
    // });

    app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/' + req.user.username);
    });
}