import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const moods = [
    "Fine",
    "Not Fine",
    "Productive",
    "Exhausted",
    "Romantic",
    "Unmotivated",
    "Peaceful",
    "Overthinking",
    "Inspired"
  ];

  useEffect(() => {
    fetchEntries();
    fetchEmojis();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select(`
        *,
        emojis ( symbol )
      `)
      .order("created_at", { ascending: false });

    setEntries(data || []);
  };

  const fetchEmojis = async () => {
    const { data } = await supabase.from("emojis").select("*");
    setEmojis(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await supabase.from("journal_entries").insert([
      {
        mood: selectedMood,
        description,
        emoji_id: selectedEmoji
      }
    ]);

    setSelectedMood("");
    setDescription("");
    setSelectedEmoji(null);
    fetchEntries();
  };

  return (
    <div className="app-container">

      <div className="glass-wrapper">

        <h1 className="hero-title">
          MEMORY ARCHIVE
        </h1>

        <form className="journal-form" onSubmit={handleSubmit}>

          <label>How was your day?</label>
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            required
          >
            <option value="">Select one</option>
            {moods.map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>

          <label>Describe your day</label>
          <textarea
            placeholder="Write something cinematic..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="emoji-grid">
            {emojis.map((emoji) => (
              <span
                key={emoji.id}
                className={`emoji-item ${selectedEmoji === emoji.id ? "active" : ""}`}
                onClick={() => setSelectedEmoji(emoji.id)}
              >
                {emoji.symbol}
              </span>
            ))}
          </div>

          <button type="submit">Save Memory</button>
        </form>

        <div className="entries-grid">
          {entries.map((entry) => (
            <div key={entry.id} className="memory-card">
              <div className="card-top">
                <span className="emoji-display">
                  {entry.emojis?.symbol}
                </span>
                <span className="timestamp">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </div>
              <h3>{entry.mood}</h3>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>

      </div>

      <button
        className="theme-switch"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀" : "🌙"}
      </button>

    </div>
  );
}

export default App;