const plantbase = require("../providers/Plantbase");

plantbase.getGardens().then(result => {
    console.log(result);
    process.exit();
});