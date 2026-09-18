# TypeSafe AI Glossary

Canonical vocabulary for this teaching workspace, defined as `docs.typesafe.ai` defines them. Terms are promoted here only once understanding has actually been demonstrated in a lesson — not just introduced.

## Terms

**System One Model**:
An AI model that evaluates a state and returns typed answers and probabilities directly, rather than generating text you'd have to parse. TypeSafe's flagship System One model is Jev.

**State**:
The content — a string, JSON object, or array of text — that a System One model evaluates a question against. One state per request; independent questions can be asked against the same state in parallel.

**Choice**:
A primitive that asks a System One model to pick exactly one option from a fixed set. Returns the picked option, the full probability distribution over every option, and a confidence score.
