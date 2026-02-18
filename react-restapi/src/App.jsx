import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    setEntries(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await supabase.from("journal_entries").insert([
      { emotion, description },
    ]);

    setEmotion("");
    setDescription("");
    fetchEntries();
  };

  return (
    <div className="wrapper">
      <h1 className="hero">Your Everyday Record</h1>

      <form className="journal-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mood..."
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          required
        />

        <textarea
          placeholder="Write about your day..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Save Memory</button>
      </form>

      <div className="grid">
        {entries.map((entry) => (
          <div key={entry.id} className="card">
            <span className="tag">{entry.emotion}</span>
            <p>{entry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;