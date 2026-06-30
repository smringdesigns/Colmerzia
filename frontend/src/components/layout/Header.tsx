export default function Header() {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

            <input
                placeholder="Buscar..."
                className="border rounded-lg px-4 py-2 w-64"
            />

            <div className="font-semibold">
                Admin
            </div>

        </header>
    );
}