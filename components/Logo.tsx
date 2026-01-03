import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  // If you have the logo image, place it in /public/logo.png
  // Otherwise, this will show a styled placeholder matching your design
  const hasLogo = false; // Set to true when logo image is added

  if (hasLogo) {
    return (
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Jalna Reporter News Logo"
          width={120}
          height={60}
          className="object-contain"
          priority
        />
      </Link>
    );
  }

  // Placeholder logo matching the design description
  return (
    <Link href="/" className="flex items-center">
      <div className="relative">
        {/* JALNA - Orange banner */}
        <div className="bg-orange-500 border-2 border-black transform -skew-x-12 px-4 py-1 mb-[-2px]">
          <span className="text-white font-bold text-lg block transform skew-x-12">JALNA</span>
        </div>
        {/* REPORTER - Red banner */}
        <div className="bg-red-600 border-2 border-black transform -skew-x-12 px-4 py-1 mb-[-2px]">
          <span className="text-white font-bold text-lg block transform skew-x-12">REPORTER</span>
        </div>
        {/* NEWS - Large gray text */}
        <div className="mt-1">
          <span className="text-gray-700 font-bold text-2xl">NEWS</span>
        </div>
      </div>
    </Link>
  );
}

