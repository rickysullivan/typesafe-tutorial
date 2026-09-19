# LangGraph — Research Notes

Compiled from primary sources only (`docs.langchain.com/oss/javascript/langgraph/*`, fetched with `curl -A "Mozilla/5.0" <url>.md` — never `WebFetch`, per this repo's convention after `WebFetch` paraphrased a TypeSafe page). Scoped to the **JavaScript/TypeScript package** (`@langchain/langgraph`), since this repo is Deno/TS. Written to ground `cookbooks/integrations/langgraph.ipynb`, which pairs LangGraph with TypeSafe.

**A note on the API reference site:** `reference.langchain.com/javascript/*` is a client-rendered app — `curl` returns an empty shell, not the actual class/method docs. Everything below is grounded in the `docs.langchain.com` guide pages instead, which serve real markdown.

## What it is

Source: https://docs.langchain.com/oss/javascript/langgraph/overview.md

LangGraph is "a low-level orchestration framework and runtime for building, managing, and deploying long-running, stateful agents." It gives "fine-grained control to mix deterministic, hand-coded steps with LLM-driven agentic steps in the same graph." It is explicitly **not** a prompt or architecture abstraction — no built-in agent loop, no opinion on how you call a model. That's what the higher-level `LangChain` package and its prebuilt agents are for; LangGraph sits underneath as the orchestration runtime and can be used standalone.

Install: `npm install @langchain/langgraph @langchain/core`. Confirmed hands-on in this repo: `npm:@langchain/langgraph` type-checks cleanly under Deno with no extra config (`deno check` pulled `@langchain/langgraph@1.4.15`, `@langchain/core@1.2.11`, `zod@4.6.5` as a peer dependency, and a handful of their own transitive deps — no version pinning needed for this pass).

Central benefits, as stated: mixing deterministic and agentic steps in one graph, persistence (resume after failure), human-in-the-loop (inspect/modify state mid-run), memory (short-term working + long-term across sessions), and LangSmith-based debugging/deployment. Only the first of these (mixing deterministic and agentic steps) is in scope for this repo's cookbook — persistence, memory, and deployment aren't demonstrated.

## Core vocabulary

Source: https://docs.langchain.com/oss/javascript/langgraph/graph-api.md

LangGraph models a workflow as a graph with three components:

1. **State** — a shared data structure representing the current snapshot of the application, defined via a `StateSchema`.
2. **Nodes** — functions that read the current state and return a *partial update* to it (not the whole state back).
3. **Edges** — functions that determine which node runs next, based on current state. Can be a fixed transition or a conditional branch.

Quoted directly: "*nodes do the work, edges tell what to do next*." Execution uses message passing (credited to Google's Pregel) in discrete "super-steps": nodes that run in parallel share a super-step, nodes that run sequentially are in separate super-steps. The graph halts when every node is inactive and no messages are in flight.

### StateGraph and compiling

`StateGraph` is the main graph class, parameterized by a `StateSchema`. You define state, add nodes and edges, then **must** call `.compile()` before `.invoke()` — compiling does basic structural checks (no orphaned nodes) and is where you'd attach a checkpointer for persistence (not used in this cookbook).

```typescript
const graph = new StateGraph(StateAnnotation)
  .addNode("nodeA", nodeA)
  .addEdge(START, "nodeA")
  .addEdge("nodeA", END)
  .compile();
```

### State schema and reducers

`StateSchema` accepts a standard schema per field (this repo uses `zod`). Each field gets a **reducer** — the function that combines the existing state value (left argument) with a node's update (right argument) to produce the new value. The **default reducer discards the left argument and keeps the right** — an update simply overwrites. A custom reducer (via `ReducedValue`) can accumulate instead, e.g. concatenating arrays across parallel node runs — not needed for this cookbook's linear-ish graph, but the load-bearing fact if a future cookbook needs to merge parallel branches.

### Nodes

Nodes are sync or async functions taking `(state, config)` and returning a partial state update, added via `.addNode(name, fn)`. The `GraphNode<typeof State>` type utility gives node functions proper typing against a `StateSchema`. `START` and `END` are special virtual nodes marking graph entry and exit — referenced only via `addEdge(START, "someNode")` / `addEdge("someNode", END)`, never given real logic themselves.

### Edges

Four kinds, quoted directly:

- **Normal edges** — `addEdge("nodeA", "nodeB")`: always go from A to B.
- **Conditional edges** — `addConditionalEdges("nodeA", routingFunction)`: call a function after `nodeA` runs to decide what's next. By default the routing function's return value *is* the next node's name; optionally, a second argument maps the function's return values to node names (`{ true: "nodeB", false: "nodeC" }`).
- **Entry point** — `addEdge(START, "nodeA")`: which node runs first.
- **Conditional entry point** — `addConditionalEdges(START, routingFunction)`: choose the first node dynamically.

Explicit warning in the docs: pick **one** routing mechanism per node — normal edges for static routing, or conditional edges/`Command` for dynamic routing, never both from the same node, "because both paths can execute and make graph behavior harder to reason about."

A node with multiple outgoing edges runs **all** of those destinations in parallel as the next super-step.

### `Send` and `Command` (noted, not used in this cookbook)

`Send(nodeName, state)` returned from a conditional edge lets you fan out to a variable, not-known-ahead-of-time number of node invocations (map-reduce pattern) — each with its own state slice. `Command` bundles a state update (`update`) with routing (`goto`) in one return value from a node, as an alternative to a separate conditional edge when you want both at once.

## The routing-function seam (the actual point of researching this)

The docs describe the *mechanics* of `addConditionalEdges` precisely — a function of `state` returning a node name (or list of names, or `Send` objects) — but say **nothing about how that function should decide**. Every example in the guide pages uses a trivial, already-known boolean or string field on state (`{ true: "nodeB", false: "nodeC" }`) as the routing key. There is no guidance in these pages on what to do when the "next node" decision itself has to be extracted from unstructured input (a user message, a document) — that's left entirely to the application.

In practice (and this is the gap the new cookbook fills, not a documented LangGraph recommendation — flagging clearly since it's *my* inference, not a primary-source claim), the common approach is an LLM call inside or before the routing function, with its free-text output parsed by hand into one of the fixed node names. That's exactly the failure mode `docs.typesafe.ai`'s own design guidance warns about (see `research/typesafe-ai.md`) — parsing unstructured text into a decision your code then branches on. A TypeSafe `Choice` question returns one of a **closed set** of options directly, with a `confidence` score, so the routing function becomes a direct read of a typed field rather than a parse step — and `confidence` composes naturally with this repo's own confidence-gated routing pattern (lesson 7) to add a "don't act — go to human review" branch alongside the model's chosen category.

## Open questions / not covered by this pass

1. **Streaming** (`invoke` vs `stream`, `streamMode` variants) — read in passing (`graph-api.md`'s private-channel warning uses `streamEvents`) but not independently verified; this cookbook only uses `.invoke()`.
2. **Checkpointers/persistence** — mentioned in the overview as a core benefit, not exercised here; would matter for a future cookbook on human-in-the-loop review queues.
3. **Python SDK** (`langgraph` on PyPI) — out of scope, this repo is Deno/TS only, same as the existing Python-SDK gap noted for TypeSafe in `research/typesafe-ai.md`.
4. **LangSmith** — mentioned throughout the docs as the paired observability/tracing product; not used or evaluated here.
