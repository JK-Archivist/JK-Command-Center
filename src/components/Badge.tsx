"use client";
import React from 'react';

type Props = { children: React.ReactNode; variant?: 'muted'|'info'|'success'|'warning'|'danger' };
export default function Badge({ children, variant='muted' }: Props){
  const map: Record<string,string> = {
    muted: 'bg-slate-100 text-slate-700',
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${map[variant]}`}>{children}</span>;
}
