'use client'
import React, { useEffect, useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit,
  Camera,
  Award,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { fetchUserProfile } from '@/lib/services/userService'
import { Goal, UserProfile } from '@/types'
import { useUser } from '@clerk/nextjs'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getGoals, postGoal } from '@/lib/services/goalService'

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
})

export default function UserAccount() {
  const [userProfile, setuserProfile] = useState<UserProfile | null>(null)
  const { user, isLoaded } = useUser()
  const [countActiveGoal, setCountActiveGoal] = useState<number>(0)
  //const [countCompletedGoal, setCountCompletedGoal] = useState<number>(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { title } = values

    // Handle form submission here
    const goalData: Goal = {
      title,
    }

    try {
      if (!user?.id) {
        return
      }
      await postGoal(user.id, goalData)
    } catch (error) {
      console.log('Failed to create goal:', error)
    }
  }

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) {
        return
      }
      try {
        const userProfile: UserProfile = await fetchUserProfile(user.id)
        const goals = await getGoals(user.id)
        console.log('Fetched goals:', goals)
        setCountActiveGoal(
          goals.filter(goal => goal.status === 'active').length
        )
        // setCountCompletedGoal(goals.filter(goal => goal.status === 'completed').length)
        if (!userProfile) {
          throw new Error('User profile not found')
        }
        setuserProfile(userProfile)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        console.log('User profile loaded')
      }
    }
    if (isLoaded) {
      loadUserProfile()
    }
  }, [user?.id, isLoaded, countActiveGoal])

  if (!isLoaded) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-teal-900 dark:to-cyan-900 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600'></div>
      </div>
    )
  }

  const userInfo = {
    name: 'Alex Johnson',
    email: userProfile?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'March 2023',
    avatar: '/api/placeholder/100/100',
    role: 'Premium Member',
    verified: true,
  }

  const accountStats = [
    {
      label: 'Profile Views',
      value: '2,847',
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      label: 'Loyalty Points',
      value: '1,256',
      icon: Award,
      color: 'text-purple-600',
    },
    {
      label: 'Account Age',
      value: '1.5 years',
      icon: Clock,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent'>
            User Profile
          </h1>
          <p className='text-muted-foreground mt-1'>
            Manage your account settings and preferences
          </p>
        </div>
        <button className='flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'>
          <Edit className='h-4 w-4' />
          Edit Profile
        </button>
      </div>
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <h1>countActiveGoal: {countActiveGoal}</h1>
        <br />
      </div>

      {/* User Info Card */}
      <div className='bg-card rounded-xl p-6 border shadow-sm'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
          <div className='relative'>
            <div className='w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
              AJ
            </div>
            <button className='absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors'>
              <Camera className='h-4 w-4' />
            </button>
          </div>

          <div className='flex-1 space-y-3'>
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-bold'>{userInfo.name}</h2>
              {userInfo.verified && (
                <div className='flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium'>
                  <Shield className='h-3 w-3' />
                  Verified
                </div>
              )}
              <span className='px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full text-sm font-medium'>
                {userInfo.role}
              </span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Mail className='h-4 w-4' />
                {userInfo.email}
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Phone className='h-4 w-4' />
                {userInfo.phone}
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                {userInfo.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {accountStats.map((stat, index) => (
          <div
            key={index}
            className='bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow'
          >
            <div className='flex items-center justify-between'>
              <div
                className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-100 dark:bg-')}-900/30`}
              >
                <stat.icon
                  className={`h-5 w-5 ${stat.color} dark:${stat.color.replace('-600', '-400')}`}
                />
              </div>
            </div>
            <div className='mt-4'>
              <h3 className='text-2xl font-bold'>{stat.value}</h3>
              <p className='text-muted-foreground text-sm mt-1'>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='bg-card rounded-xl p-6 border shadow-sm'>
        <div>
          <h3 className='text-lg font-semibold mb-6 text-center'>
            Add my goal
          </h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 max-w-2xl mx-auto'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='sr-only'>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter title'
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button
                  type='submit'
                  className='bg-blue-600 hover:bg-blue-700 text-white'
                >
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
