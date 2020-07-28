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
      <HistoryTable :records="items" />

      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="onPageChange"
        :prev-text="'Назад'"
        :next-text="'Вперед'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      >
      </Paginate>

    </section>
  </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'
import paginationMixin from '@/mixins/pagination.mixin'
import currencyFilter from '@/filters/currency.filter'

export default {
  name: 'history',
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: []
  }),
  async mounted () {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.paginationSetup(this.records.map(record => {
      return {
        ...record,
        categoryName: categories.find(cat => cat.id === record.categoryId).title,
        typeClass: record.type === 'income' ? 'blue' : 'red',
        typeText: record.type === 'income' ? 'Доход' : 'Расход',
        tooltipText: currencyFilter(record.amount)
      }
    }))

    this.loading = false
  },
  components: {
    HistoryTable
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
