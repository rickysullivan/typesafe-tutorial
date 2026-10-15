# Photo-criticism rubrics and ten new ones for the phone and AI era

Oct 15, 2026 · @Ricky Sullivan

Composition, technical quality, light and colour dominate how photos are judged, but almost nothing published checks whether an image has been computed, generated or templated; ten new rubrics target that gap, and two of them should only be used in restricted form.

## Key findings

1. **The canon is stable and mostly untested.** PPA's 12 Elements, RPS criteria, PSA and club guides, and FIAP salon practice share one core: impact, technical excellence, composition, light, colour, subject and storytelling. They are trained conventions with point anchors, not psychometrically validated instruments.
2. **Agreement falls as criteria get more semantic.** Sharpness and noise agree with overall quality at SRCC 0.89-0.96 (SPAQ). Overall aesthetic judgement does not: individual raters correlate with the mean at about 0.67 on AADB.
3. **Authenticity is enforced by rule, not by looking.** World Press Photo, PSA, NPPA and Sony check process disclosure and original files. A downscaled, EXIF-stripped JPEG is the input they refuse to rely on.
4. **People are poor at spotting AI images.** Microsoft's study of about 287,000 judgements found a 62% success rate. A single-image model should not be asked for a verdict.
5. **Vision-language models are weak aesthetic judges.** AesBench found only "rudimentary" aesthetic perception, and worse results on AI-generated images than on natural ones.

Start with the three new rubrics that test well and carry low accusation risk: `computational_look`, `thumbnail_legibility` and `lighting_physics_consistency`.

## Part 1a-c: frameworks, judging criteria, critics' vocabularies

Feldman and Barrett both separate description from judgement, which is what situational Score levels do in practice. Interpretation, the step Feldman ranks highest, is where single-image models are weakest.

### Formal critique frameworks

| Framework | Steps / criteria | Status |
| --- | --- | --- |
| Feldman (1970) | Description, formal analysis, interpretation, judgement; the dominant art-education critique format | Foundational teaching protocol, not a scoring instrument |
| Terry Barrett, *Criticizing Photographs* | Describe, interpret, evaluate, theorise; interpretations are arguments backed by visible evidence | Foundational; shapes photo-education critique |
| Elements and principles of design | Line, shape, form, value, colour, texture, space; balance, emphasis, rhythm, unity, contrast, proportion | Convention; ancestor of AADB's balancing element, repetition and symmetry |
| Aesthetic theories | Imitationalism, formalism, expressionism, contextualism, instrumentalism: each values something different | Theory; useful for choosing which dimensions a genre weights |
| Liz Lerman's Critical Response Process | Statements of meaning, artist as questioner, neutral questions, permissioned opinions | Established workshop protocol; deliberately avoids scores |

### Published photography judging criteria

| Body | Named criteria | Scale / anchors |
| --- | --- | --- |
| PPA 12 Elements of a Merit Image | Impact, technical excellence, creativity, style, composition, presentation, colour balance, centre of interest, lighting, subject matter, technique, storytelling; the IPC now assesses only impact, technical excellence, composition and style | 100-point scale; 80-84 deserves a merit; panels of 5+ trained judges |
| RPS Licentiate (LRPS) | Technical (no processing faults); artistic and visual awareness (light, backgrounds, viewpoint); visual narrative; presentation of a 10-image panel | Pass/fail panel; sequence is assessed |
| PSA and camera-club guides | Impact, technical perfection, exposure, focus, composition, imagination | Typical 3-9 or 5-10 per judge; 4Cs anchors run from serious technical defects (2) to the best you have seen (9) |
| PSSA salon guideline (FIAP/PSA style) | Salon standard versus award | Out of 15 per judge: 15 award candidate, 14 certificate of merit, 12 definite acceptance, 9 not salon standard; acceptance target 20-25% |
| FIAP | Salon patronage rules; biennials judge coherent collections in two steps | Acceptance capped at 25% |
| PSA Photojournalism and Nature | Photojournalism: storytelling over pictorial quality; Nature: truth of the scene, natural-looking adjustments | Per-salon scoring |
| World Press Photo | Accurate and visually compelling insight; compliance with its Code of Ethics | Jury rounds; camera originals checked at final stages |
| NPPA Code of Ethics | Editing must keep the integrity of content and context; no misleading manipulation | Ethics rule, not a scale |
| Sony World Photography Awards | Manipulation allowed if described; computer-generated content cannot be the origin | Jury discretion |

