const args = require("./args");
const trefle = require("../providers/Trefle");

trefle.bulkPopulatePlants().then(result => {
    console.log(result);
    process.exit();
});