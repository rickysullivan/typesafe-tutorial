# TypeSafe AI Glossary

Canonical vocabulary for this teaching workspace, defined as `docs.typesafe.ai` defines them. Terms are promoted here only once understanding has actually been demonstrated in a lesson — not just introduced.

## Core Concepts

**System One Model**:
An AI model that evaluates a state and returns typed answers and probabilities directly, rather than generating text you'd have to parse. TypeSafe's flagship System One model is Jev.

**State**:
The content — a string, JSON object, or array of text — that a System One model evaluates a question against. One state per request; independent questions can be asked against the same state in parallel.

**Primitive**:
A typed question you ask a System One model about a state, and the typed answer that comes back. There are three: Choice, Score, and Noul. Each returns a different shape of answer, and the code that consumes it decides which one a judgment actually needs.

**Choice**:
A primitive that asks a System One model to pick exactly one option from a fixed set. Returns the picked option, the full probability distribution over every option, and a confidence score.

**Score**:
A primitive that rates a state against an ordered set of levels you define. Returns a position (`score`) — the probability-weighted average of the levels, which can fall between two of them — plus a `legend` mapping level numbers back to their descriptions, the full `probabilities`, and a `confidence`.

**Noul**:
A primitive for a single yes/no judgment. Returns just `noul`, the probability the answer is yes — no separate confidence field. `0.5` means yes and no are equally likely, not medium certainty.

## Patterns

**Speculative fan-out**:
Sending every question a decision might need in one request — including ones that turn out not to apply — instead of round-tripping as each answer becomes known. Works because extra questions cost a few tokens, not extra latency; ordinary code decides afterward which answers are actually relevant.
