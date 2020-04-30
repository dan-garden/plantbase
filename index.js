const express = require("express");
const app = express();
const port = 3001;

require("./routes/index")(app);

app.listen(port);
console.log("App started on port " + port);

require("./startup");