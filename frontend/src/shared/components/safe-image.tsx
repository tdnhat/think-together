'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * SafeImage Component
 * 
 * Automatically handles external images that may not be configured in next.config.js
 * Falls back to regular <img> tag if the domain is not allowed
 */

type SafeImageProps = Readonly<{
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
  [key: string]: unknown
}>

// List of allowed domains from next.config.js
const ALLOWED_DOMAINS = [
  'res.cloudinary.com',
  'static.vecteezy.com',
  'localhost',
]

function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ALLOWED_DOMAINS.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`))
  } catch {
    return false
  }
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className = '',
  priority = false,
  onError,
  ...props
}: SafeImageProps) {
  const [useFallback, setUseFallback] = useState(false)
  const isAllowed = isAllowedDomain(src)

  // If domain not allowed or already using fallback, use regular img
  if (useFallback || !isAllowed) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={`${className} absolute inset-0 h-full w-full object-cover`}
          onError={onError}
          {...props}
        />
      )
    }

    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={onError}
        {...props}
      />
    )
  }

  // Try to use next/image, fallback to regular img on error
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onError={(e) => {
          setUseFallback(true)
          onError?.(e)
        }}
        style={{ objectFit: 'cover' }}
        {...props}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={(e) => {
        setUseFallback(true)
        onError?.(e)
      }}
      {...props}
    />
  )
}

