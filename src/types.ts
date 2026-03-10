export type BookStatus = 'Available' | 'Borrowed'
export type BorrowStatus = 'Borrowed' | 'Returned'

export type BookCategory =
  | 'Programming'
  | 'Business'
  | 'Self Development'
  | 'Science'

export interface Book {
  id: string
  title: string
  author: string
  category: BookCategory
  publishedYear: number
  status: BookStatus
}

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  memberSince: string
}

export interface BorrowRecord {
  id: string
  bookId: string
  memberId: string
  borrowDate: string
  returnDate: string
  status: BorrowStatus
}

export interface User {
  id: string
  name: string
  email: string
}

export interface StoredUser extends User {
  password: string
}
