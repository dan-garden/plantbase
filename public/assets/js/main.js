(function () {

    async function formEncodedPOST(url, data) {
        const body = new URLSearchParams();
        Object.keys(data).forEach(key => body.append(key, data[key]))
        const req = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body,
            redirect: 'follow'
        })
        const res = await req.json();
        return res;
    }

    Vue.component('top-nav', {
        props: ['session', 'loaded'],
        updated: function() {
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
                        <a href="/">Sign In / Register</a>
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
                    <li data-float="right"><div class="ui active green inline loader"></div></li>
                </template>
            </ul>
        </nav>
        `
    });


    Vue.component('register-form', {
        data: () => ({
            loading: false,
            error: false,
            email: "",
            username: "",
            password: "",
            passwordRepeat: ""
        }),
        computed: {
            buttonText: function () {
                return this.loading ? "Loading..." : "Register";
            }
        },
        methods: {
            onSubmit: async function (e) {
                this.error = false;
                this.loading = true;
                const res = await formEncodedPOST("/api/register", {
                    email: this.email,
                    username: this.username,
                    password: this.password,
                    passwordRepeat: this.passwordRepeat,
                    referrer: document.referrer
                });
                this.loading = false;
                if (res.error) {
                    this.error = res.error;
                } else if (res.success) {
                    app.session = res.success;
                }
                if (res.redirect) {
                    document.location = res.redirect;
                }
            }
        },
        template: `
            <div class="column register-form">
                <h2 class="ui green image header">
                    <img src="assets/images/logo.png" class="image">
                    <div class="content">
                        Register an account
                    </div>
                </h2>
                <form v-on:submit.prevent="onSubmit" class="ui large form">
                    <div class="ui stacked segment">
                        <transition name="fade">
                            <div class="form-error" v-if="error">{{ error }}</div>
                        </transition>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input
                                name="email"
                                v-model="email"
                                type="text"
                                placeholder="Email Address">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input
                                name="username"
                                v-model="username"
                                type="text"
                                placeholder="Username">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input
                                name="password"
                                v-model="password"
                                type="password"
                                placeholder="Password">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input
                                name="passwordRepeat"
                                v-model="passwordRepeat"
                                type="password"
                                placeholder="Repeat Password">
                            </div>
                        </div>
                        
                        <button class="ui fluid large green submit button">{{ buttonText }}</button>
                    </div>
                </form>

                <div class="ui message">
                    Already have an account? <a href="/login">Sign In</a>
                </div>
            </div>

        `
    });


    Vue.component('login-form', {
        data: () => ({
            loading: false,
            error: false,
            username: "",
            password: "",
        }),
        computed: {
            buttonText: function () {
                return this.loading ? "Loading..." : "Login";
            }
        },
        methods: {
            onSubmit: async function (e) {
                console.log(e);
                this.error = false;
                this.loading = true;
                const res = await formEncodedPOST("/api/login", {
                    username: this.username,
                    password: this.password,
                    referrer: document.referrer
                });
                this.loading = false;
                if (res.error) {
                    this.error = res.error;
                } else if (res.success) {
                    app.session = res.success;
                }
                if (res.redirect) {
                    document.location = res.redirect;
                }
            }
        },
        template: `
            <div class="column login-form">
                <h2 class="ui green image header">
                    <img src="assets/images/logo.png" class="image">
                    <div class="content">
                        Log-in to your account
                    </div>
                </h2>
                <form v-on:submit.prevent="onSubmit" class="ui large form">
                    <div class="ui stacked segment">
                        <transition name="fade">
                            <div class="form-error" v-if="error">{{ error }}</div>
                        </transition>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input
                                name="username"
                                v-model="username"
                                type="text"
                                placeholder="Username">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input
                                name="password"
                                v-model="password"
                                type="password"
                                placeholder="Password">
                            </div>
                        </div>
                        <button class="ui fluid large green submit button">{{ buttonText }}</button>
                    </div>
                </form>

                <div class="ui message">
                    New to us? <a href="/register">Sign Up</a>
                </div>
            </div>
        `
    })


    Vue.component('garden-item', {
        props: ['garden'],
        template: `
            <li class="garden-item">{{garden.name}}</li>
        `
    })


    Vue.component('user-gardens', {
        props: ['user_id'],
        data: () => ({
            loading: false,
            gardens: false
        }),
        methods: {
            getUserGardens: async function (user_id) {
                this.loading = true;
                const req = await fetch("api/get-user-gardens/" + user_id);
                const res = await req.json();
                this.gardens = res;
                this.loading = false;
            }
        },
        mounted: async function () {
            if (this.user_id) {
                await this.getUserGardens(this.user_id);
            }
        },
        template: `
            <div v-if="loading" class="loading-text">
                Loading...
            </div>
            <template v-else-if="!loading">
                <ul v-if="gardens && gardens.length" class="gardens-list">
                    <template v-for="garden in gardens">
                        <garden-item v-bind:garden="garden"></garden-item>
                    </template>
                </ul>
                <div class="gardens-empty" v-else-if="gardens && !gardens.length">
                You have no gardens
                </div>
            </template>

        `
    });


    window.app = new Vue({
        el: '#app',
        data: {
            session: false,
            loaded: false
        },
        methods: {
            popup(type) {
                console.log(type);
            },

            getUserSession: async function () {
                const req = await fetch(`/api/session`);
                const res = await req.json();
                return res;
            }
        },

        created: async function () {

            this.getUserSession().then(res => {
                this.session = res.session || false;
                this.loaded = true;
            });
        },

    })
})()