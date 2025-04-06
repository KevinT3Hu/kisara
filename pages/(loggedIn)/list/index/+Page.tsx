import { useData } from "vike-react/useData";
import type { Data } from "./+data";
import ListPage from "../ListPage";

export default function Page() {
    const lists = useData<Data>();

    return (
        <ListPage
            lists={lists}
            sidePanel={
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h1 className="text-xl text-gray-400">
                        在左边选择一个列表
                    </h1>
                </div>
            }
            middlePanel={<div />}
            rightPanel={<div />}
        />
    );
}
