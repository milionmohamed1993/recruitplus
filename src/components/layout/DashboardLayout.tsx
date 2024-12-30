import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BarChart3, BriefcaseIcon, Users, FileText, GitBranch, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: BarChart3, path: "/" },
  { title: "Stellenangebote", icon: BriefcaseIcon, path: "/jobs" },
  { title: "Kandidaten", icon: Users, path: "/candidates" },
  { title: "Firmen", icon: Building2, path: "/companies" },
  { title: "Pipeline", icon: GitBranch, path: "/pipeline" },
  { title: "Bewerbungen", icon: FileText, path: "/applications" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="p-4">
              <img 
                src="/lovable-uploads/7eae45ab-09e3-495b-a15d-d408bcf583e1.png" 
                alt="RecruitPlus Logo" 
                className="h-8 w-auto"
              />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.path} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}