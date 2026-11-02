import { Fragment } from "react";

const MAY_CONTAIN = "gluten, milk, sesame and egg";

// Bolds the allergens in the "packed in a facility which also handles…" sentence.
export function withAllergens(text: string) {
  const parts = text.split(MAY_CONTAIN);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <>
          <strong className="font-semibold">gluten</strong>, <strong className="font-semibold">milk</strong>,{" "}
          <strong className="font-semibold">sesame</strong> and <strong className="font-semibold">egg</strong>
        </>
      )}
    </Fragment>
  ));
}
