import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

// CalculatorDemo.tsx
// Default export React component that demonstrates a basic calculator
// plus a suite of predefined "use cases" (test inputs) and shows
// actual vs expected results so you can examine good/bad cases.

// Notes:
// - Tailwind classes are used for styling (no import required)
// - Uses a small, safe evaluator that only allows digits, operators, parens and dots
// - Shows a history, example cases, and a pass/fail badge for each case

const SAFE_EXPR_RE = /^[0-9+\-*/().\s]+$/;

function safeEvaluate(expr: string): { value?: number; error?: string } {
  const trimmed = expr.trim();
  if (!trimmed) return { error: 'Empty expression' };
  if (!SAFE_EXPR_RE.test(trimmed)) return { error: 'Invalid characters detected' };

  try {
    // Basic safety: disallow consecutive operators like `**` or `//` (not allowed by our intent)
    if (/\*\*|\/\//.test(trimmed)) return { error: 'Unsupported operator sequence' };

    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${trimmed});`);
    const raw = fn();

    if (typeof raw !== 'number' || !isFinite(raw)) return { error: 'Result is not a finite number' };

    // Limit precision to avoid floating noise
    const value = Math.round(raw * 1e10) / 1e10;
    return { value };
  } catch (err) {
    return { error: 'Evaluation error' };
  }
}

type UseCase = {
  id: string;
  input: string;
  expected: number | string; // number for numeric expected, string for expected error
};

const PRESET_CASES: UseCase[] = [
  { id: 'c1', input: '1+2', expected: 3 },
  { id: 'c2', input: '10 - 4 * 2', expected: 2 },
  { id: 'c3', input: '(2+3) * 4', expected: 20 },
  { id: 'c4', input: '4/0', expected: 'Result is not a finite number' },
  { id: 'c5', input: '0.1 + 0.2', expected: 0.30000000000000004 },
  { id: 'c6', input: '1 / (2 - 2)', expected: 'Result is not a finite number' },
  { id: 'c7', input: '2**8', expected: 'Unsupported operator sequence' },
  { id: 'c8', input: '1000000000000 * 3000000000000', expected: 3000000000000000000000000000000 },
  { id: 'c9', input: 'abc + 1', expected: 'Invalid characters detected' },
  { id: 'c10', input: '', expected: 'Empty expression' },
];

export default function CalculatorDemo(): JSX.Element {
  const [expr, setExpr] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ expr: string; result?: number; error?: string }>>([]);

  function runExpression(input: string) {
    const { value, error } = safeEvaluate(input);
    if (error) {
      setResult(null);
      setError(error);
      setHistory(prev => [{ expr: input, error }, ...prev].slice(0, 20));
    } else {
      setResult(value ?? null);
      setError(null);
      setHistory(prev => [{ expr: input, result: value }, ...prev].slice(0, 20));
    }
  }

  function onClickButton(val: string) {
    setExpr(prev => prev + val);
  }

  function onClear() {
    setExpr('');
    setResult(null);
    setError(null);
  }

  function runPresetCase(useCase: UseCase) {
    setExpr(useCase.input);
    const res = safeEvaluate(useCase.input);
    if (res.error) {
      setResult(null);
      setError(res.error);
      setHistory(prev => [{ expr: useCase.input, error: res.error }, ...prev].slice(0, 20));
    } else {
      setResult(res.value ?? null);
      setError(null);
      setHistory(prev => [{ expr: useCase.input, result: res.value }, ...prev].slice(0, 20));
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-4"
      >
        Calculator Demo — Use Cases & Results
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calculator UI */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow p-4">
          <div className="mb-3">
            <label className="block text-sm text-slate-500">Expression</label>
            <input
              className="w-full p-3 border rounded mt-1 text-lg font-mono"
              value={expr}
              onChange={e => setExpr(e.target.value)}
              placeholder="Type an expression like (2+3)*4 or use buttons"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {['7', '8', '9', '/'].map(v => (
              <button key={v} onClick={() => onClickButton(v)} className="p-3 rounded-lg shadow-sm hover:shadow-md">
                {v}
              </button>
            ))}
            {['4', '5', '6', '*'].map(v => (
              <button key={v} onClick={() => onClickButton(v)} className="p-3 rounded-lg shadow-sm hover:shadow-md">
                {v}
              </button>
            ))}
            {['1', '2', '3', '-'].map(v => (
              <button key={v} onClick={() => onClickButton(v)} className="p-3 rounded-lg shadow-sm hover:shadow-md">
                {v}
              </button>
            ))}
            {['0', '.', '(', ')'].map(v => (
              <button key={v} onClick={() => onClickButton(v)} className="p-3 rounded-lg shadow-sm hover:shadow-md">
                {v}
              </button>
            ))}

            <button onClick={() => onClickButton('+')} className="col-span-2 p-3 rounded-lg shadow-sm hover:shadow-md">
              +
            </button>
            <button onClick={() => runExpression(expr)} className="col-span-1 p-3 rounded-lg bg-slate-800 text-white">
              =
            </button>
            <button onClick={onClear} className="col-span-1 p-3 rounded-lg bg-rose-500 text-white">
              C
            </button>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Result</div>
                <div className="text-xl font-mono">
                  {error ? <span className="text-rose-600">{error}</span> : result !== null ? result : '—'}
                </div>
              </div>

              <div className="text-right text-sm text-slate-500">
                <div>History (recent)</div>
                <div className="mt-2">
                  {history.slice(0, 3).map((h, i) => (
                    <div key={i} className="text-xs font-mono">
                      {h.expr} = {h.error ?? h.result}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Panel */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Preset Use Cases</h2>

          <div className="space-y-2">
            {PRESET_CASES.map(uc => {
              // compute actual result to show pass/fail
              const res = safeEvaluate(uc.input);
              const passed = typeof uc.expected === 'number' ? (res.value === uc.expected) : (res.error === uc.expected);

              return (
                <div key={uc.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-mono">{uc.input || '<empty>'}</div>
                    <div className="text-xs text-slate-500">Expected: {String(uc.expected)}</div>
                    <div className="text-xs mt-1">Actual: {res.error ?? String(res.value)}</div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => runPresetCase(uc)} className="px-3 py-1 rounded bg-slate-100">
                      Run
                    </button>

                    <div className="flex items-center gap-1">
                      {passed ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check size={16} /> <span className="text-sm">Pass</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-600">
                          <X size={16} /> <span className="text-sm">Fail</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-xs text-slate-500">
            <strong>Notes:</strong>
            <ul className="list-disc ml-5">
              <li>We intentionally limit allowed characters — this avoids arbitrary code execution.</li>
              <li>Edge cases: division by zero and very large numbers may be shown as errors or non-finite.</li>
              <li>Floating point quirks (e.g. 0.1 + 0.2) are expected due to IEEE-754 precision.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">How to use for testing</h3>
        <ol className="list-decimal ml-5 text-sm space-y-1">
          <li>Click any preset "Run" to execute and compare actual vs expected.</li>
          <li>Modify the expression in the input and press <code>=</code> to evaluate manually.</li>
          <li>Use the history to quickly re-run recent expressions.</li>
        </ol>
      </div>
    </div>
  );
}
