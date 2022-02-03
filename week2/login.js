import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2'

const app = createApp({
    data() {
        return {
            user: {
                username: '',
                password: ''
            },
        };
    },
    methods: {
        login() {
            axios.post(`${url}/admin/signin`, this.user)
                .then((res) => {
                    console.log(res);
                    //取得token,expired參數
                    const { token, expired } = res.data;
                    //儲存cookie
                    document.cookie = `hexToken = ${token};expired= ${new Date(expired)}`;

                    window.location = 'products.html';
                })
                .catch((err)=>{
                    console.dir(err);
                    alert("請輸入正確帳號密碼");
                })
        }
    },
});



app.mount('#app');