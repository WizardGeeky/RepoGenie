"use client";

import React, { useState } from "react";
import {
  VscRobot,
  VscRepo,
  VscStarFull,
  VscRepoForked,
  VscHome,
  VscCalendar,
  VscSync,
  VscFileCode,
  VscCloudDownload,
  VscCopy,
} from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReadmePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState<any>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [generatedReadme, setGeneratedReadme] = useState<string>("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!repoUrl.trim()) {
      toast.error("Repository URL is required!");
      return;
    }

    try {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        toast.error("Invalid GitHub repo URL");
        return;
      }

      const owner = match[1];
      const repo = match[2].replace(/(\.git)?$/, "");

      const repoRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`
      );
      if (!repoRes.ok) throw new Error("Repo not found");
      const repoJson = await repoRes.json();
      setRepoData(repoJson);

      const langRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`
      );
      const langJson = await langRes.json();
      setLanguages(Object.keys(langJson));

      const topicRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/topics`,
        {
          headers: {
            Accept: "application/vnd.github.mercy-preview+json",
          },
        }
      );
      const topicJson = await topicRes.json();
      setTopics(topicJson.names || []);
    } catch (error) {
      toast.error("Something went wrong while fetching data.");
      setRepoData(null);
      setLanguages([]);
      setTopics([]);
      setGeneratedReadme("");
    }
  };

  const handleGenerateWithAI = async () => {
    if (!repoData) {
      toast.error("No repo data loaded!");
      return;
    }
    setLoadingAI(true);
    setGeneratedReadme("");
    try {
      const res = await fetch("/api/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: repoData,
          languages,
          topics,
        }),
      });

      const data = await res.json();
      setGeneratedReadme(data.markdown);
    } catch (err) {
      toast.error("Failed to generate README with AI.");
    } finally {
      setLoadingAI(false);
    }
  };

  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!generatedReadme) {
      toast.error("No README to copy!");
      return;
    }

    navigator.clipboard
      .writeText(generatedReadme)
      .then(() => {
        toast.success("README copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy README.");
      });
  };

  return (
    <div className="relative min-h-screen bg-white text-white overflow-hidden">
      <VscRobot className="absolute text-[15rem] sm:text-[25rem] md:text-[30rem] lg:text-[40rem] text-violet-600 opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none" />

      <nav className="bg-violet-600 py-4 px-6 flex items-center justify-between shadow-md z-10 relative">
        <div className="flex items-center gap-2">
          <VscRobot className="text-white text-4xl" />
          <h1 className="text-white text-xl font-semibold">RepoGenie</h1>
        </div>
      </nav>

      <div className="px-6 py-10 z-10 relative">
        <form
          className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4"
          onSubmit={handleSubmit}
        >
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            type="text"
            placeholder="Enter GitHub repository URL..."
            className="flex-1 px-4 py-2 bg-white text-black border border-violet-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-700"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black hover:bg-violet-600 text-white font-semibold rounded-md transition"
          >
            Search Repo
          </button>
        </form>

        {repoData && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 text-lg">
            {/* Repo Info */}
            <div className="p-6 rounded-md text-black space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <VscRepo /> {repoData.full_name}
              </h2>
              <p>{repoData.description}</p>
              <p className="flex items-center gap-2">
                <VscHome /> Homepage: {repoData.homepage || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <VscStarFull /> Stars: {repoData.stargazers_count}
              </p>
              <p className="flex items-center gap-2">
                <VscRepoForked /> Forks: {repoData.forks}
              </p>
              <p className="flex items-center gap-2">
                <VscCalendar /> Created:{" "}
                {new Date(repoData.created_at).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <VscSync /> Updated:{" "}
                {new Date(repoData.updated_at).toLocaleDateString()}
              </p>
              <p>👨‍💻 Language(s): {languages.join(", ") || "N/A"}</p>
              <p>🏷 Meta Tags: {topics.join(", ") || "N/A"}</p>

              <button
                onClick={handleGenerateWithAI}
                className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
              >
                {loadingAI ? "Generating..." : "Generate"}
              </button>
            </div>

            {/* README Preview */}
            <div className="p-6 rounded-md overflow-hidden">
              {generatedReadme && (
                <div>
                  <h3 className="text-lg font-bold mb-2 text-black">
                    Generated README
                  </h3>
                  <pre className="text-black p-4 rounded-md whitespace-pre-wrap text-sm overflow-auto h-auto max-h-[500px]">
                    {generatedReadme}
                  </pre>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={downloadReadme}
                      className="inline-flex items-center gap-2 bg-black hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                    >
                      <VscCloudDownload /> Download README
                    </button>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition"
                    >
                      <VscCopy /> Copy README
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
      <div className="mt-2 text-center">
        <p className="inline-block px-6 py-3 text-sm sm:text-base font-semibold text-gray-700 bg-gradient-to-r from-white via-gray-100 to-white rounded-xl shadow-md border border-gray-200">
          🚀 Designed & Developed with ❤️ by{" "}
          <span className="text-indigo-600"><a href="https://eswarb.vercel.app/">Eswar</a></span>
        </p>
      </div>
    </div>
  );
}
