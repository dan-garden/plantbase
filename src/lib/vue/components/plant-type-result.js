Vue.component('plant-type-result', {
    props: ['garden_id', 'plant_type'],
    data: () => ({
        loading: false
    }),
    methods: {
        async onClick() {
            this.loading = true;
            const res = await formEncodedPOST("/api/add-to-garden", {
                garden_id: this.garden_id,
                slug: this.plant_type.slug,
            });
            this.$parent.$parent.$parent.$refs.garden_plants.reload();
            this.loading = false;
        }
    },
    computed: {
        addButtonText() {
            return this.loading ? "Loading..." : "Add To Garden";
        }
    },
    template: `
        <div class="ui item">
            <div class="ui middle aligned tiny image">
                <img v-bind:src="plant_type.thumbnail">
            </div>
            <div class="middle aligned content">
                {{plant_type.title}}
            </div>
            <div class="extra middle aligned" @click.prevent="onClick">
                <div class="ui right floated button">
                    {{addButtonText}}
                </div>
            </div>
        </div>
        `
})