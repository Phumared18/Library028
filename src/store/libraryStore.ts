import { create } from 'zustand'
import type { StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mockBooks, mockBorrows, mockMembers } from '../data/mockData'
import type { Book, BorrowRecord, Member } from '../types'
import { generateId } from '../utils/id'
import { STORAGE_KEYS } from '../utils/storage'

type BorrowInput = {
  bookId: string
  memberId: string
  borrowDate: string
  returnDate: string
}

type StoreResult = {
  ok: boolean
  message: string
}

type LibraryState = {
  books: Book[]
  members: Member[]
  borrows: BorrowRecord[]
  setMembers: (members: Member[]) => void
  addBook: (book: Omit<Book, 'id'>) => void
  updateBook: (book: Book) => void
  deleteBook: (id: string) => void
  addMember: (member: Omit<Member, 'id'>) => void
  updateMember: (member: Member) => void
  deleteMember: (id: string) => void
  borrowBook: (input: BorrowInput) => StoreResult
  returnBook: (recordId: string) => StoreResult
}

const libraryCreator: StateCreator<LibraryState, [], [], LibraryState> = (set) => ({
  books: mockBooks,
  members: mockMembers,
  borrows: mockBorrows,
  setMembers: (members) => {
    set(() => ({ members }))
  },
  addBook: (book) => {
    const newBook: Book = { ...book, id: generateId('book') }
    set((state) => ({ books: [newBook, ...state.books] }))
  },
  updateBook: (book) => {
    set((state) => ({
      books: state.books.map((item) => (item.id === book.id ? book : item))
    }))
  },
  deleteBook: (id) => {
    set((state) => ({
      books: state.books.filter((item) => item.id !== id),
      borrows: state.borrows.filter((record) => record.bookId !== id)
    }))
  },
  addMember: (member) => {
    const newMember: Member = { ...member, id: generateId('member') }
    set((state) => ({ members: [newMember, ...state.members] }))
  },
  updateMember: (member) => {
    set((state) => ({
      members: state.members.map((item) =>
        item.id === member.id ? member : item
      )
    }))
  },
  deleteMember: (id) => {
    set((state) => ({
      members: state.members.filter((item) => item.id !== id),
      borrows: state.borrows.filter((record) => record.memberId !== id)
    }))
  },
  borrowBook: ({ bookId, memberId, borrowDate, returnDate }) => {
    let outcome: StoreResult = {
      ok: false,
      message: 'ไม่สามารถยืมหนังสือเล่มนี้ได้'
    }

    set((state) => {
      const book = state.books.find((item) => item.id === bookId)
      if (!book) {
        outcome = { ok: false, message: 'ไม่พบหนังสือ' }
        return state
      }

      if (book.status === 'Borrowed') {
        outcome = { ok: false, message: 'หนังสือถูกยืมไปแล้ว' }
        return state
      }

      const newRecord: BorrowRecord = {
        id: generateId('borrow'),
        bookId,
        memberId,
        borrowDate,
        returnDate,
        status: 'Borrowed'
      }

      outcome = { ok: true, message: 'ยืมหนังสือสำเร็จ' }
      return {
        books: state.books.map((item) =>
          item.id === bookId ? { ...item, status: 'Borrowed' } : item
        ),
        members: state.members,
        borrows: [newRecord, ...state.borrows]
      }
    })

    return outcome
  },
  returnBook: (recordId) => {
    let outcome: StoreResult = {
      ok: false,
      message: 'ไม่สามารถคืนหนังสือเล่มนี้ได้'
    }

    set((state) => {
      const record = state.borrows.find((item) => item.id === recordId)
      if (!record) {
        outcome = { ok: false, message: 'ไม่พบรายการยืม' }
        return state
      }

      outcome = { ok: true, message: 'คืนหนังสือแล้ว' }
      return {
        books: state.books.map((item) =>
          item.id === record.bookId ? { ...item, status: 'Available' } : item
        ),
        members: state.members,
        borrows: state.borrows.map((item) =>
          item.id === recordId ? { ...item, status: 'Returned' } : item
        )
      }
    })

    return outcome
  }
})

export const useLibraryStore = create<LibraryState>()(
  persist(libraryCreator, {
    name: STORAGE_KEYS.library,
    storage: createJSONStorage(() => localStorage)
  })
)
