import { AppSidebar } from "@components/layouts/sidebar/app-sidebar";
import { SiteHeader } from "@components/layouts/navbar/site-header";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar";
import { UserDataTable } from "@settings/user/components/user-datatable";

export default function UserSettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <UserDataTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
