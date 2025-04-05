import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

interface FPagination {
    total: number;
    limit: number;
    offset: number;
}

export default function Page() {
    const [sort, setSort] = useState("match");
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Anime[]>([]);

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

    function search(page = 1) {
        const reqBody = {
            keyword: keyword,
            sort: sort,
            filter: {
                type: [2],
                nsfw: false,
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
                    placeholder="Search..."
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
