import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./styles.css";

function delay(t, val) {
  return new Promise((resolve) => setTimeout(() => resolve(val), t));
}

const Button = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} className="trigger">
    {children}
  </button>
);

const Progress = ({ value }) => (
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: `${value}%` }}></div>
  </div>
);

export default function ProgressBoxes() {
  const [models, setModels] = useState([]);
  const [activeModels, setActiveModels] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      const mockApiResponse = await delay(1000, [
        { id: 1, delay: 1 },
        { id: 2, delay: 2 },
        { id: 3, delay: 5 },
        { id: 4, delay: 6 },
        { id: 5, delay: 10 },
        { id: 6, delay: 15 },
        { id: 7, delay: 20 },
        { id: 8, delay: 25 },
        { id: 9, delay: 30 },
        { id: 10, delay: 40 },
      ]);
      setModels(mockApiResponse.sort(() => Math.random() - 0.5));
    };
    fetchModels();
  }, []);

  const triggerAnimation = async () => {
    setActiveModels(new Set());
    setProgress(0);
    setRunning(true);

    await Promise.all(
      models.map((model) =>
        delay(model.delay * 1000, model.id).then((resolvedId) => {
          setActiveModels((prev) => new Set([...prev, resolvedId]));
          setProgress((prev) => Math.min(prev + 100 / models.length, 100));
        })
      )
    );

    setRunning(false);
  };

  return (
    <div className="container">
      <Button onClick={triggerAnimation} disabled={running}>
        Trigger
      </Button>
      <Progress value={progress} />
      <div className="button-container horizontal">
        {models.map((model) => (
          <motion.div
            key={model.id}
            className={`box ${activeModels.has(model.id) ? "green" : "red"}`}
            animate={{
              backgroundColor: activeModels.has(model.id) ? "green" : "gray",
            }}
          >
            {model.delay}s
          </motion.div>
        ))}
      </div>
    </div>
  );
}
