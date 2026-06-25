// TDD Mode — failing tests first (v3 Section 1.4).
//
// The user is handed a passing SPEC (tests) and a stub implementation that makes
// them FAIL, then writes code until they go green. This trains reading tests as
// a spec — exactly how take-homes are graded. Live tests use fireEvent for
// reliability in the in-browser runner.
//
// files = stub (red) · solution = reference implementation (green).
export const tddChallenges = [
  {
    id: 'tdd-counter',
    title: 'Counter',
    brief: 'Make the failing tests pass: a counter that starts at 0 with increment / decrement / reset buttons.',
    files: {
      '/Counter.js': `import { useState } from "react";

export default function Counter() {
  // 🟥 TODO: make the spec in Counter.test.js pass.
  return <div></div>;
}
`,
      '/Counter.test.js': `import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter";

test("starts at 0", () => {
  render(<Counter />);
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
});

test("increment / decrement / reset", () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole("button", { name: /increment/i }));
  fireEvent.click(screen.getByRole("button", { name: /increment/i }));
  expect(screen.getByText("Count: 2")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /decrement/i }));
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /reset/i }));
  expect(screen.getByText("Count: 0")).toBeInTheDocument();
});
`,
    },
    solution: {
      '/Counter.js': `import { useState } from "react";

export default function Counter() {
  const [n, setN] = useState(0);
  return (
    <div>
      <p>Count: {n}</p>
      <button onClick={() => setN((c) => c + 1)}>increment</button>
      <button onClick={() => setN((c) => c - 1)}>decrement</button>
      <button onClick={() => setN(0)}>reset</button>
    </div>
  );
}
`,
    },
  },
  {
    id: 'tdd-toggle',
    title: 'Toggle',
    brief: 'Make the tests pass: a button that toggles between "OFF" and "ON" and shows the current status.',
    files: {
      '/Toggle.js': `import { useState } from "react";

export default function Toggle() {
  // 🟥 TODO: make the spec pass.
  return <div></div>;
}
`,
      '/Toggle.test.js': `import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Toggle from "./Toggle";

test("starts OFF and flips on click", () => {
  render(<Toggle />);
  const btn = screen.getByRole("button");
  expect(btn).toHaveTextContent(/off/i);
  fireEvent.click(btn);
  expect(btn).toHaveTextContent(/on/i);
  fireEvent.click(btn);
  expect(btn).toHaveTextContent(/off/i);
});
`,
    },
    solution: {
      '/Toggle.js': `import { useState } from "react";

export default function Toggle() {
  const [on, setOn] = useState(false);
  return <button onClick={() => setOn((o) => !o)}>{on ? "ON" : "OFF"}</button>;
}
`,
    },
  },
  {
    id: 'tdd-validator',
    title: 'Form Validator',
    brief: 'Implement a pure validate(values) function so the spec passes: required email (must look like an email) and a password of at least 6 chars.',
    files: {
      '/validate.js': `// 🟥 TODO: return an errors object keyed by field; empty object means valid.
export function validate(values) {
  return {};
}
`,
      '/validate.test.js': `import { validate } from "./validate";

test("flags a missing/invalid email", () => {
  expect(validate({ email: "", password: "secret1" }).email).toMatch(/email/i);
  expect(validate({ email: "nope", password: "secret1" }).email).toMatch(/email/i);
});

test("flags a short password", () => {
  expect(validate({ email: "a@b.com", password: "123" }).password).toMatch(/6/);
});

test("valid input has no errors", () => {
  expect(validate({ email: "a@b.com", password: "secret1" })).toEqual({});
});
`,
    },
    solution: {
      '/validate.js': `export function validate(values) {
  const errors = {};
  if (!/\\S+@\\S+\\.\\S+/.test(values.email || "")) {
    errors.email = "Enter a valid email";
  }
  if ((values.password || "").length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}
`,
    },
  },
  {
    id: 'tdd-usetoggle',
    title: 'useToggle hook',
    brief: 'Implement a useToggle(initial) custom hook so the renderHook spec passes: returns [on, toggle].',
    files: {
      '/useToggle.js': `import { useState } from "react";

// 🟥 TODO: return [on, toggle] where toggle flips the boolean.
export function useToggle(initial = false) {
  return [initial, () => {}];
}
`,
      '/useToggle.test.js': `import { renderHook, act } from "@testing-library/react";
import { useToggle } from "./useToggle";

test("uses the initial value and toggles", () => {
  const { result } = renderHook(() => useToggle(true));
  expect(result.current[0]).toBe(true);
  act(() => result.current[1]());
  expect(result.current[0]).toBe(false);
  act(() => result.current[1]());
  expect(result.current[0]).toBe(true);
});
`,
    },
    solution: {
      '/useToggle.js': `import { useState, useCallback } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((o) => !o), []);
  return [on, toggle];
}
`,
    },
  },
]
