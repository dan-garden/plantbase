Vue.component('create-garden', {
    props: ['user_id'],
    data: () => ({
        modal: false,
        loading: false,
        error: false,
        name: "",
        description: ""
    }),
    methods: {
        showModal: function () {
            this.modal.modal('show');
        },
        onDeny: function () {
            return;
        },
        onApprove: function () {
            (async () => {
                this.error = false;
                this.loading = true;
                const res = await formEncodedPOST("/api/create-garden", {
                    name: this.name,
                    description: this.description
                });
                this.loading = false;
                if (res.error) {
                    this.error = res.error;
                } else if (res.success) {
                    this.modal.modal('hide');
                    if (app.$refs.user_gardens) {
                        app.$refs.user_gardens.reload();
                        $(this.$el).find(".modal form")[0].reset();
                    }
                }
            })();
            return false;
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
        <div class="create-garden-container">
            <div class="ui modal tiny create-garden-modal">
                <div class="header">
                    Create Garden
                </div>
                <div class="content">
                    <form class="ui form" @submit.prevent="onApprove">
                        <transition name="fade">
                            <div class="form-error" v-if="error">{{ error }}</div>
                        </transition>
                        <div class="field">
                            <label>Garden Name</label>
                            <input type="text" v-model="name" name="name" placeholder="Name">
                        </div>
                        <div class="field">
                            <label>Garden Description</label>
                            <textarea v-model="description" rows="2" name="description" placeholder="Description"></textarea>
                        </div>
                    </form>
                </div>
                <div class="actions">
                    <template v-if="loading">
                        <div class="ui negative disabled inactive button">
                            Cancel
                        </div>
                        <div class="ui positive disabled inactive button">
                            Loading... <div class="ui active right inline mini loader"></div>
                        </div>
                    </template>
                    <template v-else-if="!loading">
                        <div class="ui negative button">
                            Cancel
                        </div>
                        <div class="ui positive right labeled icon button">
                            Create
                            <i class="plus right icon"></i>
                        </div>
                    </template>
                </div>
            </div>
            <button @click.prevent="showModal" class="ui right labeled icon button positive">
                Create Garden <i class="right plus icon"></i>
            </button>
        </div>
        `
});