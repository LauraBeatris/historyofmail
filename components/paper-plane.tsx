export function PaperPlane({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 62 L192 14 L120 108 L96 72 Z"
        fill="#000"
        stroke="#fdfdfd"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M8 62 L192 14 L96 72 Z" fill="#fdfdfd" fillOpacity="0.12" />
      <path
        d="M8 62 L96 72 L192 14"
        stroke="#fdfdfd"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M96 72 L104 96"
        stroke="#fdfdfd"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
