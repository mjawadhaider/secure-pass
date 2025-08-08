import NavBar from "./NavBar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow p-4">{children}</main>
            <footer className="bg-gray-200 p-3 text-center text-sm text-gray-600">
                SecurePass © {new Date().getFullYear()}
            </footer>
        </div>
    );
}
