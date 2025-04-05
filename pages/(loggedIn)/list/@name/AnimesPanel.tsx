import type { Data } from "./+data";
import AnimeCard from "./AnimeCard";

export default function AnimesPanel({ data }: { data: Data["data"] }) {
    return (
        <div>
            <div className="grid grid-cols-1 gap-4 mt-4 mx-2">
                {data.map(({ anime, episodes }) => (
                    <AnimeCard key={anime.id} item={{ anime, episodes }} />
                ))}
            </div>
        </div>
    );
}
