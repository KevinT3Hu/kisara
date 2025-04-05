import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { useEffect, useMemo, useState } from "react";
import SidebarMenuItem from "./SidebarMenuItem";

const menus = [
    {
        title: "Air Today",
        signal: "airToday",
    },
    {
        title: "Unwatched",
        signal: "unwatched",
    },
    {
        title: "Unfinished",
        signal: "unfinished",
    },
    {
        title: "All",
        signal: "all",
    },
] as const;
type Signal = (typeof menus)[number]["signal"];

export default function ListSidebarMenu({
    onChange,
}: {
    onChange?: (data: Data["data"]) => void;
}) {
    const { airToday, unwatched, unfinished, data } = useData<Data>();
    const [selected, setSelected] = useState<Signal>("airToday");

    // a computed map to get the selected list
    const dataMap = useMemo(() => {
        const map = new Map<string, typeof airToday>();
        map.set("airToday", airToday);
        map.set("unwatched", unwatched);
        map.set("unfinished", unfinished);
        map.set("all", data);
        return map;
    }, [airToday, unwatched, unfinished, data]);

    useEffect(() => {
        if (onChange) {
            const list = dataMap.get(selected);
            onChange(list ?? []);
        }
    }, [selected, dataMap, onChange]);
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                {menus.map((menu) => {
                    const list = dataMap.get(menu.signal);
                    return (
                        <SidebarMenuItem
                            key={menu.signal}
                            title={menu.title}
                            num={list?.length ?? 0}
                            selected={selected === menu.signal}
                            onClick={() => {
                                setSelected(menu.signal);
                            }}
                        />
                    );
                })}
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
