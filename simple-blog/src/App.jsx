import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import BlogPage from "./pages/BlogPage";
import PostEditor from "./components/PostEditor";
import NoPost from "./components/NoPost";
import { getPosts, savePosts } from "./utils/storage";

export default function App() {
  const [posts, setPosts] = useState(getPosts());
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/new");
  };

  const handleSave = (post) => {
    let updatedPosts;
    if (post.id) {
      updatedPosts = posts.map((p) => (p.id === post.id ? post : p));
    } else {
      post.id = Date.now().toString();
      post.createdAt = new Date().toISOString();
      updatedPosts = [post, ...posts];
    }
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    navigate(`/post/${post.id}`);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this post?")) return;
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);
    savePosts(updated);
    navigate("/");
  };

  const handleRemoveAll = () => {
    if (!confirm("Remove all posts?")) return;
    setPosts([]);
    savePosts([]);
    navigate("/");
  };

  // Helper component to pass the right post to editor for editing
  const EditPost = () => {
    const { id } = useParams();
    const post = posts.find((p) => p.id === id);
    if (!post) return <p className="empty-text">Post not found.</p>;
    return <PostEditor initial={post} onSave={handleSave} onCancel={() => navigate(`/post/${id}`)} />;
  };

  return (
    <div className="container">
      <Sidebar
        posts={posts}
        onSelect={(id) => navigate(`/post/${id}`)}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onRemoveAll={handleRemoveAll}
      />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<NoPost />} />
          <Route path="/new" element={<PostEditor onSave={handleSave} onCancel={() => navigate("/")} />} />
          <Route path="/post/:id" element={<BlogPage posts={posts} />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
        </Routes>
      </div>
    </div>
  );
}
