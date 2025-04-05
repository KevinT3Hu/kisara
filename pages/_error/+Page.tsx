import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

export default function Page() {
    const pageContext = usePageContext();

    const { abortReason, abortStatusCode } = pageContext;

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {pageContext.is404 ? (
                <div>
                    <Card className="w-[400px] p-4">
                        <CardHeader>
                            <h1 className="text-2xl font-bold">404</h1>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Page not found</p>
                            <p className="text-gray-500">
                                The page you are looking for does not exist.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    navigate("/");
                                }}
                            >
                                Go To Home
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            ) : (
                <div />
            )}
        </div>
    );
}
