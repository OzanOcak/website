//import { cn } from "@/lib/utils";
import { LinkItem } from "./LinkItem";

export type LinkType = {
  id: string;
  text: string;
};

export const ContentTable = ({ links }: { links: LinkType[] }) => {
  return (
    <div id="content-table" className="sticky top-20" style={{ top: "80px" }}>
      <ul className="not-prose text-xs ">
        {links &&
          links.map((link) => (
            <LinkItem key={link.id} id={link.id} text={link.text} />
          ))}
      </ul>
    </div>
  );
};
