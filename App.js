import React, { useState } from "react";
import './styles.css';

function App() {
  const [score, setScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [sections, setSections] = useState({});
  const [industryStandard, setIndustryStandard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleAnalysis = async () => {
    if (!resume) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);
    const res = await fetch("https://enhance-resume-backend-j1pr18kxw.vercel.app/analyze", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setScore(data.score);
    setRecommendations(data.recommendations);
    setSections(data.sections);
    setIndustryStandard(data.industry_standard);
    setLoading(false);
  };

  return (
    <div className="container green-theme">
      <h1>Enhance Resume ATS Analyzer</h1>
      <div className="upload-section">
        <input type="file" accept=".pdf,.docx" onChange={handleResumeChange} />
        <textarea
          cols="50"
          rows="3"
          placeholder="Paste job description (optional)"
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
        />
        <button onClick={handleAnalysis} disabled={loading} className="analyze-btn">
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>
      {score !== null && (
        <div className="results-section">
          <h2>ATS Score: <span className={score>=96?"industry-standard":""}>{score}/100</span></h2>
          {industryStandard && <div className="badge">Industry Standard Resume</div>}
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{width: `${score}%`, background: 'limegreen'}}></div>
          </div>
          <h3>Section Analysis</h3>
          <ul>
            {Object.entries(sections).map(([section, status]) => (
              <li key={section}><strong>{section}:</strong> {status}</li>
            ))}
          </ul>
          {score<=82 && (
            <>
              <h3>Recommendations</h3>
              <ul>
                {recommendations.map((rec,i)=>(<li key={i}>{rec}</li>))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default App;
