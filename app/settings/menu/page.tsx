import { AppSidebar } from "@components/layouts/sidebar/app-sidebar";
import { SiteHeader } from "@components/layouts/navbar/site-header";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar";
import { MenuDataTable } from "@settings/menu/components/menu-datatable";

export default function MenuSettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <MenuDataTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
