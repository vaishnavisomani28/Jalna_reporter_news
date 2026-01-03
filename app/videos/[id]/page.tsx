import { Metadata } from 'next';
import ShareButtons from '@/components/ShareButtons';
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from '@/lib/youtube';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/videos/${params.id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Video not found');
    const video = await res.json();

    return {
      title: `${video.title} - Jalna Reporter News`,
      description: video.description || 'Watch this video on Jalna Reporter News',
      openGraph: {
        title: video.title,
        description: video.description,
        images: [video.thumbnail],
      },
    };
  } catch {
    return {
      title: 'Video Not Found - Jalna Reporter News',
    };
  }
}

async function getVideo(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/videos/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function VideoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const video = await getVideo(params.id);

  if (!video) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {video.title}
        </h1>

        <div className="mb-4 text-gray-600">
          <p>{formatDate(video.publishedAt)}</p>
        </div>

        <div className="mb-6">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <iframe
              src={getYouTubeEmbedUrl(video.videoId)}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-4 text-center">
            <a
              href={getYouTubeWatchUrl(video.videoId)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
            >
              Watch on YouTube →
            </a>
          </div>
        </div>

        {video.description && (
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
          </div>
        )}

        <ShareButtons url={`/videos/${video.videoId}`} title={video.title} />
      </div>
    </div>
  );
}

