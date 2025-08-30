import { ScrollArea } from "@/components/ui/scroll-area";
import SideBar from "../HomePage/PageOne/SideBar";
import TopBar from "../components/home/TopBar";
import SideBarChat from "@/ChatUI/SideBarChat";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      <aside className="w-16 fixed left-0 top-0 bottom-0 z-50 bg-black">
        <SideBarChat />
      </aside>

      <main className="flex-1 flex flex-col pl-16">
        <TopBar />
        <ScrollArea className="flex-1 overflow-auto px-6 py-4">
          {children}
        </ScrollArea>
      </main>
    </div>
  );
}
