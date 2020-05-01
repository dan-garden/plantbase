Vue.component('edit-plant-modal', {
    props: ['plant'],
    data: () => ({
        modal: false,
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

            })();
            return false;
        },
        async changePhoto() {
            console.log("change photo");
        }
    },
    mounted: function() {
        $(this.$el).find('.special.cards .image').dimmer({
            on: 'hover'
        });

        this.modal = $(this.$el).modal({
            closable: true,
            transition: "zoom",
            onDeny: this.onDeny,
            onApprove: this.onApprove
        });
    },
    template: `
    <div class="ui modal small">
        <div class="header">
            Edit Plant - {{plant.type_id.name}}
        </div>
        <div class="content scrolling">
            <div class="ui special cards align center">
                <div class="card centered edit-plant-block">
                    <div class="blurring dimmable image">
                        <div class="ui dimmer">
                        <div class="content">
                            <div class="center">
                            <div class="ui inverted button" @click.prevent="changePhoto">
                                <i class="upload icon"></i>
                                Upload Photo
                            </div>
                            </div>
                        </div>
                        </div>
                        <img v-bind:src="plant.image">
                    </div>
                    <div class="content">
                        <a class="header">Team Fu</a>
                        <div class="meta">
                        <span class="date">Created in Sep 2014</span>
                        </div>
                    </div>
                    <div class="extra content">
                        <a>
                        <i class="users icon"></i>
                        2 Members
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui negative button">
                Close
            </div>
        </div>
    </div>
    `,
})