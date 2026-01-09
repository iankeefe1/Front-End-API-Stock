import { cn } from '@/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Main({ fixed, className, fluid, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        // ✅ CHANGED: added flex-1 and min-h-screen
        'flex-1 min-h-screen px-4 py-6',

        // (kept) fixed layout behavior
        fixed && 'flex grow flex-col overflow-hidden',

        // ❌ CHANGED: only apply max-width IF fluid === false AND you REALLY want it
        !fluid &&
          'w-full', // <-- REMOVED mx-auto + max-w-7xl

        className
      )}
      {...props}
    />
  )
}
