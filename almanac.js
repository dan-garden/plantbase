const fetch = require("node-fetch");
const storage = require("./cache");
const jsdom = require("jsdom");

const {
    JSDOM
} = jsdom;


class Alamanac {
    static async searchPlant(query) {
        const q = encodeURIComponent(query);
        const url = `https://www.almanac.com/search/site/${q}?f%5B0%5D=im_field_topics%3A16&f%5B1%5D=bundle%3Aplant`;    
        const cache = await storage.getCache(url);
        if(cache) {
            return cache;
        } else {
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
                const slug = slug_split[slug_split.length-1];
                const thumbnail = result.querySelector("img").src;
                return { title, link, slug, thumbnail };
            });
    
            await storage.setCache(url, search_results);
            return search_results;
        }
    }

    static filterDom(document, title, type) {
        let result = false;
        let domList = Array.from(document.querySelectorAll(".pane-title")).filter(pane => {
            return pane.textContent.trim() === title;
        });
        if(domList.length) {
            result = Array.from(domList[0].nextElementSibling.querySelectorAll(type)).map(node => node.textContent.trim());
            result = result.filter(res => res.trim()!=="");
        }
        return result;
    }

    static async getPlant(slug) {
        const url = `https://www.almanac.com/plant/${slug}`;
        const cache = await storage.getCache(url);
        if(cache) {
            return cache;
        } else {
            let result;
            const request = await fetch(url);
            const html = await request.text();
            const {
                document
            } = (new JSDOM(html)).window;
    
            const image = "https://almanac.com" + document.querySelector(".view-primary-image-in-article img").src;
            const name = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
            const details_table = document.querySelector(".pane-plant-details-table");
            if(details_table) {
                const details = {};
                Array.from(details_table.querySelectorAll("tr")).forEach(row => {
                    let [type, detail] = Array.from(row.querySelectorAll(".views-field")).map(r => r.textContent.trim());
                    type = type.toLowerCase().split(" ").join("_");
                    details[type] = detail;
                });
        
                const planting = this.filterDom(document, "Planting", "li");
                const care = this.filterDom(document, "Care", "li");
                const pests = this.filterDom(document, "Pests/Diseases", "li");
                const pest_control = this.filterDom(document, "Pests/Diseases", "p");
                const harvest = this.filterDom(document, "Harvest/Storage", "li");
                const stats = this.filterDom(document, "Wit & Wisdom", "li");
                result = {
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
            } else {
                result = { error: "Plant slug doesn't exist." }
            }

            await storage.setCache(url, result);
            return result;
        }
    }

    static async getSearchedPlant(query) {
        const results = await this.searchPlant(query);

        if(results.length) {
            const info = await this.getPlant(results[0].slug);
            console.log(info);
        }
    }
}



module.exports = Alamanac;