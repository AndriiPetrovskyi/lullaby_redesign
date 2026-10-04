const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function TruckIcon(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M3 6.5h11v9H3z" />
      <path d="M14 9.5h3.5l3 3v3h-6.5" />
      <circle cx="7" cy="17" r="1.8" />
      <circle cx="17" cy="17" r="1.8" />
    </svg>
  );
}

export function ReturnIcon(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M4 9h11a5 5 0 0 1 0 10H8" />
      <path d="M8 5 4 9l4 4" />
    </svg>
  );
}

export function HandHeartIcon(props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 11.5s-3.5-2.1-3.5-4.4A1.9 1.9 0 0 1 12 6a1.9 1.9 0 0 1 3.5 1.1c0 2.3-3.5 4.4-3.5 4.4z" />
      <path d="M3 14.5h3l3.2 1.2h3.3a1.3 1.3 0 0 1 0 2.6H9" />
      <path d="M12.5 18.3 18 16.5a1.5 1.5 0 0 1 1.7 2.2L18 20.5l-7.5 1-4.5-2.3H3" />
    </svg>
  );
}
