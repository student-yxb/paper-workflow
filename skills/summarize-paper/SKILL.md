---
name: summarize-paper
description: Analyze scientific papers (from local files or URLs) and generate comprehensive, structured summaries ready for the knowledge vault.
argument-hint: "<file-path-or-url>"
allowed-tools: Read, Write, Bash, Glob, WebFetch, WebSearch
model: haiku
---

# summarize-paper

Analyze scientific papers (from local files or URLs) and generate comprehensive, structured summaries ready for the knowledge vault.

## Usage

```bash
/summarize-paper <file-path-or-url>
```

**Arguments:**
- `$0` (required): Path to local PDF/markdown file OR URL to paper (arXiv, DOI, etc.)

**Examples:**
```bash
# Local PDF
/summarize-paper temp/attention-paper.pdf

# arXiv URL
/summarize-paper https://arxiv.org/abs/1706.03762

# Already imported paper
/summarize-paper "3-Resource/Zotero/Smith et al - 2023 - Quantum.pdf"
```

## What It Does

1. **Input Processing**: Accepts both local files (PDF, markdown) and URLs to papers
2. **Content Extraction**: Reads paper content using PDF-aware tools
3. **Comprehensive Analysis**: Extracts key information using structured prompts:
   - Bibliographic metadata (title, authors, venue, DOI/arXiv)
   - Research context (challenge, hypothesis, background)
   - Methodology (approach, procedures, implementation details)
   - Findings & contributions (results, novelty, performance)
   - Critical assessment (comparisons, limitations, reproducibility)
   - Related work & concepts
4. **Vault Integration**: Generates markdown note with:
   - YAML frontmatter with metadata
   - Structured sections
   - Suggested tags and related concepts
   - Proper wikilinks
5. **Smart Organization**: Suggests appropriate location in vault based on paper topic

## Output Structure

Creates a comprehensive markdown note with:

- **YAML frontmatter**: type, title, authors, year, topics, venue, DOI/arXiv, tags
- **TL;DR**: One-paragraph executive summary
- **Bibliographic Information**: Complete citation details
- **Research Context**: Challenge, hypothesis, background
- **Methodology**: Approach, procedures, implementation
- **Findings & Results**: Key contributions, validation, metrics
- **Critical Assessment**: Comparisons, limitations, reproducibility
- **Resources & Links**: Paper access, code/data, related papers
- **Related Concepts**: Suggested concept notes to create/link
- **Notes**: Section for personal insights

## Output Location

The skill suggests an appropriate location based on paper topic:

- Physics papers → `3-Resource/Papers/Physics/`
- CS/AI papers → `3-Resource/Papers/Computer-Science/`
- Biology papers → `3-Resource/Papers/Biology/`
- Reviews → `3-Resource/Papers/Reviews/`
- Concept-introducing papers → Consider `3-Resource/Concepts/` instead

## Auto-Tagging

Automatically adds relevant tags:
- Always: `#paper`
- Field tags: `#physics`, `#cs`, `#biology`, `#neuroscience`, etc.
- Method tags: `#deep-learning`, `#quantum`, `#simulation`, etc.
- Type tags: `#conference`, `#journal`, `#preprint`

## Related Skills

- `/add-concept` - Create concept notes for key techniques mentioned in paper
- `/import-project` - Import related project folders with PARA organization

---

**Model**: haiku (fast processing, sufficient for paper analysis)
**Allowed tools**: Read, Write, Bash, Glob, WebFetch, WebSearch

---

## Instructions

You are helping analyze a scientific paper and create a comprehensive, structured summary for the user's knowledge vault.

### Step 1: Parse and Validate Input

1. Check the argument `$0`:
   - If it starts with `http://` or `https://`: This is a URL
   - Otherwise: This is a local file path

2. **For URLs:**
   - Use WebFetch to retrieve the paper content
   - Try to extract text content from the fetched page
   - If it's a PDF URL, save to scratchpad: `/private/tmp/claude-501/-Users-anaderi-Obsidian-iCloud-vault/aecfb1ad-c5e0-4b93-9f53-635ff8ead018/scratchpad/paper-temp.pdf`
   - Store the temp path for later cleanup

