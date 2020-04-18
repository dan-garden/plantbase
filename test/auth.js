const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0] && args[1]) {
    plantbase.authenticateUser(args[0], args[1]).then(result => {
        console.log(result);
        process.exit();
    })
}