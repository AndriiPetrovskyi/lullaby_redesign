import { useEffect, useId, useRef, useState } from "react";
import "./Select.css";

// A styled replacement for <select>, whose open list browsers draw in their
// own look. Behaves like one: arrows / Home / End / Enter / Esc, type-ahead,
// and form `required` validation via a hidden input.
function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select…",
  required = false,
  autoComplete,
}) {
  const listId = useId();
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const typed = useRef({ text: "", timer: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));

  const select = (index) => {
    const option = options[index];
    if (!option) return;
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  const open = () => {
    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  const jumpToTyped = (char) => {
    clearTimeout(typed.current.timer);
    typed.current.text += char.toLowerCase();
    typed.current.timer = setTimeout(() => (typed.current.text = ""), 600);
    const match = options.findIndex((o) =>
      o.label.toLowerCase().startsWith(typed.current.text),
    );
    if (match === -1) return;
    if (isOpen) setActiveIndex(match);
    else select(match);
  };

  const onKeyDown = (event) => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) return open();
        setActiveIndex((i) =>
          event.key === "ArrowDown" ? Math.min(i + 1, last) : Math.max(i - 1, 0),
        );
        return;
      case "Home":
      case "End":
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(event.key === "Home" ? 0 : last);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) select(activeIndex);
        else open();
        return;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        return;
      case "Tab":
        setIsOpen(false);
        return;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          jumpToTyped(event.key);
        }
    }
  };

  const selected = options[selectedIndex];

  return (
    <div className="ui-select" ref={rootRef}>
      <button
        type="button"
        id={id}
        className={`ui-select-trigger${isOpen ? " ui-select-trigger--open" : ""}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={onKeyDown}>
        <span className={selected ? "" : "ui-select-placeholder"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className="ui-select-chevron" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>

      {/* Lets the browser's required-field check cover this control too. */}
      <input
        className="ui-select-validator"
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        value={value ?? ""}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => {
          const match = options.find(
            (o) => o.value === event.target.value || o.label === event.target.value,
          );
          if (match) onChange({ target: { name, value: match.value } });
        }}
        onFocus={() => document.getElementById(id)?.focus()}
      />

      {isOpen && (
        <ul className="ui-select-list" role="listbox" id={listId} ref={listRef} tabIndex={-1}>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              data-index={index}
              role="option"
              aria-selected={index === selectedIndex}
              className={[
                "ui-select-option",
                index === activeIndex && "ui-select-option--active",
                index === selectedIndex && "ui-select-option--selected",
              ]
                .filter(Boolean)
                .join(" ")}
              onPointerEnter={() => setActiveIndex(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => select(index)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
