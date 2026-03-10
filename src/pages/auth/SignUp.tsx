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
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const SignUp = () => {
  const navigate = useNavigate()
  const signUp = useAuthStore((state) => state.signUp)

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    validate: {
      name: (value) => (value.trim().length >= 2 ? null : 'ชื่อสั้นเกินไป'),
      email: (value) =>
        /^\S+@\S+\.[A-Za-z]+$/.test(value) ? null : 'กรุณากรอกอีเมลที่ถูกต้อง',
      password: (value) => (value.length >= 6 ? null : 'อย่างน้อย 6 ตัวอักษร')
    }
  })

  const handleSubmit = (values: typeof form.values) => {
    const result = signUp(values)
    notifications.show({
      title: result.ok ? 'สร้างบัญชีสำเร็จ' : 'สมัครสมาชิกไม่สำเร็จ',
      message: result.message,
      color: result.ok ? 'teal' : 'red'
    })

    if (result.ok) {
      navigate('/dashboard')
    }
  }

  return (
    <Center mih="100vh" p="md">
      <Paper withBorder shadow="lg" radius="lg" p="xl" w="100%" maw={440}>
        <Stack gap="md">
          <div>
            <Title order={2}>สร้างบัญชีของคุณ</Title>
            <Text c="dimmed" size="sm">
              ตั้งค่าพื้นที่ทำงานห้องสมุดได้ในไม่กี่วินาที
            </Text>
          </div>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="ชื่อ-นามสกุล"
                placeholder="สุภาภรณ์ วงศ์ดี"
                withAsterisk
                {...form.getInputProps('name')}
              />
              <TextInput
                label="อีเมล"
                placeholder="คุณ@library.com"
                withAsterisk
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="รหัสผ่าน"
                placeholder="ตั้งรหัสผ่าน"
                withAsterisk
                {...form.getInputProps('password')}
              />
              <Button type="submit" size="md" fullWidth>
                สมัครสมาชิก
              </Button>
            </Stack>
          </form>
          <Text size="sm" c="dimmed">
            มีบัญชีอยู่แล้ว?{' '}
            <Anchor component={Link} to="/signin" fw={600}>
              เข้าสู่ระบบ
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  )
}

export default SignUp
