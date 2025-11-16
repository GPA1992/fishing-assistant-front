"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <button>
        <Link
          href={"/planejamento/localizacao"}
          style={{
            display: "inline-block",
            width: 36,
            height: 36,
            lineHeight: "36px",
            textAlign: "center",
            borderRadius: "50%",
            border: "1px solid #ccc",
            textDecoration: "none",
          }}
        >
          Iniciar
        </Link>
      </button>
    </>
  );
}
