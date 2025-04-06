import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import { useEffect, useState } from "react";
import type { AnimeData } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EpisodeBlock from "./EpisodeBlock";

export default function Page() {
    const { anime, episodes } = useData<Data>();

    const [fetching, setFetching] = useState(true);
    const [fetchedAnime, setFetchedAnime] = useState<AnimeData | undefined>(
        undefined
    );

    useEffect(() => {
        fetch(`https://api.bgm.tv/v0/subjects/${anime.id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setFetchedAnime(data);
            })
            .finally(() => {
                setFetching(false);
            });
    }, [anime.id]);

    return (
        <div className="flex flex-col items-center justify-start gap-2">
            <div className="w-full py-2 sticky top-0 bg-white z-10 shadow-lg px-3 rounded-b-lg">
                <div className="flex flex-col">
                    <p className="text-2xl font-semibold">{anime.name}</p>
                    <p className="text-sm/2 text-gray-400">{anime.nameCN}</p>
                </div>
            </div>
            <div className="flex flex-col w-full items-center gap-2 px-3">
                <img
                    src={anime.image}
                    alt={anime.name}
                    className="w-[100px] lg:w-1/3 h-auto m-2"
                />
                <Card className="w-full">
                    <CardHeader>
                        <h2>章节</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {episodes.map((ep) => (
                                <EpisodeBlock key={ep.id} ep={ep} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <h2>简介</h2>
                    </CardHeader>
                    <CardContent>
                        {fetching ? (
                            <p>加载中...</p>
                        ) : (
                            <p>{fetchedAnime?.summary}</p>
                        )}
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <h2>标签</h2>
                    </CardHeader>
                    <CardContent>
                        {fetching ? (
                            <p>加载中...</p>
                        ) : (
                            <div className="flex flex-wrap">
                                {fetchedAnime?.tags.map((tag) => (
                                    <div
                                        key={tag.name}
                                        className="flex flex-row bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2"
                                    >
                                        <p className="text-sm">{tag.name}</p>
                                        <Separator
                                            orientation="vertical"
                                            className="mx-1"
                                        />

                                        <p className="text-sm text-gray-400">
                                            {tag.count}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
