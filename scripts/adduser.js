const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0] && args[1]) {
    plantbase.registerUser(args[0], args[1], args[1]).then(user => {
        console.log(user);
        process.exit();
    })
}