import { NavigationBar } from "@/components/navigation/navigation-bar";

export default function Adminayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full">
            <NavigationBar>
                <main className="h-full">{children}</main>
            </NavigationBar>
        </div>
    );
}