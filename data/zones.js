const fetch = require("node-fetch");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;


const scrapeAllZones = async () => {
    const base_url = "https://www.almanac.com";

    const scrapeZones = async (url) => {
        const req = await fetch(url);
        const html = await req.text();
        const {
            document
        } = (new JSDOM(html)).window;
    
        const result = Array.from(document.querySelectorAll(".views-fluid-grid-inline.views-fluid-grid-item.views-row")).map(li => li.textContent.trim());
    
        const next = document.querySelector(".pager-next a");
        if(next) {
            const nextResult = await scrapeZones(base_url + next.href);
            result.push(...nextResult);
        }
    
        return result;
    }    


    const count = 11;
    let results = [];

    for(let i = 1; i < count+1; i++) {
        
        const url = `${base_url}/plants/hardiness/${i}`;
        const result = await scrapeZones(url);
        results.push(...result);
    
    }

    results = [...new Set(results)];
    results.sort(); 

    return results;
}


module.exports = scrapeAllZones;