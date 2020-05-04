const args = require("./args");
const provider = require("../providers/PlantProvider");


if(args[0]) {
    provider.uploadFile(args[0]).then(result => {
        console.log(result);
        process.exit();
    })
}