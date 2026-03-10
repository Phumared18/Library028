import {
  Button,
  Card,
  Group,
  Stack,
  Tabs,
  Text,
  TextInput,
  PasswordInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconLock, IconUser } from '@tabler/icons-react'
import { useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import { useAuthStore } from '../../store/authStore'

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuthStore()

  const profileForm = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || ''
    },
    validate: {
      name: (value) => (value.trim().length >= 2 ? null : 'กรุณาระบุชื่อ'),
      email: (value) =>
        /^\S+@\S+\.[A-Za-z]+$/.test(value) ? null : 'กรุณากรอกอีเมลที่ถูกต้อง'
    }
  })

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validate: {
      newPassword: (value) => (value.length >= 6 ? null : 'อย่างน้อย 6 ตัวอักษร'),
      confirmPassword: (value, values) =>
        value === values.newPassword ? null : 'รหัสผ่านไม่ตรงกัน'
    }
  })

  useEffect(() => {
    if (user) {
      profileForm.setValues({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  const handleProfileSubmit = (values: typeof profileForm.values) => {
    const result = updateProfile(values)
    notifications.show({
      title: result.ok ? 'อัปเดตโปรไฟล์แล้ว' : 'อัปเดตไม่สำเร็จ',
      message: result.message,
      color: result.ok ? 'teal' : 'red'
    })
  }

  const handlePasswordSubmit = (values: typeof passwordForm.values) => {
    const result = changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    })
    notifications.show({
      title: result.ok ? 'อัปเดตรหัสผ่านแล้ว' : 'อัปเดตไม่สำเร็จ',
      message: result.message,
      color: result.ok ? 'teal' : 'red'
    })

    if (result.ok) {
      passwordForm.reset()
    }
  }

  return (
    <Stack gap="xl">
      <PageHeader
        title="โปรไฟล์"
        subtitle="อัปเดตข้อมูลบัญชีและความปลอดภัยของคุณ"
      />

      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            ข้อมูลส่วนตัว
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
            ความปลอดภัย
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="lg">
          <Card withBorder radius="lg" p="lg">
            <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
              <Stack>
                <Text size="sm" c="dimmed">
                  อัปเดตข้อมูลบัญชีให้เป็นปัจจุบัน
                </Text>
                <TextInput
                  label="ชื่อ-นามสกุล"
                  withAsterisk
                  {...profileForm.getInputProps('name')}
                />
                <TextInput
                  label="อีเมล"
                  withAsterisk
                  {...profileForm.getInputProps('email')}
                />
                <Group justify="flex-end">
                  <Button type="submit">บันทึกการเปลี่ยนแปลง</Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="lg">
          <Card withBorder radius="lg" p="lg">
            <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
              <Stack>
                <Text size="sm" c="dimmed">
                  เปลี่ยนรหัสผ่านเป็นประจำเพื่อความปลอดภัยของบัญชี
                </Text>
                <PasswordInput
                  label="รหัสผ่านปัจจุบัน"
                  withAsterisk
                  {...passwordForm.getInputProps('currentPassword')}
                />
                <PasswordInput
                  label="รหัสผ่านใหม่"
                  withAsterisk
                  {...passwordForm.getInputProps('newPassword')}
                />
                <PasswordInput
                  label="ยืนยันรหัสผ่าน"
                  withAsterisk
                  {...passwordForm.getInputProps('confirmPassword')}
                />
                <Group justify="flex-end">
                  <Button type="submit">อัปเดตรหัสผ่าน</Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

export default ProfilePage
