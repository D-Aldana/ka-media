import { ViewTransition } from "react";

type Props = {
  /** The card's identity, so the browser can follow it between slots. */
  name: string;
  /** Position in the grid, which on a wide screen is also its column. */
  index: number;
  children: React.ReactNode;
};

/** Columns deal in one after another; past the fourth the wait stops growing. */
function column(index: number): number {
  return index % 4;
}

/**
 * Wraps a Work card so a filter re-sorts the sheet rather than cutting to a
 * new one: a card that still matches slides to its new slot, one that no
 * longer does pulls out of focus, and one joining comes into focus in its
 * place. `globals.css` holds the moves.
 *
 * Everything is keyed to the `nav-filter` type the chips carry, so the cards
 * stay out of the way of navigations that leave the page — on those the cover
 * inside is the thing that animates, flying into the story it opens.
 */
export function CardSwap({ name, index, children }: Props) {
  return (
    <ViewTransition
      name={name}
      update={{ "nav-filter": "card-move", default: "none" }}
      enter={{ "nav-filter": `card-in card-in-${column(index)}`, default: "none" }}
      exit={{ "nav-filter": "card-out", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
