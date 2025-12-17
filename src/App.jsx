import { useEffect, useState } from "react";

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_FOOD = [5, 5];
const INITIAL_DIRECTION = [0, -1];

export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [speed, setSpeed] = useState(200);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") setDirection([0, -1]);
      if (e.key === "ArrowDown") setDirection([0, 1]);
      if (e.key === "ArrowLeft") setDirection([-1, 0]);
      if (e.key === "ArrowRight") setDirection([1, 0]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(interval);
  }, [snake, direction]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];
    const newHead = [head[0] + direction[0], head[1] + direction[1]];

    // Collision with walls
    if (
      newHead[0] < 0 ||
      newHead[1] < 0 ||
      newHead[0] >= BOARD_SIZE ||
      newHead[1] >= BOARD_SIZE
    ) {
      setGameOver(true);
      return;
    }

    // Collision with self
    for (let part of newSnake) {
      if (part[0] === newHead[0] && part[1] === newHead[1]) {
        setGameOver(true);
        return;
      }
    }

    newSnake.push(newHead);

    // Eat food
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood([
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ]);
      setScore(score + 1);
      setSpeed(speed - 5); // increase speed
    } else {
      newSnake.shift();
    }

    setSnake(newSnake);
  };

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setSpeed(200);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <h1>🐍 Snake Game</h1>
      <h2>Score: {score}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
          margin: "20px auto",
          width: "fit-content",
        }}
      >
        {[...Array(BOARD_SIZE)].map((_, y) =>
          [...Array(BOARD_SIZE)].map((_, x) => {
            const isSnake = snake.some(
              (s) => s[0] === x && s[1] === y
            );
            const isFood = food[0] === x && food[1] === y;

            return (
              <div
                key={`${x}-${y}`}
                style={{
                  width: 20,
                  height: 20,
                  border: "1px solid #222",
                  background: isSnake ? "lime" : isFood ? "red" : "#111",
                }}
              ></div>
            );
          })
        )}
      </div>

      {/* Game Over overlay with Restart button */}
      {gameOver && (
        <div style={{ marginTop: "20px" }}>
          <h2>Game Over</h2>
          <button
            onClick={resetGame}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
