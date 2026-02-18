import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";

function App() {
  const [entries, setEntries] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setEntries(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("journal_entries").insert([
      { emotion, description },
    ]);

    if (!error) {
      setEmotion("");
      setDescription("");
      fetchEntries();
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Your Everyday Record</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mood"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Write about your day..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Save</button>
      </form>

      <hr />

      {entries.map((entry) => (
        <div key={entry.id}>
          <strong>{entry.emotion}</strong>
          <p>{entry.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;