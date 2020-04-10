const PlantProvider = require("./PlantProvider");

const fetch = require("node-fetch");
const storage = require("../cache");

class Trefle extends PlantProvider {
    static get url() {
        return "https://trefle.io";
    }

    static get token() {
        return "Qk5uKzM5K29Cdm9rZWl3eFNGU1M1QT09"
    }

    static async callAPI(path, params={}) {
        const url = new URL(`${this.url}/api/${path}`);
        const searchParams = { token: this.token, ...params };
        
        Object.keys(searchParams).forEach(key => {
            url.searchParams.set(key, searchParams[key])
        });

        const request = await fetch(url.href).catch(error => console.error(error));
        const json = await request.json();
        return json;
    }

    static async searchPlant(query) {
        const result = await this.callAPI("plants", { q: query });
        return result;
    }

    static async getPlant(id) {
        const result = await this.callAPI(`plants/${id}`);
        return result;
    }

    static async getSearchedPlant(query) {
        const results = await this.searchPlant(query);

        if(results.length) {
            const plant = await this.getPlant(results[0].id);
            return plant;
        }
    }


}


module.exports = Trefle;