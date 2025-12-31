'use client'

import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { FLOATING_STATIONERY_ITEMS } from '../constants'

export function FloatingStationery() {
    return (
        <div className="pointer-events-none absolute inset-0 z-0 flex h-screen w-screen items-center justify-center opacity-90">
            <div className="relative h-screen w-full">
                {FLOATING_STATIONERY_ITEMS.map(({ id, icon: Icon, className, colors, size, float, delay, duration }) => (
                    <motion.div
                        key={id}
                        className={cn(
                            'pointer-events-none absolute flex items-center justify-center rounded-3xl border border-white/40 shadow-md shadow-black/5 backdrop-blur-sm',
                            className,
                            colors,
                            size,
                        )}
                        animate={{
                            x: float.x,
                            y: float.y,
                            rotate: float.rotate,
                        }}
                        transition={{
                            duration,
                            delay,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                        }}
                    >
                        <Icon className="h-7 w-7" strokeWidth={1.6} />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
