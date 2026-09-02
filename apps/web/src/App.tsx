import { useState } from "react";

function App() {
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${baseUrl}/data`);
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Hello, World!</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Click me
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;
