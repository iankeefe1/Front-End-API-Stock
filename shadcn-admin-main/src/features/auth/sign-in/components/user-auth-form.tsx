import { useState } from 'react'
import { z } from 'zod'
import { API_BASE_URL } from '@/config/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
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
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(7, 'Password must be at least 7 characters'),
})

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '' },
  })

  async function loginApi(username: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/Users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
  setIsLoading(true)

    try {
      const res = await loginApi(data.username, data.password)

      auth.setUser({
        username: res.user.username,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        email: res.user.email,
        role: [],
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })

      auth.setAccessToken(res.token ?? 'logged-in')

      toast.success('Welcome back!')
      navigate({ to: '/', replace: true })
    } catch (err) {
      toast.error('Invalid username or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
          Sign in
        </Button>
      </form>
    </Form>
  )
}
