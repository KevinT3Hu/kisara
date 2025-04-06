import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver as zodRes } from "@hookform/resolvers/zod";
import { navigate } from "vike/client/router";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});

export default function Page() {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodRes(loginSchema),
        defaultValues: {
            password: "",
        },
        mode: "onBlur",
    });

    function onSubmit(data: z.infer<typeof loginSchema>) {
        fetch("/_auth/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                navigate("/");
            } else {
                form.setError("password", {
                    type: "manual",
                    message: "密码错误",
                });
            }
        });
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="w-96 lg:w-[500px]">
                <CardHeader>
                    <p className="text-6xl text-center">Kisara</p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>密码</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Password"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="w-full hover:cursor-pointer"
                                type="submit"
                            >
                                登录
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
