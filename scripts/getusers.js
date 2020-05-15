const plantbase = require("../providers/Plantbase");

plantbase.getUsers().then(result => {
    console.log(result);
    process.exit();
});