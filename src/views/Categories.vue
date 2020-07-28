<template>
  <div>
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <Loader v-if="loading" />

      <div v-else class="row">
        <CreateCategory @created="addNewCategory"/>
        <EditCategory
          v-if="categories.length"
          :key="categories.length + categoryCount"
          :categories="categories"
          @updated="updateCategories"
        />
        <p v-else class="center text">Категорий еще нет</p>
      </div>
    </section>
  </div>
</template>

<script>
import CreateCategory from '@/components/CreateCategory'
import EditCategory from '@/components/EditCategory'

export default {
  name: 'categories',
  data: () => ({
    categories: [],
    loading: true,
    categoryCount: 0
  }),
  async mounted () {
    this.categories = await this.$store.dispatch('fetchCategories') || []
    this.loading = false
  },
  components: { CreateCategory, EditCategory },
  methods: {
    addNewCategory (category) {
      this.categories.push(category)
    },
    updateCategories (category) {
      const idx = this.categories.findIndex(cat => cat.id === category.id)
      this.categories[idx].title = category.title
      this.categories[idx].limit = category.limit
      this.categoryCount++
    }
  }
}
</script>
