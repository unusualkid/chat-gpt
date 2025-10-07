import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingJoke, setLoadingJoke] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setExplanation(null);

    try {
      const res = await fetch(`http://localhost:8080/grammar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setResult(data.correction);
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoke() {
    setLoadingJoke(true);
    setJoke(null);

    try {
      const res = await fetch(`http://localhost:8080/`);
      const data = await res.json();
      const jokeText = data.response || data["response: "] || "No joke found.";
      setJoke(jokeText);
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke("Failed to fetch a joke 😢");
    } finally {
      setLoadingJoke(false);
    }
  }

  return (
    <div className="app-container">
      {/* --- Grammar Card --- */}
      <div className="app-card">
        <h1 className="app-title">Lingoda AI Grammar Helper</h1>
        <form onSubmit={handleSubmit} className="app-form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a sentence"
            className="app-input"
          />
          <button type="submit" className="app-button" disabled={loading}>
            {loading ? "Checking..." : "Check"}
          </button>
        </form>

        {loading && <div className="loading">⏳ Checking grammar...</div>}

        {result && (
          <div className="result-box">
            <p>
              <b>✅ Corrected:</b> {result}
            </p>
            <p>
              <b>💬 Explanation:</b> {explanation}
            </p>
          </div>
        )}
      </div>

      {/* --- Joke Card --- */}
      <div className="app-card app-card-joke">
        <h2 className="app-title">AI Joke Generator 🤖</h2>

        <button
          onClick={handleJoke}
          className="app-button app-button-green"
          disabled={loadingJoke}
        >
          {loadingJoke ? "Loading joke..." : "Tell me a joke!"}
        </button>

        {loadingJoke && <div className="loading">🎭 Fetching a joke...</div>}

        {joke && <div className="joke-box">{joke}</div>}
      </div>
    </div>
  );
}

export default App;
