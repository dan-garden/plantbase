Vue.component('top-nav', {
    props: ['session', 'loaded'],
    mounted: function() {
        if(this.session) {
            $("nav .ui.dropdown").dropdown();
        }
    },
    template: `
    <nav>
        <ul>
            <li>
                <a href="/">Plant Index</a>
            </li>
            <li>
                <a href="/my-gardens">My Gardens</a>
            </li>
            <template v-if="loaded">
                <li v-if="!session" data-float="right">
                    <a href="/login">Sign In</a>
                </li>
                <li v-if="session" data-float="right">
                    <div class="ui pointing dropdown link item">
                        <span class="text">{{ session.username }}</span>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            <a class="item">User Settings</a>
                            <div class="divider"></div>
                            <a class="item" href="/logout">Logout</a>
                        </div>
                    </div>
                </li>
            </template>
            <template v-if="!loaded">
                <li data-float="right"><div class="ui active green small inline loader"></div></li>
            </template>
        </ul>
    </nav>
    `
});