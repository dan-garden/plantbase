Vue.component('all-gardens', {
    data: () => ({
        loading: false,
        gardens: false
    }),
    methods: {
        async getAllGardens() {
            this.loading = true;
            const req = await fetch("/api/get-all-gardens");
            const res = await req.json();
            this.gardens = res;
            this.loading = false;
        },
        async reload() {
            await this.getAllGardens();
        }
    },
    mounted: async function () {
        await this.reload();
    },
    template: `
        <div v-if="loading" class="loading-text">
            <div class="ui active large centered inline loader text green">Loading Gardens...</div>
        </div>
        <template v-else-if="!loading">
            <div v-if="gardens && gardens.length" class="gardens-list ui link cards">
                <template v-for="garden in gardens">
                    <garden-item v-bind:garden="garden"></garden-item>
                </template>
            </div>
            <div class="gardens-empty" v-else-if="gardens && !gardens.length">
            There are no gardens
            </div>
        </template>

    `
})