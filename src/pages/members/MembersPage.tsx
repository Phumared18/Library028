import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import useDelayedLoading from '../../hooks/useDelayedLoading'
import { useLibraryStore } from '../../store/libraryStore'
import type { Member } from '../../types'

type ApiMember = Partial<Member> & {
  _id?: string
  createdAt?: string
  fullName?: string
  phoneNumber?: string
}

const buildMemberFromApi = (item: ApiMember): Member | null => {
  if (!item) {
    return null
  }

  const id = item.id ?? item._id
  const name = item.name ?? item.fullName
  const email = item.email

  if (!id || !name || !email) {
    return null
  }

  return {
    id,
    name,
    email,
    phone: item.phone ?? item.phoneNumber ?? '',
    memberSince:
      item.memberSince ??
      (item.createdAt ? item.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10))
  }
}

const MembersPage = () => {
  const { members, addMember, updateMember, deleteMember, setMembers } = useLibraryStore()
  const [query, setQuery] = useState('')
  const [opened, setOpened] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const delayedLoading = useDelayedLoading(500)
  const loading = delayedLoading || isFetching

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      memberSince: new Date().toISOString().slice(0, 10)
    },
    validate: {
      name: (value) => (value.trim().length >= 2 ? null : 'กรุณาระบุชื่อ'),
      email: (value) =>
        /^\S+@\S+\.[A-Za-z]+$/.test(value) ? null : 'กรุณากรอกอีเมลที่ถูกต้อง'
    }
  })

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesQuery =
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase())
      return matchesQuery
    })
  }, [members, query])

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL
    if (!apiBase) {
      return
    }

    const controller = new AbortController()

    const loadMembers = async () => {
      setIsFetching(true)
      setFetchError(null)

      try {
        const token =
          window.localStorage.getItem('lm_token') ??
          window.localStorage.getItem('token') ??
          ''
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }

        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch(`${apiBase}/users`, {
          method: 'GET',
          headers,
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error(`โหลดสมาชิกไม่สำเร็จ (${response.status})`)
        }

        const payload = await response.json()
        const list = Array.isArray(payload)
          ? payload
          : payload.data ?? payload.users ?? []
        const nextMembers = list
          .map((item: ApiMember) => buildMemberFromApi(item))
          .filter(Boolean) as Member[]

        setMembers(nextMembers)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        const message =
          error instanceof Error ? error.message : 'โหลดข้อมูลสมาชิกไม่สำเร็จ'
        setFetchError(message)
        notifications.show({
          title: 'โหลดข้อมูลล้มเหลว',
          message,
          color: 'red'
        })
      } finally {
        setIsFetching(false)
      }
    }

    loadMembers()

    return () => controller.abort()
  }, [setMembers])

  const openCreate = () => {
    setEditing(null)
    form.setValues({
      name: '',
      email: '',
      phone: '',
      memberSince: new Date().toISOString().slice(0, 10)
    })
    setOpened(true)
  }

  const openEdit = (member: Member) => {
    setEditing(member)
    form.setValues({
      name: member.name,
      email: member.email,
      phone: member.phone,
      memberSince: member.memberSince
    })
    setOpened(true)
  }

  const handleSubmit = (values: typeof form.values) => {
    if (editing) {
      updateMember({ ...editing, ...values })
      notifications.show({
        title: 'อัปเดตสมาชิกแล้ว',
        message: `อัปเดตรายละเอียดของ ${values.name} แล้ว`,
        color: 'teal'
      })
    } else {
      addMember(values)
      notifications.show({
        title: 'เพิ่มสมาชิกแล้ว',
        message: `${values.name} เข้าร่วมห้องสมุดแล้ว`,
        color: 'teal'
      })
    }

    setOpened(false)
  }

  const handleDelete = (member: Member) => {
    deleteMember(member.id)
    notifications.show({
      title: 'ลบสมาชิกแล้ว',
      message: `${member.name} ถูกลบออกจากรายการแล้ว`,
      color: 'red'
    })
  }

  return (
    <Stack gap="xl">
      <PageHeader
        title="สมาชิก"
        subtitle="จัดการข้อมูลสมาชิกและติดต่อผู้อ่านได้ง่าย"
        actions={
          <Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
            เพิ่มสมาชิก
          </Button>
        }
      />

      <Card withBorder radius="lg" p="lg">
        <Group mb="md" wrap="wrap">
          <TextInput
            placeholder="ค้นหาสมาชิก"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            w={{ base: '100%', sm: 260 }}
          />
        </Group>

        {fetchError && (
          <Text c="red" size="sm" mb="md">
            {fetchError}
          </Text>
        )}

        <Table striped highlightOnHover withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ชื่อ</Table.Th>
              <Table.Th>อีเมล</Table.Th>
              <Table.Th>โทรศัพท์</Table.Th>
              <Table.Th>วันที่สมัคร</Table.Th>
              <Table.Th>การจัดการ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Table.Tr key={`skeleton-${index}`}>
                    {Array.from({ length: 5 }).map((__, cellIndex) => (
                      <Table.Td key={`skeleton-${index}-${cellIndex}`}>
                        <Skeleton height={18} radius="sm" />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              : filteredMembers.map((member) => (
                  <Table.Tr key={member.id}>
                    <Table.Td>{member.name}</Table.Td>
                    <Table.Td>{member.email}</Table.Td>
                    <Table.Td>{member.phone}</Table.Td>
                    <Table.Td>{member.memberSince}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="indigo"
                          onClick={() => openEdit(member)}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(member)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิก'}
        radius="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="ชื่อ" withAsterisk {...form.getInputProps('name')} />
            <TextInput label="อีเมล" withAsterisk {...form.getInputProps('email')} />
            <TextInput label="โทรศัพท์" {...form.getInputProps('phone')} />
            <TextInput
              label="วันที่สมัคร"
              type="date"
              {...form.getInputProps('memberSince')}
            />
            <Button type="submit">บันทึก</Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  )
}

export default MembersPage
