import LatestBlogs from "@/components/LatestBlogs/LatestBlogs";

const HomePage = async () => {
  const res = await fetch("http://localhost:3004/blogs", {
    next: {
      revalidate: 30,
    },
  });
  const blogs = await res.json();
  // console.log(blogs);
  return (
    <div className="my-10">
      <LatestBlogs blogs={blogs} />
    </div>
  );
};

export default HomePage;
