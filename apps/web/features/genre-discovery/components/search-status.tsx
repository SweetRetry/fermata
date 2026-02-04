"use client"

interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="mt-12 flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-destructive px-1.5 py-0.5 border border-destructive/30 rounded bg-destructive/5">
        Error
      </span>
      <p className="text-sm text-destructive font-normal tracking-tight">{message}</p>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="mt-40 flex flex-col items-center justify-center space-y-8">
      <p className="text-sm md:text-base text-muted-foreground/60 font-normal tracking-[0.2em] uppercase text-center max-w-md leading-relaxed">
        Begin your musical context exploration in tranquility
      </p>
    </div>
  )
}
