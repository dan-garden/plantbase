Vue.component('garden-plants', {
    props: ['garden_id'],
    data: () => ({
        loading: false,
        plants: false,
    }),
    methods: {
        async getGardenPlants(garden_id) {
            this.loading = true;
            const req = await fetch("/api/get-garden-plants/" + garden_id);
            const res = await req.json();
            this.plants = res.sort((a, b) => a.title - b.title);
            this.loading = false;
        },
        remove(plant_id) {
            this.plants = this.plants.filter(plant => {
                return plant._id !== plant_id;
            });

        },
        async reload() {
            if (this.garden_id) {
                await this.getGardenPlants(this.garden_id);
            }
        }
    },
    mounted: async function () {
        await this.reload();
    },
    template: `
            <div v-if="loading" class="loading-text">
                <div class="ui active large centered inline loader text green">Loading Plants...</div>
            </div>
            <template v-else-if="!loading">
                <div v-if="plants && plants.length" class="plants-list ui link cards">
                    <template v-for="plant in plants">
                        <plant-item v-bind:plant="plant"></plant-item>
                    </template>
                </div>
                <div class="plants-empty" v-else-if="plants && !plants.length">
                You have no plants
                </div>
            </template>

        `
});