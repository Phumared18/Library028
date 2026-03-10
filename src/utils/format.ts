export const formatDate = (value: string) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('th-TH', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    calendar: 'gregory'
  })
}
