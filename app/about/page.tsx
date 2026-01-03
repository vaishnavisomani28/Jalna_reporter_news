import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Jalna Reporter News',
  description: 'Learn about Jalna Reporter News, our mission, and journalism ethics',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Jalna Reporter News</h1>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Jalna Reporter News is dedicated to delivering accurate, timely, and comprehensive
              news coverage to our community. We strive to keep our readers informed about local
              events, national developments, and global happenings that matter most to them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Journalism Ethics</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are committed to the highest standards of journalism ethics:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Accuracy:</strong> We verify all information before publication and correct errors promptly.</li>
              <li><strong>Independence:</strong> Our editorial decisions are made without influence from advertisers, politicians, or special interests.</li>
              <li><strong>Fairness:</strong> We present all sides of a story and give subjects the opportunity to respond.</li>
              <li><strong>Transparency:</strong> We clearly identify sources and distinguish between news and opinion.</li>
              <li><strong>Accountability:</strong> We take responsibility for our reporting and are open to feedback from our readers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Focus on Local & Digital News</h2>
            <p className="text-gray-700 leading-relaxed">
              While we cover national and international news, our primary focus remains on local
              journalism. We believe that strong local news is essential for a healthy democracy
              and an informed citizenry.               Through our digital platform, we bring you breaking news,
              in-depth analysis, video content, and live streams to keep you connected with what&apos;s
              happening in your community and beyond.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Trust & Transparency</h2>
            <p className="text-gray-700 leading-relaxed">
              Trust is the foundation of our relationship with our readers. We are transparent
              about our reporting process, our sources, and our corrections policy. We welcome
              your feedback and are committed to continuous improvement in serving our community
              with reliable, relevant, and responsible journalism.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              Have a story tip, question, or feedback? We&apos;d love to hear from you. Visit our
              <a href="/contact" className="text-primary hover:underline"> contact page</a> to get in touch.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

