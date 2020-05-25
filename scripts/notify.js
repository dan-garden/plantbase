const args = require("./args");
const plantbase = require("../providers/Plantbase");

const count = 15;
const user_id = "5eaa7c4a2187d611f4beea77";


async function multi() {
    return new Promise(async (resolve, reject) => {
        if(args[0] && args[1]) {
            for(let i = 0; i < count; i++) {
                const res = await plantbase.notify(user_id, args[0], args[1], "/", "vial");
                console.log(res);
        
                if(i === count-1) {
                    resolve();
                }
            }
        } else {
            resolve();
        }
    })
}


multi().then(() => {
    process.exit();
});