const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0]) {
    plantbase.getGardensByUserId(args[0]).then(result => {
        console.log(result);
        process.exit();
    })
}