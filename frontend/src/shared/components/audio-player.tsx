'use client'

/**
 * Audio Player Component
 * Beautiful audio player with waveform visualization
 */

import { useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface AudioPlayerProps {
    /** Audio source URL */
    src: string
    /** Start time in seconds */
    startTime?: number
    /** Auto-play on mount */
    autoPlay?: boolean
    /** Callback when audio ends */
    onEnded?: () => void
    /** Additional CSS classes */
    className?: string
}

export function AudioPlayer({
    src,
    startTime = 0,
    autoPlay = false,
    onEnded,
    className = '',
}: AudioPlayerProps) {
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const audio = new Audio(src)
        setAudioRef(audio)

        // Set start time if provided
        if (startTime > 0) {
            audio.currentTime = startTime
            setCurrentTime(startTime)
        }

        // Event listeners
        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
            setIsLoading(false)
            if (autoPlay) {
                audio.play().catch(console.error)
            }
        }

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
            onEnded?.()
        }

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)

        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)

        // Set volume
        audio.volume = volume
        audio.muted = isMuted

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.pause()
            audio.src = ''
        }
    }, [src, startTime, autoPlay, onEnded])

    useEffect(() => {
        if (audioRef) {
            audioRef.volume = volume
            audioRef.muted = isMuted
        }
    }, [audioRef, volume, isMuted])

    const togglePlayPause = () => {
        if (!audioRef) return

        if (isPlaying) {
            audioRef.pause()
        } else {
            audioRef.play().catch((error) => {
                console.error('Error playing audio:', error)
            })
        }
    }

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef || !duration) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = x / rect.width
        const newTime = percentage * duration

        audioRef.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const newVolume = Math.max(0, Math.min(1, x / rect.width))

        setVolume(newVolume)
        audioRef.volume = newVolume
        setIsMuted(newVolume === 0)
    }

    const toggleMute = () => {
        if (!audioRef) return
        setIsMuted(!isMuted)
        audioRef.muted = !isMuted
    }

    const formatTime = (seconds: number): string => {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
    const volumePercentage = volume * 100

    return (
        <div
            className={`rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6 shadow-lg dark:border-purple-800 dark:from-purple-950/20 dark:to-blue-950/20 ${className}`}
        >
            <div className="space-y-4">
                {/* Main Controls */}
                <div className="flex items-center gap-4">
                    {/* Play/Pause Button */}
                    <Button
                        type="button"
                        variant="default"
                        size="icon"
                        className="size-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg transition-all hover:from-purple-600 hover:to-blue-600 hover:shadow-xl"
                        onClick={togglePlayPause}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : isPlaying ? (
                            <Pause className="size-6 text-white" fill="white" />
                        ) : (
                            <Play className="ml-0.5 size-6 text-white" fill="white" />
                        )}
                    </Button>

                    {/* Progress Bar */}
                    <div className="flex-1 space-y-2">
                        <div
                            className="group relative h-2 cursor-pointer overflow-hidden rounded-full bg-white/50 dark:bg-white/10"
                            onClick={handleSeek}
                        >
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                                style={{ width: `${progressPercentage}%` }}
                            />
                            <div
                                className="absolute inset-y-0 left-0 size-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                                style={{ left: `${progressPercentage}%`, top: '50%' }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-10"
                            onClick={toggleMute}
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="size-5" />
                            ) : (
                                <Volume2 className="size-5" />
                            )}
                        </Button>
                        <div
                            className="group relative h-2 w-20 cursor-pointer overflow-hidden rounded-full bg-white/50 dark:bg-white/10"
                            onClick={handleVolumeChange}
                        >
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                                style={{ width: `${volumePercentage}%` }}
                            />
                            <div
                                className="absolute inset-y-0 left-0 size-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                                style={{ left: `${volumePercentage}%`, top: '50%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Waveform Visualization (Animated) */}
                <div className="flex h-12 items-center justify-center gap-1">
                    {Array.from({ length: 40 }).map((_, i) => {
                        // Create a pattern based on index and current time for consistent animation
                        const waveValue = Math.sin((i * 0.3 + currentTime * 2) * Math.PI)
                        const baseHeight = isPlaying ? 30 + waveValue * 40 : 20
                        const opacity = isPlaying ? 0.7 + Math.abs(waveValue) * 0.3 : 0.3

                        return (
                            <div
                                key={i}
                                className="w-1 rounded-full bg-gradient-to-t from-purple-400 to-blue-400 transition-all duration-150"
                                style={{
                                    height: `${Math.max(20, baseHeight)}%`,
                                    opacity,
                                }}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
