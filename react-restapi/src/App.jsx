import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

const emotions = [
  { label: "Focused", color: "#7F5AF0" },
  { label: "Happy", color: "#2CB67D" },
  { label: "Calm", color: "#3DA9FC" },
  { label: "Tired", color: "#F4A261" },
  { label: "Anxious", color: "#EF4565" },
];

function App() {
  const [entries, setEntries] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [description, setDescription] = useState("");
  const [energy, setEnergy] = useState(5);

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
      { emotion, description, energy_level: energy },
    ]);

    setEmotion("");
    setDescription("");
    setEnergy(5);
    fetchEntries();
  };

  return (
    <div className="wrapper">
      <motion.h1
        className="hero"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        YOUR EVERYDAY RECORD
      </motion.h1>

      <motion.form
        className="card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="emotion-grid">
          {emotions.map((e) => (
            <div
              key={e.label}
              className={`emotion-pill ${
                emotion === e.label ? "active" : ""
              }`}
              style={{ borderColor: e.color }}
              onClick={() => setEmotion(e.label)}
            >
              {e.label}
            </div>
          ))}
        </div>

        <textarea
          placeholder="What defined your day?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="energy">
          <span>Energy</span>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
          />
        </div>

        <button type="submit">Save Entry</button>
      </motion.form>

      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3>Energy Trends</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={entries}>
            <XAxis dataKey="emotion" />
            <Tooltip />
            <Area dataKey="energy_level" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="entries">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            className="entry"
            whileHover={{ scale: 1.03 }}
          >
            <strong>{entry.emotion}</strong>
            <p>{entry.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;