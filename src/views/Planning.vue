<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{info.bill | currency('UAH')}}</h4>
    </div>

    <loader v-if="loading" />

    <p v-else-if="!categories.length" class="center">Категорий пока нет.
      <router-link to="/categories">Создать категорию</router-link>
    </p>

    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p>
          <strong>{{cat.title}}:</strong>
          {{cat.spend | currency('UAH')}} из {{cat.limit | currency('UAH')}}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import currencyFilter from '@/filters/currency.filter'
export default {
  name: 'planning',
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  async mounted () {
    const categories = await this.$store.dispatch('fetchCategories')
    const records = await this.$store.dispatch('fetchRecords')

    this.loading = false

    this.categories = categories.map(cat => {
      const spend = records
        .filter(r => r.categoryId === cat.id)
        .filter(r => r.type === 'outcome')
        .reduce((total, record) => {
          total += +record.amount
          return total
        }, 0)

      const percent = spend * 100 / cat.limit
      const progressPercent = percent > 100 ? 100 : percent
      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red'

      const tooltipValue = cat.limit - spend
      const tooltip = `${tooltipValue < 0 ? 'Превешение на' : 'Осталось'} ${currencyFilter(Math.abs(tooltipValue))}`

      return {
        ...cat,
        progressColor,
        progressPercent,
        spend,
        tooltip
      }
    })
  }
}
</script>

<style scoped>

</style>
