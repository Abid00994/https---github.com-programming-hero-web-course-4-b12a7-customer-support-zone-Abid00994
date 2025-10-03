## 1. What is JSX, and why is it used?

- JSX is a syntax extension for JS that looks like but is used inside react
- It makes code more readable and declarative .

- Lets you write UI elements in a familiar HTML-like structure inside JavaScript.

- Compiles down to React.createElement(), which creates React elements.

## 2. What is the difference between State and Props?

- Feature	Props  (Properties)	State  (Component’s Memory).

- Data passed from parent to child component	Data that is managed within the component.

- Immutable (cannot be changed by child)	Mutable (can be updated with setState / useState).

## 3. What is the useState hook, and how does it work?

- useState is a React Hook that lets functional components have state.

- It takes an initial value and returns an array with two items:
- The current state value.
- A function to update that value.

## 4. How can you share state between components in React?

- Move the state to the nearest common parent and pass it down via props.

- Useful for avoiding prop drilling (passing props through many layers).

- For large apps, libraries like Redux, Zustand, MobX, Recoil help manage global state.

## 5. How is event handling done in React?

- Events are written in camelCase (e.g., onClick, not onclick).

- Instead of a string, you pass a function as the event handler.

- React uses SyntheticEvent for cross-browser compatibility.



