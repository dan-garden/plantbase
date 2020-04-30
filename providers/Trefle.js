//https://trefle.io/reference

const PlantProvider = require("./PlantProvider");
const { Model } = require("../Database");


class Trefle extends PlantProvider {

    static url = "https://trefle.io";
    static token = "Qk5uKzM5K29Cdm9rZWl3eFNGU1M1QT09";
    static forceScrape = true;

    static async getStoredSearch(query) {
        const find = await this.findLike(Model.TrefleSearch, {
            $or: [{
                    common_name: query
                },
                {
                    scientific_name: query
                }
            ]
        }, 50);

        return find;
    }

    static async getStoredPlantById(id) {
        const find = await this.findOne(Model.TreflePlant, {
            id: id
        });

        return find;
    }

    static async storeSearch(update) {
        const store = await this.store(Model.TrefleSearch, "id", update);
        return store;
    }

    static async storeSearches(updateArray) {
        const store = await this.storeMany(Model.TrefleSearch, "id", updateArray);
        return store;
    }

    static async storePlant(update) {
        const store = await this.store(Model.TreflePlant, "id", update);
        return store;
    }

    static async bulkSearch(type) {
        let searches = require(`../data/${type}.js`);
        if (typeof searches === "function") {
            searches = await searches();
        }

        for (let i = 0; i < searches.length; i++) {
            const results = await this.searchPlants(searches[i]);
            console.log(`[${results.length}] ${searches[i]}`);
        }
        return `------Finished ${searches.length}-----`;
    }

    static async searchPlants(query) {
        const stored = await this.getStoredSearch(query);
        if(stored.length && !this.forceScrape) {
            return stored;
        } else {
            const results = await this.callAPI("plants", {
                q: query,
                page_size: 50
            });
    
            if (results === "Internal server error") {
                return [];
            } else {
                const store = await this.storeSearches(results);
                return store;
            }
        }
    }

    static async getPlant(id) {
        id = parseInt(id);
        const stored = await this.getStoredPlantById(id);
        if(stored && !this.forceScrape) {
            return stored;
        } else {
            const result = await this.callAPI(`plants/${id}`);
            const store = await this.storePlant(result);
    
            return store;
        }
    }

    static async getSearchedPlant(query) {
        const results = await this.searchPlants(query);

        if (results.length) {
            const plant = await this.getPlant(results[0].id);
            return plant;
        }
    }


}


module.exports = Trefle;