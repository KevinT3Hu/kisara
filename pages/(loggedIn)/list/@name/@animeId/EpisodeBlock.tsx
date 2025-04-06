import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Data } from "./+data";
import cn from "classnames";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { onMarkEpisode } from "./Page.telefunc";
import { reload } from "vike/client/router";
import { toast } from "sonner";

export default function EpisodeBlock({ ep }: { ep: Data["episodes"][number] }) {
    const releaseDate = useMemo(() => {
        if (!ep.releaseDate) return null;
        const date = dayjs(ep.releaseDate);
        return date.isValid() ? date.format("YYYY-MM-DD") : null;
    }, [ep.releaseDate]);

    const [loading, setLoading] = useState(false);

    function markEpisode(watched: boolean) {
        setLoading(true);
        onMarkEpisode(ep.id, watched)
            .then(() => {
                reload();
            })
            .catch((err) => {
                toast.error(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div
                    className={cn(
                        "w-7 h-7 flex items-center justify-center select-none",
                        {
                            "bg-gray-100": !ep.watched,
                            "bg-green-100": ep.watched,
                        }
                    )}
                >
                    {ep.ep || ep.sort}
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2">
                        <p className="text-xl">{ep.ep || ep.sort}</p>
                        <div className="flex flex-col gap-1">
                            <p className="text-base">{ep.episodeName}</p>
                            <p className="text-sm/2 text-gray-400">
                                {ep.episodeNameCN}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm/2 text-gray-400">{releaseDate}</p>
                    {ep.watched ? (
                        <Button
                            variant="destructive"
                            disabled={loading}
                            onClick={() => markEpisode(false)}
                        >
                            标记为未看
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            disabled={loading}
                            onClick={() => markEpisode(true)}
                        >
                            标记为已看
                        </Button>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
