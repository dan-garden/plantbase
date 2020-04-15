const PlantProvider = require("./PlantProvider");
const Model = require("../Database");

const almanac = require("./Almanac");
const trefle = require("./Trefle");


class Plantbase extends PlantProvider {
    static photos_dir = "../assets/images/plants";
    
    static async createGarden(user_id, name) {
        const garden = {
            user_id,
            name,
            plants: []
        };
        const store = await this.store(Model.Garden, null, garden);
        return store;
    }

    static async getGardenById(garden_id) {
        const stored = await this.findOne(Model.Garden, {
            _id: garden_id
        })

        return stored;
    }
    
    static async getGardensByUserId(user_id) {
        const stored = await this.find(Model.Garden, {
            user_id
        });

        return stored;
    }

    static async createPlant(garden_id, user_id, slug) {
        const plantType = await almanac.getType(slug);
        const plant = {
            garden_id: garden_id,
            user_id: user_id,
            image: plantType.image,
            sun_exposure: "",
            location: "",
            type_id: plantType._id,
            plant_id: null
        };

        const storePlant = await this.store(Model.Plant, null, plant);
        return storePlant;
    }

    static async getPlantById(plant_id) {
        const stored = await this.findOne(Model.Plant, {
            _id: plant_id
        })

        return stored;
    }

    static async addTypeToGarden(garden_id, slug) {
        try {
            const garden = await this.getGardenById(garden_id);
            if(garden) {
                const plant = await this.createPlant(garden._id, garden.user_id, slug);
                return plant;
            }
        } catch {
            return undefined;
        }
    }

    static async selectPlantSpecies(plant_id, species_id) {
        try {
            const plant = await this.getPlantById(plant_id);
            const species = await trefle.getPlant(species_id);
            plant.plant_id = species._id;
            const storePlant = await this.store(Model.Plant, null, plant);
            return storePlant;
        } catch(e) {
            console.error(e);
            return undefined;
        }
    }

    static async updatePhoto(plant_id, filename) {
        const plant = await this.getPlantById(plant_id);
        plant.image = this.photos_dir + "/" + filename;
        const storePlant = await this.store(Model.plant, null, plant);
        return storePlant;
    }


    
}


module.exports = Plantbase;