The scales are steep at the top, used mainly to rank, and anchored with vague words such as "solid" and "exceptional". That is the degree-wording the Jev docs say to avoid. The PSSA and 4Cs anchors come closest to situational levels, and even they merge technical and artistic judgements into one number.

### Critics' vocabularies

| Thinker | Evaluative vocabulary | Maps to |
| --- | --- | --- |
| John Szarkowski | The thing itself, the detail, the frame, time, vantage point | Subject, framing, moment, viewpoint; v0 covers frame (`edge_control`) and time (`moment`) |
| Roland Barthes | Studium (coded interest) versus punctum (the detail that pricks one viewer) | Punctum is personal by definition, so unscorable in principle |
| Henri Cartier-Bresson | The decisive moment | Already `moment` |
| Susan Sontag, John Berger | Images carry ethics and ideology; ways of seeing are learned | Motivates intent inputs and caution about cultural bias |
| Ansel Adams | Previsualisation, Zone System | Intent to tonal execution; `exposure_tone` and `intent_fit` |
| Fred Ritchin, Joan Fontcuberta, Hito Steyerl | Post-photography, circulation, the poor image | Motivates provenance and legibility rubrics (Part 2) |

These are foundational principles critics actually use. None is a validated measurement.

## Part 1d: what raters actually agree on

Technical quality is the only criterion with strong human agreement; overall merit, interest and originality are where raters disagree most.

| Dataset / study | What it measured | Reliability datapoints |
| --- | --- | --- |
| AVA (Murray et al., 2012; DPChallenge) | Overall aesthetics, 1-10 | 78-549 votes per image; means cluster near the midpoint (about 5.5, SD about 1.4), which is score compression; high-variance images are often the unconventional ones |
| AADB (Kong et al., 2016) | Overall score plus 11 attributes: interesting content, object emphasis, lighting, colour harmony, vivid colour, shallow depth of field, motion blur, rule of thirds, balancing element, repetition, symmetry | 10,000 Flickr images, 5 raters each; individual-vs-mean rho 0.674; best model rho 0.678; transfer collapses: AADB to AVA 0.157, AVA to AADB 0.319 |
| PCCD (Chang et al., 2017) | Expert critiques on 7 aspects, including composition, colour and lighting, subject, depth of field, focus, exposure | About 4,235 images with critiques and ratings |
| EVA (Kang et al., 2020) | Overall plus light and colour, composition and depth, quality, semantics | 4,070 images, 30+ votes each; authors note difficulty of judging is itself subjective; no per-attribute agreement found |
| SPAQ (Fang et al., 2020; smartphone photos) | Quality plus brightness, colourfulness, contrast, noisiness, sharpness | Split-half SRCC 0.923; attribute vs quality: sharpness 0.958, noisiness 0.893, contrast 0.874, colourfulness 0.844, brightness 0.784 |
| KonIQ-10k (Hosu et al., 2020) | In-the-wild technical quality | 120 ratings per image; reported agreement up to 0.973 SROCC (setting not verified) |
| AesBench (Huang et al., 2024) | Multimodal model aesthetic perception, empathy, assessment, interpretation | Models show "rudimentary" perception; worse on AI-generated images than natural ones; interpretations suffer from hallucination |
| NIMA, LAION aesthetic predictor | Learned predictors of AVA-style mean scores | Inherit AVA's compression and DPChallenge taste; use as baselines only |

**Reliably judgeable:** sharpness, noise, exposure, contrast, gross composition faults. In practice, technical quality.

**Moderately judgeable:** lighting quality, colour harmony, object emphasis, composition attributes.

**Highly subjective:** overall merit, interesting content, emotional impact, originality.

**Known problems:**

