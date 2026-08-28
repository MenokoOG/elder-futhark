import React from "react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="card flex flex-col items-start gap-3 py-11">
      <span className="text-[44px] text-neutral-700">ᚺ</span>
      <div className="font-heading text-[27px]">Nothing here</div>
      <p className="m-0 leading-relaxed text-neutral-700">That page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back home</Link>
    </div>
  );
}
