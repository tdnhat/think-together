import Image from 'next/image'

type AuthIllustrationProps = {
  className?: string
}

export function AuthIllustration({ className }: AuthIllustrationProps) {
  return (
    <div className={className}>
      <Image
        src="/icons/auth-illustration.svg"
        alt="Authentication illustration"
        width={500}
        height={500}
        className="w-full h-auto"
        priority
      />
    </div>
  )
}
