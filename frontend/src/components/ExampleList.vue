<template>
  <div>
    <h1>Ejemplos</h1>
    <ul>
      <li v-for="example in examples" :key="example._id">
        {{ example.name }} - {{ example.description }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      examples: [],
    };
  },
  async created() {
    try {
      const response = await this.$axios.get('/api/examples');
      this.examples = response.data;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>