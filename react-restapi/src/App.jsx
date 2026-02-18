import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import "./App.css";

function App() {
  const [emotion, setEmotion] = useState("");
  const [description, setDescription] = useState("");
  const [energy, setEnergy] = useState(5);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setEntries(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("journal_entries").insert([
      {
        emotion_summary: emotion,
        description,
        energy_level: energy,
      },
    ]);

    if (!error) {
      setEmotion("");
      setDescription("");
      setEnergy(5);
      fetchEntries();
    }
  };

  const handleDelete = async (id) => {
    await supabase.from("journal_entries").delete().eq("id", id);
    fetchEntries();
  };

  return (
    <div className="container">
      <h1 className="title">✨ YOUR EVERYDAY RECORD ✨</h1>

      <form onSubmit={handleSubmit} className="journal-form">
        <input
          type="text"
          placeholder="Emotion (Happy, Sad, Excited...)"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          required
        />

        <textarea
          placeholder="Describe your experience today..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Energy Level: {energy}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
        />

        <button type="submit">Save Entry</button>
      </form>

      <div className="entries">
        {entries.map((entry) => (
          <div key={entry.id} className="entry-card">
            <h3>{entry.emotion_summary}</h3>
            <p>{entry.description}</p>
            <small>Energy: {entry.energy_level}</small>
            <button onClick={() => handleDelete(entry.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;