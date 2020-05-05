Vue.component('user-gardens', {
    props: ['user_id'],
    data: () => ({
        loading: false,
        gardens: false
    }),
    methods: {
        async getUserGardens(user_id) {
            this.loading = true;
            const req = await fetch("/api/get-user-gardens/" + user_id);
            const res = await req.json();
            this.loading = false;
            if(res.success) {
                this.gardens = res.success;
            } else {
                $('body')
                .toast({
                    class: 'error',
                    message: `${res.error}`,
                    displayTime: 1000,
                    position: window.innerWidth <= 770 ? "top center" : "top right"
                });                
            }
        },
        async reload() {
            if (this.user_id) {
                await this.getUserGardens(this.user_id);
            }
        }
    },
    mounted: async function () {
        await this.reload();
    },
    template: `
        <div>
            <div v-if="loading" class="loading-text">
                <div class="ui active large centered inline loader text green">Loading Gardens...</div>
            </div>
            <template v-else-if="!loading">
                <div v-if="gardens && gardens.length" class="gardens-list ui link cards centered">
                    <template v-for="garden in gardens">
                        <garden-item v-bind:garden="garden"></garden-item>
                    </template>
                </div>
                <div class="gardens-empty" v-else-if="gardens && !gardens.length">
                You have no gardens
                </div>
            </template>
        </div>

    `
});