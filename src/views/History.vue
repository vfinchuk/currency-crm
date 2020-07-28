<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <loader v-if="loading" />

    <section v-else>
      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Сумма</th>
          <th>Дата</th>
          <th>Категория</th>
          <th>Тип</th>
          <th>Открыть</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(record, index) in records" :key="record.id">
          <td>{{index + 1}}</td>
          <td>{{record.amount | currency}}</td>
          <td>{{new Date(record.date) | date('date')}}</td>
          <td>{{record.categoryName}}</td>
          <td>
            <span class="white-text badge" :class="{red: record.type === 'outcome', blue: record.type === 'income'}">Расход</span>
          </td>
          <td>
            <button class="btn-small btn">
              <i class="material-icons">open_in_new</i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
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
      const categoryName = categories.find(cat => cat.id === record.categoryId).title

      return {
        ...record,
        categoryName
      }
    })
    this.loading = false
  }
}
</script>

<style scoped>

</style>
