import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [correction, setCorrection] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingJoke, setLoadingJoke] = useState(false);
  const [translationInput, setTranslationInput] = useState("");
  const [translations, setTranslations] = useState(null);
  const [error, setError] = useState(null);

  async function handleGrammarSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setCorrection(null);
    setExplanation(null);

    try {
      const res = await fetch(`http://localhost:8080/grammar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setCorrection(data.correction);
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error:", error);
      setCorrection("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleJokeSubmit() {
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

  async function handleTranslateSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTranslations(null);

    try {
      const res = await fetch("http://localhost:8080/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setTranslations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch translations.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <div className="left-column">
        {/* Grammar Card */}
        <div className="app-card app-card-grammar">
          <h1 className="app-title">Lingoda AI Grammar Police 👮</h1>
          <form onSubmit={handleGrammarSubmit} className="app-form">
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

          {correction && (
            <div className="result-box">
              <p>
                <b>✅ Corrected:</b> {correction}
              </p>
              <p>
                <b>💬 Explanation:</b> {explanation}
              </p>
            </div>
          )}
        </div>

        {/* Joke Card */}
        <div className="app-card app-card-joke">
          <h2 className="app-title">AI Joke Generator 🤖</h2>

          <div className="joke-button-container">
            <button
              onClick={handleJokeSubmit}
              className="app-button app-button-green"
              disabled={loadingJoke}
            >
              {loadingJoke ? "Loading joke..." : "Tell me a joke!"}
            </button>
          </div>

          {loadingJoke && <div className="loading">🎭 Fetching a joke...</div>}

          {joke && <div className="joke-box">{joke}</div>}
        </div>
      </div>

      {/* --- RIGHT COLUMN --- */}
      <div className="right-column">
        {/* Translation Card */}
        <div className="app-card app-card-translation">
          <h2 className="app-title">Translation Card 🌍</h2>
          <form onSubmit={handleTranslateSubmit} className="app-form">
            <input
              type="text"
              value={translationInput}
              onChange={(e) => setTranslationInput(e.target.value)}
              placeholder="Enter text to translate"
              className="app-input"
            />
            <button
              type="submit"
              className="app-button app-button-purple"
              disabled={loading}
            >
              {loading ? "Translating..." : "Translate"}
            </button>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {translations && (
            <div className="translation-result">
              {Object.entries(translations).map(([code, item]) => (
                <div key={code} className="translation-block">
                  <h4>
                    {item.language} ({code.toUpperCase()})
                  </h4>
                  <p>
                    <strong>Translation:</strong> {item.translation}
                  </p>
                  <ul>
                    {item.examples.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
