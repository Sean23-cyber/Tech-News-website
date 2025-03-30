"use client";
import { useEffect, useState } from "react";

export default function Home() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/api/news")
            .then(res => res.json())
            .then(data => setNews(data));
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-blue-400 border-b-2 border-blue-400 pb-2">Latest Tech News</h1>
            <div className="mt-6 w-full max-w-4xl grid gap-6">
                {news.map(item => (
                    <div key={item.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-2xl transition duration-300">
                        <h2 className="text-2xl font-semibold text-blue-300">{item.title}</h2>
                        <p className="text-sm text-gray-400 mt-1">Category: <span className="font-medium text-yellow-400">{item.category}</span></p>
                        <p className="mt-3 text-gray-300 leading-relaxed">{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
