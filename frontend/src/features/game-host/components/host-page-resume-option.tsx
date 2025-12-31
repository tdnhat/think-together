/**
 * Host Page Resume Option Component
 */

'use client'

import { Loader2, RefreshCw, Play } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import type { StoredHostSession } from '../lib/session-storage'

interface HostPageResumeOptionProps {
  storedSession: StoredHostSession
  isLoading: boolean
  error: string | null
  onResume: (sessionId: string) => void
  onStartFresh: () => void
}

export function HostPageResumeOption({
  storedSession,
  isLoading,
  error,
  onResume,
  onStartFresh,
}: HostPageResumeOptionProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Phiên trò chơi đang hoạt động</CardTitle>
          <CardDescription className="text-center">
            Bạn có một phiên trò chơi đang chờ người chơi tham gia. Bạn muốn tiếp tục hay tạo mới?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Mã PIN</p>
            <p className="font-heading text-3xl font-bold text-primary tracking-wider">
              {storedSession?.pin?.match(/.{1,3}/g)?.join(' ')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Trạng thái: Đang chờ
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="default" 
              onClick={() => onResume(storedSession.sessionId)}
              disabled={isLoading}
              className="w-full gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang kết nối...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Tiếp tục phiên cũ
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onStartFresh}
              disabled={isLoading}
              className="w-full gap-2"
            >
              <Play className="h-5 w-5" />
              Hủy và tạo phiên mới
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

