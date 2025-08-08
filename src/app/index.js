import NavBar from "../components/NavBar";

export default function Home() {
    const mockData = [
        { id: 1, title: "Google", username: "me@gmail.com" },
        { id: 2, title: "GitHub", username: "coder123" },
    ];

    return (
        <>
            <NavBar />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Saved Passwords</h2>
                <ul className="space-y-2">
                    {mockData.map((item) => (
                        <li key={item.id} className="bg-white p-3 rounded shadow flex justify-between">
                            <div>
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-gray-500">{item.username}</p>
                            </div>
                            <button className="bg-green-500 px-3 py-1 text-white rounded">View</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
