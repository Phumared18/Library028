import { Card, Group, Text, ThemeIcon } from '@mantine/core'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
  tone?: 'indigo' | 'teal' | 'orange' | 'grape'
}

const StatCard = ({ title, value, description, icon, tone = 'indigo' }: StatCardProps) => {
  return (
    <Card withBorder radius="lg" p="lg" shadow="sm">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text c="dimmed" size="sm" fw={600} tt="uppercase">
            {title}
          </Text>
          <Text size="xl" fw={700} mt={4}>
            {value}
          </Text>
          <Text c="dimmed" size="sm" mt={4}>
            {description}
          </Text>
        </div>
        <ThemeIcon variant="light" color={tone} size={44} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  )
}

export default StatCard
