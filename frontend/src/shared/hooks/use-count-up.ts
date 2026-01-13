'use client'

import { useEffect, useState } from 'react'

interface UseCountUpOptions {
  end: number
  duration?: number
  start?: number
  decimals?: number
  enabled?: boolean
}

export function useCountUp({
  end,
  duration = 1500,
  start = 0,
  decimals = 0,
  enabled = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (!enabled) {
      setCount(end)
      return
    }

    const startTime = Date.now()
    const difference = end - start

    const updateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = start + difference * easeOut

      if (decimals > 0) {
        setCount(Number(current.toFixed(decimals)))
      } else {
        setCount(Math.floor(current))
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setCount(end)
      }
    }

    const frameId = requestAnimationFrame(updateCount)
    return () => cancelAnimationFrame(frameId)
  }, [end, start, duration, decimals, enabled])

  return count
}

