import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { CalendarCheck, Mic, MicOff, Paperclip, Phone, Send, Star, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Chip, HiddenFileInput, Segmented, TextInput } from "@/components/ui/form";
import { Heading, NavAnchor, Text } from "@/components/ui/primitives";
import { PageHeader, Panel, Section, Tag, pill } from "@/src/app/kit";
import { EXPERTS, type Expert } from "@/src/data/catalog";
import { cn } from "@/lib/cn";
import { formatDate } from "@/src/lib/format";
import { uid } from "@/src/lib/store";
import { firstName, useConsultations, useProfile } from "@/src/lib/sagri";
import { useAuth } from "../app/AuthProvider";

type Lang = "en" | "hi" | "mr" | "pa";
const LANGS: { value: Lang; label: string; speech: string }[] = [
  { value: "en", label: "English", speech: "en-IN" },
  { value: "hi", label: "हिंदी", speech: "hi-IN" },
  { value: "mr", label: "मराठी", speech: "mr-IN" },
  { value: "pa", label: "ਪੰਜਾਬੀ", speech: "pa-IN" },
];

const COPY: Record<Lang, { hello: (n: string) => string; placeholder: string; chips: string[] }> = {
  en: {
    hello: (n) => `Namaste ${n}. I'm Krishi Sahayak. Ask me about crop disease, fertiliser doses, weather or government schemes.`,
    placeholder: "Type your question…",
    chips: ["Wheat leaf yellowing", "Urea dosage", "PM-Kisan status"],
  },
  hi: {
    hello: (n) => `नमस्ते ${n}। मैं कृषि सहायक हूँ। फसल रोग, खाद की मात्रा, मौसम या सरकारी योजनाओं के बारे में पूछें।`,
    placeholder: "अपना सवाल लिखें…",
    chips: ["गेहूं की पत्तियाँ पीली क्यों हो रही हैं?", "गेहूं में यूरिया की मात्रा", "पीएम-किसान स्थिति"],
  },
  mr: {
    hello: (n) => `नमस्कार ${n}. मी कृषी सहायक आहे. पीक रोग, खत मात्रा, हवामान किंवा सरकारी योजनांबद्दल विचारा.`,
    placeholder: "तुमचा प्रश्न लिहा…",
    chips: ["गव्हाची पाने पिवळी का होत आहेत?", "गव्हासाठी युरिया मात्रा", "पीएम-किसान स्थिती"],
  },
  pa: {
    hello: (n) => `ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${n}। ਮੈਂ ਕ੍ਰਿਸ਼ੀ ਸਹਾਇਕ ਹਾਂ। ਫ਼ਸਲ ਰੋਗ, ਖਾਦ, ਮੌਸਮ ਜਾਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਪੁੱਛੋ।`,
    placeholder: "ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ…",
    chips: ["ਕਣਕ ਦੇ ਪੱਤੇ ਪੀਲੇ ਕਿਉਂ ਹੋ ਰਹੇ ਹਨ?", "ਕਣਕ ਲਈ ਯੂਰੀਆ ਦੀ ਮਾਤਰਾ", "ਪੀਐਮ-ਕਿਸਾਨ ਸਥਿਤੀ"],
  },
};

