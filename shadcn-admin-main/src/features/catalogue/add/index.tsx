
// import { SlidersHorizontal, ArrowUpAZ, ArrowDownAZ } from 'lucide-react'
// import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  Form,
//   FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'


export function CatalogueAdd() {

    const formSchema = z
      .object({
        cataloguename: z.email({
          error: (iss) =>
            iss.input === '' ? 'Please enter your email' : undefined,
        }),
        password: z
          .string()
          .min(1, 'Please enter your password')
          .min(7, 'Password must be at least 7 characters long'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'],
      })

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { },
    })

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Add Catalogue
          </h1>
        </div>
        <br></br>
        <Separator className='shadow-sm' />
        <br></br>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <Form {...form}>
            <form
            >
                <FormField
                control={form.control}
                name='cataloguename'
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Catalogue Name</FormLabel>

                        <Input placeholder='Type Here' {...field} />
                    <FormMessage />
                    </FormItem>
                )}
                />
            </form>
            </Form>

          {/* <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <SlidersHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='asc'>
                <div className='flex items-center gap-4'>
                  <ArrowUpAZ size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='desc'>
                <div className='flex items-center gap-4'>
                  <ArrowDownAZ size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </Main>
    </>
  )
}
