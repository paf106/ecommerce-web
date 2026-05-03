const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}
