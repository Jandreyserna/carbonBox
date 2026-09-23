import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex gap-6 border-b px-6 py-3">
      <Link href="/" className="font-semibold">CarbonBox</Link>
      <Link href="/uploads">Uploads</Link>
      <Link href="/uploads/new">Nuevo upload</Link>
    </nav>
  );
}