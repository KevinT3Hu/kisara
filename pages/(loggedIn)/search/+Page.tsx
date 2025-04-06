import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowDownNarrowWide,
    CalendarCheck2,
    CalendarIcon,
    Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Anime } from "./anime";
import SearchAnimeItem from "./SearchAnimeItem";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useLocalStorage } from "usehooks-ts";

interface FPagination {
    total: number;
    limit: number;
    offset: number;
}

type SortType = "match" | "rank" | "heat" | "score";

const sortMenu: Record<SortType, string> = {
    match: "匹配",
    rank: "排名",
    heat: "热度",
    score: "评分",
};

const dateLocalstorageOptions = {
    initializeWithValue: false,
    serializer: (value?: Date) => {
        return value?.getTime().toString() ?? "";
    },
    deserializer: (value: string) => {
        const date = new Date();
        date.setTime(Number.parseInt(value));
        return date;
    },
};

export default function Page() {
    const [sort, setSort] = useLocalStorage<SortType>("sort", "match", {
        initializeWithValue: false,
    });
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Anime[]>([]);

    const [filterStartDate, setFilterStartDate] = useLocalStorage<
        Date | undefined
    >("startDate", undefined, dateLocalstorageOptions);
    const [filterEndDate, setFilterEndDate] = useLocalStorage<Date | undefined>(
        "endDate",
        undefined,
        dateLocalstorageOptions
    );

    const [pagination, setPagination] = useState<FPagination>({
        total: 0,
        limit: 0,
        offset: 0,
    });

    const totalPages = useMemo(() => {
        if (pagination.limit === 0) {
            return 0;
        }
        return Math.ceil(pagination.total / pagination.limit);
    }, [pagination.total, pagination.limit]);
    const currentPage = useMemo(() => {
        if (pagination.limit === 0) {
            return 0;
        }
        return Math.floor(pagination.offset / pagination.limit) + 1;
    }, [pagination.offset, pagination.limit]);

    const dateFilter = useMemo(() => {
        if (filterStartDate === undefined && filterEndDate === undefined) {
            return undefined;
        }
        const f: string[] = [];
        if (filterStartDate) {
            f.push(`>=${filterStartDate.toISOString().split("T")[0]}`);
        }
        if (filterEndDate) {
            f.push(`<=${filterEndDate.toISOString().split("T")[0]}`);
        }
        return f;
    }, [filterStartDate, filterEndDate]);

    function changeSort(newSort: SortType) {
        setSort(newSort);
        if (keyword.length > 0) {
            search(currentPage);
        }
    }

    function search(page = 1) {
        const reqBody = {
            keyword: keyword,
            sort: sort,
            filter: {
                type: [2],
                nsfw: false,
                air_date: dateFilter,
            },
        };
        const offset = (page - 1) * pagination.limit;

        setLoading(true);
        fetch(`https://api.bgm.tv/v0/search/subjects?offset=${offset}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setPagination({
                    total: data.total,
                    limit: data.limit,
                    offset: data.offset,
                });
                setData(data.data);
            })
            .finally(() => {
                setLoading(false);
                // scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            });
    }

    return (
        <div className="flex flex-col items-center justify-start md:px-[300px] h-screen">
            <div className="flex flex-row my-4 w-full gap-2">
                <Input
                    type="text"
                    placeholder="搜索..."
                    className="w-full"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            search();
                        }
                    }}
                    disabled={loading}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => search()}
                    disabled={loading}
                >
                    <Search />
                </Button>
            </div>
            <div className="flex flex-row gap-2 w-full justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <ArrowDownNarrowWide />
                            {sortMenu[sort]}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            {Object.entries(sortMenu).map(([key, value]) => (
                                <DropdownMenuItem
                                    key={key}
                                    onClick={() => changeSort(key as SortType)}
                                    className="hover:cursor-pointer"
                                >
                                    {value}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Popover>
                    <PopoverTrigger asChild>
                        {dateFilter ? (
                            <Button variant="outline">
                                <CalendarCheck2 />
                                {dateFilter
                                    .map((d) => d.split("=")[1])
                                    .join(" ~ ")}
                            </Button>
                        ) : (
                            <Button variant="outline">
                                <CalendarIcon />
                                日期
                            </Button>
                        )}
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2 items-center justify-between">
                                <p>从</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-2/3"
                                        >
                                            {filterStartDate
                                                ? filterStartDate
                                                      .toISOString()
                                                      .split("T")[0]
                                                : "None"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={filterStartDate}
                                            onSelect={setFilterStartDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-row gap-2 items-center justify-between">
                                <p>至</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-2/3"
                                        >
                                            {filterEndDate
                                                ? filterEndDate
                                                      .toISOString()
                                                      .split("T")[0]
                                                : "None"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={filterEndDate}
                                            onSelect={setFilterEndDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col items-start w-full">
                {data.map((amime) => (
                    <SearchAnimeItem key={amime.id} anime={amime} />
                ))}
                {totalPages > 1 && (
                    <div className="w-full flex justify-center mb-4">
                        <Pagination>
                            <PaginationContent>
                                {currentPage > 1 && (
                                    <>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                className="hover:cursor-pointer"
                                                onClick={() => {
                                                    search(currentPage - 1);
                                                }}
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink className="hover:cursor-pointer">
                                                {currentPage - 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}
                                <PaginationItem>
                                    <PaginationLink
                                        isActive
                                        className="hover:cursor-pointer"
                                    >
                                        {currentPage}
                                    </PaginationLink>
                                </PaginationItem>
                                {currentPage < totalPages && (
                                    <>
                                        <PaginationItem>
                                            <PaginationLink
                                                className="hover:cursor-pointer"
                                                onClick={() => {
                                                    search(currentPage + 1);
                                                }}
                                            >
                                                {currentPage + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                        {currentPage < totalPages - 1 && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationNext
                                                className="hover:cursor-pointer"
                                                onClick={() => {
                                                    search(currentPage + 1);
                                                }}
                                            />
                                        </PaginationItem>
                                    </>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}
