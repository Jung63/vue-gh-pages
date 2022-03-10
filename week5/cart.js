import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'jung';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min); //限制最小的值 ex 8碼
defineRule('max', max); //限制最大的值

//本地端語言
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({ // 用來做一些設定
    generateMessage: localize('zh_TW'), //啟用 locale 
    validateOnInput: true, //輸入文字立即驗證
});

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});


const app = Vue.createApp({
    data() {
        return {
            cartData: {},
            products: [],
            productId: '',
            isLoadingItem: '', //定義變數=>讀取效果
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        };
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods: {
        getProducts() {
            axios.get(`${site}/api/${api_path}/products/all`).then((res) => {
                this.products = res.data.products;
            });
        },
        openProductModal(id) {
            this.productId = id;
            this.$refs.productModal.openModal();
        },
        getCart() {
            axios.get(`${site}/api/${api_path}/cart`).then((res) => {
                this.cartData = res.data.data;
            });
        },
        addToCart(id, qty = 1) {
            const data = {
                product_id: id,
                qty,
            };
            this.isLoadingItem = id;//讀取id
            axios.post(`${site}/api/${api_path}/cart`, { data }).then((res) => {
                this.getCart();
                this.$refs.productModal.closeModal();
                this.isLoadingItem = '';//讀取id結束會清空
                alert(res.data.message);
            });
        },
        removeCartItem(id) {
            this.isLoadingItem = id;
            axios.delete(`${site}/api/${api_path}/cart/${id}`).then((res) => {
                console.log(res);
                this.getCart();
                this.isLoadingItem = '';
            });
        },
        removeAllCart() {
            axios.delete(`${site}/api/${api_path}/carts`).then((res) => {
                this.getCart();
                alert(res.data.message);
                // console.log(res);
            }).catch((err) => {
                alert(err.data.message);
            });
        },
        updateCartItem(item) {
            const data = {
                product_id: item.id,
                qty: item.qty,
            };
            this.isLoadingItem = item.id;
            axios.put(`${site}/api/${api_path}/cart/${item.id}`, { data }).then((res) => {
                console.log(res);
                this.getCart();
                this.isLoadingItem = '';
            });
        },
        createOrder() {
            const order = this.form;
            const url = `${site}/api/${api_path}/order`;
            axios.post(url, { data: order }).then((res) => {
                alert(res.data.message);
                this.$refs.form.resetForm();
                this.getCart();
            }).catch((error) => {
                alert(error.data.message);
            });
        },
    },
    mounted() { //初始化就取得
        this.getProducts();
        this.getCart();
    },
});

// 註冊一個元件  //refs
app.component('product-modal', {
    props: ['id'],
    template: '#userProductModal',
    data() {
        return {
            modal: {},
            product: {},
            qty: 1,
        };
    },
    //watch監控id，若id有變動
    watch: {
        id() {//當id觸發時，啟動遠端資料
            this.getProduct();
            console.log(this.id);
        },
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        closeModal() {
            this.modal.hide();
        },
        getProduct() {
            axios.get(`${site}/api/${api_path}/product/${this.id}`).then((res) => {
                console.log(res);
                this.product = res.data.product;
            });
        },
        addToCart() {
            this.$emit('add-cart', this.product.id, this.qty);//觸發外層
        },
    },
    mounted() {
        //ref="modal"
        this.modal = new bootstrap.Modal(this.$refs.modal);
    },
});
app.mount('#app');
