import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

const ApiTest = () => {
    const [data, setData] = useState<Todo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            setData(json);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>API Connection Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Testing FETCH request to <code>jsonplaceholder.typicode.com</code>
                    </p>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            Error: {error}
                        </div>
                    )}

                    {data && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </div>
                    )}

                    <Button
                        onClick={fetchData}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Fetching..." : "Test Connection"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ApiTest;
