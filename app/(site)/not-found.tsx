import { PageTransition } from "@/components/site/PageTransition";
import { NotFound as NotFoundView } from "@/components/site/NotFound";

/** Catches notFound() thrown inside the site group, with the chrome intact. */
export default function NotFound() {
  return (
    <PageTransition>
      <NotFoundView blurb="The game may have been taken down, or the link may be wrong." />
    </PageTransition>
  );
}
