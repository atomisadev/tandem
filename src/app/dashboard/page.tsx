import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return redirect("/login");
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground text-sm">
                        {session.user.name}
                    </span>
                    <Button variant="outline">Settings</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            System status and health.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">
                            Everything is running smoothly.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">No recent activity.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Team</CardTitle>
                        <CardDescription>
                            Manage your team members.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">Default Team</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
