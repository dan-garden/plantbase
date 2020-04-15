const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0]) {
    plantbase.addTypeToGarden("5e96e791b266e46b8b32b8e3", args[0]).then(result => {
        console.log(result);
        process.exit();
    })
}