import { BarChart, DonutChart } from '@mantine/charts'
import {
  Card,
  Grid,
  Group,
  List,
  Loader,
  Paper,
  Progress,
  Stack,
  Text
} from '@mantine/core'
import {
  IconBook,
  IconBooks,
  IconUsers,
  IconChecklist
} from '@tabler/icons-react'
import { useMemo } from 'react'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/StatCard'
import useDelayedLoading from '../../hooks/useDelayedLoading'
import { useLibraryStore } from '../../store/libraryStore'
import { bookCategoryLabels } from '../../utils/labels'

const borrowSeries = [
  { month: 'ม.ค.', borrowed: 18 },
  { month: 'ก.พ.', borrowed: 24 },
  { month: 'มี.ค.', borrowed: 31 },
  { month: 'เม.ย.', borrowed: 22 },
  { month: 'พ.ค.', borrowed: 28 },
  { month: 'มิ.ย.', borrowed: 34 }
]

const Dashboard = () => {
  const { books, members, borrows } = useLibraryStore()
  const loading = useDelayedLoading(600)

  const totalBooks = books.length
  const borrowedBooks = books.filter((book) => book.status === 'Borrowed').length
  const availableBooks = books.filter((book) => book.status === 'Available').length

  const categoryData = useMemo(() => {
    const counts = books.reduce<Record<string, number>>((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts).map(([name, value], index) => ({
      name: bookCategoryLabels[name as keyof typeof bookCategoryLabels] ?? name,
      value,
      color: ['indigo', 'teal', 'orange', 'grape'][index % 4]
    }))
  }, [books])

  const activeBorrows = borrows.filter((record) => record.status === 'Borrowed')

  return (
    <Stack gap="xl">
      <PageHeader
        title="แดชบอร์ด"
        subtitle="ภาพรวมการทำงานและแนวโน้มห้องสมุดแบบเรียลไทม์"
      />

      {loading ? (
        <Paper withBorder radius="lg" p="xl">
          <Group justify="center">
            <Loader size="lg" />
          </Group>
        </Paper>
      ) : (
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="หนังสือทั้งหมด"
              value={String(totalBooks)}
              description="รวมทุกหมวดหมู่"
              icon={<IconBooks size={20} />}
              tone="indigo"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="หนังสือที่ยืมอยู่"
              value={String(borrowedBooks)}
              description="อยู่ระหว่างการยืม"
              icon={<IconChecklist size={20} />}
              tone="orange"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="หนังสือพร้อมยืม"
              value={String(availableBooks)}
              description="พร้อมให้ยืม"
              icon={<IconBook size={20} />}
              tone="teal"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="สมาชิก"
              value={String(members.length)}
              description="สมาชิกที่ใช้งานอยู่"
              icon={<IconUsers size={20} />}
              tone="grape"
            />
          </Grid.Col>
        </Grid>
      )}

      <Grid>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Card withBorder radius="lg" p="lg">
            <Text fw={700} mb="xs">
              จำนวนหนังสือที่ยืมต่อเดือน
            </Text>
            <BarChart
              h={260}
              data={borrowSeries}
              dataKey="month"
              series={[{ name: 'borrowed', color: 'indigo.6' }]}
              tickLine="y"
              valueFormatter={(value) => `${value}`}
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Card withBorder radius="lg" p="lg">
            <Text fw={700} mb="xs">
              สัดส่วนตามหมวดหมู่
            </Text>
            <DonutChart
              h={260}
              data={categoryData}
              tooltipDataSource="segment"
              chartLabel="หนังสือ"
            />
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card withBorder radius="lg" p="lg">
            <Group justify="space-between" mb="md">
              <Text fw={700}>รายการยืมที่ยังไม่คืน</Text>
              <Text size="sm" c="dimmed">
                {activeBorrows.length} รายการที่ยังเปิดอยู่
              </Text>
            </Group>
            <List spacing="sm">
              {activeBorrows.map((record) => {
                const book = books.find((item) => item.id === record.bookId)
                const member = members.find((item) => item.id === record.memberId)
                return (
                  <List.Item key={record.id}>
                    <Group justify="space-between" wrap="nowrap">
                      <div>
                        <Text fw={600}>{book?.title || 'ไม่พบชื่อหนังสือ'}</Text>
                        <Text size="xs" c="dimmed">
                          {member?.name || 'ไม่พบสมาชิก'}
                        </Text>
                      </div>
                      <Progress value={70} color="indigo" w={120} />
                    </Group>
                  </List.Item>
                )
              })}
            </List>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card withBorder radius="lg" p="lg">
            <Text fw={700} mb="md">
              ไฮไลต์คอลเลกชัน
            </Text>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">ขายดีสายโปรแกรมมิง</Text>
                <Text size="sm" fw={600}>
                  42%
                </Text>
              </Group>
              <Progress value={42} color="indigo" />
              <Group justify="space-between">
                <Text size="sm">ธุรกิจและการเงิน</Text>
                <Text size="sm" fw={600}>
                  28%
                </Text>
              </Group>
              <Progress value={28} color="teal" />
              <Group justify="space-between">
                <Text size="sm">พัฒนาตนเอง</Text>
                <Text size="sm" fw={600}>
                  18%
                </Text>
              </Group>
              <Progress value={18} color="orange" />
              <Group justify="space-between">
                <Text size="sm">วิทยาศาสตร์</Text>
                <Text size="sm" fw={600}>
                  12%
                </Text>
              </Group>
              <Progress value={12} color="grape" />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

export default Dashboard
