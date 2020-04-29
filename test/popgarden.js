const args = require("./args");
const plantbase = require("../providers/Plantbase");
const almanac = require("../providers/Almanac");


plantbase.getAllGardens().then(gardens => {
    const garden = gardens[0];
    if (garden) {
        almanac.getAllStoredTypes().then(async result => {
            for(let i = 0; i < result.length; i++) {
                const res = await plantbase.addTypeToGarden(garden._id, result[i].slug);
                console.log("added: " + result[i].slug);
            }
            process.exit();
        })
    } else {
        process.exit();
    }
})