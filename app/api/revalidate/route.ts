import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

type Payload = { tags?: string[] };

/**
 * Sanity calls this on publish so a change is live without a redeploy. The
 * webhook's projection sends the document type as the tag, matching the tags
 * `lib/content.ts` attaches to each query.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<Payload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      // Sanity's CDN lags the webhook by a moment; wait for it to catch up.
      true,
    );

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    if (!body?.tags?.length) {
      return new Response("Missing tags", { status: 400 });
    }

    body.tags.forEach((tag) => revalidateTag(tag));
    return NextResponse.json({ revalidated: body.tags });
  } catch (error) {
    // Nothing internal goes back to an unauthenticated caller.
    console.error("Revalidation failed", error);
    return new Response("Revalidation failed", { status: 500 });
  }
}
