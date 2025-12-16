"""Generate embeddings for textbook content and upload to Qdrant"""
import os
import re
import sys
import argparse
import asyncio
from pathlib import Path
from typing import List, Dict, Any

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.utils.cohere_client import embedding_client
from app.utils.qdrant_client import vector_search_client
from dotenv import load_dotenv


class TextbookProcessor:
    """Process textbook markdown files into embeddings"""

    def __init__(self, textbook_path: str):
        """
        Initialize processor

        Args:
            textbook_path: Path to textbook docs directory
        """
        self.textbook_path = Path(textbook_path)
        if not self.textbook_path.exists():
            raise ValueError(f"Textbook path does not exist: {textbook_path}")

    def extract_sections(self, file_path: Path) -> List[Dict[str, Any]]:
        """
        Extract sections from a markdown file

        Args:
            file_path: Path to markdown file

        Returns:
            List of section dictionaries with text and metadata
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        sections = []
        current_section = None
        current_text = []

        # Parse file path for chapter/section info
        relative_path = file_path.relative_to(self.textbook_path)
        parts = relative_path.parts

        # Extract chapter number from path (e.g., "chapter-3" -> 3)
        chapter_match = re.search(r'chapter-(\d+)', str(relative_path))
        chapter_number = int(chapter_match.group(1)) if chapter_match else 0

        # Split content by headers
        lines = content.split('\n')
        for line in lines:
            # Check for section headers (##, ###)
            header_match = re.match(r'^(#{2,3})\s+(.+)$', line)

            if header_match:
                # Save previous section
                if current_section and current_text:
                    section_text = '\n'.join(current_text).strip()
                    if len(section_text) > 50:  # Skip very short sections
                        current_section['text'] = section_text
                        current_section['word_count'] = len(section_text.split())
                        sections.append(current_section)

                # Start new section
                level = len(header_match.group(1))
                heading = header_match.group(2).strip()

                # Extract section number if present
                section_match = re.search(r'(?:Section\s+)?(\d+)', heading)
                section_number = int(section_match.group(1)) if section_match else None

                current_section = {
                    'chapter_number': chapter_number,
                    'chapter': f"Chapter {chapter_number}" if chapter_number else "Introduction",
                    'section_number': section_number,
                    'section': heading if level == 2 else None,
                    'heading': heading if level == 3 else None,
                    'file_path': str(relative_path),
                    'doc_url': self.generate_url(file_path, heading)
                }
                current_text = []
            else:
                current_text.append(line)

        # Save last section
        if current_section and current_text:
            section_text = '\n'.join(current_text).strip()
            if len(section_text) > 50:
                current_section['text'] = section_text
                current_section['word_count'] = len(section_text.split())
                sections.append(current_section)

        return sections

    def generate_url(self, file_path: Path, heading: str = None) -> str:
        """
        Generate Docusaurus URL from file path

        Args:
            file_path: Path to markdown file
            heading: Optional heading for anchor

        Returns:
            URL like /docs/chapter-3/kinematics#section-2
        """
        relative_path = file_path.relative_to(self.textbook_path)

        # Remove .md extension
        url_path = str(relative_path).replace('\\', '/').replace('.md', '')

        # Build URL
        url = f"/docs/{url_path}"

        # Add heading anchor if provided
        if heading:
            slug = heading.lower().replace(' ', '-').replace('_', '-')
            slug = re.sub(r'[^a-z0-9\-]', '', slug)
            url += f"#{slug}"

        return url

    def find_markdown_files(self) -> List[Path]:
        """
        Find all markdown files in textbook directory

        Returns:
            List of paths to .md files
        """
        md_files = list(self.textbook_path.rglob("*.md"))
        md_files = [f for f in md_files if 'node_modules' not in str(f)]
        return md_files


async def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(
        description="Generate embeddings for textbook content"
    )
    parser.add_argument(
        "--textbook-path",
        type=str,
        required=True,
        help="Path to textbook docs directory (e.g., ../textbook/docs)"
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Reset collection (delete all existing embeddings)"
    )

    args = parser.parse_args()

    # Load environment variables
    load_dotenv()

    print("🚀 Starting embedding generation...")
    print(f"📁 Textbook path: {args.textbook_path}")

    # Initialize processor
    processor = TextbookProcessor(args.textbook_path)

    # Reset collection if requested
    if args.reset:
        print("🗑️  Resetting Qdrant collection...")
        await vector_search_client.delete_all()

    # Ensure collection exists
    vector_search_client.ensure_collection_exists()

    # Find markdown files
    md_files = processor.find_markdown_files()
    print(f"📄 Found {len(md_files)} markdown files")

    # Process files
    total_sections = 0
    total_uploaded = 0

    for file_path in md_files:
        print(f"\n📖 Processing: {file_path.name}")

        try:
            # Extract sections
            sections = processor.extract_sections(file_path)
            print(f"   ✂️  Extracted {len(sections)} sections")
            total_sections += len(sections)

            # Generate embeddings in batches
            batch_size = 10
            for i in range(0, len(sections), batch_size):
                batch = sections[i:i + batch_size]

                # Generate embeddings
                texts = [section['text'] for section in batch]
                embeddings = await embedding_client.embed_texts(texts)

                # Upload to Qdrant
                for section, embedding in zip(batch, embeddings):
                    try:
                        await vector_search_client.upsert_embedding(
                            embedding=embedding,
                            metadata=section
                        )
                        total_uploaded += 1
                    except Exception as e:
                        print(f"   ⚠️  Failed to upload section: {e}")

                print(f"   ✅ Uploaded batch {i // batch_size + 1} ({len(batch)} sections)")

        except Exception as e:
            print(f"   ❌ Error processing file: {e}")
            continue

    # Summary
    print(f"\n" + "=" * 50)
    print(f"✨ Embedding generation complete!")
    print(f"📊 Total sections: {total_sections}")
    print(f"✅ Total uploaded: {total_uploaded}")

    # Get collection info
    info = vector_search_client.get_collection_info()
    print(f"🗄️  Collection: {info.get('collection_name')}")
    print(f"📦 Vectors in collection: {info.get('vectors_count', 0)}")


if __name__ == "__main__":
    asyncio.run(main())