3. **For local files:**
   - Normalize the path (handle relative paths from vault root)
   - Verify the file exists using Bash `test -f`
   - If not found, provide clear error with the attempted path

4. **Detect file type:**
   - Check extension: `.pdf`, `.md`, `.txt`
   - PDFs require Read tool (which handles PDF text extraction)

### Step 2: Extract Paper Content

1. Use the Read tool to extract content:
   - Read tool automatically handles PDF text extraction
   - For large files, may need to read in chunks (though Read handles this)

2. If content extraction fails:
   - Provide helpful error message
   - Suggest manual text extraction if PDF is scanned/image-based

### Step 3: Analyze with Enhanced Prompt

Feed the extracted content to this analysis prompt:

```
As a specialist in scientific paper analysis, conduct a meticulous examination
of the provided document and extract key information into structured categories.

PAPER CONTENT:
---
{PAPER_TEXT}
---

Your analysis should produce a comprehensive summary with these fields:

CORE BIBLIOGRAPHIC INFO:
- Title: The complete paper title
- Authors: First author name and last author name (and key middle authors if notable)
- Year: Publication or submission year (from paper or metadata)
- Venue: Conference name or journal title (e.g., "NeurIPS 2023", "Nature")
- DOI: Digital Object Identifier if present (format: 10.XXXX/XXXXX)
- arXiv ID: arXiv identifier if present (format: XXXX.XXXXX)

TOPICS & CLASSIFICATION:
- Topics: Scientific areas/fields (2-5 items)
  Example: ['Deep Learning', 'Computer Vision', 'Image Generation']
- Type: Paper type (Conference paper / Journal article / Preprint / Survey)

RESEARCH CONTEXT:
- Challenge: Main research question or problem addressed
  - Focus on knowledge gap or specific problem to be resolved
  - 2-3 sentences maximum

- Hypothesis: Research hypothesis or expected findings
  - Include predictions or anticipated outcomes
  - State if hypothesis testing is explicit or implicit
  - Write "Not explicitly stated" if no clear hypothesis

- Background: Why this work matters
  - Motivation and context
  - Related prior work mentioned (brief)

METHODOLOGY:
- Approach: High-level methodology description
  - Overall research approach and framework
  - 2-3 sentences

- Procedures: Detailed experimental procedures
  - Materials used
  - Data collection methods
  - Experimental setup

- Models/Simulations: Computational aspects
  - Specific models or algorithms employed
  - Simulation parameters if applicable
  - Architecture details for neural networks

- Implementation: Technical details
  - Datasets used (name, size, source)
  - Hyperparameters or key settings
  - Training procedures or experimental protocols

FINDINGS & CONTRIBUTIONS:
- Principal Results: Main findings and conclusions
  - Key data points and observed patterns
  - Quantitative results with metrics
  - Statistical significance if reported

- Key Contributions: What's novel or innovative
  - Original contributions to the field
  - Advances beyond prior work
  - 3-5 bullet points

- Hypothesis Validation: Do results affirm hypothesis?
  - Explicit statement of validation or refutation
  - Partial validation with caveats if applicable
  - Write "N/A" if no hypothesis was stated

- Performance: Quantitative metrics
  - Accuracy, F1, RMSE, or domain-specific metrics
  - Comparison with baselines or state-of-the-art
  - Include specific numbers when available

CRITICAL ASSESSMENT:
- Comparison Methods: Related work and how it compares
  - List specific alternative methods mentioned (2-4 methods)
  - How proposed method differs in:
    - Effectiveness (better/worse results)
    - Efficiency (speed, resources)
    - Scope (applicability, generalizability)
    - Application domain

- Limitations: Stated or apparent limitations
  - What authors acknowledge
  - Potential weaknesses
  - Scope constraints

- Reproducibility: Code and data availability
  - GitHub repository links (extract exact URLs)
  - Dataset availability and access
  - Sufficient implementation details for reproduction?

- Future Work: Suggested next steps
  - What authors propose as follow-up
  - Open questions remaining

REFERENCES & CONNECTIONS:
- Key Citations: Important papers referenced (top 3-5)
  - Papers that this work builds directly upon
  - Include author and year if extractable
  - Papers that warrant reading for context

- Related Concepts: Theoretical concepts or techniques (3-7 items)
  - Novel algorithms or methods introduced
  - Key theoretical frameworks used
  - Important techniques mentioned
  - Format as list of concept names that could become vault notes

OUTPUT FORMAT:
Present findings as a structured JSON object with these exact keys:
{
  "title": "...",
  "authors": "First Author, ..., Last Author",
  "year": "YYYY",
  "venue": "..." or "Not stated",
  "doi": "..." or "Not found",
  "arxiv": "..." or "Not found",
  "type": "Conference paper|Journal article|Preprint|Survey",
  "topics": ["topic1", "topic2", ...],
  "tldr": "One paragraph executive summary (2-4 sentences)",
  "challenge": "...",
  "hypothesis": "...",
  "background": "...",
  "approach": "...",
  "procedures": "...",
  "models": "...",
  "implementation": "...",
  "results": "...",
  "contributions": ["Contribution 1", "Contribution 2", ...],
  "validation": "...",
  "performance": "...",
  "comparison_methods": "...",
  "limitations": "...",
  "reproducibility": "...",
  "future_work": "...",
  "key_citations": ["Paper 1 (Author, Year)", "Paper 2", ...],
  "related_concepts": ["Concept1", "Concept2", ...]
}

IMPORTANT: Ensure each field delivers precise information without overlap between
categories. Focus on factual extraction - avoid speculation. If information is not
present, state "Not explicitly stated" or "Not found" rather than inferring.
```

