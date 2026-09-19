# LangGraph — Research Notes

Compiled from primary sources only (`docs.langchain.com/oss/javascript/langgraph/*`, fetched with `curl -s -A "Mozilla/5.0" <url>.md` — never `WebFetch`, per this repo's convention after `WebFetch` paraphrased a TypeSafe page). Scoped to the **JavaScript/TypeScript package** (`@langchain/langgraph`), since this repo is Deno/TS. Written to ground `cookbooks/integrations/langgraph.ipynb`, which pairs LangGraph with TypeSafe.

**Revision note (pass 2):** the first pass covered `overview.md` and `graph-api.md` only and left streaming, persistence, and human-in-the-loop as open questions. This pass re-verified every quote from pass 1 against a fresh fetch of `graph-api.md` (all checked out verbatim) and added six more primary-source pages: `use-graph-api.md` (the how-to companion to `graph-api.md`, with runnable examples for state, conditional branching, `Send`, and `Command`), `streaming.md`, `event-streaming.md`, `persistence.md` + `checkpointers.md`, and `interrupts.md`. One correction from pass 1: the routing-function path map is not "a second argument" loosely speaking — `addConditionalEdges(nodeName, routingFunction, pathMap?)` takes it as an explicit **third** parameter; pass 1's phrasing was directionally right but imprecise. `Send`'s doc example also uses `new Send(...)`, which pass 1's prose dropped. Both are fixed below. Version numbers were re-checked against the npm registry (not just this repo's `node_modules`) — see [Versions](#versions).

## What it is

Source: https://docs.langchain.com/oss/javascript/langgraph/overview.md

LangGraph is "a low-level orchestration framework and runtime for building, managing, and deploying long-running, stateful agents." It gives "fine-grained control to mix deterministic, hand-coded steps with LLM-driven agentic steps in the same graph." It is explicitly **not** a prompt or architecture abstraction — no built-in agent loop, no opinion on how you call a model. That's what the higher-level `LangChain` package and its prebuilt agents are for; LangGraph sits underneath as the orchestration runtime and can be used standalone. The docs frame the wider stack as layers: Deep Agents (a harness) → LangChain (the agent framework) → **LangGraph (the orchestration runtime: durable execution, streaming, human-in-the-loop, persistence)** → LangSmith (tracing/eval/deployment).

Install: `npm install @langchain/langgraph @langchain/core`.

Central benefits, as stated: mixing deterministic and agentic steps in one graph, [persistence](https://docs.langchain.com/oss/javascript/langgraph/persistence) (resume after failure), [human-in-the-loop](https://docs.langchain.com/oss/javascript/langgraph/interrupts) (inspect/modify state mid-run), comprehensive memory (short-term working + long-term across sessions), and LangSmith-based debugging/deployment. Pass 1 exercised only the first of these in the cookbook; this pass adds primary-source depth on persistence and human-in-the-loop (items 2 and 3 below), since they're directly relevant to where the cookbook's `humanReview` stub node would go next.

## Core vocabulary

Source: https://docs.langchain.com/oss/javascript/langgraph/graph-api.md (re-fetched and re-verified this pass — every quote below checked against the live page)

LangGraph models a workflow as a graph with three components:

1. **State** — a shared data structure representing the current snapshot of the application, defined via a `StateSchema`.
2. **Nodes** — functions that read the current state and return a *partial update* to it (not the whole state back).
3. **Edges** — functions that determine which node runs next, based on current state. Can be a fixed transition or a conditional branch.

Quoted directly: "*nodes do the work, edges tell what to do next*." Execution uses message passing (credited to Google's Pregel) in discrete "super-steps": nodes that run in parallel share a super-step, nodes that run sequentially are in separate super-steps. A node is `active` when it receives a message on an incoming edge; it runs, then at the end of the super-step, nodes with no incoming messages vote to `halt`. The graph halts when every node is inactive and no messages are in flight.

### StateGraph and compiling

`StateGraph` is the main graph class, parameterized by a `StateSchema`. You define state, add nodes and edges, then **must** call `.compile()` before you can use the graph — compiling does basic structural checks (no orphaned nodes) and is where you'd attach a checkpointer or breakpoints (see [Persistence](#persistence-checkpointers)).

```typescript
const graph = new StateGraph(StateAnnotation)
  .addNode("nodeA", nodeA)
  .addEdge(START, "nodeA")
  .addEdge("nodeA", END)
  .compile();
```

### State schema and reducers

`StateSchema` accepts a standard schema per field (this repo uses `zod`). Each field gets a **reducer** — a binary function of `(left, right)` where the **left argument is the value already in state** and the **right argument is the update a node just returned**. LangGraph calls `reducer(currentState[key], nodeUpdate[key])` for every key a node's partial update touches.

The **default reducer discards the left argument and keeps the right** — an update simply overwrites: if state is `{ foo: 1, bar: ["hi"] }` and a node returns `{ foo: 2 }`, state becomes `{ foo: 2, bar: ["hi"] }`.

A custom reducer, via `new ReducedValue(schema, { reducer })`, can combine instead of overwrite — e.g. `(x, y) => x.concat(y)` to accumulate an array across parallel node runs. **Gotcha confirmed from the docs' own callout:** with a merging reducer, returning an *empty* update does not clear the field — the empty value still gets merged in, so previously accumulated values survive. Not needed for this cookbook's linear-ish graph, but load-bearing if a future cookbook needs to merge parallel branches (see [`Send`](#send-and-command) below, which relies on exactly this).

### Nodes

Nodes are sync or async functions taking `(state, config)` — `config` is a `RunnableConfig` carrying `thread_id` and tracing tags — and returning a partial state update, added via `.addNode(name, fn)`. Explicit warning in `use-graph-api.md`: "Nodes should return updates to the state directly, instead of mutating the state." Functions are converted internally to a `RunnableLambda`, which is what gives nodes batch/async support and native LangSmith tracing. An unnamed `addNode(fn)` call defaults the node's name to the function name.

Two type utilities for typing node functions against a `StateSchema`: `GraphNode<typeof State>` (standalone) and the `State.Node` shorthand (`typeof State.Node`) — the docs show these as equivalent. A node that returns `Command` (see below) needs the richer `GraphNode<{ InputSchema: typeof State; Nodes: "nodeB" | "nodeC" }>` form so TypeScript knows its valid `goto` targets. `START` and `END` are special virtual nodes marking graph entry and exit — referenced only via `addEdge(START, "someNode")` / `addEdge("someNode", END)`, never given real logic themselves.

**Re-execution and idempotency** (new this pass, from `graph-api.md`'s "Re-execution and idempotency" section): checkpoints are saved at super-step boundaries, not mid-function. If execution stops and resumes — after an interrupt or a retry — the affected node re-runs **from the start of its function**; any code and side effects before the pause point run again. Design node logic so re-execution doesn't corrupt state (idempotency keys, upserts, read-before-write). This is the same rule [Interrupts](#human-in-the-loop-interrupts) states more sharply for `interrupt()` calls specifically.

### Edges

Four kinds, quoted directly:

- **Normal edges** — `addEdge("nodeA", "nodeB")`: always go from A to B.
- **Conditional edges** — `addConditionalEdges("nodeA", routingFunction)`: call a function after `nodeA` runs to decide what's next. By default the routing function's return value (a node name, or an array of node names to run in parallel) *is* the next node's name. **Correction from pass 1:** you can optionally supply a path-map object as an explicit **third argument** — `addConditionalEdges("nodeA", routingFunction, { true: "nodeB", false: "nodeC" })` — that maps the routing function's return value to a node name; pass 1 called this loosely "a second argument," which undersold that it's a distinct, positional third parameter to the same call.
- **Entry point** — `addEdge(START, "nodeA")`: which node runs first.
- **Conditional entry point** — `addConditionalEdges(START, routingFunction)`: choose the first node dynamically (same signature, `START` in place of a node name).

Explicit warning in the docs: pick **one** routing mechanism per node — normal edges for static routing, or conditional edges/`Command` for dynamic routing, never both from the same node, "because both paths can execute and make graph behavior harder to reason about." The `Command` docs restate this even more concretely: `Command` only adds a **dynamic** edge — a static edge added separately with `addEdge` still fires, so if `nodeA` returns `Command({ goto: "myOtherNode" })` *and* you also called `addEdge("nodeA", "nodeB")`, **both** `myOtherNode` and `nodeB` run.

A node with multiple outgoing edges runs **all** of those destinations in parallel as the next super-step.

There's a `ConditionalEdgeRouter<{ InputSchema; Nodes }>` type utility (new this pass) for typing routing functions, parallel to `GraphNode`:

```typescript
const route: ConditionalEdgeRouter<{ InputSchema: typeof State; Nodes: "b" | "c" }> = (state) => {
  return state.which as "b" | "c";
};
```

### `Send` and `Command`

Source: https://docs.langchain.com/oss/javascript/langgraph/graph-api.md (`## Send`, `## Command`) and https://docs.langchain.com/oss/javascript/langgraph/use-graph-api.md (`## Map-Reduce and the send API`, `## Combine control flow and state updates with Command`)

**`Send`** exists because nodes and edges are normally defined ahead of time against one shared state shape — but map-reduce-style fan-out needs an unknown-ahead-of-time number of node invocations, each over its own state slice. Returned from a conditional edge (or entry point), `new Send(nodeName, state)` takes the destination node's name and the state object to hand that specific invocation:

```typescript
graph.addConditionalEdges("nodeA", (state) => {
  return state.subjects.map((subject) => new Send("generateJoke", { subject }));
});
```

`use-graph-api.md`'s full worked example (`generateTopics` → `Send` per subject → `generateJoke` → `bestJoke`) confirms the field each `Send` invocation writes into (`jokes`) needs a `ReducedValue` reducer (`(x, y) => x.concat(y)`) on the shared state, or each parallel `generateJoke` call would clobber the others' output instead of accumulating it — directly the mechanic the reducer section above describes.

**`Command`** is "a versatile primitive for controlling graph execution," accepting up to four parameters, used in three distinct contexts:

- `update` + `goto`, **returned from a node**: combine a state update and routing in one step — `return new Command({ update: { foo: "bar" }, goto: "myOtherNode" })`. A node that returns `Command` **must** declare its possible destinations via `ends` when added: `builder.addNode("nodeA", nodeA, { ends: ["nodeB", "nodeC"] })` — required for graph rendering and validation, not optional decoration.
- `graph: Command.PARENT`, **returned from a subgraph node**: navigate to a node in the *parent* graph instead of the subgraph's own graph — "navigates to the closest parent graph." If the target key is shared between parent and subgraph state schemas, the parent schema **must** define a reducer for it (the child's Command update and the parent's own state need to merge, not clobber).
- `resume`, **passed as input to `invoke()`/`stream()`**: the *only* `Command` shape meant as call input, used to resume after an `interrupt()` — see [Human-in-the-loop](#human-in-the-loop-interrupts). Explicit warning: passing `new Command({ update: ... })` alone as input (with no `resume`) to continue a multi-turn conversation is wrong — any `Command` as input resumes from the latest checkpoint (the last step that ran), not `__start__`, so the graph "will appear stuck" if it already finished. To continue a conversation, pass a plain input object instead, not a `Command`.
- `Command` can also be **returned from a tool** (`@langchain/core` `tool()` function) to update graph state and route after the tool call completes — same `update`/`goto` shape, same "don't also use a static edge from the same node" warning.

## Streaming

Source: https://docs.langchain.com/oss/javascript/langgraph/streaming.md, https://docs.langchain.com/oss/javascript/langgraph/event-streaming.md

Not covered at all in pass 1 beyond a passing mention. LangGraph has **two** streaming APIs, and the docs are explicit about which one to reach for:

**`graph.stream(input, { streamMode })`** — the lower-level, `streamMode`-based API. `streamMode` accepts one or more of: `values` (full state after each step), `updates` (only the update each step returned — multiple updates in one step stream separately), `messages` (`[token, metadata]` tuples from LLM calls anywhere in the graph), `custom` (app-emitted data via a `writer` config param), `tools` (tool-call lifecycle events — `on_tool_start`/`on_tool_event`/`on_tool_end`/`on_tool_error`), and `debug` (everything). Note: the `streaming.md` intro paragraph also names `checkpoints` and `tasks` as stream modes, but the mode table on the same page only documents `values`/`updates`/`messages`/`custom`/`tools`/`debug` — recording this as a documented inconsistency rather than resolving it one way.

```typescript
for await (const chunk of await graph.stream(inputs, { streamMode: "updates" })) {
  console.log(chunk);
}
```

**`graph.streamEvents(input, { version: "v3" })`** — the newer typed-projection API, explicitly recommended over `stream()`/`streamMode` for new applications: "Event streaming is the recommended in-process streaming model for most LangGraph application code," introduced in LangGraph v1.2. It sits one layer above raw `stream()`: raw Pregel events (`updates`/`values`/`messages`/`custom`/`checkpoints`/`tasks`/`debug`) are normalized and run through stream transformers to produce named, independently-iterable projections on the returned stream object:

| Projection | Use |
|---|---|
| `stream` | iterate every protocol event |
| `stream.messages` | chat-model messages / token deltas |
| `stream.values` | state snapshots + the final value |
| `stream.output` | await the final output |
| `stream.subgraphs` | discover/observe nested graph runs |
| `stream.interrupts` | inspect HITL interrupt payloads |
| `stream.interrupted` | whether the run paused for human input |
| `stream.extensions` | custom stream-transformer projections |

Multiple consumers can read different projections concurrently without one draining another — "reading `stream.messages` does not consume events needed by `stream.values`... or `stream.output`." Quickstart shape:

```typescript
const stream = await graph.streamEvents(
  { messages: [{ role: "user", content: "What is 42 * 17?" }] },
  { version: "v3" }
);
for await (const message of stream.messages) {
  for await (const token of message.text) {
    process.stdout.write(token);
  }
}
const finalState = await stream.output;
```

`event-streaming.md` also documents building a custom projection (a "stream transformer") for application-specific event shapes — out of scope for this cookbook, flagged as an open item below.

**`invoke` vs `stream`:** `graph.invoke(input, config?)` runs the graph to completion and resolves once with the full final state (this is all the cookbook uses) — confirmed directly in `use-graph-api.md`'s basic-usage walkthrough: "We receive the entire state in the invocation result." `stream`/`streamEvents` instead give you incremental access — per-step updates, full snapshots, or token-level LLM output — while the run is in progress.

## Persistence / checkpointers

Source: https://docs.langchain.com/oss/javascript/langgraph/persistence.md, https://docs.langchain.com/oss/javascript/langgraph/checkpointers.md

Not exercised in pass 1's cookbook or research. LangGraph has two complementary persistence systems:

- **Checkpointers** persist a **thread's** graph state as checkpoints — short-term, thread-scoped memory: conversation continuity, human-in-the-loop, time travel, fault tolerance.
- **Stores** persist application-defined data **outside** graph state — long-term, cross-thread memory: user preferences, facts, shared knowledge. (Not explored further this pass — see open questions.)

Compile with a checkpointer to enable persistence:

```typescript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer });

const result = await graph.invoke(
  { messages: [{ role: "user", content: "Hi, my name is Bob." }] },
  { configurable: { thread_id: "thread-1" } }
);
```

**`thread_id` is mandatory** once a checkpointer is attached — it's the primary key the checkpointer uses to store and load state, passed under `configurable`. Without it the checkpointer can't save or resume.

**What a checkpoint is:** a snapshot of graph state saved at each **super-step** boundary, represented as a `StateSnapshot` (`values`, `next` — node names still to run, empty `[]` means done — `config`, `metadata` (`source`: `"input"`/`"loop"`/`"update"`, `writes`, `step`), `createdAt`, `parentConfig`, `tasks`). The docs' own worked example (`START → nodeA → nodeB → END`, invoked once with a `MemorySaver`) produces **exactly 4 checkpoints**: the empty initial one, one after input is received (next: `nodeA`), one after `nodeA` runs (next: `nodeB`), and one after `nodeB` runs (next: none). LangGraph also persists **per-node "pending writes"** within a super-step — if one node in a parallel super-step fails, the other nodes' already-completed writes are durable and aren't re-run on resume.

**`MemorySaver`** (from `@langchain/langgraph-checkpoint`, bundled with `@langchain/langgraph` — confirmed present as `@langchain/langgraph-checkpoint@1.1.5` in this repo's own `node_modules/.deno`, a transitive dependency) stores checkpoints **in RAM only** — "does not persist between restarts," explicitly flagged as a common issue in the troubleshooting section. For production, the docs name `PostgresSaver` (async, production-grade), `SqliteSaver` (local file, dev/experimentation), `MongoDBSaver`, and `RedisSaver` — all separate installable packages implementing a common `BaseCheckpointSaver` interface (`.put`, `.putWrites`, `.getTuple`, `.list`).

Three **durability modes**, settable per call (`{ durability: "sync" }`), trading performance for consistency: `"exit"` (persist only when the run exits — fastest, no mid-run crash recovery), `"async"` (persist in the background while the next step runs — small window of risk on crash), `"sync"` (persist before continuing — safest, some latency cost).

**Relevance to human-in-the-loop:** a checkpointer is a hard prerequisite for `interrupt()` — see next section. The cookbook's current `humanReview` node is a terminal stub (`() => ({ resolution: "flagged for human review" })`); turning it into an actual pause-for-a-person step would mean compiling with a checkpointer, giving each run a `thread_id`, calling `interrupt()` inside (or in place of) that node, and resuming with `Command({ resume: ... })` — exactly the "Approve or reject" pattern documented below.

## Human-in-the-loop / interrupts

Source: https://docs.langchain.com/oss/javascript/langgraph/interrupts.md

Not detailed in pass 1 beyond being named a core benefit. This is one of the more prescriptive pages in the docs — it states hard rules, not just capabilities.

**Mechanics:** `interrupt(payload)`, called inside a node, throws a special exception that the LangGraph runtime catches; it saves the current graph state (via the checkpointer) under `__interrupt__` and pauses **indefinitely**. The `payload` must be JSON-serializable. To resume, re-invoke the graph with the **same `thread_id`**, passing `new Command({ resume: someValue })` — `someValue` becomes the return value of the original `interrupt()` call inside the node.

Three prerequisites, all mandatory: a **checkpointer** (state must be persisted to pause/resume across it), a **`thread_id`** in config (the pointer to the paused checkpoint), and an `interrupt()` call at the pause point.

```typescript
import { interrupt } from "@langchain/langgraph";

async function approvalNode(state: State) {
  const approved = interrupt("Do you approve this action?");
  return { approved };
}
```

```typescript
import { Command } from "@langchain/langgraph";

const config = { configurable: { thread_id: "thread-1" } };
const result = await graph.invoke({ input: "data" }, config);
console.log(result.__interrupt__); // [{ value: 'Do you approve this action?', ... }]

await graph.invoke(new Command({ resume: true }), config);
```

**Rules of interrupts** (the highest-value new content this pass — none of this was in pass 1):

1. **Don't wrap `interrupt()` in a bare `try/catch`.** The pause mechanism *is* a thrown exception; a bare catch swallows it and the interrupt never reaches the graph runtime. If you need error handling around code that also calls `interrupt`, separate the two, or re-throw.
2. **Don't reorder or conditionally skip `interrupt()` calls within one node.** On resume, LangGraph restarts the node from the top and matches each `interrupt()` call to a resume value **by strict index position** within that node's execution. Conditionally skipping an `interrupt()` call, or looping `interrupt()` a variable number of times based on data that might differ between the original run and the resume, desyncs the index and mismatches answers to questions. Use a conditional edge for validation loops instead of a `while` loop around `interrupt()`.
3. **Only pass JSON-serializable values to `interrupt()`.** Depending on the checkpointer, complex values (e.g. functions) may not serialize.
4. **Side effects before `interrupt()` must be idempotent** — because resuming re-runs the node from the start, anything before the `interrupt()` call runs again. Prefer upserts over inserts, or move the side effect to *after* the `interrupt()` call, or push it into a separate node entirely.

**Common patterns**, each with a full worked example in the docs:

- **Approve or reject** — pause before a critical action, resume with `true`/`false`, route via a `Command({ goto })` returned from the same node based on the interrupt's answer.
- **Review and edit state** — `interrupt()` surfaces generated content for a human to edit; the resume value replaces it directly.
- **Interrupts inside tools** — placing `interrupt()` inside a `tool()` function itself (not a graph node) so approval logic travels with the tool and applies wherever an LLM calls it.
- **Handling multiple interrupts** — when parallel branches each hit `interrupt()` in the same super-step, `result.__interrupt__` is an array of `{ id, value }` entries; resume by passing `Command({ resume: { [id]: answer, ... } })`, an id→answer map, using `isInterrupted()` and the `INTERRUPT` symbol to read pending interrupts back off a result.
- **Streaming with interrupts** — `streamEvents(..., { version: "v3" })` exposes `stream.interrupted` (boolean) and `stream.interrupts` (payloads) so an app can loop: stream tokens via `stream.messages`, check `stream.interrupted` after the run settles, and if true, collect a human response and re-call `streamEvents` with `Command({ resume })` as input, repeating until `stream.interrupted` is false.

## Routing-function design guidance (the actual point of researching this)

Source: `graph-api.md` and `use-graph-api.md`, both re-checked this pass with a targeted grep for anything resembling decision guidance.

**Confirmed, not just asserted:** neither page says anything about how a routing function passed to `addConditionalEdges` should *decide*. `graph-api.md` describes the mechanism only ("the `routingFunction` accepts the current `state` of the graph and returns a value"). `use-graph-api.md`'s own worked conditional-branching example is the closest thing to guidance the docs offer, and it's a placeholder comment, not a recommendation:

```typescript
const conditionalEdge: ConditionalEdgeRouter<{ InputSchema: typeof State; Nodes: "b" | "c" }> = (state) => {
  // Fill in arbitrary logic here that uses the state
  // to determine the next node
  return state.which as "b" | "c";
};
```

Every other example in both pages routes on an already-known field set earlier by a plain, deterministic node (`state.which`, a boolean, `Math.random() > 0.5`) — never on something extracted from unstructured input. There is no example anywhere in these two pages of an LLM call feeding a routing decision, structured or otherwise.

In practice (and this is the gap the new cookbook fills, not a documented LangGraph recommendation — flagging clearly since it's *my* inference, not a primary-source claim), the common approach is an LLM call inside or before the routing function, with its free-text output parsed by hand into one of the fixed node names. That's exactly the failure mode `docs.typesafe.ai`'s own design guidance warns about (see `research/typesafe-ai.md`) — parsing unstructured text into a decision your code then branches on. A TypeSafe `Choice` question returns one of a **closed set** of options directly, with a `confidence` score, so the routing function becomes a direct read of a typed field rather than a parse step — and `confidence` composes naturally with this repo's own confidence-gated routing pattern (lesson 7) to add a "don't act — go to human review" branch alongside the model's chosen category.

## Versions

Checked 2026-09-19 against the npm registry directly (`npm view <pkg> version` / `dist-tags`), not just this repo's installed copies:

| Package | This repo's `node_modules` | npm `latest` |
|---|---|---|
| `@langchain/langgraph` | 1.4.15 | **1.4.16** |
| `@langchain/core` | 1.2.11 | 1.2.11 (unchanged) |
| `@langchain/langgraph-checkpoint` | 1.1.5 | not re-checked |
| `@langchain/langgraph-sdk` | 1.11.0 | not re-checked |

Pass 1's `deno check` spike cited 1.4.15/1.2.11 as current; `@langchain/langgraph` has since moved to 1.4.16 upstream (a patch release), while `@langchain/core` hasn't moved. This repo's `node_modules` is still pinned to 1.4.15 and hasn't been bumped — worth knowing if a future pass diffs behavior against the changelog, but not something this pass investigated (no changelog page was fetched).

## The API reference site

`reference.langchain.com/javascript/*` is still a client-rendered app, confirmed again this pass with `curl -s -A "Mozilla/5.0" -L <url>`. Even following redirects, the response is ~158KB of Next.js HTML; stripped of `<script>` tags and markup it reduces to ~1200 characters of site chrome (title, nav links to other reference sub-sites, an "Ask AI" widget) with **zero** class or method documentation content — no `addConditionalEdges`, no `addNode`, no `compile` anywhere in the rendered text. Confirmed unusable for both `StateGraph` and general class pages; skipped again, same as pass 1. Everything in this file is grounded in the `docs.langchain.com` guide pages instead, which serve real markdown to `curl`.

## Documented inconsistencies worth flagging (not resolving)

Small things noticed while reading multiple pages that don't add up perfectly — recorded as observations about the docs, not corrected, since guessing at which is "right" would violate this repo's no-invented-facts rule:

- State-type helper naming: `interrupts.md` uses `typeof State.State` (matches this cookbook's usage); `checkpointers.md` uses `typeof State.Type` in one node signature. Both may be valid — not independently verified against the package's own `.d.ts` this pass.
- `interrupts.md`'s "Handling multiple interrupts" example imports from `@langchain/langgraph` using `Annotation.Root` for state, not `StateSchema` — even though `use-graph-api.md`'s "Alternative state definitions" section frames `Annotation.Root` and the raw Channels API as legacy/alternative patterns next to the current `StateSchema` API. Likely just an unrefreshed example on that one page.
- Import style varies across pages: `import * as z from "zod"` in most examples, `import { z } from "zod/v4"` in a few (`streaming.md`, some of `graph-api.md`'s reducer examples).
- `streaming.md`'s intro paragraph lists `checkpoints` and `tasks` as stream modes; the mode table on the same page documents only `values`/`updates`/`messages`/`custom`/`tools`/`debug`. Not resolved — noted above under Streaming.
- `graph-api.md`'s own "Compiling your graph" example uses `new StateGraph(StateAnnotation)`, while every other example on the same page (and the rest of the docs) constructs state via `new StateSchema({...})`. Likely a stale variable name left over from an older API generation, not a second valid constructor argument.
- `interrupts.md`'s "Stream with human-in-the-loop (HITL) interrupts" section mixes Python call syntax into TypeScript prose — `graph.stream_events(..., version="v3")` and `Command(resume=...)` (snake_case method, Python kwarg syntax) — where the actual code sample two lines later correctly uses `graph.streamEvents(..., { version: "v3" })` and `new Command({ resume: ... })`.

## Open questions / not covered by this pass

1. **Stores** (`/oss/javascript/langgraph/stores`) — the long-term, cross-thread persistence counterpart to checkpointers, named in `persistence.md` but not independently fetched this pass.
2. **Subgraphs** (`/oss/javascript/langgraph/use-subgraphs`) — referenced repeatedly (`Command.PARENT`, checkpoint namespacing) but the dedicated page wasn't fetched.
3. **Functional API** (`/oss/javascript/langgraph/functional-api`) — the `@task`/entrypoint alternative to the graph builder API, referenced from `graph-api.md`'s idempotency section but not read directly.
4. **Time travel** (`/oss/javascript/langgraph/use-time-travel`) — named as a checkpointer benefit, not explored.
5. **Custom stream transformers / `stream.extensions`** (`event-streaming.md`'s "Build your own projection" section) — read the section headings only, not the mechanics.
6. **LangSmith** — mentioned throughout as the paired observability/tracing product; not used or evaluated here.
7. **Python SDK** (`langgraph` on PyPI) — out of scope, this repo is Deno/TS only, same as the existing Python-SDK gap noted for TypeSafe in `research/typesafe-ai.md`.
8. **Whether this repo's own `node_modules` pin (1.4.15) behaves differently from the current 1.4.16** — not diffed against a changelog; flagged in [Versions](#versions) only as a fact, not investigated further.
