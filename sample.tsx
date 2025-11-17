import React, { useEffect, useState } from "react";

interface MyCounterProps {
  initialValue?: number;
  step?: number;
  onChange?: (value: number) => void;
  fetchInitialValue?: () => Promise<number>;
}

const MyCounter: React.FC<MyCounterProps> = ({
  initialValue = 0,
  step = 1,
  onChange,
  fetchInitialValue,
}) => {
  const [count, setCount] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial value asynchronously if provided
  useEffect(() => {
    if (!fetchInitialValue) return;

    setIsLoading(true);
    fetchInitialValue()
      .then((value) => {
        setCount(value);
        onChange?.(value);
      })
      .catch(() => {
        setError("Failed to fetch initial value");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchInitialValue]);

  const increment = () => {
    const newValue = count + step;
    setCount(newValue);
    onChange?.(newValue);
  };

  const decrement = () => {
    const newValue = count - step;
    setCount(newValue);
    onChange?.(newValue);
  };

  if (isLoading) return <div data-testid="loader">Loading...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  return (
    <div>
      <h2 data-testid="count">{count}</h2>

      <button data-testid="increment" onClick={increment}>
        Increment
      </button>

      <button data-testid="decrement" onClick={decrement}>
        Decrement
      </button>
    </div>
  );
};

export default MyCounter;
