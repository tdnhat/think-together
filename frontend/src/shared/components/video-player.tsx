'use client'

/**
 * Video Player Component
 * Embedded video player with YouTube support
 */

interface VideoPlayerProps {
    /** Video URL (supports YouTube URLs) */
    url: string
    /** Start time in seconds */
    startTime?: number
    /** Auto-play on mount */
    autoPlay?: boolean
    /** Additional CSS classes */
    className?: string
}

export function VideoPlayer({
    url,
    startTime = 0,
    autoPlay = false,
    className = '',
}: VideoPlayerProps) {
    // Convert YouTube URL to embed format
    let embedUrl = url

    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
    }

    // Add parameters
    const params = new URLSearchParams()
    if (startTime > 0) {
        params.set('start', startTime.toString())
    }
    if (autoPlay) {
        params.set('autoplay', '1')
    }

    const finalUrl = params.toString()
        ? `${embedUrl}?${params.toString()}`
        : embedUrl

    return (
        <div className={`overflow-hidden rounded-lg bg-black ${className}`}>
            <div className="aspect-video">
                <iframe
                    src={finalUrl}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video player"
                />
            </div>
        </div>
    )
}
