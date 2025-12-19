'use client'

import { Users, Mail, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CLASS_CONSTANTS } from '../constants'
import type { ClassMemberDto } from '../types'

interface ClassMembersListProps {
  members: ClassMemberDto[]
  isLoading?: boolean
  isTeacher?: boolean
  onRemoveMember?: (memberId: string) => void
  className?: string
}

export function ClassMembersList({
  members,
  isLoading = false,
  isTeacher = false,
  onRemoveMember,
  className = '',
}: Readonly<ClassMembersListProps>) {
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ')
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return '??'
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Thành viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--bg-surface-secondary)]" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-[var(--bg-surface-secondary)]" />
                  <div className="h-3 w-24 animate-pulse rounded bg-[var(--bg-surface-secondary)]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Thành viên ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="mx-auto h-12 w-12 text-[var(--text-tertiary)]" />
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {CLASS_CONSTANTS.MESSAGES.NO_MEMBERS}
            </p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              {CLASS_CONSTANTS.MESSAGES.NO_MEMBERS_DESCRIPTION}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-[var(--bg-surface-secondary)]"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                    {getInitials(member.userName, member.userEmail)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text-primary)] truncate">
                    {member.userName || member.userEmail || 'Người dùng'}
                  </p>
                  {member.userEmail && (
                    <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.userEmail}</span>
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Tham gia{' '}
                      {formatDistanceToNow(new Date(member.joinedAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                </div>
                {isTeacher && onRemoveMember && (
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => onRemoveMember(member.id)}
                    className="shrink-0"
                  >
                    Xóa
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
