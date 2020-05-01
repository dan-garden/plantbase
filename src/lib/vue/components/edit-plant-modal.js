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
    },
    computed: {},
    mounted: function() {
        this.modal = $(this.$el).find(".modal").modal({
            closable: true,
            transition: "horizontal flip",
            onDeny: this.onDeny,
            onApprove: this.onApprove
        });
    },
    template: `
    <div class="ui modal small">
        <div class="header">
            Add Plants
        </div>
        <div class="content scrolling">
            lol
        </div>
        <div class="actions">
            <div class="ui negative button">
                Close
            </div>
        </div>
    </div>
    `,
})