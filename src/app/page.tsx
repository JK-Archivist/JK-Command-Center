import Link from 'next/link';

export default function Home() {
  const links = [
    { href: '/tasks', label: 'Tasks Board' },
    { href: '/content', label: 'Content Pipeline' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/memory', label: 'Memory' },
    { href: '/team', label: 'Team' },
    { href: '/office', label: 'Office' },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="block rounded-md border bg-white p-6 hover:shadow">
          <div className="text-lg font-semibold">{l.label}</div>
          <div className="text-sm text-slate-500">{l.href}</div>
        </Link>
      ))}
    </div>
  );
}
