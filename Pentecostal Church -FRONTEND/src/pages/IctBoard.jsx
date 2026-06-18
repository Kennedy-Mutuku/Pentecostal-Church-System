import { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { boards } from "../data/boardsData";
import "./SoftwareDevelopmentBoard.css";
import "./IctBoard.css";

/* Initial letter helper */
const initials = (name) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

function IctBoard() {
  const board = boards.find((b) => b.id === "ict");
  const [showJoin, setShowJoin] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const stackRef = useRef(null);

  /* Stacking scale effect using IntersectionObserver */
  useEffect(() => {
    const items = stackRef.current?.querySelectorAll(".sdb-stack-item");
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = "scale(1)";
            entry.target.style.opacity = "1";
          } else {
            const rect = entry.boundingClientRect;
            if (rect.top < 0) {
              entry.target.style.transform = "scale(0.96)";
              entry.target.style.opacity = "0.88";
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.3, 0.5],
        rootMargin: "0px 0px -10% 0px",
      }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  if (!board) {
    return <Navigate to="/boards" />;
  }

  const cardData = [
    {
      title: "Database Mgt",
      icon: "fas fa-database",
      desc: "Prepares and securely updates the central RPC Nyamira database.",
      active: false,
    },
    {
      title: "Social Media",
      icon: "fas fa-share-alt",
      desc: "Manages the church's digital footprint across Facebook and more.",
      active: true,
    },
    {
      title: "Events Protocol",
      icon: "fas fa-project-diagram",
      desc: "Technically projects and directs all the church activities.",
      active: false,
    },
  ];

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fileInput = form.querySelector('input[type="file"]');
    if (!fileInput || !fileInput.files[0]) return;
    if (!applicantName.trim()) {
      setUploadStatus("error:Please enter your full name.");
      return;
    }
    setUploading(true);
    setUploadStatus("");
    try {
      const formData = new FormData();
      formData.append("applicationLetter", fileInput.files[0]);
      formData.append("boardId", "ict");
      formData.append("applicantName", applicantName.trim());
      const res = await fetch(
        "http://localhost:3000/api/board-applications/submit",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadStatus("success:Application submitted! We'll contact you regarding interview dates.");
      setApplicantName("");
      form.reset();
    } catch (err) {
      setUploadStatus(`error:${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const statusType = uploadStatus.startsWith("success") ? "success" : "error";
  const statusText = uploadStatus.replace(/^(success|error):/, "");

  return (
    <div className="sdb-wrapper">
      {/* ══════════════ HERO ══════════════ */}
      <section className="sdb-hero">
        <div className="sdb-hero-bg" />
        <div className="sdb-hero-content">
          <div className="sdb-hero-eyebrow">Professional</div>

          <h1 className="sdb-hero-title">
            Information Technology<br />
            <span>&amp; ICT Board</span>
          </h1>

          <p className="sdb-hero-subtitle">
            Connecting and Building the Tech Ecosystem for Startup Growth &amp; RPC Nyamira
          </p>
        </div>
      </section>

      {/* ══════════════ ROLE CARDS ══════════════ */}
      <section>
        <div className="sdb-section-header">
          <h2>What We Do</h2>
          <p>
            Our board covers every facet of the church's IT support and system setup.
          </p>
          <div className="sdb-divider" />
        </div>

        <div className="sdb-roles-grid">
          {cardData.map((card, i) => (
            <div className={`sdb-role-card ${card.active ? "featured" : ""}`} key={i}>
              <i className={`${card.icon} sdb-role-icon`}></i>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ LEADERS ══════════════ */}
      <section className="ict-members-section" style={{ background: "transparent", marginTop: "40px", padding: "20px 20px 60px" }}>
        <div className="sdb-section-header" style={{ padding: "40px 20px 20px" }}>
          <h2>Board Leadership</h2>
          <p>
            Reach out directly to the heads of our ecosystem.
          </p>
          <div className="sdb-divider" />
        </div>

        <div className="ict-members-grid" style={{ maxWidth: "1000px", margin: "30px auto 0" }}>
          {board.members.map((member, index) => (
            <div className="ict-member-card" key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                className="sdb-member-avatar-placeholder"
                style={{ backgroundColor: "#730051", margin: "0 auto 15px auto", border: "4px solid #730051" }}
              >
                {initials(member.name)}
              </div>
              <span className="ict-member-role" style={{ color: "#730051" }}>{member.role}</span>
              <h3 className="ict-member-name" style={{ color: "#333" }}>{member.name}</h3>
              {member.phone && (
                <a href={`tel:${member.phone}`} className="ict-member-phone" style={{ background: "#730051" }}>
                  <i className="fas fa-phone-alt"></i> {member.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ RECRUITMENT ══════════════ */}
      <section style={{ padding: "0 20px 20px" }}>
        <div className="sdb-recruitment">
          <div className="sdb-recruitment__inner">
            <h2>Build for the Kingdom</h2>
            <p>
              Passionate about technology, databases or social media? Join the RPC Nyamira ICT Board and put your skills to Kingdom use.
            </p>

            <div>
              <button
                className="sdb-btn sdb-btn-primary"
                onClick={() => setShowJoin(!showJoin)}
              >
                {showJoin ? "Close" : "Apply Now"}
                <i className={`fas ${showJoin ? "fa-times" : "fa-rocket"}`} style={{ marginLeft: "10px" }}></i>
              </button>
              <button
                className="sdb-btn sdb-btn-outline"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Learn More
              </button>
            </div>

            {showJoin && (
              <div className="sdb-join-panel">
                <h3>How to Join</h3>
                <ol>
                  <li>Write a formal application letter to the ICT Board Overseer, stating your technical background and area of interest.</li>
                  <li>Upload a scanned or digital copy of your letter via the form below.</li>
                  <li>Shortlisted candidates will be contacted for a technical &amp; spiritual interview.</li>
                </ol>

                <form className="sdb-form-row" onSubmit={handleUpload}>
                  <input
                    type="text"
                    className="sdb-input"
                    placeholder="Your Full Name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    required
                  />
                  <input
                    type="file"
                    className="sdb-input"
                    required
                    accept=".pdf,.doc,.docx"
                  />
                  <button
                    type="submit"
                    className="sdb-submit-btn"
                    disabled={uploading}
                  >
                    <i className="fas fa-upload" style={{ marginRight: "10px" }}></i>
                    {uploading ? "Submitting…" : "Submit Application"}
                  </button>

                  {uploadStatus && (
                    <p className={`sdb-upload-status ${statusType}`}>
                      {statusText}
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER STRIP ══════════════ */}
      <div className="sdb-footer-strip">
        RPC Nyamira ICT Board — Transforming Lives, Impacting Nations through Technology.
      </div>
    </div>
  );
}

export default IctBoard;