- Score compression around the scale midpoint.
- Taste populations that do not transfer between datasets.
- A gap between technical quality and aesthetic merit: SPAQ and KonIQ measure quality, and a sharp photo can still be dull.
- Halo effects and a bias toward polish and saturation. Adobe's Marc Levoy concedes the smartphone look is partly driven by consumer preference, but I found no controlled study quantifying the saturation bias, so treat it as plausible but under-evidenced.

## Part 1e: criteria ranked by how many of 15 sources name them

Composition leads, followed by technical quality, light and colour; your v0 set already covers ranks 1-8 except colour, which you could add as a plain Score. Authenticity is the only frequently named criterion with no visual rubric anywhere.

I coded 15 sources myself: Feldman, elements and principles, PPA 12, PPA IPC-4, RPS LRPS, club guides, PSA photojournalism and nature, WPP, NPPA, AADB, PCCD, EVA, SPAQ, Szarkowski, and Cartier-Bresson with Barthes. The counts show direction, not precise frequency.

| Rank | Criterion | Sources (of 15) | Named by | Evidence level |
| --- | --- | --- | --- | --- |
| 1 | Composition, design, frame | 10 | Feldman, E&P, PPA12, IPC4, RPS, clubs, AADB, PCCD, EVA, Szarkowski | Established practice; moderate agreement |
| 2 | Technical quality | 8 | PPA12, IPC4, RPS, clubs, PSA, PCCD, EVA, SPAQ | Established and validated; high agreement |
| 3 | Light | 7 | E&P, PPA12, RPS, AADB, PCCD, EVA, SPAQ | Established; moderate agreement |
| 4 | Colour | 6 | E&P, PPA12, AADB, PCCD, EVA, SPAQ | Established; moderate agreement |
| 5= | Subject, centre of interest | 5 | PPA12, AADB, PCCD, EVA, Szarkowski | Convention; low-moderate agreement |
| 5= | Impact, first impression | 5 | PPA12, IPC4, clubs, PCCD, Barthes | Convention; low agreement |
| 5= | Storytelling, meaning | 5 | Feldman, PPA12, RPS, PSA photojournalism, WPP | Foundational principle; untested as a score |
| 8 | Creativity, originality, style | 4 | PPA12, IPC4, RPS, clubs | Convention; lowest agreement |
| 9 | Authenticity, integrity | 3 | PSA, WPP, NPPA (plus Sony) | Established rule; no visual rubric |
| 10= | Presentation, finish | 2 | PPA12, RPS | Convention |
| 10= | Moment, timing | 2 | Szarkowski, Cartier-Bresson | Foundational principle |

## Part 2: what phones, AI and feeds changed

Every serious contest body now enforces authenticity through process disclosure and original files, not by looking at the image, which is the one input your pipeline never has.

**The smartphone look has a published definition.** Marc Levoy, who led Google's computational camera work and now leads Adobe's Project Indigo, describes it as overly bright, low contrast, highly saturated, strongly smoothed and strongly sharpened, and says part of it is driven by consumer preference. He warns that pushed HDR can look unrealistic on screens larger than a phone. Because the look is described this concretely, it can become a rubric.

**Contest rules hardened after 2023.**

- **Sony World Photography Awards 2023:** Boris Eldagsen's AI-generated "Pseudomnesia: The Electrician" won the Creative category; he refused the prize.
- **World Press Photo:** reversed a plan to allow generative AI in November 2023. Its 2026 rules ban generative fill and AI enlarging tools such as Adobe Super Resolution and Topaz Photo AI, because they introduce new information. Rule 20 accepts smartphone photos only in standard shooting mode, not HDR, portrait mode, creative lighting or panorama. Camera originals are checked at the final stages.
- **PSA:** bans images created in whole or in part by image creation software, bans replacement skies, and allows AI editing only if it uses visual information already present.
- **Sony:** manipulation must be described, and computer-generated content cannot be the origin of an entry.

**Human detection of AI images is weak.**

| Study | Result |
| --- | --- |
| Microsoft AI for Good Lab (about 287,000 judgements, 12,500+ participants) | 62% overall success; most trouble with natural and urban landscapes |
| Lu et al., "Seeing is not always believing" | 61.3% overall; real photos identified correctly 66.9% of the time |
| HPBench (2025) | 39.64% in special scenarios versus 58.29% in everyday scenes; brief few-shot exposure raised accuracy from 42.07% to 55.86% |