/** Offline answers used when no chat backend is configured. Keys match English and Indic spellings. */
const KNOWLEDGE: { match: RegExp; en: string; hi: string }[] = [
  {
    match: /yellow|पीली|पिवळी|ਪੀਲੇ/i,
    en: "Yellowing that starts on older, lower leaves usually means nitrogen deficiency. Top-dress 25 kg of urea per acre after irrigation. If you see orange-yellow powdery stripes, it's yellow rust. Spray propiconazole 25 EC at 1 ml per litre, and send a photo through Disease Vision to confirm.",
    hi: "निचली पुरानी पत्तियों से पीलापन शुरू हो तो आमतौर पर नाइट्रोजन की कमी होती है। सिंचाई के बाद 25 किलो यूरिया प्रति एकड़ डालें। अगर नारंगी-पीली धारियाँ दिखें तो यह पीला रतुआ है: प्रोपिकोनाज़ोल 25 EC 1 मिली प्रति लीटर छिड़कें।",
  },
  {
    match: /urea|यूरिया|युरिया|ਯੂਰੀਆ|fertili[sz]er|खाद/i,
    en: "For irrigated wheat, the recommended dose is 110 kg of urea per acre in three splits: one-third at sowing (with DAP), one-third at the first irrigation (21 days) and one-third at the second irrigation (40–45 days). Cut it by 25% if your soil card shows high nitrogen.",
    hi: "सिंचित गेहूं में 110 किलो यूरिया प्रति एकड़ तीन भागों में दें: बुवाई पर एक-तिहाई (DAP के साथ), पहली सिंचाई (21 दिन) पर एक-तिहाई, और दूसरी सिंचाई (40–45 दिन) पर एक-तिहाई।",
  },
  {
    match: /kisan|किसान|ਕਿਸਾਨ|instal|किस्त/i,
    en: "To check PM-KISAN status, go to pmkisan.gov.in, open 'Know Your Status' and enter your registration number or Aadhaar-linked mobile number. Instalments are ₹2,000 each, three times a year. Make sure your e-KYC is complete, or the payment will be held.",
    hi: "पीएम-किसान स्थिति के लिए pmkisan.gov.in पर 'Know Your Status' खोलें और पंजीकरण संख्या या आधार से जुड़ा मोबाइल नंबर डालें। हर किस्त ₹2,000 की है, साल में तीन बार। e-KYC पूरा होना ज़रूरी है।",
  },
  {
    match: /blight|झुलसा|tomato|टमाटर/i,
    en: "For early blight on tomato: remove the infected lower leaves, avoid overhead watering and spray mancozeb 75% WP at 2.5 g per litre every 7–10 days. Mulch the beds and rotate away from tomato, potato and brinjal for two seasons.",
    hi: "टमाटर के अगेती झुलसा में संक्रमित निचली पत्तियाँ हटाएँ, ऊपर से सिंचाई न करें और मैनकोज़ेब 75% WP 2.5 ग्राम प्रति लीटर हर 7–10 दिन में छिड़कें।",
  },
  {
    match: /aphid|माहू|mustard|सरसों/i,
    en: "For aphids on mustard: if more than 25 aphids per plant are on the main shoot, spray imidacloprid 17.8 SL at 0.5 ml per litre in the evening. For a light attack, neem oil at 5 ml per litre works. Avoid spraying during flowering hours to protect bees.",
    hi: "सरसों पर माहू: मुख्य तने पर 25 से ज़्यादा माहू हों तो शाम को इमिडाक्लोप्रिड 17.8 SL 0.5 मिली प्रति लीटर छिड़कें। हल्के प्रकोप में नीम तेल 5 मिली प्रति लीटर।",
  },
];

const FALLBACK = {
  en: "I don't have a confident answer for that yet. Book a free call with one of the agronomists on this page, or call the Kisan Call Centre on 1800-180-1551. It's free, and open 6 AM to 10 PM.",
  hi: "इसका पक्का जवाब मेरे पास अभी नहीं है। इस पेज पर किसी कृषि विशेषज्ञ से मुफ़्त कॉल बुक करें, या किसान कॉल सेंटर 1800-180-1551 पर कॉल करें (मुफ़्त, सुबह 6 से रात 10 बजे)।",
};

type Message = { id: string; from: "farmer" | "ai"; text: string; attachment?: string };
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:8000";

async function answer(question: string, lang: Lang): Promise<string> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, language: lang }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.reply ?? data.response ?? data.answer;
        if (typeof reply === "string" && reply) return reply;
      }
    } catch {
      /* fall through to offline answers */
    }
  }
  await new Promise((r) => window.setTimeout(r, 700));
  const hit = KNOWLEDGE.find((k) => k.match.test(question));
  const useHindi = lang === "hi" || lang === "mr";
  return hit ? (useHindi ? hit.hi : hit.en) : useHindi ? FALLBACK.hi : FALLBACK.en;
}

type SpeechRec = { lang: string; interimResults: boolean; start: () => void; stop: () => void; onresult: ((e: { results: { 0: { transcript: string } }[] }) => void) | null; onend: (() => void) | null };

