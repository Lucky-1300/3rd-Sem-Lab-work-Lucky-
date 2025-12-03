import { Link } from "react-router-dom";

export default function AllProjects() {
  return (
    <div className="max-w-4xl mx-auto p-5">

      <h1 className="text-3xl font-bold mb-5">All Projects</h1>

      <ul className="list-disc ml-8 space-y-1">
        <li>Portfolio Website</li>
        <li>Pexels Clone</li>
        <li>Country Data Visualizer</li>
        <li>Todo Manager App</li>
        <li>Weather App</li>
        <li>Blog Website</li>
      </ul>

      <Link
        to="/"
        className="text-blue-600  block mt-5"
      >
        ← Back to Resume
      </Link>

    </div>
  );
}