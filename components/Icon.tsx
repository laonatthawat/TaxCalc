import * as icons from "lucide-react";
import type { LucideProps } from "lucide-react";

function toPascal(name: string) {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

type IconMap = Record<string, React.ComponentType<LucideProps>>;

export default function Icon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Cmp = (icons as unknown as IconMap)[toPascal(name)];
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
