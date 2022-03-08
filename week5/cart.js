import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'jung';

const app = createApp({
    data() {
        return {
            cartData: {},
            products: [],
            productId: '',
            isLoadingItem: '', //定義變數=>讀取效果

        };
    },
    methods: {
        getProducts() {
            axios.get(`${site}/api/${api_path}/products/all`).then((res) => {
                console.log(res);
                this.products = res.data.products;
            });
        },
        openProductModal(id) {
            this.$refs.productModal.openModal();
            this.productId = id;
        },
        getCart() {
            axios.get(`${site}/api/${api_path}/cart`).then((res) => {
                console.log(res);
                this.cartData = res.data.data
            });
        },
        addToCart(id, qty = 1) {
            const data = {
                product_id: id,
                qty,
            };
            this.isLoadingItem = id;//讀取id
            axios.post(`${site}/api/${api_path}/cart`, { data }).then((res) => {
                console.log(res);
                this.isLoadingItem = '';//讀取id結束會清空
                this.getCart();
                this.$refs.productModal.closeModal();
                alert(res.data.message);
            });

        },
        removeCartItem(id) {
            axios.delete(`${site}/api/${api_path}/cart/${id}`).then((res) => {
                this.isLoadingItem = id;
                this.isLoadingItem = '';
                this.getCart();
                console.log(res);
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
                this.isLoadingItem = '';
                this.getCart();
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
    },//watch監控id，若id有變動
    watch: {
        id() {//當id觸發時，啟動遠端資料
            this.getProduct();
            console.log(this.id);
        }
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
})

app.mount('#app');