**Provenance depends on metadata you strip.** C2PA Content Credentials are cryptographically signed, but the metadata is removable by design and social platforms routinely strip it. Durable credentials add watermarks and fingerprints to recover it. With EXIF stripped and a 1568 px cap, Jev will never see these signals, so any provenance rubric guesses from appearance alone.

**Homogenisation and abundance.**

- A study of 800 top Instagram posts on AlUla and Socotra found aesthetic homogenisation and concentrated visibility: in Socotra, the top 10% of posts captured 93.5% of likes.
- A 2025 study of 625 landscape photos by 25 German-speaking influencers reports users mimicking high-performing content, which homogenises the look.
- Miller (2025) identifies a "digital beauty template" in Instagram filters between 2021 and 2024: replicable, hegemonic and Eurocentric.
- Fontcuberta's post-photography argument puts circulation and management of images ahead of their content, and Steyerl's "poor image" values images by how they circulate rather than by resolution.

The critical theory is argument, not measurement. It does justify rubrics about template conformity and about how images survive downscaled circulation.

## Ten novel rubrics, 1-5

All ten are speculative: none has a rated dataset behind it. Put a Noul gate such as `has_person` in front of any gated Score, because Jev scores each question in isolation and has no "not applicable" level unless you give it one.

### 1. `computational_look`

**Question:** "Which processing regime does this photo's rendering most resemble?" **Type:** Choice.

- **A, restrained camera rendering:** shadows stay dark where the scene was dark, highlights roll off, fine texture shows grain rather than smoothing.
- **B, default smartphone rendering:** shadows lifted so dark areas look evenly lit, flat midtone contrast, skies held against bright foregrounds, crisp edge halos, smoothed flat areas.
- **C, deliberate stylised edit:** a uniform colour cast or preset applied across the frame, such as teal-orange or faded blacks.
- **D, synthetic-looking rendering:** uniformly clean surfaces with no sensor noise anywhere, including dark regions.

**Why now:** Levoy's published definition of the smartphone look and WPP Rule 20. `processing_artefacts` catches defects; this classifies the pipeline. **Judgeable from one 1568 px image:** mostly; passing EXIF as text would help a lot. **Case against:** phone and camera rendering have converged, presets mimic both, and option D overlaps `origin_triage`, so keep its wording visual rather than causal.

### 2. `synthetic_bokeh_plausibility`

**Gate:** Noul `has_shallow_dof`. **Question:** "How consistently does background blur follow the depth of the scene?" **Type:** Score.

1. The blur boundary cuts through the subject: hair, glasses arms, ear edges or held objects are blurred while adjacent background is sharp, or a sharp halo hugs the outline.
2. Depth is mostly coherent but one region is wrong: a gap between arm and torso keeps sharp background, or a foreground object at subject distance is blurred.
3. Blur increases with distance and the ground plane falls off gradually; the only uncertainty is in fine hair.
4. Foreground and background blur both scale with distance, out-of-focus highlights are consistent discs, and no outline artefacts are visible.

