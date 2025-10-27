import Image from 'next/image'

export type AuthIllustrationProps = Readonly<{
  className?: string
}>

export function AuthIllustration({ className }: AuthIllustrationProps) {
  return (
    <div className={className}>
      <Image
        src="/icons/auth-illustration.svg"
        alt="Authentication illustration"
        width={500}
        height={500}
        className="h-auto w-full"
        priority
      />
    </div>
  )
}
