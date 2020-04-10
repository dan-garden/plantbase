const PlantProvider = require("./PlantProvider");

const providers = {
    trefle: require("./Trefle"),
    almanac: require("./Almanac")
};


class Plantbase extends PlantProvider {
    static async searchPlant(query) {

        const result = [];
        
        result.push(...await providers.trefle.searchPlant(query));
        result.push(...await providers.almanac.searchPlant(query));

        return result;
    }
    
    static async getSearchedPlant(query) {

        const result = {
            ...await providers.trefle.getSearchedPlant(query),
            ...await providers.almanac.getSearchedPlant(query)
        };

        return result;
    }
}


module.exports = Plantbase;