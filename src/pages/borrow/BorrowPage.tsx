import {
  Badge,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Table,
  TextInput
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconArrowBackUp } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { useLibraryStore } from '../../store/libraryStore'
import { formatDate } from '../../utils/format'
import { borrowStatusLabels } from '../../utils/labels'

const BorrowPage = () => {
  const { books, members, borrows, borrowBook, returnBook } = useLibraryStore()
  const [bookId, setBookId] = useState<string | null>(null)
  const [memberId, setMemberId] = useState<string | null>(null)
  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().slice(0, 10))
  const [returnDate, setReturnDate] = useState('')

  const availableBooks = useMemo(
    () => books.filter((book) => book.status === 'Available'),
    [books]
  )

  const handleBorrow = () => {
    if (!bookId || !memberId || !borrowDate || !returnDate) {
      notifications.show({
        title: 'ข้อมูลไม่ครบ',
        message: 'กรุณาเลือกหนังสือ สมาชิก และวันที่ให้ครบถ้วน',
        color: 'red'
      })
      return
    }

    const result = borrowBook({ bookId, memberId, borrowDate, returnDate })
    notifications.show({
      title: result.ok ? 'บันทึกการยืมแล้ว' : 'ยืมไม่สำเร็จ',
      message: result.message,
      color: result.ok ? 'teal' : 'red'
    })

    if (result.ok) {
      setBookId(null)
      setMemberId(null)
      setReturnDate('')
    }
  }

  const handleReturn = (recordId: string) => {
    const result = returnBook(recordId)
    notifications.show({
      title: result.ok ? 'คืนแล้ว' : 'คืนไม่สำเร็จ',
      message: result.message,
      color: result.ok ? 'teal' : 'red'
    })
  }

  return (
    <Stack gap="xl">
      <PageHeader
        title="ยืม / คืน"
        subtitle="บันทึกการยืมและคืนได้อย่างรวดเร็ว"
      />

      <Card withBorder radius="lg" p="lg">
        <Group align="end" wrap="wrap">
          <Select
            label="เลือกหนังสือ"
            placeholder="หนังสือที่พร้อมให้ยืม"
            data={availableBooks.map((book) => ({
              value: book.id,
              label: `${book.title} · ${book.author}`
            }))}
            value={bookId}
            onChange={setBookId}
            w={{ base: '100%', sm: 260 }}
          />
          <Select
            label="เลือกสมาชิก"
            placeholder="สมาชิกที่ใช้งานอยู่"
            data={members.map((member) => ({
              value: member.id,
              label: member.name
            }))}
            value={memberId}
            onChange={setMemberId}
            w={{ base: '100%', sm: 220 }}
          />
          <TextInput
            label="วันที่ยืม"
            type="date"
            value={borrowDate}
            onChange={(event) => setBorrowDate(event.currentTarget.value)}
          />
          <TextInput
            label="วันที่กำหนดคืน"
            type="date"
            value={returnDate}
            onChange={(event) => setReturnDate(event.currentTarget.value)}
          />
          <Button onClick={handleBorrow}>บันทึกการยืม</Button>
        </Group>
      </Card>

      <Card withBorder radius="lg" p="lg">
        <Table striped highlightOnHover withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>หนังสือ</Table.Th>
              <Table.Th>สมาชิก</Table.Th>
              <Table.Th>วันที่ยืม</Table.Th>
              <Table.Th>วันที่กำหนดคืน</Table.Th>
              <Table.Th>สถานะ</Table.Th>
              <Table.Th>การทำรายการ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {borrows.map((record) => {
              const book = books.find((item) => item.id === record.bookId)
              const member = members.find((item) => item.id === record.memberId)
              return (
                <Table.Tr key={record.id}>
                  <Table.Td>{book?.title || 'ไม่พบข้อมูล'}</Table.Td>
                  <Table.Td>{member?.name || 'ไม่พบข้อมูล'}</Table.Td>
                  <Table.Td>{formatDate(record.borrowDate)}</Table.Td>
                  <Table.Td>{formatDate(record.returnDate)}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={record.status === 'Borrowed' ? 'orange' : 'teal'}
                      variant="light"
                    >
                      {borrowStatusLabels[record.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      color="teal"
                      leftSection={<IconArrowBackUp size={14} />}
                      disabled={record.status === 'Returned'}
                      onClick={() => handleReturn(record.id)}
                    >
                      คืนหนังสือ
                    </Button>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  )
}

export default BorrowPage
