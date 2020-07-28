<template>
  <div>

    <loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <a href="/history" class="breadcrumb">История</a>
        <a class="breadcrumb">
          {{record.typeText}}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="[record.typeClass]">
            <div class="card-content white-text">
              <p>Описание: {{record.description}}</p>
              <p>Сумма: {{record.amount | currency}}</p>
              <p>Категория: {{record.categoryName}}</p>

              <small>{{record.date | date('datetime')}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>Запись не найдена</p>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data: () => ({
    loading: true,
    record: null
  }),
  async mounted () {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

    this.record = {
      ...record,
      categoryName: category.title,
      typeClass: record.type === 'income' ? 'blue' : 'red',
      typeText: record.type === 'income' ? 'Доход' : 'Расход'
    }

    this.loading = false
  }
}
</script>
