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
                
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                myHeaders.append("Cookie", "connect.sid=s%3AWFLZRmQ1vLK-ta72y7f92IrY1TLoAIn8.p89n8E3Lv1H0RYotGaUssqIN0SdyKXaqKhbF8OAE0oU");

                var urlencoded = new URLSearchParams();
                urlencoded.append("username", "daniel");
                urlencoded.append("password", "daniel123");
                urlencoded.append("passwordRepeat", "daniel123");

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
                };

                const req = await fetch("http://192.168.1.119:3001/api/register", requestOptions)
                const res = await req.json();
                
                console.log(res);


                this.loading = false;

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