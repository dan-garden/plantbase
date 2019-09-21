const storage = require("./cache");
const almanac = require("./almanac");
const uuidv4 = require('uuid/v4');

class GardenDB {
    static get db_name() {
        return "plant-index-db";
    }

    static async getDB() {
        let db = await storage.getCache(this.db_name);
        if(!db) {
            db = await storage.setCache(this.db_name, {
                plants: []
            });
        }
        return db;
    }

    static async setDB(db) {
        const store = await storage.setCache(this.db_name, db);
        return store;
    }

    static async add(slug) {
        const db = await this.getDB();
        db.plants.push({
            id: uuidv4(),
            slug,
            moisture: 3,
            photo: false,
            location: "greenhouse",
            sun_exposure: "Full Sun"
        });
        const update = await this.setDB(db);
        return update;
    }

    static async update() {

    }

    static async getCount(slug) {
        const db = await this.getDB();
        let count = 0;
        db.plants.forEach(plant => {
            if(plant.slug === slug) {
                count++;
            }
        });
        return count;
    }

    static async getAll() {
        const db = await this.getDB();
        db.plants = await Promise.all(db.plants.map(async plant => {
            plant.details = await almanac.getPlant(plant.slug);
            return plant;
        }));
        return db;
    }
}



module.exports = GardenDB;