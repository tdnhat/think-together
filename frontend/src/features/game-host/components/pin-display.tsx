'use client'

import { useState } from 'react'
import { Copy, Check, QrCode } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import { GAME_HOST_CONSTANTS } from '../constants'

interface PinDisplayProps {
  pin: string
  className?: string
}

export function PinDisplay({ pin, className = '' }: Readonly<PinDisplayProps>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pin)
      setCopied(true)
      toastSuccess(GAME_HOST_CONSTANTS.PIN_DISPLAY.COPY_SUCCESS)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toastError(GAME_HOST_CONSTANTS.PIN_DISPLAY.COPY_FAILED)
    }
  }

  const formattedPin = pin.match(/.{1,3}/g)?.join(' ') || pin

  return (
    <Card className={className}>
      <CardContent className="p-8 text-center">
        <div className="mb-4">
          <span className="text-sm text-muted-foreground uppercase tracking-wider">
            Mã tham gia
          </span>
        </div>
        
        <div className="mb-6">
          <span className="font-heading text-5xl md:text-6xl font-bold tracking-[0.3em] text-primary">
            {formattedPin}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="default" size="lg" onClick={handleCopy}>
            {copied ? (
              <>
                <Check />
                Đã sao chép
              </>
            ) : (
              <>
                <Copy />
                Sao chép mã
              </>
            )}
          </Button>
          
          <Button variant="outline" size="lg" disabled title="Tính năng QR code sẽ sớm ra mắt">
            <QrCode />
            QR Code
          </Button>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          Truy cập <span className="font-semibold">thinktogether.vn/join</span> và nhập mã trên
        </div>
      </CardContent>
    </Card>
  )
}

