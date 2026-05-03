import type { ReactNode } from 'react'

interface EmptyStateProps {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ eyebrow, title, description, action }: EmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-12">
      {eyebrow ? (
        <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-emerald-600">{eyebrow}</p>
      ) : null}
      <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
      {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
    </section>
  )
}
