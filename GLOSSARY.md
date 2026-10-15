# TypeSafe AI Glossary

Canonical vocabulary for this teaching workspace, defined as `docs.typesafe.ai` defines them. Terms are promoted here only once understanding has actually been demonstrated in a lesson — not just introduced.

## Core Concepts

**System One Model**:
An AI model that evaluates a state and returns typed answers and probabilities directly, rather than generating text you'd have to parse. TypeSafe's flagship System One model is Jev.

**State**:
The content — a string, JSON object, or array of text — that a System One model evaluates a question against. One state per request; independent questions can be asked against the same state in parallel. With the Danger Zone images header, a state can also hold images.

**Primitive**:
A typed question you ask a System One model about a state, and the typed answer that comes back. There are three: Choice, Score, and Noul. Each returns a different shape of answer, and the code that consumes it decides which one a judgment actually needs.

**Choice**:
A primitive that asks a System One model to pick exactly one option from a fixed set. Returns the picked option, the full probability distribution over every option, and a confidence score.

**Score**:
A primitive that rates a state against an ordered set of levels you define. Returns a position (`score`) — the probability-weighted average of the levels, which can fall between two of them — plus a `legend` mapping level numbers back to their descriptions, the full `probabilities`, and a `confidence`.

**Noul**:
A primitive for a single yes/no judgment. Returns just `noul`, the probability the answer is yes — no separate confidence field. `0.5` means yes and no are equally likely, not medium certainty.

**Confidence**:
A single 0–1 number derived from an answer's `probabilities`, summarizing how concentrated that distribution is — peaked means confident, flat means uncertain. Present on Choice and Score, absent on Noul. It measures how clear-cut the answer was, not whether the answer is actually correct; TypeSafe's structured output guarantees an answer's *shape*, never its correctness.

**Asset**:
An image listed in a request's top-level `assets` map, under a reference key. Sent once, either as a multipart file part (`part`) or as `data_base64` with a `format`. Every asset must be referenced somewhere in the request. The SDK's `image()` builds assets for you. Dreamer-ready: needs the `TypeSafe-Danger-Zone-Images: true` header.

**Reference**:
The string key of an asset. Wherever it appears in the `state`, a question's `instructions` or its `criteria`, the model receives the image in its place. Each use adds the image again, so an image several questions share belongs in the state, once. The SDK generates references for you. When you choose your own, a new UUID per image per request is the safest choice. (The docs called this a "placeholder" until October 2026.)

**Box**:
A question type that answers *where* something is in an image: the four edges (`top`, `bottom`, `left`, `right`) of the smallest rectangle around the target, as fractions of the image's height and width, plus a `confidence`. Takes `instructions` and no `criteria`. Needs Jev 1.14 (`jev-preview`). In the SDK, `box()`, whose `confidence` can be `null`. Dreamer-ready.

## Patterns

**Speculative fan-out**:
Sending every question a decision might need in one request — including ones that turn out not to apply — instead of round-tripping as each answer becomes known. Works because extra questions cost a few tokens, not extra latency; ordinary code decides afterward which answers are actually relevant.

**Composite scoring**:
Breaking one complex judgment into several independent Score dimensions, normalizing each to 0–1, and combining them with weights that live in code, not the model. Changing the weights re-ranks instantly, without asking anything new.

**Function calling** (as a TypeSafe pattern):
Mapping a natural-language request onto a call to an ordinary function: a Choice for which function, a Choice (or per-member Noul, for a set argument) for each closed-set argument, and an optional companion Noul asking whether an argument was even mentioned at all. The call's overall confidence is the *minimum* across every question actually used, not a product — one weak argument is enough to spoil the whole call.

**Confidence-gated routing**:
TypeSafe's own name for dividing confidence into ranges that trigger different behavior — act automatically, proceed with caution (confirm/flag/gather more), or don't act at all. Thresholds scale with the stakes of being wrong, not a single fixed number: a destructive action gets a higher bar than a read-only one, which may get no gate at all.
