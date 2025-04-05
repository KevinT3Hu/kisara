import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function ListPage(props: {
    selected?: string;
    lists: string[];
    sidePanel: React.ReactNode;
    middlePanel: React.ReactNode;
    rightPanel: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar
                selected={props.selected}
                lists={props.lists}
                sidePanel={props.sidePanel}
            />
            <main className="w-full">
                <div className="flex flex-row h-screen">
                    <div className="h-full overflow-y-scroll w-1/2">
                        {props.middlePanel}
                    </div>
                    <Separator orientation="vertical" className="h-full" />
                    <div className="h-full overflow-y-scroll w-1/2">
                        {props.rightPanel}
                    </div>
                </div>
            </main>
        </SidebarProvider>
    );
}
