'use client';
import { useState } from 'react';
import styles from '../styles/Home.module.scss';

export default function Home() {
  const [result, setResult] = useState('');
  const [simulatedResults, setSimulatedResults] = useState({});
  const [rolling, setRolling] = useState(false);

  const probabilities = [
    { name: 'Player', probability: 0.00001 },
    { name: 'S', probability: 0.0005 },
    { name: 'A', probability: 0.0195 },
    { name: 'B', probability: 0.08 },
    { name: 'C', probability: 0.20 },
    { name: 'D', probability: 0.30 },
    { name: 'E', probability: 0.40 }
  ];

  const letters = probabilities.map(prob => prob.name);

  const roll = () => {
    let rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i].probability;
      if (rand < cumulative) {
        return probabilities[i].name;
      }
    }
  };

  const handleRoll = () => {
    setRolling(true);
    const rolledResult = roll();
    const targetIndex = letters.indexOf(rolledResult);
    const totalLetters = letters.length;
    const spinCount = 5;
    const duration = 3000;

    const rollBox = document.getElementById('rollBox');
    if (rollBox) {
      rollBox.style.transition = 'none';
      rollBox.style.transform = 'translateY(0px)';

      setTimeout(() => {
        rollBox.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
        const finalPosition = -(targetIndex + spinCount * totalLetters) * 120;
        rollBox.style.transform = `translateY(${finalPosition}px)`;
      }, 20);
    }

    setTimeout(() => {
      setResult(rolledResult);
      setRolling(false);
    }, duration + 100);
  };

  const handleSimulateRolls = (numRolls) => {
    const results = { Player: 0, S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };
    for (let i = 0; i < numRolls; i++) {
      const rolledResult = roll();
      if (results.hasOwnProperty(rolledResult)) {
        results[rolledResult]++;
      }
    }
    setSimulatedResults(results);
  };

  return (
    <div className={styles.theme}>
      <div className={styles.container}>
        <h1>Simulateur de Rolls - Arise</h1>
        <div className={styles.rollContainer}>
          <div className={styles.rollBox} id="rollBox">
            {Array(50)
              .fill(letters)
              .flat()
              .map((letter, index) => (
                <div
                  className={`${styles.letter} ${styles[letter]}`}
                  key={index}
                >
                  {letter}
                </div>
              ))}
          </div>
        </div>
        <button onClick={handleRoll} disabled={rolling}>
          Rouler
        </button>
        <div className={styles.simulation}>
          <input
            type="number"
            id="numRolls"
            name="numRolls"
            min="1"
            placeholder="Nombre de rouleaux"
          />
          <button onClick={() => handleSimulateRolls(Number(document.getElementById('numRolls').value))}>
            Simuler les Rouleaux
          </button>
        </div>
        {Object.keys(simulatedResults).length > 0 && (
          <div className={styles.results}>
            <h2>Résultats de la Simulation :</h2>
            {Object.entries(simulatedResults).map(([key, value]) => (
              <p key={key}>
                {key}: {String(value)}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
