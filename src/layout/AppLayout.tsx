import {
  AppShell,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  NavLink as MantineNavLink,
  ScrollArea,
  Text,
  ThemeIcon
} from '@mantine/core'
import {
  IconBook,
  IconGauge,
  IconLogout,
  IconId,
  IconUsers,
  IconClipboardList
} from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ColorSchemeToggle from '../components/ColorSchemeToggle'
import { useAuthStore } from '../store/authStore'

const navItems = [
  {
    label: 'แดชบอร์ด',
    path: '/dashboard',
    icon: <IconGauge size={18} />
  },
  {
    label: 'หนังสือ',
    path: '/books',
    icon: <IconBook size={18} />
  },
  {
    label: 'สมาชิก',
    path: '/members',
    icon: <IconUsers size={18} />
  },
  {
    label: 'ยืม / คืน',
    path: '/borrow',
    icon: <IconClipboardList size={18} />
  },
  {
    label: 'โปรไฟล์',
    path: '/profile',
    icon: <IconId size={18} />
  }
]

const AppLayout = () => {
  const [opened, { toggle }] = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  const handleSignOut = () => {
    signOut()
    navigate('/signin')
  }

  return (
    <AppShell
      header={{ height: 72 }}
      navbar={{ width: 280, breakpoint: 'md', collapsed: { mobile: !opened } }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
            <ThemeIcon size={36} radius="md" variant="light" color="indigo">
              <IconBook size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={700}>ห้องสมุด Aether</Text>
              <Text size="xs" c="dimmed">
                คอนโซลจัดการ
              </Text>
            </Box>
          </Group>
          <Group gap="sm">
            <Badge variant="light" color="indigo" radius="md">
              มีนาคม 2026
            </Badge>
            <ColorSchemeToggle />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Group gap="sm" align="center" mb="md">
            <Avatar radius="xl" color="indigo">
              {user?.name?.slice(0, 1).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Text size="sm" fw={600}>
                {user?.name || 'ผู้ดูแลห้องสมุด'}
              </Text>
              <Text size="xs" c="dimmed">
                {user?.email || 'admin@library.app'}
              </Text>
            </Box>
          </Group>
          <Divider />
        </AppShell.Section>

        <AppShell.Section component={ScrollArea} mt="md" pr="sm" style={{ flex: 1 }}>
          {navItems.map((item) => (
            <MantineNavLink
              key={item.path}
              label={item.label}
              leftSection={item.icon}
              component={Link}
              to={item.path}
              active={location.pathname === item.path}
              variant="filled"
              color="indigo"
              mb={6}
            />
          ))}
        </AppShell.Section>

        <AppShell.Section>
          <Button
            fullWidth
            variant="light"
            color="red"
            leftSection={<IconLogout size={18} />}
            onClick={handleSignOut}
          >
            ออกจากระบบ
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default AppLayout
