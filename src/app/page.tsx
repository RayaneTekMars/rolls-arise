'use client';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.scss';

type Results = {
  Player: number;
  S: number;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
};

export default function Home() {
  const [result, setResult] = useState<string>('');
  const [simulatedResults, setSimulatedResults] = useState<Results>({
    Player: 0,
    S: 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  });
  const [rolling, setRolling] = useState<boolean>(false);

  const probabilities = [
    { name: 'Player', probability: 0.0000001 },
    { name: 'S', probability: 0.0005 },
    { name: 'A', probability: 0.0195 },
    { name: 'B', probability: 0.08 },
    { name: 'C', probability: 0.20 },
    { name: 'D', probability: 0.30 },
    { name: 'E', probability: 0.40 }
  ];

  const items = probabilities.map(prob => prob.name);

  const roll = (): string => {
    let rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i].probability;
      if (rand < cumulative) {
        return probabilities[i].name;
      }
    }
    return 'E'; // default fallback, should never reach here
  };

  const handleRoll = () => {
    setRolling(true);
    const rolledResult = roll();
    const targetIndex = items.indexOf(rolledResult);
    const totalItems = items.length;
    const spinCount = 15;
    const duration = 3000;

    const rollBox = document.getElementById('rollBox');
    if (rollBox) {
      rollBox.style.animation = 'none'; // Stop infinite animation during roll
      rollBox.style.transition = 'none';
      rollBox.style.transform = 'translateX(0px)';

      setTimeout(() => {
        rollBox.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
        const finalPosition = -(targetIndex + spinCount * totalItems) * 120 + 360 - 60;
        rollBox.style.transform = `translateX(${finalPosition}px)`;
      }, 20);
    }

    setTimeout(() => {
      setResult(rolledResult);
      setRolling(false);
      if (rollBox) {
        rollBox.style.animation = 'scroll 20s linear infinite'; // Resume infinite animation
      }
    }, duration + 100);
  };

  const handleSimulateRolls = (numRolls: number) => {
    const results: Results = { Player: 0, S: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };
    for (let i = 0; i < numRolls; i++) {
      const rolledResult = roll();
      if (rolledResult in results) {
        results[rolledResult as keyof Results]++;
      }
    }
    setSimulatedResults(results);
  };

  return (
    <div className={styles.theme}>
      <div className={styles.container}>
        <h1>Arise - Rank Rolls</h1>
        <div className={styles.rollContainer}>
          <div className={styles.highlight}></div>
          <div className={styles.rollBox} id="rollBox">
            {Array(50)
              .fill(items)
              .flat()
              .map((item, index) => (
                <div
                  className={`${styles.item} ${styles[item]}`}
                  key={index}
                >
                  {item}
                </div>
              ))}
          </div>
        </div>
        <button onClick={handleRoll} disabled={rolling}>
          Roll
        </button>
        {result && (
          <p className={styles.result}>Vous avez obtenu : {result}</p>
        )}
        <div className={styles.simulation}>
          <input
            type="number"
            id="numRolls"
            name="numRolls"
            min="1"
            placeholder="Number of rolls"
          />
          <button onClick={() => {
            const numRollsInput = document.getElementById('numRolls') as HTMLInputElement;
            if (numRollsInput) {
              const numRolls = Number(numRollsInput.value);
              if (!isNaN(numRolls) && numRolls > 0) {
                handleSimulateRolls(numRolls);
              }
            }
          }}>
            Simulate Rolls
          </button>
        </div>
        {Object.keys(simulatedResults).length > 0 && (
          <div className={styles.results}>
            <h2>Simulation Results:</h2>
            {Object.entries(simulatedResults).map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
