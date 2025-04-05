import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import ListCombo from "./ListCombo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { navigate } from "vike/client/router";

export default function AppSidebar(props: {
    selected?: string;
    lists: string[];
    collapsed?: boolean;
    sidePanel: React.ReactNode;
}) {
    return (
        <Sidebar>
            <SidebarHeader className="flex items-center justify-between">
                <div className="flex flex-row items-center justify-between w-full gap-2">
                    <ListCombo
                        className="grow"
                        selected={props.selected}
                        lists={props.lists}
                        collapsed={props.collapsed}
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            navigate("/search");
                        }}
                    >
                        <Search />
                    </Button>
                </div>

                <Separator />
            </SidebarHeader>
            <SidebarContent>{props.sidePanel}</SidebarContent>
        </Sidebar>
    );
}
