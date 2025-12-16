"""Parse and format citations from LLM responses"""
import re
from typing import List, Dict, Any
from app.models import Citation


def parse_citations(
    response_text: str,
    context_passages: List[Dict[str, Any]]
) -> List[Citation]:
    """
    Extract citations from response text and match to context passages

    Looks for patterns like:
    - [Chapter 3, Section 2]
    - [Chapter 3]
    - [Section 2]

    Args:
        response_text: Generated response containing citation markers
        context_passages: Retrieved passages with metadata

    Returns:
        List of Citation objects with URLs

    Example:
        >>> text = "IK is complex [Chapter 3, Section 2]. Joints vary [Chapter 1]."
        >>> citations = parse_citations(text, passages)
        >>> len(citations)
        2
    """
    citations = []
    seen_citations = set()  # Avoid duplicates

    # Regex pattern for citation markers
    # Matches: [Chapter X, Section Y], [Chapter X], [Section Y]
    pattern = r'\[(?:Chapter\s+(\d+))?(?:,\s*)?(?:Section\s+(\d+))?\]'

    matches = re.finditer(pattern, response_text, re.IGNORECASE)

    for match in matches:
        chapter_num = match.group(1)
        section_num = match.group(2)

        if not chapter_num and not section_num:
            continue  # Invalid citation

        # Create citation key to avoid duplicates
        citation_key = f"{chapter_num or 'all'}:{section_num or 'all'}"
        if citation_key in seen_citations:
            continue

        seen_citations.add(citation_key)

        # Find matching passage
        matching_passage = find_matching_passage(
            chapter_num=int(chapter_num) if chapter_num else None,
            section_num=int(section_num) if section_num else None,
            passages=context_passages
        )

        if matching_passage:
            payload = matching_passage['payload']

            # Build citation text
            citation_text_parts = []
            if chapter_num:
                citation_text_parts.append(f"Chapter {chapter_num}")
            if section_num:
                citation_text_parts.append(f"Section {section_num}")
            citation_text = ", ".join(citation_text_parts)

            # Create Citation object
            citation = Citation(
                text=citation_text,
                url=payload.get('doc_url', '/docs/unknown'),
                chapter=payload.get('chapter', f"Chapter {chapter_num or '?'}"),
                chapter_number=int(chapter_num) if chapter_num else 0,
                section=payload.get('section'),
                section_number=int(section_num) if section_num else None,
                heading=payload.get('heading')
            )

            citations.append(citation)

    return citations


def find_matching_passage(
    chapter_num: int = None,
    section_num: int = None,
    passages: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Find the best matching passage for a citation

    Args:
        chapter_num: Chapter number to match
        section_num: Section number to match
        passages: List of passage dictionaries with payload

    Returns:
        Best matching passage or None
    """
    if not passages:
        return None

    best_match = None
    best_score = 0

    for passage in passages:
        payload = passage.get('payload', {})
        score = 0

        # Match chapter
        if chapter_num and payload.get('chapter_number') == chapter_num:
            score += 10

        # Match section
        if section_num and payload.get('section_number') == section_num:
            score += 5

        # Update best match
        if score > best_score:
            best_score = score
            best_match = passage

    # If no good match, return first passage
    return best_match if best_score > 0 else passages[0]


def format_citation_text(chapter_number: int = None, section_number: int = None) -> str:
    """
    Format citation display text

    Args:
        chapter_number: Chapter number
        section_number: Section number

    Returns:
        Formatted citation string

    Example:
        >>> format_citation_text(3, 2)
        'Chapter 3, Section 2'
        >>> format_citation_text(3)
        'Chapter 3'
    """
    parts = []

    if chapter_number:
        parts.append(f"Chapter {chapter_number}")

    if section_number:
        parts.append(f"Section {section_number}")

    return ", ".join(parts) if parts else "Unknown"


def generate_docusaurus_url(
    chapter_number: int,
    section_number: int = None,
    heading: str = None
) -> str:
    """
    Generate Docusaurus-compatible URL from citation info

    Args:
        chapter_number: Chapter number
        section_number: Section number (optional)
        heading: Heading text (optional)

    Returns:
        URL path like /docs/chapter-3/inverse-kinematics#section-2

    Example:
        >>> generate_docusaurus_url(3, 2, "Analytical IK")
        '/docs/chapter-3#section-2'
    """
    # Build base URL
    url = f"/docs/chapter-{chapter_number}"

    # Add section anchor if provided
    if section_number:
        url += f"#section-{section_number}"

    # Add heading anchor if provided (slugified)
    elif heading:
        slug = heading.lower().replace(' ', '-').replace('_', '-')
        slug = re.sub(r'[^a-z0-9\-]', '', slug)
        url += f"#{slug}"

    return url