**Why now:** portrait mode is excluded by WPP, and depth of field is already an AADB and PCCD attribute. **Judgeable from one image:** partly; hair-level errors may vanish at 1568 px, so send a 1:1 crop of the subject outline as a second image. **Case against:** real lenses also produce odd blur (swirly, cat's-eye), so Jev may punish real optics or reward clean fakes.

### 3. `generative_detail_coherence`

**Question:** "Does fine detail (text, hands, repeated structures, foliage, fabric) hold together as real objects when examined?" **Type:** Score.

1. Pseudo-text with glyph-like shapes, fused or extra fingers, or structures (railings, windows, teeth) that merge or change count.
2. One area where detail dissolves into plausible texture that is not any particular object, such as a painted-looking crowd or foliage.
3. Detail is coherent wherever inspected but carries a uniform waxy or over-defined micro-texture, typical of AI denoise or upscaling.
4. Fine detail behaves like optical capture: text is legible or uniformly blurred, repeated objects vary naturally, and grain is consistent across regions.

**Why now:** WPP bans AI upscalers because they introduce new information, and AesBench shows models are weaker on AI images. **Judgeable from one image:** no, levels 2-3 need native-resolution crops. **Case against:** level 1 artefacts are disappearing from newer generators, and heavy JPEG compression or real motion looks similar. **Attempt only on full-resolution crops, never on the 1568 px copy alone.**

### 4. `lighting_physics_consistency`

**Question:** "Do shadows, highlights and reflections across the whole frame agree on where the light comes from?" **Type:** Score.

1. Contradictory: shadows from objects in the same sunlight point in clearly different directions, or a reflection is missing or shows a different scene.
2. One localised mismatch: one element (sky, person, object) is lit from a different direction or with a different colour than its surroundings, or sits without a contact shadow.
3. Consistent overall, with an anomaly explainable by a second visible or plausible source such as a window or flash.
4. Every shadow, highlight and reflection checked is consistent with the visible light sources.

**Why now:** sky replacement (banned by PSA), compositing (WPP Rule 17) and generative fill all break global light coherence. **Judgeable from one image:** yes, gross geometry survives downscaling. **Case against:** mixed real lighting is common and the model may hallucinate inconsistencies; score the description, never "manipulated".

### 5. `origin_triage` (restricted)

**Question:** "Which description best fits how this image appears to have been made?" **Type:** Choice.

- **A:** a single camera capture with global adjustments.
- **B:** a camera capture with visible local compositing or retouching.
- **C:** wholly or partly generated imagery.
- **D:** cannot be determined from this copy.

**Why now:** Eldagsen, the WPP and PSA bans, and C2PA. **Judgeable from one image:** no; every authoritative body requires originals or provenance metadata. **Case against:** real photos will be classified as C (Lu et al. found real photos identified correctly only 66.9% of the time). **Do not show this to users or use it in scoring.** Use it only as an internal routing signal to request originals, and act on it only at high confidence and when rubrics 3 and 4 agree.

## Ten novel rubrics, 6-10

### 6. `platform_template_conformity`

**Question:** "How closely does this photo reproduce a recognisable social-media template in subject, pose, framing and grade?" **Type:** Score.

1. A direct replica of a stock feed formula, such as a figure from behind at a famous viewpoint, a hand-held coffee against a café window, or a symmetrical doorway selfie, with a trending preset grade.
2. A stock formula with one specific deviation (unusual weather, gesture or vantage).
3. Uses a genre convention, but the subject, place or moment is particular and could not be swapped for another.
4. No identifiable feed formula; framing and grade follow from this specific scene.

**Why now:** the homogenisation studies and Fontcuberta's priority of circulation over content. **Judgeable from one image:** yes, but the model's sense of "template" is its training distribution. **Overlap:** it overlaps `originality`; check their correlation and merge them above 0.8. **Case against:** culturally and temporally biased because templates drift fast, it penalises legitimate genre work, and one quirky element games it.

### 7. `genre_edit_compliance`

**Needs:** genre text. **Question:** "Given the stated genre, how far has editing gone relative to that genre's published manipulation norms?" **Type:** Score, for documentary, nature and photojournalism.

1. Content visibly altered: an element appears added, removed or relocated, or the sky does not belong to the scene.
2. Content intact, but adjustments change what the scene looked like: implausible colours for the light, or burned-down surroundings that hide context.
3. Noticeable tonal or colour work that keeps the scene's appearance.
4. Adjustments indistinguishable from a careful neutral rendering.

**Why now:** PSA's "must appear natural" and truth-of-the-scene rules, NPPA's ban on misleading edits, WPP Rules 17 and 21. **Judgeable from one image:** needs genre or intent text, and level 1 really needs the original. **Evidence:** convention; the norms are established, judging them visually is speculative. **Distinction from `intent_fit`:** that asks whether the image achieves its intent; this asks whether it respects the genre's ethics. **Case against:** "natural" is culturally and technically contested, and Jev will confuse strong real light with editing.

### 8. `narrative_openness`

**Question:** "How many distinct readings of what is happening does the visible evidence support?" **Type:** Score.

1. One reading, fully stated; nothing is left to infer, as in catalogue or record style.
2. One implied question, answered within the frame by caption-like clarity.
3. Key information withheld (off-frame gaze, interrupted gesture, partial figure), inviting one or two readings.
4. Several incompatible readings, each supported by something visible.

**Why now:** Feldman ranks interpretation highest, Barrett treats it as argument from evidence, and in an attention economy open images reward a second look. **Judgeable from one image:** yes. **Evidence:** foundational theory, untested as a score. **Case against:** openness is not a virtue in photojournalism, product or ID genres, so weight it per genre, and models may over-interpret.

### 9. `thumbnail_legibility`

**Needs:** a second, roughly 200 px copy of the same image. **Question:** "At the small size, what survives of the picture's main idea?" **Type:** Score.

1. The main subject cannot be found, or the picture reads as a different thing.
2. The subject is findable but the key relationship or gesture is lost.
3. Subject and main relationship read; secondary detail is lost.
4. The small copy carries the same idea as the large one.

**Why now:** Steyerl's poor image and Fontcuberta's circulation thesis; most photos are first seen as feed thumbnails. **Judgeable from one image:** no, it needs a second downscale, which is trivial to generate. **Evidence:** speculative but highly testable, and humans should agree on it. **Case against:** it rewards bold, simple graphics and could push toward the homogenised look rubric 6 penalises, so report both together.

### 10. `face_body_retouch`

**Gate:** Noul `has_person`. **Question:** "What has been done to the depicted person's skin and features?" **Type:** Score, descriptive rather than normative.

1. Geometry altered: enlarged eyes, narrowed jaw or waist, with warped straight lines near the body.
2. Skin texture removed entirely: a uniform plastic sheen, with pores and fine hair absent across the face.
3. Light retouching: blemishes reduced, texture visible in most areas.
4. Skin texture, asymmetries and natural irregularities intact.

**Why now:** the filter-culture research on the digital beauty template and smartphone smoothing. **Judgeable from one image:** mostly for levels 1-2; fine skin texture needs a face crop. **Case against:** **high risk of cultural and skin-tone bias.** Makeup, lighting and lens softness mimic retouching, and retouching is legitimate in portrait and fashion work. Use it as a descriptive label only, never as a quality penalty unless the genre is documentary.

## What to avoid, which type fits, pairwise questions

Three uses should not be attempted as specified, because they either need pixel-level evidence the 1568 px copy lacks or risk falsely accusing real photographers.

### Do not attempt

- **`origin_triage` as a verdict.** The accusation risk is unacceptable and the human baseline is near chance. Restrict it to internal routing.
- **`generative_detail_coherence` on the 1568 px copy alone.** Upscaler and denoise signatures are pixel-level; without native crops Jev will judge compression.
- **`synthetic_bokeh_plausibility` hair-level judgements** without a crop.

### Recommended question types

| Type | Use for |
| --- | --- |
| Noul flags | `has_person` and `has_shallow_dof` (gates), `pseudo_text_present`, `extra_or_fused_digits`, `subject_without_contact_shadow` |
| Weighted Scores | `narrative_openness`, `thumbnail_legibility`, `lighting_physics_consistency`, `platform_template_conformity` (low weight) |
| Choice classifiers | `computational_look`, `origin_triage` (internal only) |
| Descriptive labels, unweighted | `face_body_retouch`; `genre_edit_compliance` (weighted only for documentary, nature and photojournalism) |

### Pairwise questions

- "Which of these two photos keeps more of its main idea at thumbnail size?"
- "Which of these two renderings of the same scene looks more like the scene would have looked to a person standing there?" Use phone-default versus neutral pairs.
- "Which of these two images relies more on a recognisable feed formula?"
- "In which of the two does the background blur follow depth more consistently?"
- For portfolios, where RPS and FIAP judge coherence: "Does image B belong in the same set as image A in light, palette and approach?"

## Part 4: summary and experiment plan

Start with the rubrics that are judgeable at 1568 px and cheap to verify, and write down in advance what result would show Jev cannot do the job.

### The ten new rubrics at a glance

| id | Type | Judgeable from one 1568 px image? | Evidence |
| --- | --- | --- | --- |
| `computational_look` | Choice | Yes, mostly | Speculative |
| `synthetic_bokeh_plausibility` | Score (gated) | Partly; needs a crop | Speculative |
| `generative_detail_coherence` | Score | No; needs native crops | Speculative |
| `lighting_physics_consistency` | Score | Yes | Speculative (forensic principle) |
| `origin_triage` | Choice, internal only | No | Speculative; restricted |
| `platform_template_conformity` | Score | Yes | Speculative |
| `genre_edit_compliance` | Score | No; needs genre text, ideally the original | Convention |
| `narrative_openness` | Score | Yes | Foundational theory |
| `thumbnail_legibility` | Score | No; needs a second downscaled copy | Speculative, testable |
| `face_body_retouch` | Score (gated, descriptive) | Mostly; a crop helps | Speculative |

### Experiment plan

1. **Order.** Run `thumbnail_legibility`, `computational_look` and `lighting_physics_consistency` first: they work at 1568 px, ground truth is cheap and accusation risk is low. Then `narrative_openness` and `platform_template_conformity`, which are subjective and need a human ceiling. Run `synthetic_bokeh`, `generative_detail` and `face_body_retouch` last, with crops. Run `origin_triage` only as a measurement study, never in production.
2. **Test set of about 300 images, origin known by construction.**
   - 100 unprocessed captures: dedicated-camera RAW with neutral conversion, plus phone RAW through a zero-process app.
   - 100 phone-default captures across iPhone, Pixel and Samsung, including portrait, night and HDR modes; shoot about 40 as matched pairs with the unprocessed set.
   - 100 AI-touched images: about 40 fully generated across at least 3 generators and prompted to match the real scenes, 30 real photos with generative fill or sky replacement, and 30 real photos run through AI upscaling or denoise.
   - A few dozen images with physical inconsistencies you composite yourself.
3. **Human reference.** At least 5 raters per image, including 2 experienced judges. Compute Krippendorff's alpha per rubric and split-half SRCC. The human ceiling is single-rater-versus-mean rho: about 0.67 for subjective items (AADB) and about 0.84 for perceptual ones (SPAQ).
4. **Metrics for Jev.** Spearman rho between Jev's expected level and the human mean; Choice accuracy against construction ground truth; the false-positive rate on unprocessed real photos for any AI-related output; calibration, meaning whether confidence predicts correctness; correlation with gut-overall as a halo check; and invariance when you rerun at 1568 versus 768 px, after JPEG recompression, mirrored, and with paraphrased level texts.
5. **What would show Jev cannot do it.**
   - Rho below single-rater rho on a rubric where humans agree (alpha of 0.6 or higher).
   - `computational_look` failing to separate matched phone and neutral pairs above chance.
   - `origin_triage` accuracy not clearly above the 62% human baseline, or more than 5% of unprocessed photos labelled as generated.
   - Scores that shift a level after a mere resize or recompression.
   - New dimensions correlating above 0.8 with gut-overall, which indicates a halo effect.
   - Confidence uncorrelated with accuracy.

### Evidence levels, stated bluntly

- **Validated:** only technical-quality perception (sharpness, noise, exposure) has strong human agreement and model fit.
- **Established practice:** the PPA, RPS, PSA and FIAP criteria and the WPP, NPPA and PSA authenticity rules. They are trained and enforced, but not psychometrically validated.
- **Foundational principle:** Feldman, Barrett, Szarkowski, Barthes, Cartier-Bresson.
- **Untested theory:** all ten new rubrics, and the critical claims of Fontcuberta, Steyerl and the homogenisation studies as applied to scoring.

## Caveats

The criteria counts and every new rubric are my own work, and several figures come from secondary reports.

- The 15-source tally is my own coding. A different choice of sources would shift ranks 5-10, but not ranks 1-4.
- Some numbers come from secondary reports: AVA's mean of about 5.5 with SD about 1.4, KonIQ's 0.973, and PCCD's aspect list (taken from a citing paper). EVA's per-attribute agreement could not be retrieved.
- I found no controlled study quantifying rater bias toward saturation or polish. That claim rests on the industry's own admission and on filter-culture research.
- Contest rules change every year; the World Press Photo rules cited are the 2026 edition.
- Commercial "AI contest policy" summaries were used only for context, never as primary evidence.
- AI-detection accuracy figures are snapshots and will get worse as generators improve, which is another reason not to build verdicts on them.

## Sources

Links are the pages the research drew on, as cited in the research report.

- [AADB: Photo Aesthetics Ranking Network with Attributes (Kong et al.)](https://arxiv.org/pdf/1606.01621)
- [SPAQ supplemental: Perceptual Quality Assessment of Smartphone Photography (Fang et al.)](https://openaccess.thecvf.com/content_CVPR_2020/supplemental/Fang_Perceptual_Quality_Assessment_CVPR_2020_supplemental.pdf)
- [SPAQ paper (Fang et al.)](https://ece.uwaterloo.ca/~z70wang/publications/cvpr20_smartphone.pdf)
- [KonIQ-10k](https://arxiv.org/pdf/1910.06180v2)
- [AVA: A Large-Scale Database for Aesthetic Visual Analysis](https://refbase.cvc.uab.es/files/MMP2012a.pdf)
- [EVA: An Explainable Visual Aesthetics Dataset](https://hal.science/hal-02934292v1)
- [AesBench](https://www.emergentmind.com/papers/2401.08276)
- [Predicting Scores of Various Aesthetic Attribute Sets by Learning from Overall Score Labels](https://arxiv.org/html/2312.03222)
- [World Press Photo entry rules](https://www.worldpressphoto.org/contest/entry-rules)
- [World Press Photo: rules change prohibits generative AI images](https://www.worldpressphoto.org/news/2023/could-an-ai-generated-image-win-the-world-press-photo-contest)
- [PSA competition guidelines](https://mcc-nj.org/psa-competition-guidelines/)
- [NPPA Code of Ethics](https://nppa.org/resources/code-ethics)
- [Sony World Photography Awards, Single Image competition](https://www.worldphoto.org/sony-world-photography-awards/open)
- [PPA: 12 Elements of a Merit Image](https://www.ppa.com/articles/photo-competition-prep-understand-the-12-elements-of-a-merit-image)
- [PPAM: 12 Elements and scoring](https://www.ppam.com/12-elements-and-scoring)
- [RPS LRPS guidelines](https://bookhamcameraclub.zenfolio.com/lrps-guidelines.pdf)
- [4Cs judging guidelines](https://www.yaaphotographers.org/wp-content/uploads/2018/02/Judging-guidelines.pdf)
- [PSSA salon judging guidelines](https://pssa.co.za/wp-content/uploads/2012/11/PSSA_Salon_Judging_Guidelines_V2022.1_2022-03-31.pdf)
- [Feldman's critical analysis model (ERIC)](https://files.eric.ed.gov/fulltext/EJ1086252.pdf)
- [Liz Lerman's Critical Response Process](https://www.colorado.edu/center/teaching-learning/sites/default/files/attached-files/liz_lerman_critical_response_1_page.pdf)
- [Adobe Research: Project Indigo](https://research.adobe.com/articles/indigo/indigo.html)
- [Microsoft Research: How good are humans at detecting AI-generated images?](https://www.microsoft.com/en-us/research/publication/how-good-are-humans-at-detecting-ai-generated-images-learnings-from-an-experiment/)
- [Seeing is not always believing](https://arxiv.org/pdf/2304.13023)
- [IPTC: C2PA Content Credentials FAQ](https://iptc.org/std/guidelines/media-provenance/C2PA-FAQs/IPTC-C2PA-FAQs-v1.0-2027-07-08.pdf)
- [C2PA FAQ](https://c2pa.org/faqs/)
- [Landscape constructions on Instagram](https://www.sciencedirect.com/science/article/pii/S2666378325000224)
- [Hito Steyerl: In Defense of the Poor Image](https://www.e-flux.com/journal/10/61362/in-defense-of-the-poor-image)
- [Joan Fontcuberta: post-photography and the spectral image](https://aestheticsofphotography.com/wp-content/uploads/2021/02/Joan_Fontcuberta_post_photography_and_th.pdf)
