import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostView from "../components/PostView";

export default function BlogPage({ posts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.id === id);

  if (!post) return <p className="empty-text">Post not found.</p>;

  return (
    <PostView
      post={post}
      onEdit={() => navigate(`/post/${id}/edit`)}
    />
  );
}
