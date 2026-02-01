import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

const DOCUMENTS_DIRECTORY = path.join(process.cwd(), 'public', 'documents');

export async function GET() {
  try {
    if (!fs.existsSync(DOCUMENTS_DIRECTORY)) {
      return NextResponse.json([]);
    }

    const fileNames = fs.readdirSync(DOCUMENTS_DIRECTORY);
    const slugs = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));

    const files = await Promise.all(
      slugs.map(async (slug) => {
        const filePath = path.join(DOCUMENTS_DIRECTORY, `${slug}.md`);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        return {
          slug,
          frontmatter: data,
        };
      })
    );

    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}