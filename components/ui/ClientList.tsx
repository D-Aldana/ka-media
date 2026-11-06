import { Fragment } from "react";

import { CLIENT_LINKS } from "@/lib/clientLinks";

/** Renders a "shot for" list, linking out any name found in `CLIENT_LINKS`. */
export function ClientList({ clients }: { clients: string[] }) {
  return (
    <span>
      {clients.map((client, index) => {
        const href = CLIENT_LINKS[client];
        return (
          <Fragment key={client}>
            {index > 0 && " · "}
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {client}
              </a>
            ) : (
              client
            )}
          </Fragment>
        );
      })}
    </span>
  );
}
