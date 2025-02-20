import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
//import { highlight } from "sugar-high"; // Import the highlight function
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LinkType, SideBar } from "@/components/SideBar";
import { CustomTags } from "@/components/Tags";
import { cn } from "@/lib/utils";
import { ContentTable } from "@/components/ContentTable";
import LikeDislikeButtons from "@/components/LikesComponent";
import { SheetSide } from "@/components/SheetSide";

async function fetchBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), "src/content", `${slug}.md`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) return undefined;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  //console.log(content);

  // Convert markdown content to HTML using marked
  const contentHtml = await marked(content);
  //console.log(contentHtml);

  // Use RegEx to extract <h2> elements and generate links
  const headingRegex = /<h2[^>]*>(.*?)<\/h2>/g;
  const generatedLinks: LinkType[] = [];
  //let match: RegExpExecArray | null;
  let index = 1;

  // Replace <h2> elements with <h2 id="index"> and generate links
  const modifiedContentHtml = contentHtml.replace(
    headingRegex,
    (match, text) => {
      // Create a unique ID based on the current index
      const id = `h2-${index}`; // You can customize the ID format as needed
      generatedLinks.push({ id, text });
      index++;

      // Return the modified <h2> element with the new id
      return `<h2 id="${id}">${text}</h2>`;
    }
  );

  //console.log("generatedLinks: ", generatedLinks);
  //console.log("Modified HTML: ", modifiedContentHtml);

  return {
    title: data.title || "",
    content: modifiedContentHtml,
    imageUrl: data.imageUrl || "",
    links: generatedLinks, // Include the links
    author: data.author || "",
    date: data.date || "",
    tags: data.tags || "",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Change to match the slug parameter
}) {
  const { slug } = await params;

  if (!slug) redirect("/login"); // Redirect if slug is not provided

  const post = await fetchBlogPost(slug);

  if (!post) redirect("/join"); // Redirect if the post is not found

  return (
    <div className="flex mx-4 md:mx-16 my-8 lg:mx-16 xl:mx-32 bg-white text-black dark:bg-black/0 dark:text-white/70 ">
      <SideBar links={post.links} /*tags={post.tags}*/ />
      <div className="w-full lg:w-[80%]">
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        <div className="flex justify-between text-md mb-4 text-black/60 dark:text-white/70 italic">
          <div className="flex">
            <div>{post.date}</div>
            <div className="font-extrabold text-lg -mt-2 mx-1">.</div>
            <div>{post.author}</div>
          </div>
          <div className="flex  space-x-2 mr-2">
            <LikeDislikeButtons postId={slug} />

            <div className="font-extrabold text-lg -mt-1 mx-1"> </div>
            <SheetSide slug={slug} />
          </div>
        </div>
        <hr />
        <div className={cn(" block w-full lg:hidden lg:w-0 mr-16 my-2")}>
          <ContentTable links={post.links} />
        </div>
        <hr />
        <div className="flex mt-8">
          <CustomTags tags={post.tags} />
        </div>
        <div className="prose lg:prose-xl my-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Blog Post",
  description: "Read the full blog post.",
};

/// npm install --force  marked sugar-high
