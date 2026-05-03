const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}
