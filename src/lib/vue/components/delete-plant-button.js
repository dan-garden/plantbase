Vue.component('delete-plant-button', {
    props: ["plant_id"],
    data: () => ({
        loading: false
    }),
    methods: {
        async deletePlant() {
            this.loading = true;
            const res = await formEncodedPOST("/api/delete-garden-plant", {
                plant_id: this.plant_id,
            });
            this.loading = false;
            if (res.success) {
                this.hide(res.success);
            }
        },

        hide(deleted_plant) {
            this.$parent.$parent.remove(deleted_plant._id);
        }
    },
    computed: {
        deleteButtonText() {
            return this.loading ? "Deleting..." : "Delete";
        }
    },
    template: `
        <button class="ui right labeled icon button basic" v-bind:class="{loading: loading, red: loading}" @click.prevent="deletePlant">
            {{deleteButtonText}}
            <i class="right trash icon red"></i>
        </button>
        `
});