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

  const moods = ["Fine", "Not Fine", "Productive", "Exhausted", "Romantic", "Unmotivated", "Peaceful", "Overthinking", "Inspired"];

  useEffect(() => {
    fetchEntries();
    fetchEmojis();
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select(`*, emojis ( symbol )`)
      .order("created_at", { ascending: false });
    setEntries(data || []);
  };

  const fetchEmojis = async () => {
    const { data } = await supabase.from("emojis").select("*");
    setEmojis(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmoji) return alert("Please select an emoji to describe your day!");

    await supabase.from("journal_entries").insert([
      { mood: selectedMood, description, emoji_id: selectedEmoji }
    ]);

    setSelectedMood("");
    setDescription("");
    setSelectedEmoji(null);
    fetchEntries();
  };

  return (
    <div className="app-container">
      
      <header className="hero-header">
        <h1 className="hero-title">MEMORY ARCHIVE</h1>
        <p className="hero-subtitle">Chronicle your cinematic journey</p>
      </header>

      <main className="glass-wrapper">
        <form className="journal-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Your Vibe of the Day</label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              required
            >
              <option value="" disabled>Select Mood</option>
              {moods.map((mood) => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Your Story of the Day</label>
            <textarea
              placeholder="What made today cinematic?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Describe your day (Select an Emoji)</label>
            <div className="emoji-selector">
              {emojis.map((emoji) => (
                <span
                  key={emoji.id}
                  className={`emoji-btn ${selectedEmoji === emoji.id ? "active" : ""}`}
                  onClick={() => setSelectedEmoji(emoji.id)}
                >
                  {emoji.symbol}
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="save-btn">Capture Memory</button>
        </form>
      </main>

      {/* Theme Switcher Button */}
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