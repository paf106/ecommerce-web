export function getFormString(formData: FormData, field: string) {
  return String(formData.get(field) ?? '').trim()
}
