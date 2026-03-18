import Link from "next/link";
import MaintenanceBanner from "./MaintenanceBanner";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/education", label: "Education" },
  { href: "/career", label: "Career" },
  { href: "/brain", label: "Brain" },
];

export default function Header() {
  return (
    <header className="backdrop-blur-2xl z-20 sticky top-0">
      <MaintenanceBanner />
      <div className="flex flex-col">

        <div className="flex items-center justify-between px-8 py-4 border-b border-brand-dark/10 dark:border-brand-white/10">
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
        </div>
      </div>

    </header>
  );
}
