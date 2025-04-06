import { useEffect, useMemo, useState } from "react";
import type { Data } from "./+data";
import { usePageContext } from "vike-react/usePageContext";
import cn from "classnames";
import { navigate } from "vike/client/router";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function AnimeCard({ item }: { item: Data["data"][number] }) {
    const pageContext = usePageContext();
    const selected = useMemo(
        () => pageContext.routeParams.animeId === item.anime.id.toString(),
        [pageContext.routeParams.animeId, item.anime.id]
    );
    function openBangumi() {
        const url = `https://bgm.tv/subject/${item.anime.id}`;
        // open in new tab
        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <div
            className={cn(
                "p-4 border rounded-lg shadow-lg hover:shadow-xl transition-colors duration-300 hover:cursor-pointer flex flex-row justify-start gap-4",
                {
                    "bg-indigo-300 shadow-xl": selected,
                    "hover:bg-gray-100 ": !selected,
                }
            )}
            onClick={() => {
                navigate(
                    `/list/${pageContext.routeParams.name}/${item.anime.id}`
                );
            }}
        >
            <img
                src={item.anime.image}
                alt={item.anime.name}
                className="w-[100px] h-auto object-cover rounded-lg mb-4"
            />
            <div className="flex flex-col items-start">
                <h3 className="text-xl font-semibold">{item.anime.name}</h3>
                <p
                    className={cn({
                        "text-gray-500": !selected,
                        "text-gray-800": selected,
                    })}
                >
                    {item.anime.nameCN}
                </p>
                <Button variant="link" size="nopad" onClick={openBangumi}>
                    Bangumi
                    <ExternalLink />
                </Button>
                <Button variant="outline">移除</Button>
            </div>
        </div>
    );
}
