import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LinkItem } from "./LinkItem";
//import { CustomTags } from "./Tags";
//import { MessageSquareText, ThumbsDown, ThumbsUp } from "lucide-react";
//import { CustomTags } from "./Tags";

export type LinkType = {
  id: string;
  text: string;
};

export const ContentTable = ({
  //tags,
  links,
}: //  tags,
{
  //className: string;
  // tags: string[];
  links: LinkType[];
}) => {
  return (
    <div className={cn("block w-full lg:hidden  mr-16 ")}>
      <div className="sticky top-20" style={{ top: "80px" }}>
        <ScrollArea className="flex flex-col items-start  h-[60%] ">
          <ul className="not-prose text-xs ">
            {links &&
              links.map((link) => (
                <LinkItem key={link.id} id={link.id} text={link.text} />
              ))}
          </ul>
        </ScrollArea>

        {/* <div className="my-8  h-[30%]">
          <CustomTags tags={tags} />
        </div>
        <div className="flex  space-x-2 mr-2 h-[10%] bottom-0">
          <ThumbsUp />
          <ThumbsDown />
          <div className="font-extrabold text-lg -mt-1 mx-1"> -</div>
          <MessageSquareText />
        </div>*/}
      </div>
    </div>
  );
};
