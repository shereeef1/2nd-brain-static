import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

const DOCUMENTS_DIRECTORY = path.join(process.cwd(), 'public', 'documents');

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const filePath = path.join(DOCUMENTS_DIRECTORY, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);
    
    return NextResponse.json({
      slug,
      frontmatter,
      content,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}