import {
  Anchor,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const SignIn = () => {
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.[A-Za-z]+$/.test(value) ? null : 'กรุณากรอกอีเมลที่ถูกต้อง',
      password: (value) => (value.length >= 6 ? null : 'อย่างน้อย 6 ตัวอักษร')
    }
  })

  const handleSubmit = (values: typeof form.values) => {
    const result = signIn(values)
    notifications.show({
      title: result.ok ? 'เข้าสู่ระบบสำเร็จ' : 'เข้าสู่ระบบไม่สำเร็จ',
      message: result.message,
      color: result.ok ? 'teal' : 'red'
    })

    if (result.ok) {
      navigate('/dashboard')
    }
  }

  return (
    <Center mih="100vh" p="md">
      <Paper withBorder shadow="lg" radius="lg" p="xl" w="100%" maw={420}>
        <Stack gap="md">
          <div>
            <Title order={2}>ยินดีต้อนรับกลับมา</Title>
            <Text c="dimmed" size="sm">
              เข้าสู่ระบบเพื่อจัดการงานห้องสมุด
            </Text>
          </div>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="อีเมล"
                placeholder="คุณ@library.com"
                withAsterisk
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="รหัสผ่าน"
                placeholder="••••••••"
                withAsterisk
                {...form.getInputProps('password')}
              />
              <Button type="submit" size="md" fullWidth>
                เข้าสู่ระบบ
              </Button>
            </Stack>
          </form>
          <Text size="sm" c="dimmed">
            เพิ่งมาใช่ไหม?{' '}
            <Anchor component={Link} to="/signup" fw={600}>
              สร้างบัญชี
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  )
}

export default SignIn
