import { Separator } from '@/shared/ui/separator'

type AuthDividerProps = Readonly<{
  text?: string
}>

export function AuthDivider({ text = 'hoặc' }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-xs font-base uppercase tracking-[0.3em] text-foreground/50">
        {text}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}

