Vue.component('edit-plant-button', {
    props: ["plant_id"],
    data: () => ({
        modal: false,
        loading: false
    }),
    methods: {
        showModal() {

        },

        async getPlant() {

        },

        async editPlant() {
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
    mounted: async function () {
        this.modal = $(this.$el).find(".modal").modal({
            closable: true,
            transition: "horizontal flip",
            onDeny: this.onDeny,
            onApprove: this.onApprove
        });
    },
    template: `
        <button class="ui labeled icon button basic" @click.prevent="editPlant">
            <i class="edit icon blue"></i>
            Edit
        </button>
        `
});