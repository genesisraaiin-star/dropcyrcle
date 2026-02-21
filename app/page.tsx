"use client";

import React, { useMemo, useState } from "react";

type Mode = "artist" | "fan";
type Step = 1 | 2 | 3;

export default function Page() {
  const [mode, setMode] = useState<Mode>("artist");
  const [step, setStep] = useState<Step>(1);

  // Upload
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState<string>("");

  // Audience
  const [circle, setCircle] = useState("VIP 50");
  const [access, setAccess] = useState<"free" | "paid" | "members">("paid");
  const [price, setPrice] = useState("5");

  // Payout
  const [stripeConnected, setStripeConnected] = useState(false);

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(title.trim()) && Boolean(fileName);
    if (step === 2) return Boolean(circle.trim()) && (access !== "paid" || Number(price) > 0);
    if (step === 3) return stripeConnected;
    return false;
  }, [step, title, fileName, circle, access, price, stripeConnected]);

  const next = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight">DropCircle</h1>
          <p className="text-slate-600 text-lg">
            Private releases. Real feedback. Paid drops.
          </p>

          {/* Mode toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setMode("artist")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                mode === "artist" ? "bg-white shadow-sm" : "text-slate-600"
              }`}
            >
              Artist
            </button>
            <button
              onClick={() => setMode("fan")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                mode === "fan" ? "bg-white shadow-sm" : "text-slate-600"
              }`}
            >
              Fan
            </button>
          </div>
        </header>

        {/* Artist view */}
        {mode === "artist" ? (
          <main className="mt-10 space-y-6">
            {/* 3 tap indicator */}
            <div className="flex items-center gap-3 text-sm">
              <StepPill active={step === 1} done={step > 1} label="1 · Upload" />
              <div className="h-px flex-1 bg-slate-200" />
              <StepPill active={step === 2} done={step > 2} label="2 · Audience" />
              <div className="h-px flex-1 bg-slate-200" />
              <StepPill active={step === 3} done={false} label="3 · Payout" />
            </div>

            {/* Main card */}
            <div className="rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-3xl font-semibold tracking-tight">
                {step === 1 && "Upload"}
                {step === 2 && "Choose Audience"}
                {step === 3 && "Connect Payout"}
              </h2>
              <p className="mt-2 text-slate-600">
                {step === 1 && "Pick a track and give it a name."}
                {step === 2 && "Choose who hears it first and how they unlock it."}
                {step === 3 && "Connect Stripe once. Then you can publish instantly."}
              </p>

              {/* Step contents */}
              <div className="mt-6 space-y-5">
                {step === 1 && (
                  <>
                    <Field label="Track title">
                      <input
                        className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-slate-900"
                        placeholder="Midnight Demo (v2)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Field>

                    <Field label="Audio file">
                      <label className="flex items-center justify-between gap-3 border border-dashed border-slate-300 bg-slate-50 rounded-2xl px-4 py-4 cursor-pointer">
                        <div>
                          <div className="text-sm font-semibold">
                            {fileName ? fileName : "Drop MP3/WAV here (or click)"}
                          </div>
                          <div className="text-xs text-slate-500">Max 20MB for beta</div>
                        </div>
                        <span className="text-sm font-semibold underline underline-offset-4">
                          Browse
                        </span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                        />
                      </label>
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label="Circle">
                      <input
                        className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-slate-900"
                        value={circle}
                        onChange={(e) => setCircle(e.target.value)}
                      />
                      <div className="mt-2 text-xs text-slate-500">
                        Examples: “VIP 50”, “Street Team”, “Collaborators”
                      </div>
                    </Field>

                    <Field label="Access">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Choice
                          selected={access === "free"}
                          title="Free link"
                          subtitle="Anyone with link"
                          onClick={() => setAccess("free")}
                        />
                        <Choice
                          selected={access === "paid"}
                          title="Paid unlock"
                          subtitle="$3–$10"
                          onClick={() => setAccess("paid")}
                        />
                        <Choice
                          selected={access === "members"}
                          title="Members"
                          subtitle="Subscribers only"
                          onClick={() => setAccess("members")}
                        />
                      </div>

                      {access === "paid" && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm text-slate-600">$</span>
                          <input
                            className="w-24 border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-900"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            inputMode="numeric"
                          />
                          <span className="text-sm text-slate-500">per unlock</span>
                        </div>
                      )}
                    </Field>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="text-sm font-semibold">Stripe Payout</div>
                      <div className="mt-1 text-sm text-slate-600">
                        Connect once. We’ll route paid unlocks to your account.
                      </div>

                      <button
                        onClick={() => setStripeConnected((v) => !v)}
                        className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold border ${
                          stripeConnected
                            ? "bg-black text-white border-black"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {stripeConnected ? "Stripe Connected ✓" : "Connect Stripe"}
                      </button>

                      <div className="mt-3 text-xs text-slate-500">
                        (This is a UI stub for now — we’ll wire it to Stripe later.)
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                      <div className="text-sm font-semibold">Summary</div>
                      <div className="mt-2 text-sm text-slate-700">
                        <div><span className="text-slate-500">Track:</span> {title || "—"}</div>
                        <div><span className="text-slate-500">Circle:</span> {circle}</div>
                        <div>
                          <span className="text-slate-500">Access:</span>{" "}
                          {access === "free" ? "Free link" : access === "members" ? "Members" : `Paid ($${price})`}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  onClick={back}
                  disabled={step === 1}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold border ${
                    step === 1 ? "border-slate-200 text-slate-400" : "border-slate-300"
                  }`}
                >
                  Back
                </button>

                {step < 3 ? (
                  <button
                    onClick={next}
                    disabled={!canContinue}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                      canContinue ? "bg-black text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={() => alert("Published (mock)")}
                    disabled={!canContinue}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                      canContinue ? "bg-black text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Principle: <span className="font-semibold">3 taps only</span> — Upload → Audience → Payout.
            </p>
          </main>
        ) : (
          // Fan view (keep super simple)
          <main className="mt-10">
            <div className="rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-3xl font-semibold tracking-tight">Fan View</h2>
              <p className="mt-2 text-slate-600">
                Hear early drops. Support artists directly.
              </p>

              <div className="mt-6 space-y-3">
                <FanRow title="Midnight Demo (v2)" artist="K. Rivers" action="Play" />
                <FanRow title="Chorus A/B Test" artist="K. Rivers" action="Unlock $5" />
                <FanRow title="Acoustic Sketch" artist="Luna Grey" action="Play" />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

function StepPill({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div
      className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
        active
          ? "bg-black text-white border-black"
          : done
          ? "bg-white border-slate-300 text-slate-700"
          : "bg-white border-slate-200 text-slate-500"
      }`}
    >
      {label}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Choice({
  selected,
  title,
  subtitle,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        selected ? "bg-black text-white border-black" : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className={`mt-1 text-xs ${selected ? "text-white/80" : "text-slate-500"}`}>{subtitle}</div>
    </button>
  );
}

function FanRow({ title, artist, action }: { title: string; artist: string; action: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="truncate text-xs text-slate-500">{artist}</div>
      </div>
      <button className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold">
        {action}
      </button>
    </div>
  );
}
