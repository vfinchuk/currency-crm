<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <loader v-if="loading" />

    <p v-else-if="!records.length" class="center">Записей пока нет. <RouterLink to="/record">Добавить запись</RouterLink></p>

    <section v-else>
      <HistoryTable :records="records" />
    </section>
  </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'

export default {
  name: 'history',
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted () {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.records = records.map(record => {
      return {
        ...record,
        categoryName: categories.find(cat => cat.id === record.categoryId).title,
        typeClass: record.type === 'income' ? 'blue' : 'red',
        typeText: record.type === 'income' ? 'Доход' : 'Расход'
      }
    })

    this.loading = false
  },
  components: {
    HistoryTable
  }
}
</script>

<style scoped>

</style>
