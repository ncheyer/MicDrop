import { NextRequest, NextResponse } from 'next/server';
import { uploadSpeakerPhoto, uploadResourceFile } from '@/lib/blob-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'speaker' or 'resource'
    const id = formData.get('id') as string; // speakerId or talkPageId

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    let url: string;

    if (type === 'speaker') {
      url = await uploadSpeakerPhoto(file, id);
    } else if (type === 'resource') {
      url = await uploadResourceFile(file, id);
    } else {
      return NextResponse.json(
        { error: 'Invalid upload type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; // Use edge runtime for better performance