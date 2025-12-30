import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SafeImage } from "@/shared/components"

type Props = {
  imageUrl: string
  imageAlt?: string
  children?: ReactNode
  imageOverlay?: ReactNode
  className?: string
  aspectRatio?: string
}

export default function ImageCard({
  imageUrl,
  imageAlt = "image",
  children,
  imageOverlay,
  className,
  aspectRatio = "aspect-4/3"
}: Props) {
  return (
    <figure
      className={cn(
        "w-full overflow-hidden rounded-lg border bg-card shadow-sm",
        className,
      )}
    >
      <div className={cn("relative w-full overflow-hidden border-b", aspectRatio)}>
        <SafeImage
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        {imageOverlay && (
          <div className="absolute inset-0 pointer-events-auto">
            {imageOverlay}
          </div>
        )}
      </div>
      {children && (
        <figcaption className="p-4 bg-card text-card-foreground">
          {children}
        </figcaption>
      )}
    </figure>
  )
}
