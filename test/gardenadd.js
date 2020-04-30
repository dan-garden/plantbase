const args = require("./args");
const plantbase = require("../providers/Plantbase");


if(args[0]) {
    plantbase.getGardens().then(gardens => {
        const garden = gardens[0];
        if(garden) {
            plantbase.addTypeToGarden(garden.user_id, garden._id, args[0]).then(result => {
                console.log(result);
                process.exit();
            })
        } else {
            process.exit();
        }
    })
}