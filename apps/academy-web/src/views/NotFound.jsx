import React from "react";
import { Card } from "../ui/components/Card.jsx";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <Card title="Not found">
      <p className="text-zinc-300">That page doesn’t exist.</p>
      <Link to="/" className="mt-3 inline-block text-sm text-zinc-200 underline underline-offset-4">Back home</Link>
    </Card>
  );
}
