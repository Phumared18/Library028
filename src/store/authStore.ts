import { create } from 'zustand'
import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoredUser, User } from '../types'
import { generateId } from '../utils/id'
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage'

type AuthResult = {
  ok: boolean
  message: string
}

type SignUpInput = {
  name: string
  email: string
  password: string
}

type SignInInput = {
  email: string
  password: string
}

type UpdateProfileInput = {
  name: string
  email: string
}

type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  signUp: (input: SignUpInput) => AuthResult
  signIn: (input: SignInInput) => AuthResult
  signOut: () => void
  updateProfile: (input: UpdateProfileInput) => AuthResult
  changePassword: (input: ChangePasswordInput) => AuthResult
}

const getUsers = () => readStorage<StoredUser[]>(STORAGE_KEYS.users, [])
const saveUsers = (users: StoredUser[]) => writeStorage(STORAGE_KEYS.users, users)

const toSessionUser = (user: StoredUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email
})

const authCreator: StateCreator<AuthState, [], [], AuthState> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  signUp: ({ name, email, password }) => {
    const users = getUsers()
    const exists = users.some((stored) => stored.email === email)

    if (exists) {
      return {
        ok: false,
        message: 'อีเมลนี้ถูกใช้งานแล้ว ลองเข้าสู่ระบบแทน'
      }
    }

    const newUser: StoredUser = {
      id: generateId('user'),
      name,
      email,
      password
    }

    const updatedUsers = [...users, newUser]
    saveUsers(updatedUsers)
    set({ user: toSessionUser(newUser), isAuthenticated: true })

    return {
      ok: true,
      message: 'สร้างบัญชีสำเร็จแล้ว'
    }
  },
  signIn: ({ email, password }) => {
    const users = getUsers()
    const found = users.find(
      (stored) => stored.email === email && stored.password === password
    )

    if (!found) {
      return {
        ok: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      }
    }

    set({ user: toSessionUser(found), isAuthenticated: true })
    return {
      ok: true,
      message: 'ยินดีต้อนรับกลับมา!'
    }
  },
  signOut: () => {
    set({ user: null, isAuthenticated: false })
  },
  updateProfile: ({ name, email }) => {
    const current = get().user
    if (!current) {
      return { ok: false, message: 'ไม่พบเซสชันที่ใช้งานอยู่' }
    }

    const users = getUsers()
    const emailTaken = users.some(
      (stored) => stored.email === email && stored.id !== current.id
    )

    if (emailTaken) {
      return {
        ok: false,
        message: 'อีเมลนี้ถูกลงทะเบียนแล้ว'
      }
    }

    const updatedUsers = users.map((stored) =>
      stored.id === current.id
        ? {
            ...stored,
            name,
            email
          }
        : stored
    )

    saveUsers(updatedUsers)
    set({ user: { ...current, name, email } })

    return {
      ok: true,
      message: 'อัปเดตโปรไฟล์แล้ว'
    }
  },
  changePassword: ({ currentPassword, newPassword }) => {
    const current = get().user
    if (!current) {
      return { ok: false, message: 'ไม่พบเซสชันที่ใช้งานอยู่' }
    }

    const users = getUsers()
    const storedUser = users.find((stored) => stored.id === current.id)

    if (!storedUser || storedUser.password !== currentPassword) {
      return { ok: false, message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' }
    }

    const updatedUsers = users.map((stored) =>
      stored.id === current.id
        ? {
            ...stored,
            password: newPassword
          }
        : stored
    )

    saveUsers(updatedUsers)
    return { ok: true, message: 'อัปเดตรหัสผ่านเรียบร้อย' }
  }
})

export const useAuthStore = create<AuthState>()(
  persist(authCreator, {
    name: STORAGE_KEYS.session
  })
)
