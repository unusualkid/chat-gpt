import { useState } from "react";
import "./App.css";

const flagMap = {
  de: "🇩🇪",
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  jp: "🇯🇵",
  tw: "🇹🇼",
};

function App() {
  const [grammarInput, setGrammarInput] = useState("");
  const [correction, setCorrection] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [joke, setJoke] = useState(null);
  const [translationInput, setTranslationInput] = useState("");
  const [translations, setTranslations] = useState(null);
  const [loadingGrammar, setLoadingGrammar] = useState(false);
  const [loadingJoke, setLoadingJoke] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [error, setError] = useState(null);

  async function handleGrammarSubmit(e) {
    e.preventDefault();
    setLoadingGrammar(true);
    setCorrection(null);
    setExplanation(null);

    try {
      const res = await fetch(`http://localhost:8080/grammar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: grammarInput }),
      });
      const data = await res.json();
      setCorrection(data.correction);
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error:", error);
      setCorrection("An error occurred.");
    } finally {
      setLoadingGrammar(false);
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
    setLoadingTranslation(true);
    setError(null);
    setTranslations(null);

    try {
      const res = await fetch("http://localhost:8080/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translationInput }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setTranslations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch translations.");
    } finally {
      setLoadingTranslation(false);
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
              value={grammarInput}
              onChange={(e) => setGrammarInput(e.target.value)}
              placeholder="Enter a sentence"
              className="app-input"
            />
            <button
              type="submit"
              className="app-button"
              disabled={loadingGrammar}
            >
              {loadingGrammar ? "Checking..." : "Check"}
            </button>
          </form>

          {loadingGrammar && (
            <div className="loading">⏳ Checking grammar...</div>
          )}

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
          <h2 className="app-title">Translation Wizard 🌍</h2>
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
              disabled={loadingTranslation}
            >
              {loadingTranslation ? "Translating..." : "Translate"}
            </button>
          </form>

          {loadingTranslation && (
            <div className="loading">⏳ Checking translations...</div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}

          {translations && (
            <div className="translation-result">
              {Object.entries(translations).map(([code, item]) => (
                <div key={code} className="translation-block">
                  <div className="translation-header"></div>
                  <p className="translation-text">
                    <span className="translation-flag">{flagMap[code]} </span>
                    {item.translation}
                  </p>
                  <ul className="translation-examples">
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
