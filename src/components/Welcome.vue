<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      content: "",
    };
  },
  mounted() {
  },
};
</script>