### Step 4: Generate Vault-Ready Note

Using the extracted analysis, create a markdown note with this structure:

```markdown
---
type: paper-summary
title: "{title}"
authors: [{authors_as_list}]
year: {year}
topics: [{topics}]
venue: "{venue}"
arxiv: "{arxiv_if_present}"
doi: "{doi_if_present}"
date-summarized: {TODAY}
tags: [paper, {auto_generated_tags}]
---

# {title}

**TL;DR:** {tldr}

**Source:** {link_to_source}

## Bibliographic Information

- **Title:** {title}
- **Authors:** {authors}
- **Year:** {year}
- **Venue:** {venue}
- **DOI/arXiv:** {doi_or_arxiv}

## Topics & Classification

{topics_list}

## Research Context

### Challenge
{challenge}

### Hypothesis
{hypothesis}

### Background & Motivation
{background}

## Methodology

### Approach
{approach}

### Procedures & Materials
{procedures}

### Models & Simulations
{models}

### Implementation Details
{implementation}

## Findings & Results

### Principal Results
{results}

### Key Contributions
{contributions_as_bullets}

### Hypothesis Validation
{validation}

### Performance Metrics
{performance}

## Critical Assessment

### Comparison of Methods
{comparison_methods}

### Stated Limitations
{limitations}

### Reproducibility
{reproducibility}

### Future Work
{future_work}

## Resources & Links

### Paper Access
- {source_links}

### Code & Data
{code_and_data_links}

### Related Papers
{key_citations_as_wikilinks}

### Related Concepts
{related_concepts_as_wikilinks}

## Notes

[Add your personal insights and commentary here]

---

*Summarized:* {TODAY}
*Source type:* {PDF|arXiv|URL}
*Tags:* {all_tags}
```

**Auto-tagging logic:**
- Always include: `#paper`
- Add field tags based on topics:
  - Physics → `#physics`
  - Computer Science/AI → `#cs`, `#ai`
  - Deep Learning → `#deep-learning`
  - Biology → `#biology`
  - Neuroscience → `#neuroscience`
  - Materials → `#materials`
  - Quantum → `#quantum`
