import { Separator } from "@/components/ui/separator";
import type { Anime } from "./anime";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { onAddToList } from "./Page.telefunc";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { navigate } from "vike/client/router";
import { toast } from "sonner";

export default function SearchAnimeItem({ anime }: { anime: Anime }) {
    const lists = useData<Data>();

    const [newListName, setNewListName] = useState("");

    function addToList(list: string) {
        onAddToList(anime, list)
            .then(() => {
                navigate(`/list/${list}`);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    }

    function onNewDialogOpenChange(open: boolean) {
        if (!open) {
            setNewListName("");
        }
    }

    return (
        <div className="w-[324px] lg:w-[512px] flex flex-row p-4 mb-4 gap-4">
            <img
                className="w-1/3 h-auto"
                src={anime.images.common}
                alt={anime.name}
            />
            <div className="flex flex-col justify-start w-2/3">
                <h2 className="text-lg font-bold">{anime.name}</h2>
                <p className="text-sm text-gray-500">{anime.name_cn}</p>
                <Separator className="my-2" />
                <p className="text-sm line-clamp-3">{anime.summary}</p>
                <div className="h-4" />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-40 hover:cursor-pointer"
                        >
                            Add to List
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="flex flex-col">
                            {lists.map((list) => (
                                <Button
                                    key={list}
                                    variant="ghost"
                                    className="w-full text-left"
                                    onClick={() => {
                                        addToList(list);
                                    }}
                                >
                                    {list}
                                </Button>
                            ))}
                            <Separator className="my-2" />
                            <Dialog onOpenChange={onNewDialogOpenChange}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-left"
                                    >
                                        Create New List
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <h2 className="text-lg font-bold">
                                            Create New List
                                        </h2>
                                    </DialogHeader>
                                    <Input
                                        type="text"
                                        placeholder="List Name..."
                                        value={newListName}
                                        onChange={(e) =>
                                            setNewListName(e.target.value)
                                        }
                                    />
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (newListName.trim() === "") {
                                                    return;
                                                }
                                                addToList(newListName);
                                            }}
                                        >
                                            Create
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setNewListName("");
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
