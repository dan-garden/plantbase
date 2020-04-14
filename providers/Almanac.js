//https://www.almanac.com/gardening

const fetch = require("node-fetch");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;

const PlantProvider = require("./PlantProvider");
const Model = require("../Database");

class Almanac extends PlantProvider {

    static url = "https://www.almanac.com";
    static forceScrape = false;

    static async getStoredSearch(query) {
        const find = await this.findLike(Model.AlmanacSearch, {
            title: query
        });

        const results = find.sort((a, b) => {
            return this.levDist(a.title, b.title);
        });
        return results;
    }

    static async getStoredType(slug) {
        const find = await this.findOne(Model.AlmanacType, {
            slug: slug
        });

        return find;
    }

    static async storeSearch(update) {
        const store = await this.store(Model.AlmanacSearch, "slug", update);
        return store;
    }

    static async storeSearches(updateArray) {
        const store = await this.storeMany(Model.AlmanacSearch, "slug", updateArray);
        return store;
    }

    static async storeType(update) {
        const store = await this.store(Model.AlmanacType, "slug", update);
        return store;
    }

    static async bulkSearch(type) {
        let searches = require(`../data/${type}.js`);
        if (typeof searches === "function") {
            searches = await searches();
        }

        for (let i = 0; i < searches.length; i++) {
            const results = await this.searchTypes(searches[i]);
            console.log(`[${results.length}] ${searches[i]}`);
        }
        return `------Finished ${searches.length}-----`;
    }

    static async searchTypes(query) {
        const stored = await this.getStoredSearch(query);

        if (stored.length && !this.forceScrape) {
            return stored;
        } else {
            const q = encodeURIComponent(query);
            const url = `${this.url}/search/site/${q}?f%5B0%5D=im_field_topics%3A16&f%5B1%5D=bundle%3Aplant`;
            const request = await fetch(url);
            const html = await request.text();
            const {
                document
            } = (new JSDOM(html)).window;

            let search_results = Array.from(document.querySelectorAll(".search-result"));
            search_results = search_results.map(result => {
                const a = result.querySelector(".title a");
                const title = a.textContent;
                const link = a.href;
                const slug_split = link.split("/");
                const slug = slug_split[slug_split.length - 1];
                const thumbnail = result.querySelector("img").src;
                return {
                    title,
                    link,
                    slug,
                    thumbnail
                };
            });
            const store = await this.storeSearches(search_results);
            return store;
        }
    }

    static filterDom(document, title, type) {
        let result = false;
        let domList = Array.from(document.querySelectorAll(".pane-title")).filter(pane => {
            return pane.textContent.trim() === title;
        });
        if (domList.length) {
            result = Array.from(domList[0].nextElementSibling.querySelectorAll(type)).map(node => node.textContent.trim());
            result = result.filter(res => res.trim() !== "");
        }
        return result;
    }

    static async getType(slug) {
        const stored = await this.getStoredType(slug);
        if (stored && !this.forceScrape) {
            return stored;
        } else {
            const url = `${this.url}/plant/${slug}`;
            const request = await fetch(url);
            const html = await request.text();
            const {
                document
            } = (new JSDOM(html)).window;

            const image = this.url + document.querySelector(".view-primary-image-in-article img").src;
            const name = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
            const details_table = document.querySelector(".pane-plant-details-table");
            if (details_table) {
                const details = {};
                Array.from(details_table.querySelectorAll("tr")).forEach(row => {
                    let [type, detail] = Array.from(row.querySelectorAll(".views-field")).map(r => r.textContent.trim());
                    type = type.toLowerCase().split(" ").join("_");
                    details[type] = detail;
                });

                if (details.hardiness_zones) {
                    details.hardiness_zones = details.hardiness_zones.split(",").map(int => {
                        return parseInt(int.trim());
                    });
                }

                const planting = this.filterDom(document, "Planting", "li");
                const care = this.filterDom(document, "Care", "li");
                const pests = this.filterDom(document, "Pests/Diseases", "li");
                const pest_control = this.filterDom(document, "Pests/Diseases", "p");
                const harvest = this.filterDom(document, "Harvest/Storage", "li");
                const stats = this.filterDom(document, "Wit & Wisdom", "li");

                const result = {
                    name,
                    image,
                    slug,
                    ...details,
                    planting,
                    care,
                    pests,
                    pest_control,
                    harvest,
                    stats
                };


                const stored = await this.storeType(result);
                return stored;
            } else {
                return {
                    error: "Plant slug doesn't exist."
                };
            }
        }
    }

    static async getSearchedType(query) {
        const results = await this.searchTypes(query);

        if (results.length) {
            const plant = await this.getPlant(results[0].slug);
            return plant;
        }
    }
}


module.exports = Almanac;