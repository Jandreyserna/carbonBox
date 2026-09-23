'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import { getActiveHref, navItems } from './navigation';

export function AppSidebar() {
  const activeHref = getActiveHref(usePathname());
  const { setOpenMobile } = useSidebar();
  const closeMobileSidebar = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" onClick={closeMobileSidebar}>
                <Image
                  src="/brand/carbonbox-mark.png"
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0"
                />
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">CarbonBox</span>
                  <span className="truncate text-xs text-muted-foreground">Datos de actividad</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.href === activeHref} tooltip={item.title}>
                    <Link href={item.href} onClick={closeMobileSidebar}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
