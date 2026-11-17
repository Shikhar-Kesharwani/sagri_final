import { useState } from "react";
import { Check, Heart, MapPin, MessageCircle, Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea, TextInput } from "@/components/ui/form";
import { ActionLink, Heading, Text } from "@/components/ui/primitives";
import { PageHeader, Panel, Reveal, Tag, pill } from "@/src/app/kit";
import { NEARBY_FARMERS, type Post } from "@/src/data/catalog";
import { districtById } from "@/src/data/places";
import { cn } from "@/lib/cn";
import { uid } from "@/src/lib/store";
import { usePosts, useProfile } from "@/src/lib/sagri";
import { useAuth } from "../app/AuthProvider";

const ago = (iso: string) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  return h < 24 ? `${h} hour${h > 1 ? "s" : ""} ago` : `${Math.round(h / 24)} day${h >= 48 ? "s" : ""} ago`;
};

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
      {name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)}
    </span>
  );
}

function PostCard({ post, me, update }: { post: Post; me: string; update: (fn: (p: Post) => Post) => void }) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/community`;
    try {
      if (navigator.share) await navigator.share({ title: `${post.author} on SAGRI`, text: post.text, url });
      else await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <article id={post.id} className="border-b border-border py-8">
      <div className="flex items-start gap-4">
        <Avatar name={post.author} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <Text>{post.author}</Text>
            <Text size="xs" tone="muted">
              {post.place} · {post.distance} km · {ago(post.at)}
            </Text>
          </div>
          <Text className="mt-2 whitespace-pre-line">{post.text}</Text>
          <div className="mt-4 flex gap-6">
            <ActionLink
              tone={post.liked ? "accent" : "muted"}
              aria-pressed={post.liked}
              onClick={() => update((p) => ({ ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }))}
            >
              <Heart className={cn("h-4 w-4", post.liked && "fill-wheat")} />
              {post.likes}
            </ActionLink>
            <ActionLink tone="muted" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <MessageCircle className="h-4 w-4" />
              Comment ({post.comments.length} {post.comments.length === 1 ? "reply" : "replies"})
            </ActionLink>
            <ActionLink tone="muted" onClick={share}>
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Link copied" : "Share"}
            </ActionLink>
          </div>
          {open && (
            <div className="mt-6 space-y-4 border-l border-border pl-5">
              {post.comments.map((c) => (
                <div key={c.id}>
                  <Text size="sm">
                    {c.author}{" "}
                    <Text as="span" size="xs" tone="muted">
                      · {ago(c.at)}
                    </Text>
                  </Text>
                  <Text size="sm" tone="muted" className="mt-1">
                    {c.text}
                  </Text>
                </div>
              ))}
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reply.trim()) return;
                  update((p) => ({ ...p, comments: [...p.comments, { id: uid(), author: me, text: reply.trim(), at: new Date().toISOString() }] }));
                  setReply("");
                }}
              >
                <TextInput value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply" aria-label="Reply" />
                <Button type="submit" size="icon" className="shrink-0 rounded-full" aria-label="Send reply">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Community() {
  const [profile] = useProfile();
  const { user } = useAuth();
  const myName = user?.name ? user.name.replace(/\s*\(.*?\)/, "").trim() : profile.name;
  const [posts, setPosts] = usePosts();
  const [draft, setDraft] = useState("");
  const district = districtById(profile.district);

  const update = (id: string) => (fn: (p: Post) => Post) => setPosts((all) => all.map((p) => (p.id === id ? fn(p) : p)));

  return (
    <>
      <PageHeader
        eyebrow="Farmer Community Forum"
        title="Kisan Community Hub"
        subtitle="Discuss farming problems, pest outbreaks, and techniques with nearby farmers"
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              setPosts((all) => [
                { id: uid(), author: myName, place: `${profile.village}, ${district.name}`, distance: 0, at: new Date().toISOString(), text: draft.trim(), likes: 0, liked: false, comments: [] },
                ...all,
              ]);
              setDraft("");
            }}
          >
            <TextArea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Share an update, ask a question, or report a pest in your area..." aria-label="New post" />
            <div className="mt-3 flex justify-end">
              <Button type="submit" variant="outline" className={pill} disabled={!draft.trim()}>
                Post to Community
              </Button>
            </div>
          </form>
          <div className="mt-4 border-t border-border">
            {posts.map((p) => (
              <Reveal key={p.id}>
                <PostCard post={p} me={myName} update={update(p.id)} />
              </Reveal>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Panel>
            <Heading as="h2" family="serif" size="subtitle" className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-wheat" />
              Farmers near you
            </Heading>
            <ul className="mt-6">
              {NEARBY_FARMERS.map((f) => (
                <li key={f.name} className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
                  <Avatar name={f.name} />
                  <span className="flex-1">
                    <Text as="span" size="sm" className="block">
                      {f.name}
                    </Text>
                    <Text as="span" size="xs" tone="muted" className="block">
                      {f.distance} km away
                    </Text>
                  </span>
                  <Tag>{f.crop}</Tag>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </>
  );
}
