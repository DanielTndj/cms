import { AppSidebar } from "@components/layouts/sidebar/app-sidebar";
import { SiteHeader } from "@components/layouts/navbar/site-header";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar";
import { TechnicianDataTable } from "./components/technician-datatable";

export default function TechnicianPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <TechnicianDataTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}