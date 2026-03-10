import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Center mih="100vh" p="md">
      <Stack align="center">
        <Title order={2}>ไม่พบหน้า</Title>
        <Text c="dimmed">หน้าที่คุณค้นหาไม่มีอยู่</Text>
        <Button component={Link} to="/dashboard">
          ไปที่แดชบอร์ด
        </Button>
      </Stack>
    </Center>
  )
}

export default NotFound
