import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import "./App.css";

const emotions = [
  "Inspired",
  "Soft",
  "Romantic",
  "Overwhelmed",
  "Grateful",
  "Dreamy",
];

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
      <motion.h1
        className="hero"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        Your Everyday Record
      </motion.h1>

      <form className="journal-box" onSubmit={handleSubmit}>
        <select
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
          required
        >
          <option value="">Select Mood</option>
          {emotions.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <textarea
          placeholder="Write about your day like it's a Pinterest caption..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Save Memory</button>
      </form>

      <Masonry
        breakpointCols={{ default: 3, 900: 2, 600: 1 }}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            className="entry-card"
            whileHover={{ scale: 1.03 }}
          >
            <span className="mood-tag">{entry.emotion}</span>
            <p>{entry.description}</p>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
}

export default App;