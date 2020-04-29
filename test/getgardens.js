const plantbase = require("../providers/Plantbase");

plantbase.getAllGardens().then(result => {
    console.log(result);
    process.exit();
});