"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EyeMark } from "@/components/StringArt";

// Landing page after the email confirmation link. Supabase verifies the token
// server-side before redirecting here, so by the time this page loads the email
// is confirmed in the backend. We surface any error the link carried, otherwise
// confirm success and send the user to sign in.
export default function ConfirmPage() {
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const err =
      hash.get("error_description") ||
      query.get("error_description") ||
      hash.get("error") ||
      query.get("error");
    if (err) setError(err.replace(/\+/g, " "));
    setReady(true);
  }, []);

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-5 py-20 text-center">
      <EyeMark className="mb-6 h-10 w-10" />

      {!ready ? (
        <p className="text-sm text-text-2">Confirming…</p>
      ) : error ? (
        <>
          <h1 className="display mb-2 text-xl text-white">Link didn&apos;t work</h1>
          <p className="mb-8 text-sm text-text-2">
            {error}. The link may have expired. Create your account again to get a fresh one.
          </p>
          <Link href="/login/" className="btn-primary">
            Back to sign up
          </Link>
        </>
      ) : (
        <>
          <h1 className="display mb-2 text-xl text-white">Account confirmed</h1>
          <p className="mb-8 text-sm text-text-2">
            Your email is verified and your account is ready. Sign in to start learning.
          </p>
          <Link href="/login/" className="btn-primary">
            Go to sign in
          </Link>
        </>
      )}
    </div>
  );
}
