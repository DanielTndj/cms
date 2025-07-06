"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@components/layouts/navbar/nav-main";
import { NavUser } from "@components/layouts/navbar/nav-user";
import { TeamSwitcher } from "@components/layouts/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@components/ui/sidebar";
import { ROUTES } from '@constants/routes';

const data = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Admin",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: ROUTES.DASHBOARD, 
      icon: LayoutDashboard,
    },
    {
      title: "Settings",
      url: ROUTES.SETTINGS, 
      icon: Settings2,
      items: [
        {
          title: "User",
          url: ROUTES.SETTINGS_USER, 
        },
        {
          title: "Menu",
          url: ROUTES.SETTINGS_MENU, 
        },
      ],
    },    
    {
      title: "Pump Maintenance",
      url: ROUTES.PUMP_MAINTENANCE, 
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
