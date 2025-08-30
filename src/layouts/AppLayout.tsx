import { ScrollArea } from "@/components/ui/scroll-area";
import SideBar from "../HomePage/PageOne/SideBar";
import TopBar from "../components/home/TopBar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <div className="flex flex-1 flex-col ml-16">
        <TopBar />
        <ScrollArea className="h-full py-2 px-6 lg:px-10 flex-1">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
