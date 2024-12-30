import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BarChart3, BriefcaseIcon, Users, FileText, GitBranch, Building2, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", icon: BarChart3, path: "/" },
  { title: "Stellenangebote", icon: BriefcaseIcon, path: "/jobs" },
  { title: "Kandidaten", icon: Users, path: "/candidates" },
  { title: "Firmen", icon: Building2, path: "/companies" },
  { title: "Pipeline", icon: GitBranch, path: "/pipeline" },
  { title: "Bewerbungen", icon: FileText, path: "/applications" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const NavigationContent = () => (
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
                  <Link 
                    to={item.path} 
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
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
  );

  if (isMobile) {
    return (
      <div className="min-h-screen w-full">
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white border-b">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar className="border-none">
                <NavigationContent />
              </Sidebar>
            </SheetContent>
          </Sheet>
          <img 
            src="/lovable-uploads/7eae45ab-09e3-495b-a15d-d408bcf583e1.png" 
            alt="RecruitPlus Logo" 
            className="h-8 w-auto"
          />
        </div>
        <main className="pt-16 px-4">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar>
        <NavigationContent />
      </Sidebar>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}