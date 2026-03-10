import type { BookCategory, BookStatus, BorrowStatus } from '../types'

export const bookStatusLabels: Record<BookStatus, string> = {
  Available: 'พร้อมยืม',
  Borrowed: 'ยืมอยู่'
}

export const borrowStatusLabels: Record<BorrowStatus, string> = {
  Borrowed: 'ยืมอยู่',
  Returned: 'คืนแล้ว'
}

export const bookCategoryLabels: Record<BookCategory, string> = {
  Programming: 'การเขียนโปรแกรม',
  Business: 'ธุรกิจ',
  'Self Development': 'พัฒนาตนเอง',
  Science: 'วิทยาศาสตร์'
}
