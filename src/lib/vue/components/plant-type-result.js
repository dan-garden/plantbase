Vue.component('plant-type-result', {
    props: ['garden_id', 'plant_type'],
    data: () => ({
        loading: false
    }),
    methods: {
        async onClick() {
            if (!this.loading) {
                this.loading = true;
                const res = await formEncodedPOST("/api/add-to-garden", {
                    garden_id: this.garden_id,
                    slug: this.plant_type.slug,
                });
                this.loading = false;

                if(res.success) {
                    $('body')
                    .toast({
                        class: 'success',
                        message: `${this.plant_type.title} has been added to your garden.`,
                        position: window.innerWidth <= 770 ? "top center" : "top right"
                    });
                    this.$parent.$parent.$parent.$refs.garden_plants.reload();
                } else {
                    $('body')
                    .toast({
                        class: 'error',
                        message: `${res.error}`,
                        position: window.innerWidth <= 770 ? "top center" : "top right"
                    });
                }
            }
        }
    },
    computed: {
        addButtonText() {
            return this.loading ? "Add" : `Add <i class="plus right icon"></i>`;
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
                <div class="ui right green icon button" v-bind:class="{floated: !loading, loading: loading, disabled: loading}" v-html="addButtonText"></div>
            </div>
        </div>
        `
})