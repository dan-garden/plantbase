Vue.component('user-garden-header', {
    props: ['garden_id'],
    data: () => ({
        loading: false,
        garden: false,
    }),
    methods: {
        async getGarden(garden_id) {
            this.loading = true;
            const req = await fetch("/api/get-garden/" + garden_id);
            const res = await req.json();
            this.garden = res;
            this.loading = false;
        },
        async reload() {
            if (this.garden_id) {
                await this.getGarden(this.garden_id);
            }
        }
    },
    computed: {
        userOwns() {
            return this.garden && app.session._id === this.garden.user_id._id;
        },
    },
    mounted: async function () {
        await this.reload();
    },
    template: `
    <div>
        <template v-if="!loading">
            <h2 class="ui icon header center aligned green">
                <i class="circular seedling icon"></i>
                <div class="content">
                    {{garden.name}}
                    <div class="sub header">
                    {{garden.description}}
                    </div>
                </div>
            </h2>
            <template v-if="userOwns">
                <add-plant-type v-bind:garden_id="garden_id"></add-plant-type>
            </template>

        </template>
        <div class="ui divider"></div>
    </div>
    `
});