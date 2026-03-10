import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  Skeleton,
  Stack,
  Table,
  TextInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import useDelayedLoading from '../../hooks/useDelayedLoading'
import { useLibraryStore } from '../../store/libraryStore'
import type { Member } from '../../types'

const MembersPage = () => {
  const { members, addMember, updateMember, deleteMember } = useLibraryStore()
  const [query, setQuery] = useState('')
  const [opened, setOpened] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const loading = useDelayedLoading(500)

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
