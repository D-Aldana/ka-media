/**
 * The Studio gets its own root layout: no site header, footer, fonts or
 * globals.css, and no settings fetch. Its own CSS owns the whole viewport.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