export default function ExpertConnect() {
  const [params] = useSearchParams();
  const [profile] = useProfile();
  const { user } = useAuth();
  const farmerName = user?.name ? user.name.replace(/\s*\(.*?\)/, "").trim() : profile.name;
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState(params.get("q") ?? "");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [consultations, setConsultations] = useConsultations();
  const file = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const rec = useRef<SpeechRec | null>(null);
  const copy = COPY[lang];

  const speechCtor =
    typeof window !== "undefined"
      ? ((window as unknown as Record<string, unknown>).SpeechRecognition ?? (window as unknown as Record<string, unknown>).webkitSpeechRecognition)
      : undefined;

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q && !attachment) return;
    setMessages((m) => [...m, { id: uid(), from: "farmer", text: q || "Photo attached", attachment: attachment ?? undefined }]);
    setText("");
    setAttachment(null);
    setThinking(true);
    const reply = await answer(q || "photo", lang);
    setMessages((m) => [...m, { id: uid(), from: "ai", text: reply }]);
    setThinking(false);
  };

  const toggleMic = () => {
    if (!speechCtor) return;
    if (listening) {
      rec.current?.stop();
      return;
    }
    const r = new (speechCtor as new () => SpeechRec)();
    r.lang = LANGS.find((l) => l.value === lang)!.speech;
    r.interimResults = false;
    r.onresult = (e) => setText((t) => `${t} ${e.results[0][0].transcript}`.trim());
    r.onend = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  return (
    <>
      <PageHeader
        eyebrow="Krishi Sahayak AI Expert"
        title="Krishi Sahayak & Agronomist Support"
        subtitle="24/7 AI diagnostic chat and one-on-one video consultation with ICAR scientists"
        actions={<Segmented<Lang> label="Language" value={lang} onChange={setLang} options={LANGS} />}
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <section className="flex flex-col lg:col-span-3" aria-label="Chat with Krishi Sahayak">
          <div ref={scroller} className="h-96 space-y-4 overflow-y-auto rounded-2xl border border-border bg-card/40 p-5" aria-live="polite">
            <div className="max-w-md rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-sm leading-relaxed">{copy.hello(firstName(farmerName))}</div>
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-md rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.from === "farmer" ? "ml-auto rounded-tr-sm bg-wheat text-primary-foreground" : "rounded-tl-sm bg-secondary",
                )}
              >
                {m.attachment && (
                  <span className="mb-1 flex items-center gap-1 text-xs opacity-80">
                    <Paperclip className="h-3 w-3" />
                    {m.attachment}
                  </span>
                )}
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-4" aria-label="Krishi Sahayak is typing">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {copy.chips.map((c) => (
              <Chip key={c} size="sm" onClick={() => send(c)} disabled={thinking}>
                {c}
              </Chip>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
            className="mt-4 flex items-center gap-2"
          >
            <Button variant="outline" size="icon" className="shrink-0 rounded-full" aria-label="Attach a photo" onClick={() => file.current?.click()}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <HiddenFileInput ref={file} accept="image/*" onFile={(f) => setAttachment(f.name)} />
            {speechCtor ? (
              <Button
                variant="outline"
                size="icon"
                className={cn("shrink-0 rounded-full", listening && "border-alert text-alert")}
                aria-label={listening ? "Stop voice input" : "Speak your question"}
                aria-pressed={listening}
                onClick={toggleMic}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            ) : null}
            <TextInput value={text} onChange={(e) => setText(e.target.value)} placeholder={attachment ? `Photo: ${attachment}` : copy.placeholder} aria-label="Your question" />
            <Button type="submit" size="icon" className="shrink-0 rounded-full" aria-label="Send" disabled={thinking}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {!API_BASE && (
            <Text size="xs" tone="muted" className="mt-3">
              Offline mode: answers come from SAGRI's built-in agronomy guide. Connect the SAGRI chat service for full AI replies.
            </Text>
          )}
        </section>

        <aside className="lg:col-span-2">
          <Heading as="h2" family="serif" size="subtitle">
            Certified Agronomist Directory
          </Heading>
          <ul className="mt-6 border-t border-border">
            {EXPERTS.map((ex) => (
              <li key={ex.id} className="flex items-start justify-between gap-4 border-b border-border py-5">
                <div>
                  <Text>{ex.name}</Text>
                  <Text size="sm" tone="muted">
                    {ex.field} — {ex.institute}
                  </Text>
                  <Text size="xs" tone="muted" className="mt-2 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-wheat text-wheat" />
                    {ex.rating} · {ex.consultations.toLocaleString("en-IN")} consultations · {ex.languages.join(", ")}
                  </Text>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Tag tone={ex.fee === 0 ? "good" : "neutral"}>{ex.fee === 0 ? "Free (Govt Supported)" : `₹${ex.fee}`}</Tag>
                  <Button variant="outline" className="rounded-full" onClick={() => setExpert(ex)}>
                    Book Audio/Video Consultation
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {consultations.length > 0 && (
            <div className="mt-8">
              <Text size="sm" tone="muted">
                Your upcoming consultations
              </Text>
              <ul className="mt-2">
                {consultations.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-4 border-b border-border py-3 text-sm">
                    <span>
                      {c.expert}
                      <span className="block text-xs text-muted-foreground">
                        {c.mode} · {formatDate(c.date)}, {c.slot}
                      </span>
                    </span>
                    <Button variant="ghost" className="rounded-full text-muted-foreground" onClick={() => setConsultations((all) => all.filter((x) => x.id !== c.id))}>
                      Cancel
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <Section title="Kisan Call Centre Toll-Free">
        <Panel tone="paper" className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Text size="none" tone="ink" className="font-serif text-4xl">
              1800-180-1551
            </Text>
            <Text tone="inkMuted" className="mt-1">
              Toll free · 6 AM to 10 PM, every day · in 22 languages
            </Text>
          </div>
          <NavAnchor href="tel:18001801551" tone="ink" className="rounded-full border border-ink px-6 py-3 font-medium hover:text-ink">
            <Phone className="h-4 w-4" />
            Call now
          </NavAnchor>
        </Panel>
      </Section>

      <BookingDialog
        expert={expert}
        onClose={() => setExpert(null)}
        onBook={(c) => setConsultations((all) => [{ ...c, id: uid() }, ...all])}
      />
    </>
  );
}

const SLOTS = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "6:00 PM"];

function BookingDialog({
  expert,
  onClose,
  onBook,
}: {
  expert: Expert | null;
  onClose: () => void;
  onBook: (c: { expert: string; mode: string; date: string; slot: string }) => void;
}) {
  const days = Array.from({ length: 5 }, (_, i) => new Date(Date.now() + (i + 1) * 86400_000).toISOString().slice(0, 10));
  const [mode, setMode] = useState<"Audio call" | "Video call">("Audio call");
  const [day, setDay] = useState(days[0]);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [done, setDone] = useState(false);
  useEffect(() => setDone(false), [expert]);

  return (
    <Dialog open={expert !== null} onClose={onClose} title={done ? "Consultation booked" : `Book ${expert?.name ?? ""}`}>
      {expert &&
        (done ? (
          <div role="status">
            <CalendarCheck className="h-6 w-6 text-leaf" />
            <Text className="mt-3">
              {expert.name} will call you on {formatDate(day)} at {slot}.
            </Text>
            <Button variant="outline" className={`${pill} mt-6`} onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Segmented
              label="Call type"
              value={mode}
              onChange={setMode}
              options={[
                { value: "Audio call", label: "Audio call" },
                { value: "Video call", label: "Video call" },
              ]}
            />
            <div>
              <Text size="sm" tone="muted">
                Day
              </Text>
              <div className="mt-2 flex flex-wrap gap-2">
                {days.map((d) => (
                  <Chip key={d} active={day === d} onClick={() => setDay(d)}>
                    {new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric" }).format(new Date(d))}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <Text size="sm" tone="muted">
                Time
              </Text>
              <div className="mt-2 flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <Chip key={s} active={slot === s} onClick={() => setSlot(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
            <Button
              className={pill}
              onClick={() => {
                onBook({ expert: expert.name, mode, date: day, slot });
                setDone(true);
              }}
            >
              {mode === "Video call" ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
              Confirm {expert.fee === 0 ? "free " : ""}consultation
            </Button>
          </div>
        ))}
    </Dialog>
  );
}
