import Link from "next/link";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/education", label: "Education" },
  { href: "/career", label: "Career" },
  { href: "/brain", label: "Brain" },
];

export default function Header() {
  return (
    <header className="backdrop-blur-2xl z-20 sticky top-0 flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <Link href="/" className="font-funnel font-semibold text-lg">
        Darko Cejkov
      </Link>
      <nav className="flex gap-6">
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className="text-sm hover:underline">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
