const { PlantProvider } = require("./PlantProvider");

const almanac = require("./Almanac");
const trefle = require("./Trefle");


class Plantbase extends PlantProvider {
    static async searchTypes(query) {
        const result = await almanac.searchTypes(query);
        return result;
    }

    static async addToGarden(user, garden, slug) {
        
    }

    static async searchPlants(query) {
        const result = await trefle.searchPlants(query);
        return result;
    }
}





//search plant type
//select plant type and add to garden
//go to garden and select precise species


module.exports = Plantbase;