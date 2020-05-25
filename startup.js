const plantbase = require("./providers/Plantbase");

setInterval(() => {
    plantbase.updateAllWatered().then((count) => {
        // console.log(`${count} plants updated.`);
    });
}, 100000);