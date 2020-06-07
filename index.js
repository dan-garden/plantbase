if(process.env.ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();


require("./routes/index")(app);

app.listen(process.env.PORT);
console.log("App started on port " + process.env.PORT);

require("./startup");