import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  Select,
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
import { bookCategoryLabels, bookStatusLabels } from '../../utils/labels'
import type { Book, BookCategory, BookStatus } from '../../types'

const categories: BookCategory[] = [
  'Programming',
  'Business',
  'Self Development',
  'Science'
]

const statusOptions: BookStatus[] = ['Available', 'Borrowed']
const statusSelectOptions = statusOptions.map((value) => ({
  value,
  label: bookStatusLabels[value]
}))

const BooksPage = () => {
  const { books, addBook, updateBook, deleteBook } = useLibraryStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<BookCategory | 'All'>('All')
  const [opened, setOpened] = useState(false)
  const [editing, setEditing] = useState<Book | null>(null)
  const loading = useDelayedLoading(500)

  const form = useForm({
    initialValues: {
      title: '',
      author: '',
      category: 'Programming' as BookCategory,
      publishedYear: new Date().getFullYear(),
      status: 'Available' as BookStatus
    },
    validate: {
      title: (value) => (value.trim().length >= 2 ? null : 'กรุณาระบุชื่อหนังสือ'),
      author: (value) => (value.trim().length >= 2 ? null : 'กรุณาระบุผู้แต่ง'),
      publishedYear: (value) => (value > 0 ? null : 'กรุณาระบุปีที่พิมพ์')
    }
  })

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesQuery =
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || book.category === category
      return matchesQuery && matchesCategory
    })
  }, [books, category, query])

  const openCreate = () => {
    setEditing(null)
    form.setValues({
      title: '',
      author: '',
      category: 'Programming',
      publishedYear: new Date().getFullYear(),
      status: 'Available'
    })
    setOpened(true)
  }

  const openEdit = (book: Book) => {
    setEditing(book)
    form.setValues({
      title: book.title,
      author: book.author,
      category: book.category,
      publishedYear: book.publishedYear,
      status: book.status
    })
    setOpened(true)
  }

  const handleSubmit = (values: typeof form.values) => {
    if (editing) {
      updateBook({ ...editing, ...values })
      notifications.show({
        title: 'อัปเดตหนังสือแล้ว',
        message: `อัปเดตรายละเอียดของ ${values.title} แล้ว`,
        color: 'teal'
      })
    } else {
      addBook(values)
      notifications.show({
        title: 'เพิ่มหนังสือแล้ว',
        message: `${values.title} ถูกเพิ่มในแคตตาล็อกแล้ว`,
        color: 'teal'
      })
    }

    setOpened(false)
  }

  const handleDelete = (book: Book) => {
    deleteBook(book.id)
    notifications.show({
      title: 'ลบหนังสือแล้ว',
      message: `${book.title} ถูกลบจากแคตตาล็อกแล้ว`,
      color: 'red'
    })
  }

  return (
    <Stack gap="xl">
      <PageHeader
        title="หนังสือ"
        subtitle="จัดการแคตตาล็อก ติดตามสถานะ และอัปเดตรายละเอียดหนังสือ"
        actions={
          <Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
            เพิ่มหนังสือ
          </Button>
        }
      />

      <Card withBorder radius="lg" p="lg">
        <Group mb="md" wrap="wrap">
          <TextInput
            placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            w={{ base: '100%', sm: 240 }}
          />
          <Select
            value={category}
            onChange={(value) => setCategory((value as BookCategory) || 'All')}
            data={[
              { value: 'All', label: 'ทั้งหมด' },
              ...categories.map((value) => ({
                value,
                label: bookCategoryLabels[value]
              }))
            ]}
            w={{ base: '100%', sm: 200 }}
          />
        </Group>

        <Table striped highlightOnHover withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ชื่อหนังสือ</Table.Th>
              <Table.Th>ผู้แต่ง</Table.Th>
              <Table.Th>หมวดหมู่</Table.Th>
              <Table.Th>ปีที่พิมพ์</Table.Th>
              <Table.Th>สถานะ</Table.Th>
              <Table.Th>การจัดการ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Table.Tr key={`skeleton-${index}`}>
                    {Array.from({ length: 6 }).map((__, cellIndex) => (
                      <Table.Td key={`skeleton-${index}-${cellIndex}`}>
                        <Skeleton height={18} radius="sm" />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              : filteredBooks.map((book) => (
                  <Table.Tr key={book.id}>
                    <Table.Td>{book.title}</Table.Td>
                    <Table.Td>{book.author}</Table.Td>
                    <Table.Td>{bookCategoryLabels[book.category]}</Table.Td>
                    <Table.Td>{book.publishedYear}</Table.Td>
                    <Table.Td>
                      <Badge
                        color={book.status === 'Available' ? 'teal' : 'orange'}
                        variant="light"
                      >
                        {bookStatusLabels[book.status]}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="indigo"
                          onClick={() => openEdit(book)}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(book)}
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
        title={editing ? 'แก้ไขหนังสือ' : 'เพิ่มหนังสือใหม่'}
        radius="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput label="ชื่อหนังสือ" withAsterisk {...form.getInputProps('title')} />
            <TextInput label="ผู้แต่ง" withAsterisk {...form.getInputProps('author')} />
            <Select
              label="หมวดหมู่"
              data={categories.map((value) => ({
                value,
                label: bookCategoryLabels[value]
              }))}
              withAsterisk
              {...form.getInputProps('category')}
            />
            <NumberInput
              label="ปีที่พิมพ์"
              withAsterisk
              min={1900}
              max={new Date().getFullYear()}
              {...form.getInputProps('publishedYear')}
            />
            <Select
              label="สถานะ"
              data={statusSelectOptions}
              withAsterisk
              {...form.getInputProps('status')}
            />
            <Button type="submit">บันทึก</Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  )
}

export default BooksPage
