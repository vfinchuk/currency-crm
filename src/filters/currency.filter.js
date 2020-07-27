export default function currencyFilter (value, currency = 'UAH') {
  return new Intl.NumberFormat('ru-UA', {
    style: 'currency',
    currency
  }).format(value)
}
