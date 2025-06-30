"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Notification = {
  id: number;
  title: string;
  read: boolean;
  createdAt: Date;
  url?: string;
};

let simulatedId = 3;

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); 

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const fetchNotifications = async (): Promise<Notification[]> => {
  simulatedId++;
  const newNotification: Notification = {
    id: simulatedId,
    title: `New message #${simulatedId}`,
    createdAt: new Date(),
    read: false,
    url: `/messages/${simulatedId}`,
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: "New user registered",
          createdAt: new Date(Date.now() - 60 * 1000), 
          read: false,
          url: "/settings/user",
        },
        {
          id: 2,
          title: "System update available",
          createdAt: new Date(Date.now() - 10 * 60 * 1000), 
          read: false,
          url: "/settings/user",
        },
        {
          id: 3,
          title: "New user registered",
          createdAt: new Date(Date.now() - 20 * 60 * 1000),
          read: true,
        },
        newNotification,
      ]);
    }, 300);
  });
};

export function SiteHeader() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const data = await fetchNotifications();
      if (isMounted) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newOnes = data.filter((n) => !existingIds.has(n.id));

          const merged = [...newOnes, ...prev];

          return merged.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNotificationClick = (note: Notification) => {
    markAsRead(note.id);
    if (note.url) {
      router.push(note.url);
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2">
              <div className="text-sm font-semibold mb-2">Notifications</div>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-auto">
                  {notifications.map((note) => (
                    <li
                      key={note.id}
                      className={`text-sm p-2 rounded cursor-pointer transition hover:bg-muted ${
                        !note.read ? "bg-muted/30 font-semibold" : ""
                      }`}
                      onClick={() => handleNotificationClick(note)}
                    >
                      <div>{note.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(new Date(note.createdAt))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
