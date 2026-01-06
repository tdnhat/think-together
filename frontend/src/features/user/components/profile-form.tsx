'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Button } from '@/shared/ui/button'
import { ProfileAvatar } from './profile-avatar'
import { useProfile } from '../hooks/use-profile'

const profileSchema = z.object({
    firstName: z
        .string()
        .min(1, 'Tên đệm là bắt buộc')
        .max(100, 'Tên đệm không được vượt quá 100 ký tự'),
    lastName: z
        .string()
        .min(1, 'Tên gọi là bắt buộc')
        .max(100, 'Tên gọi không được vượt quá 100 ký tự'),
    bio: z.string().max(500, 'Tiểu sử không được vượt quá 500 ký tự').optional(),
    avatarUrl: z.string().optional().nullable(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
    const { user, isLoading, updateProfile } = useProfile()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        user?.avatarUrl || null
    )

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            bio: user?.bio || '',
            avatarUrl: user?.avatarUrl || null,
        },
    })

    const onSubmit = async (data: ProfileFormValues) => {
        const result = await updateProfile({
            ...data,
            avatarUrl,
            bio: data.bio || null,
        })

        if (result.success) {
            form.reset(data)
        }
    }

    const userInitials = user
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        : 'U'

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex justify-center">
                            <ProfileAvatar
                                avatarUrl={avatarUrl}
                                userInitials={userInitials}
                                onAvatarChange={(url) => {
                                    setAvatarUrl(url)
                                    form.setValue('avatarUrl', url)
                                }}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên đệm</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Nhập tên đệm" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên gọi</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Nhập tên gọi" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tiểu sử</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Viết một chút về bản thân bạn..."
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => form.reset()}
                                disabled={isLoading || !form.formState.isDirty}
                            >
                                Đặt lại
                            </Button>
                            <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
