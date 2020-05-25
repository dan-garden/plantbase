Vue.component('user-notifications', {
    props: ['notifications'],
    mounted: function() {
        $(this.$el).find(".ui.dropdown").each(function() {
            $(this).dropdown();
        })
    },
    computed: {
        unread_count: function() {
            if(this.notifications) {
                const unread = this.notifications.filter(notif => notif.read === false);
                return unread.length;
            } else {
                return 0;
            }
        }
    },
    methods: {
        async executeAction(notification) {
            notification.read = true;
            const res = await formEncodedPOST("/api/read-notification", {
                notification_id: notification._id
            });
            document.location = notification.link;
        }
    },
    template: `
    <div class="ui icon dropdown scrolling inline">
        <i class="bell icon large inline"></i>
        <span v-if="unread_count > 0" class="number-badge">{{unread_count}}</span>
        <div class="menu notification-list">
            <template v-for="notification in notifications">
                <a v-bind:href="notification.link" @click.prevent="executeAction(notification)" class="notification-item ui icon message tiny link" v-bind:class="{info: !notification.read}">
                    <i class="icon tiny" v-bind:class="notification.icon"></i>
                    <div class="content">
                        <div class="header">
                            {{notification.title}}
                        </div>
                        <p>{{notification.body}}</p>
                    </div>
                </a>
            </template>
            <template v-if="notifications.length < 1">
                <div class="ui warning message">
                    <p>No new notifications</p>
                </div>
            </template>
        </div>
    </div>
    `
})