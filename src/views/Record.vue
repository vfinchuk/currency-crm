<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>

    <Loader v-if="loading"/>

    <p v-else-if="!categories.length" class="center">Категорий пока нет.
      <router-link to="/categories">Создать категорию</router-link>
    </p>

    <form v-else class="form" @submit.prevent="onSubmit">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >{{cat.title}}
          </option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount">Сумма</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
        >Минимальная значение {{this.$v.amount.$params.minValue.min}}</span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">Описание</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
        >
          Добавьте описание
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { required, minValue } from 'vuelidate/lib/validators'

export default {
  name: 'record',
  data: () => ({
    loading: true,
    select: null,
    categories: [],
    category: null,
    type: 'income',
    amount: 1,
    description: ''
  }),
  validations: {
    amount: { required, minValue: minValue(1) },
    description: { required }
  },
  async mounted () {
    this.categories = await this.$store.dispatch('fetchCategories')

    this.loading = false
    this.category = this.categories[0].id

    setTimeout(() => {
      // eslint-disable-next-line no-undef
      M.updateTextFields()
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select)
    }, 0)
  },
  destroyed () {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord () {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async onSubmit () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          })

          const bill = this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', { bill })

          this.$message('Запись создана!')

          this.$v.$reset()

          this.amount = 1
          this.description = ''
          this.type = 'income'
        } catch (e) {}
      } else {
        this.$message(`Сумма больше допустимой на: ${this.amount - this.info.bill}`)
      }
    }
  }
}
</script>

<style scoped>

</style>
