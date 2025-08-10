import BlogDetailsCard from "@/components/ui/BlogDetailsCard";
import { Blog } from "@/types/blog"; // Assuming you have a Blog type defined
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Generate static paths
export const generateStaticParams = async () => {
  const res = await fetch("http://localhost:3004/blogs/");
  const blogs: Blog[] = await res.json();

  return blogs.slice(0, 3).map((blog) => ({
    blogId: blog.id,
  }));
};

interface Params {
  blogId: string;
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const { blogId } = params;
    const res = await fetch(`http://localhost:3004/blogs/${blogId}`);

    if (!res.ok) {
      return {
        title: "Blog Not Found",
      };
    }

    const blog: Blog = await res.json();

    return {
      title: blog.title,
      description: blog.description,
      openGraph: {
        title: blog.title,
        description: blog.description,
        images: [
          {
            url: blog.blog_image,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Blog Details",
    };
  }
}

// Main component
const BlogDetailsPage = async ({ params }: { params: Params }) => {
  try {
    const { blogId } = params;
    const res = await fetch(`http://localhost:3004/blogs/${blogId}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      if (res.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch blog: ${res.status}`);
    }

    const blog: Blog = await res.json();

    // Validate required image
    if (!blog.blog_image) {
      blog.blog_image = "/default-blog-image.jpg";
    }

    return (
      <div className="my-10">
        <BlogDetailsCard blog={blog} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog details:", error);
    return (
      <div className="my-10 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Blog</h2>
        <p className="text-gray-600 mt-2">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
};

export default BlogDetailsPage;
