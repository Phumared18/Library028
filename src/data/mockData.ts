import type { Book, Member, BorrowRecord } from '../types'

export const mockBooks: Book[] = [
  {
    id: 'book_clean_code',
    title: 'โค้ดสะอาด',
    author: 'โรเบิร์ต ซี. มาร์ติน',
    category: 'Programming',
    publishedYear: 2008,
    status: 'Available'
  },
  {
    id: 'book_atomic_habits',
    title: 'พลังของนิสัย',
    author: 'เจมส์ เคลียร์',
    category: 'Self Development',
    publishedYear: 2018,
    status: 'Borrowed'
  },
  {
    id: 'book_rich_dad',
    title: 'พ่อรวยสอนลูก',
    author: 'โรเบิร์ต ที. คิโยซากิ',
    category: 'Business',
    publishedYear: 1997,
    status: 'Available'
  },
  {
    id: 'book_pragmatic',
    title: 'โปรแกรมเมอร์เชิงปฏิบัติ',
    author: 'แอนดรูว์ ฮันท์',
    category: 'Programming',
    publishedYear: 1999,
    status: 'Borrowed'
  },
  {
    id: 'book_brief_history',
    title: 'ประวัติย่อของกาลเวลา',
    author: 'สตีเฟน ฮอว์คิง',
    category: 'Science',
    publishedYear: 1988,
    status: 'Available'
  }
]

export const mockMembers: Member[] = [
  {
    id: 'member_amelia',
    name: 'อรทัย แก้วใส',
    email: 'orathai.kaewsai@example.com',
    phone: '081-555-1294',
    memberSince: '2022-03-19'
  },
  {
    id: 'member_ryan',
    name: 'ธนพล วัฒนศรี',
    email: 'thanapol.wattanasri@example.com',
    phone: '082-555-2481',
    memberSince: '2023-07-02'
  },
  {
    id: 'member_lina',
    name: 'ลินดา พรหมทัต',
    email: 'linda.phromthat@example.com',
    phone: '083-555-9931',
    memberSince: '2021-11-05'
  }
]

export const mockBorrows: BorrowRecord[] = [
  {
    id: 'borrow_001',
    bookId: 'book_atomic_habits',
    memberId: 'member_amelia',
    borrowDate: '2026-02-08',
    returnDate: '2026-02-28',
    status: 'Borrowed'
  },
  {
    id: 'borrow_002',
    bookId: 'book_pragmatic',
    memberId: 'member_lina',
    borrowDate: '2026-02-12',
    returnDate: '2026-03-02',
    status: 'Borrowed'
  }
]
