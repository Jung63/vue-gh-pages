<template>
  <h2>單一產品</h2>
  <div class="container">
    {{ product }}
    <img :src="product.imageUrl" alt="" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      product: {}
    }
  },
  methods: {
    getProduct () {
      // console.log(this.$route.params);
      const { id } = this.$route.params
      this.$http(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`).then((res) => {
        this.product = res.data.product
      }
      )
    }
  },
  mounted () {
    this.getProduct()
  }
}
</script>
