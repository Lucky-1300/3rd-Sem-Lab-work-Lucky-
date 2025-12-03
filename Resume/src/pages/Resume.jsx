import { Link } from "react-router-dom";

export default function Resume() {
  return (
    <div className="max-w-4xl mx-auto p-10">

      {/* About */}
      <section id="about" className="py-6">
        <h1 className="text-3xl font-bold">Komal Kumari Roy</h1>
        <p className="text-gray-700 mt-2">
          Motivated BCA student with a strong interest in coding and web development. Currently enhancing skills in Data Structures & Algorithms while developing projects with HTML, CSS, JavaScript, and React. Experienced in building simple, interactive user interfaces and applying computer science fundamentals through hands-on practice. Enthusiastic about translating ideas into functional applications and continuously improving through experimentation. Committed to personal growth and eager to gain real-world experience while contributing as a web developer.
        </p>
      </section>

      {/* Skills */}
      <section id="skills" className="py-6 bg-gray-100">
        <h2 className="text-2xl font-semibold  m-2">Skills</h2>
        <ul className="list-disc ml-8">
          <li>Front-End: HTML, CSS, JavaScript, DOM</li>
          <li>Learning: React, Node.js, Express.js, Python</li>
          <li>Databases: Basic understanding of MongoDB and MySQL</li>
          
        </ul>
      </section>

      {/* Education */}
      <section id="education" className="py-6">
        <h2 className="text-2xl font-semibold m-2">Education</h2>
        <p className="m-2">BCA - Akal College of Engineering and Technology</p>
      </section>

      {/* Projects */}
      <section id="projects" className="py-6 bg-gray-100">
        <h2 className="text-2xl font-semibold m-2">Projects</h2>
        <ul className="list-disc ml-8">
          <li>To-do App</li>
          <li>Age Calculator</li>
          <li>BMI Checker</li>
        </ul>

        <Link
          to="/projects"
          className="text-blue-600  block mt-3 m-5"
        >
          View All Projects →
        </Link>
      </section>

      {/* Contact */}
      <section id="contact" className="py-6">
        <h2 className="text-2xl font-semibold m-2">Contact</h2>
        <p className="m-2">Email: komalroy42774@gmail.com</p>
      </section>
    </div>
  );
}