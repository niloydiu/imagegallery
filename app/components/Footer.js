import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6 mb-3">
          <a
            href="https://www.linkedin.com/in/niloykumarmohonta000/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <FaLinkedin className="text-2xl" />
          </a>
          <a
            href="https://github.com/niloydiu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a
            href="https://niloykm.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition-colors"
          >
            <FaGlobe className="text-2xl" />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Image Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
}
