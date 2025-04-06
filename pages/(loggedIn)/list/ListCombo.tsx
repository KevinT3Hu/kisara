import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { navigate } from "vike/client/router";

export default function ListCombo(props: {
    selected?: string;
    lists: string[];
    collapsed?: boolean;
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    function navigateToList(list: string) {
        navigate(`/list/${list}`);
    }

    return (
        <Popover open={open} onOpenChange={(open) => setOpen(open)}>
            <PopoverTrigger
                asChild
                className={cn("hover:cursor-pointer", props.className)}
            >
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {props.selected || "选择列表..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="搜索列表..." />
                    <CommandList>
                        <CommandEmpty>No list found.</CommandEmpty>
                        <CommandGroup>
                            {props.lists.map((list) => (
                                <CommandItem
                                    key={list}
                                    value={list}
                                    onSelect={(v) => {
                                        navigateToList(v);
                                        setOpen(false);
                                    }}
                                    className="hover:cursor-pointer"
                                >
                                    {list}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
