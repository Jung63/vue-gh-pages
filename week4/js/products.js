import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'jung';
//因還需呼叫，所以定義在外層，先設定空物件到時候可被覆蓋
let productModal = {};
let delProductModal = {};

const app = createApp({
    components: {
        pagination
    },
    data() {
        return {
            products: [],
            tempProduct: {
                //多圖(陣列)
                imagesUrl: [],
            },
            isNew: false,
            pagination: {},
        }
    },
    //方法
    methods: {
        checkLogin() {
            // 取出 Token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
            //每次發送token都發送至header裡(在axios網站可取得程式碼)
            axios.defaults.headers.common.Authorization = token;
            const url = `${site}/api/user/check`;
            axios.post(url)
                .then(() => {
                    this.getProducts();
                })
        },
        getProducts(page = 1) {//參數預設值
            //query ?後方就稱為query
            const url = `${site}/api/${api_path}/admin/products/?page=${page}`;
            axios.get(url)
                .then((res) => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
        },
        //打開productModal
        openModal(status, product) {
            if (status === 'isNew') {
                this.tempProduct = {
                    imagesUrl: [],
                }
                productModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                //物件傳參考 淺拷貝
                this.tempProduct = { imagesUrl: [], ...product };//助教建議部分:加上imagesUrl避免編輯時無法新增多圖
                productModal.show();
                this.isNew = false;
            } else if (status === 'delete') {
                delProductModal.show();
                this.tempProduct = { ...product };
            }
        },


    },
    mounted() {
        this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
});
//全域註冊 - 建立新產品
app.component('productModal', {
    props: ['tempProduct', 'isNew'],
    template: `#templateForProductModal`,
    methods: {
        updateProduct() {
            let url = `${site}/api/${api_path}/admin/product`;
            let method = 'post';
            if (!this.isNew) {
                url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](url, { data: this.tempProduct })
                .then((res) => {
                    console.log(res);
                    alert(res.data.message);
                    // this.getProducts();//沒有getProduct(這是外層的方法)
                    this.$emit('get-products')
                    productModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
    }
})
app.component('delProductModal', {
    props: ['tempProduct'],
    template: `#templateForDelProductModal`,
    methods: {
        delProduct() {
            let url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(res => {
                    console.log(res);
                    alert(res.data.message)
                    // 重新取得產品列表
                    this.$emit('get-products')
                    delProductModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        }
    }
})
app.mount('#app')