- Add type tag: `#conference`, `#journal`, or `#preprint`
- Add method tags based on techniques mentioned

### Step 5: Suggest Output Location

Based on paper topics, suggest appropriate vault location:

**Suggestion logic:**
- Check primary topic from topics list
- Physics/Materials → `3-Resource/Papers/Physics/`
- Computer Science/AI/ML → `3-Resource/Papers/Computer-Science/`
- Biology/Neuroscience → `3-Resource/Papers/Biology/`
- Mathematics → `3-Resource/Papers/Mathematics/`
- Survey/Review papers → `3-Resource/Papers/Reviews/`
- Multi-disciplinary → Ask user to choose

**Filename format:** `{FirstAuthor}-{Year}-{ShortTitle}.md`
- Example: `Vaswani-2017-Attention.md`
- Limit ShortTitle to 3-5 key words
- Remove special characters from filename

Present suggestion to user:
```
Suggested location: 3-Resource/Papers/{Category}/{Filename}

Would you like to:
1. Save to suggested location
2. Specify custom location
3. Save to default (3-Resource/Papers/)
```

If user chooses option 2, ask for path. Otherwise proceed with suggestion.

### Step 6: Create the Note

1. Ensure target directory exists (create if needed)
2. Write the markdown file using Write tool
3. Verify file was created successfully

### Step 7: Cleanup (if URL was fetched)

If paper was downloaded from URL:
- Remove temp file from scratchpad using Bash `rm`
- Report cleanup status

### Step 8: Output Summary

Provide concise summary to user:

```
✓ Paper summary created: {full_path}

Key Information:
- Title: {title}
- Authors: {authors}
- Year: {year}
- Topics: {topics}

Suggested Related Concepts (consider creating notes):
{list_related_concepts_with_brief_explanation}

Next Steps:
- Review and add personal notes to the "Notes" section
- Create concept notes for: {top_3_concepts}
- Link to related papers: {key_citations}
```

### Error Handling

**File not found:**
```
Error: Could not find file at path: {attempted_path}

Please check:
- Path is correct
- File exists
- You have read permissions

Example usage:
  /summarize-paper temp/paper.pdf
  /summarize-paper "3-Resource/Zotero/paper.pdf"
```

**URL fetch failed:**
```
Error: Could not fetch paper from URL: {url}

Suggestions:
- Check if URL is accessible
- Try downloading manually and use local path
- Verify URL is for a paper (not a landing page)
```

**PDF unreadable:**
```
Warning: PDF text extraction may be incomplete.

This could mean:
- PDF is scanned/image-based (needs OCR)
- PDF has restrictions
- File is corrupted

Attempting to proceed with extracted content...
```

**Insufficient content:**
```
Warning: Extracted content is very short ({char_count} characters).

Creating minimal structure. You may need to:
- Manually add missing information
- Try a different file format
- Check if file is complete
```

**Large files (>10MB):**
```
Note: Large file detected ({size}MB). Processing may take 30-60 seconds...
```

### Implementation Notes

- Use Haiku model for cost efficiency (paper analysis works well with smaller model)
- Preserve user's original file if local (don't move or modify)
- For URLs, show the URL being fetched
- Handle both arXiv URLs (can extract arXiv ID) and DOI URLs specially
- Be concise in output - focus on actionable next steps
- If analysis produces incomplete results, create note anyway with warnings
- Suggest creating concept notes only for truly novel/important concepts (not every term)

### Validation Checklist

Before completing, verify:
- ✓ Valid YAML frontmatter (proper list syntax)
- ✓ All required sections present
- ✓ Proper markdown formatting (headers, lists, links)
- ✓ At least 3 auto-generated tags
- ✓ Related concepts formatted as potential wikilinks
- ✓ Source link or file reference included
- ✓ Date in YYYY-MM-DD format
- ✓ No placeholder text like "{title}" remains
- ✓ File saved to correct location
- ✓ Temp files cleaned up if applicable
