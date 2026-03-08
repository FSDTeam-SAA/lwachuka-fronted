import { cn } from "@/lib/utils"

<<<<<<< HEAD
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />
    )
=======
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
>>>>>>> f4ed9c33bb5d7640c0e0d7f0bbc9f2ebba56f685
}

export { Skeleton }
