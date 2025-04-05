export default function SidebarMenuItem(props: {
    title: string;
    num: number;
    selected?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            className={`flex items-center justify-between p-2 hover:cursor-pointer ${
                props.selected ? "bg-gray-200" : "hover:bg-gray-100"
            } rounded-md transition-colors duration-200 ease-in-out ${
                props.selected ? "text-gray-900" : "text-gray-600"
            }`}
            onClick={props.onClick}
        >
            <span className="text-sm">{props.title}</span>
            <span className="text-xs text-gray-500">{props.num}</span>
        </div>
    );
}
