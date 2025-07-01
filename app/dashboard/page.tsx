import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { ChartAreaInteractive } from "@/features/dashboard/components/chart-area-interactive";
import { DataTable } from "@/features/dashboard/components/dashboard-datatable";
import { SectionCards } from "@/components/ui/section-cards";
import { SiteHeader } from "@/components/layouts/navbar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "../data/dashboard.json";
import ScheduleCalendar from "@/features/technician/components/TechnicianScheduleCalendar";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:px-6">
                <ScheduleCalendar />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
