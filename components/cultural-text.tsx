import { Fragment } from "react";

export default function CulturalText({
  children,
  dark = false,
}: {
  children: string;
  dark?: boolean;
}) {
  return children.split(/(Vietnamese)/gi).map((part, index) =>
    /^Vietnamese$/i.test(part) ? (
      <span
        key={index}
        className={
          dark ? "culture-keyword culture-keyword-light" : "culture-keyword"
        }
      >
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
