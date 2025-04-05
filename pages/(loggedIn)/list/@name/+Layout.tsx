import { useData } from "vike-react/useData";
import ListPage from "../ListPage";
import type { Data } from "./+data";
import { useEffect, useState } from "react";
import ListSidebarMenu from "./ListSidebarMenu";
import AnimesPanel from "./AnimesPanel";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { lists, selected } = useData<Data>();
    const data = useData<Data>();

    const [animes, setAnimes] = useState<Data["data"]>([]);

    return (
        <ListPage
            lists={lists}
            selected={selected}
            sidePanel={
                <ListSidebarMenu
                    onChange={(data) => {
                        setAnimes(data);
                    }}
                />
            }
            middlePanel={<AnimesPanel data={animes} />}
            rightPanel={children}
        />
    );
}
