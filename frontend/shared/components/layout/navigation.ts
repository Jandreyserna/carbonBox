import { FileSpreadsheet, LayoutDashboard, Upload, type LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export const navItems: NavItem[] = [
  { title: 'Inicio', href: '/', icon: LayoutDashboard },
  { title: 'Uploads', href: '/uploads', icon: FileSpreadsheet },
  { title: 'Nuevo upload', href: '/uploads/new', icon: Upload },
];

function isWithin(pathname: string, href: string): boolean {
  return href === '/' || pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveHref(pathname: string): string | undefined {
  const [mostSpecific] = navItems
    .map((item) => item.href)
    .filter((href) => isWithin(pathname, href))
    .sort((a, b) => b.length - a.length);
  return mostSpecific;
}

const uploadsCrumb: Breadcrumb = { label: 'Uploads', href: '/uploads' };

export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  if (pathname === '/') return [{ label: 'Inicio' }];
  if (pathname === '/uploads') return [{ label: 'Uploads' }];
  if (pathname === '/uploads/new') return [uploadsCrumb, { label: 'Nuevo upload' }];
  if (pathname.startsWith('/uploads/')) return [uploadsCrumb, { label: 'Detalle' }];
  return [];
}
