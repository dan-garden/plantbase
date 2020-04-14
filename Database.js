const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://dan:Fredwarrior123@cluster0-gluxm.mongodb.net/plantbase?retroWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const Schema = mongoose.Schema;
const Model = {};


const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
});

const plantSchema = new Schema({
    user_id: mongoose.ObjectId,
    image: {
        type: String,
        default: null
    },
    sun_exposure: String,
    location: String,
    type_slug: String,
    plant_id: {
        type: Number,
        default: null
    }
});

const gardenSchema = new Schema({
    user_id: mongoose.ObjectId,
    name: String,
    date_created: {
        type: Date,
        default: Date.now
    },
    plants: {
        type: [mongoose.ObjectId],
        default: []
    }
}, {
    strict: true
});


const almanacSearchSchema = new Schema({
    slug: {
        type: String,
        unique: true
    },
    title: String,
    link: String,
    thumbnail: String
});


const almanacTypeSchema = new Schema({
    slug: {
        type: String,
        unique: true
    },
    name: String,
    image: String,
    botanical_name: String,
    plant_type: String,
    sun_exposure: String,
    soil_type: String,
    soil_ph: String,
    bloom_time: String,
    flower_color: String,
    hardiness_zones: [Number],
    special_features: String,
    planting: [String],
    care: [String],
    pests: [String],
    pest_control: [String],
    harvest: [String],
    stats: [String]
});


const trefleSearchSchema = new Schema({
    slug: {
        type: String,
        unique: true
    },
    scientific_name: String,
    link: String,
    common_name: String,
    id: {
        type: Number,
        unique: true
    },
    complete_data: Boolean
});


const treflePlantSchema = new Schema({}, {
    strict: false,
    strictQuery: false
});


Model.User = mongoose.model("User", userSchema);
Model.Plant = mongoose.model("Plant", plantSchema);
Model.Garden = mongoose.model("Garden", gardenSchema);

Model.AlmanacSearch = mongoose.model("AlmanacSearch", almanacSearchSchema);
Model.AlmanacType = mongoose.model("AlmanacType", almanacTypeSchema);

Model.TrefleSearch = mongoose.model("TrefleSearch", trefleSearchSchema);
Model.TreflePlant = mongoose.model("TreflePlant", treflePlantSchema);


module.exports = Model;