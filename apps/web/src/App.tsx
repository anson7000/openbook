import { useState } from "react";

function App() {
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    const baseUrl = import.meta.env.API_URL;
    const response = await fetch(`${baseUrl}/api/data`);
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Hello, World! web</h1>
      <button onClick={handleClick}>Click me</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
