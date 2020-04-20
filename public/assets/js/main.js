(function () {


    Vue.component('top-nav', {
        props: ['session'],
        template: `
        <nav>
            <ul>
                <li>
                    <a href="/">Plant Index</a>
                </li>
                <li>
                    <a href="/garden">My Garden</a>
                </li>
                <li v-if="!session" data-float="right">
                    <a href="/">Sign In / Register</a>
                </li>
                <li v-if="session" data-float="right">
                    <a href="/">{{ session.username }}</a>
                </li>
            </ul>
        </nav>
        `
    });


    Vue.component('register-form', {
        data: () =>({
            loading: false,
            error: false
        }),
        computed: {
            buttonText: function() {
                return this.loading ? "Loading..." : "Register";
            }
        },
        methods: {
            onSubmit: async function(e) {
                this.loading = true;
                
                const formData = new FormData(e.target);
                const req = await fetch("/api/register", {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    }
                });
                const res = await req.text();
                console.log(res);

            }
        },
        template: `
            <form v-on:submit.prevent="onSubmit" class="register-form pure-form pure-form-aligned">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="name">Username</label>
                        <input id="name" name="username" type="text" placeholder="Username">
                    </div>

                    <div class="pure-control-group">
                        <label for="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="Password">
                    </div>

                    <div class="pure-control-group">
                        <label for="passwordRepeat">Repeat Password</label>
                        <input id="passwordRepeat" name="passwordRepeat" type="password" placeholder="Repeat Password">
                    </div>

                    <div class="pure-controls">
                        <label for="cb" class="pure-checkbox">
                            <input id="cb" type="checkbox"> I've read the terms and conditions
                        </label>

                        <button type="submit" class="pure-button pure-button-primary">{{ buttonText }}</button>
                    </div>
                </fieldset>
            </form>
        `
    })



    window.app = new Vue({
        el: '#app',
        data: {
            session: false
        },
        methods: {
            popup(type) {
                console.log(type);
            },           
            
            getUserSession: async function() {
                const req = await fetch(`/api/session`);
                const res = await req.json();
                return res;
            }
        },

        created: async function() {
            //get user session
            this.getUserSession().then(res=>this.session=res.session||false)
        },

    })
})()