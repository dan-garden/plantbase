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
                        <a href="javascript: void(0)">
                        {{ session.username }}
                        <i class="fas fa-caret-down"></i>
                        </a>
                    </li>
                </template>
                <template v-if="!loaded">
                    <li data-float="right"><div class="small-loader"></div></li>
                </template>
            </ul>
        </nav>
        `
    });

    // Vue.component('main-container')


    Vue.component('register-form', {
        data: () => ({
            loading: false,
            error: false,
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
                    username: this.username,
                    password: this.password,
                    passwordRepeat: this.passwordRepeat,
                    referrer: document.referrer
                });
                this.loading = false;
                if(res.error) {
                    this.error = res.error;
                } else if(res.success) {
                    app.session = res.success;
                }
                if(res.redirect) {
                    document.location = res.redirect;
                }
            }
        },
        template: `
            <form v-on:submit.prevent="onSubmit" class="register-form pure-form pure-form-aligned">
                <fieldset>
                    <transition name="fade">
                        <div class="form-error" v-if="error">{{ error }}</div>
                    </transition>
                    <div class="pure-control-group">
                        <label for="name">Username</label>
                        <input
                        id="name"
                        name="username"
                        v-model="username"
                        type="text"
                        placeholder="Username">
                    </div>

                    <div class="pure-control-group">
                        <label for="password">Password</label>
                        <input
                        id="password"
                        name="password"
                        v-model="password"
                        type="password"
                        placeholder="Password">
                    </div>

                    <div class="pure-control-group">
                        <label for="passwordRepeat">Repeat Password</label>
                        <input id="passwordRepeat"
                        name="passwordRepeat"
                        v-model="passwordRepeat"
                        type="password"
                        placeholder="Repeat Password">
                    </div>

                    <div class="pure-controls">
                        <label for="cb" class="pure-checkbox">
                            <input id="cb" type="checkbox"> I've read the terms and conditions
                        </label>

                        <button type="submit" class="pure-button pure-button-primary">{{ buttonText }}</button>
                        Already have an account? <a href="/login">Login</a>
                    </div>
                </fieldset>
            </form>
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
                this.error = false;
                this.loading = true;
                const res = await formEncodedPOST("/api/login", {
                    username: this.username,
                    password: this.password,
                    referrer: document.referrer
                });
                this.loading = false;
                if(res.error) {
                    this.error = res.error;
                } else if(res.success) {
                    app.session = res.success;
                }
                if(res.redirect) {
                    document.location = res.redirect;
                }
            }
        },
        template: `
            <form v-on:submit.prevent="onSubmit" class="login-form pure-form pure-form-aligned">
                <fieldset>
                    <transition name="fade">
                        <div class="form-error" v-if="error">{{ error }}</div>
                    </transition>
                    <div class="pure-control-group">
                        <label for="name">Username</label>
                        <input
                        id="name"
                        name="username"
                        v-model="username"
                        type="text"
                        placeholder="Username">
                    </div>

                    <div class="pure-control-group">
                        <label for="password">Password</label>
                        <input
                        id="password"
                        name="password"
                        v-model="password"
                        type="password"
                        placeholder="Password">
                    </div>

                    <div class="pure-controls">
                        <button type="submit" class="pure-button pure-button-primary">{{ buttonText }}</button>
                        <br /><br />
                        Don't have an account? <a href="/register">Register</a>
                    </div>
                </fieldset>
            </form>
        `
    })



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