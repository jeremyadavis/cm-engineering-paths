import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0c0e14",
  surface: "#141720",
  surfaceHover: "#1a1e2a",
  border: "#232838",
  textPrimary: "#e4e8f0",
  textSecondary: "#8892a8",
  textMuted: "#4e5670",
  ic: "#7b9ec7",
  delivery: "#c9865a",
  tradeoff: "#b07cc5",
  people: "#6bc59e",
  process: "#c4b46a",
  staff: "#b07cc5",
  em: "#6bc59e",
};

const BRANCH_META = {
  ic: { color: COLORS.ic, label: "Individual Contribution", icon: "◆" },
  delivery: { color: COLORS.delivery, label: "Delivery Ownership", icon: "▶" },
  tradeoff: { color: COLORS.tradeoff, label: "Technical Tradeoffs", icon: "⬡" },
  people: { color: COLORS.people, label: "People Development", icon: "●" },
  process: { color: COLORS.process, label: "Process & Practices", icon: "■" },
};

const PHASES = [
  { id: "p0", x: 0.04, label: "Junior", sublabel: "Learning & Growing" },
  { id: "p1", x: 0.155, label: "Mid-Level", sublabel: "Reliable Contributor" },
  { id: "p2", x: 0.28, label: "Senior", sublabel: "Individual Focus" },
  { id: "p3", x: 0.41, label: "Senior\n(Growing)", sublabel: "Expanding Ownership" },
  { id: "p4", x: 0.55, label: "Senior+", sublabel: "Feature Area Lead" },
  { id: "p5", x: 0.70, label: "Crossroads", sublabel: "Track Emergence" },
  { id: "p6", x: 0.88, label: "Staff / EM", sublabel: "Distinct Paths" },
];

const NODES = [
  {
    id: "ic-jr", branch: "ic", phase: 0,
    title: "Learning the Craft",
    items: [
      "Completes well-defined tasks with guidance and support",
      "Writes functional code and learns team conventions and patterns",
      "Asks good questions — knows when to push through and when to ask for help",
      "Participates in PR reviews to learn, starts giving basic feedback",
      "Developing familiarity with the codebase, tooling, and deployment process",
    ],
  },
  {
    id: "ic-mid", branch: "ic", phase: 1,
    title: "Reliable Contributor",
    items: [
      "Independently delivers well-scoped features with minimal guidance",
      "Writes clean, tested code that follows team standards consistently",
      "Gives substantive PR reviews — catches real issues, not just style nits",
      "Debugs and resolves issues in their area without hand-holding",
      "Starting to understand the 'why' behind architectural choices, not just the 'how'",
    ],
  },
  {
    id: "ic-sr", branch: "ic", phase: 2,
    title: "Solid IC Foundation",
    items: [
      "Owns features end-to-end: design, implementation, testing, deployment",
      "Produces thorough, constructive PR reviews that elevate code quality",
      "Maintains quality standards for their area of the codebase",
      "Debugs and resolves production issues independently",
      "Makes sound technical choices within their feature scope",
    ],
  },
  {
    id: "ic-grow", branch: "ic", phase: 3,
    title: "Broadening Technical Depth",
    items: [
      "Takes on more complex, ambiguous implementation work",
      "Proactively addresses tech debt in areas they touch",
      "Contributes to shared libraries, tooling, or test infrastructure",
      "Reviews code across a wider area of the codebase",
    ],
  },
  {
    id: "ic-plus", branch: "ic", phase: 4,
    title: "Technical Quality Owner",
    items: [
      "Sets quality bar for their feature area — testing strategy, reliability, observability",
      "Identifies patterns of code health issues and drives systemic fixes",
      "Leads design reviews and architectural discussions for their area",
      "Deep expertise in a domain that the team depends on",
    ],
  },
  {
    id: "ic-cross", branch: "ic", phase: 5,
    title: "Cross-Cutting IC Impact",
    items: [
      "Tackles the hardest technical problems regardless of team boundaries",
      "Contributions raise the quality bar for the broader engineering org",
      "Trusted as the go-to person for critical system decisions",
    ],
  },
  {
    id: "del-1", branch: "delivery", phase: 3,
    title: "Delivery Awareness",
    items: [
      "Estimates their own work accurately and communicates progress",
      "Flags blockers and risks early without being asked",
      "Breaks down their tasks into shippable increments",
    ],
  },
  {
    id: "del-2", branch: "delivery", phase: 4,
    title: "Feature Area Delivery",
    items: [
      "Owns scoping and sequencing for a feature area with PM input",
      "Coordinates across 1–2 other engineers on shared deliverables",
      "Runs lightweight project management: tracking, status, dependencies",
      "Identifies delivery risks at the feature-area level and escalates",
    ],
  },
  {
    id: "del-3", branch: "delivery", phase: 5,
    title: "Delivery Leadership",
    items: [
      "Drives delivery planning for complex, multi-sprint initiatives",
      "Balances scope, quality, and timeline tradeoffs with product partners",
      "EM relies on them to own and report on feature-area delivery health",
    ],
  },
  {
    id: "trd-1", branch: "tradeoff", phase: 3,
    title: "Tradeoff Awareness",
    items: [
      "Recognizes when a problem has multiple valid approaches",
      "Articulates pros and cons of their chosen approach in PRs and discussions",
      "Asks good questions in design conversations",
    ],
  },
  {
    id: "trd-2", branch: "tradeoff", phase: 4,
    title: "Tradeoff Ownership",
    items: [
      "Makes and documents technical decisions for their feature area",
      "Balances short-term delivery pressure against long-term maintainability",
      "Writes lightweight decision records or design docs when stakes are high",
      "Considers cross-team implications of their technical choices",
    ],
  },
  {
    id: "trd-3", branch: "tradeoff", phase: 5,
    title: "Architectural Judgment",
    items: [
      "Trusted to make team-level technical decisions that stick",
      "Facilitates tradeoff discussions rather than just making the call alone",
      "Evaluates build vs. buy, refactor vs. rewrite at a systemic level",
      "Thinks about the target-state architecture, not just the next feature",
    ],
  },
  {
    id: "ppl-1", branch: "people", phase: 4,
    title: "Informal Growth Support",
    items: [
      "Pairs with mid-level engineers to help them level up",
      "Gives specific, actionable technical feedback in PRs and design reviews",
      "Shares context and rationale, not just solutions",
    ],
  },
  {
    id: "ppl-2", branch: "people", phase: 5,
    title: "Intentional Development",
    items: [
      "Actively identifies growth areas for engineers they work with",
      "Delegates stretch work intentionally, not just for efficiency",
      "Creates psychological safety around technical disagreement",
      "EM partners with them on technical growth plans for more junior engineers",
    ],
  },
  {
    id: "prc-1", branch: "process", phase: 4,
    title: "Process Participation",
    items: [
      "Suggests improvements to team workflows from direct experience",
      "Helps refine how the team does estimation, PR review, or incident response",
      "Brings a pragmatic lens — pushes back on ceremony that doesn't help",
    ],
  },
  {
    id: "prc-2", branch: "process", phase: 5,
    title: "Process Shaping",
    items: [
      "Co-designs team technical processes with the EM",
      "Facilitates design reviews, spike reviews, or tech debt planning sessions",
      "Identifies when process is failing the team and proposes changes",
    ],
  },
];

const TRACKS = [
  {
    id: "staff",
    label: "Staff Engineer",
    color: COLORS.staff,
    fromBranches: ["ic", "tradeoff"],
    items: [
      "IC depth expands to cross-team architectural ownership",
      "Technical tradeoffs scale to org-wide decisions and RFCs",
      "Delivery influence shifts to enabling other teams, not owning a feature area",
      "Defines the target-state architecture and migration paths",
      "Influences without authority — leads through trust and craft",
    ],
  },
  {
    id: "em",
    label: "Engineering Manager",
    color: COLORS.em,
    fromBranches: ["delivery", "people", "process"],
    items: [
      "People development becomes the primary responsibility — 1:1s, performance, career growth",
      "Delivery ownership scales to the full team's throughput and capacity",
      "Process ownership formalizes — team health, retros, planning cadence",
      "Coaches senior+ engineers in their feature-area responsibilities",
      "Accountable for team outcomes, not personal technical output",
    ],
  },
];

const BRANCH_ORDER = ["tradeoff", "ic", "delivery", "process", "people"];
const BRANCH_Y_OFFSETS = {
  ic: 0,
  tradeoff: -1.4,
  delivery: 1.2,
  process: 2,
  people: 2.8,
};

/* ── Current-State data ────────────────────────────────── */

const CURRENT_PHASES = [
  { id: "c0", x: 0.08, label: "Junior", sublabel: "Learning & Growing" },
  { id: "c1", x: 0.24, label: "Mid-Level", sublabel: "Reliable Contributor" },
  { id: "c2", x: 0.42, label: "Senior", sublabel: "Experienced IC" },
  { id: "c3", x: 0.62, label: "Staff", sublabel: "Technical Leadership" },
  { id: "c4", x: 0.82, label: "Principal", sublabel: "Org-wide Impact" },
];

const CURRENT_NODES = [
  {
    id: "cur-jr", phase: 0,
    title: "Junior Engineer",
    items: [
      "Completes well-defined tasks with guidance and support",
      "Writes functional code and learns team conventions",
      "Asks good questions — knows when to ask for help",
      "Participates in PR reviews to learn",
      "Developing familiarity with the codebase and tooling",
    ],
  },
  {
    id: "cur-mid", phase: 1,
    title: "Mid-Level Engineer",
    items: [
      "Independently delivers well-scoped features",
      "Writes clean, tested code following team standards",
      "Gives substantive PR reviews",
      "Debugs and resolves issues in their area",
      "Understands the 'why' behind architectural choices",
    ],
  },
  {
    id: "cur-sr", phase: 2,
    title: "Senior Engineer",
    items: [
      "Owns features end-to-end: design, implementation, testing, deployment",
      "Produces thorough PR reviews that elevate code quality",
      "Maintains quality standards for their area",
      "Debugs and resolves production issues independently",
      "Makes sound technical choices within their feature scope",
    ],
  },
  {
    id: "cur-staff", phase: 3,
    title: "Staff Engineer",
    items: [
      "Drives technical direction across multiple teams",
      "Owns complex cross-cutting technical initiatives",
      "Mentors and grows senior engineers",
      "Makes architectural decisions with org-wide impact",
      "Balances technical excellence with business needs",
    ],
  },
  {
    id: "cur-principal", phase: 4,
    title: "Principal Engineer",
    items: [
      "Sets technical vision and strategy for the organization",
      "Solves the hardest, most ambiguous technical problems",
      "Influences engineering culture and practices company-wide",
      "Partners with leadership on technology decisions",
      "Recognized as a technical authority internally and externally",
    ],
  },
];

const TECH_LEAD_ROLE = {
  id: "tech-lead",
  title: "Tech Lead",
  subtitle: "Role assigned to Senior+ engineers",
  color: "#c9865a",
  items: [
    "Owns scoping, sequencing, and delivery tracking for team projects",
    "Coordinates across engineers on shared deliverables",
    "Identifies and escalates delivery risks",
    "Makes and documents technical decisions for the team",
    "Balances short-term delivery vs. long-term maintainability",
    "Facilitates design reviews and architectural discussions",
    "Pairs with and mentors junior and mid-level engineers",
    "Shares context and rationale to help others grow",
    "Suggests and drives improvements to team workflows",
    "Helps refine estimation, PR review, and incident response processes",
  ],
};

export default function CareerSpectrum() {
  const [activeTab, setActiveTab] = useState("future");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const svgContainerRef = useRef(null);
  const [W, setW] = useState(960);

  useEffect(() => {
    const measure = () => {
      if (isFullscreen) {
        setW(Math.max(740, window.innerWidth - 80));
      } else if (containerRef.current) {
        setW(Math.max(740, Math.min(1060, containerRef.current.clientWidth)));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isFullscreen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else if (selected) setSelected(null);
        else if (selectedTrack) setSelectedTrack(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFullscreen, selected, selectedTrack]);

  const H = isFullscreen ? Math.max(500, window.innerHeight - 120) : 580;
  const midY = H * 0.28;
  const branchSpacing = 55;
  const phaseXPositions = PHASES.map((p) => W * p.x);
  const SENIOR_PHASE = 2;

  const getBranchY = (branch, phase) => {
    if (phase <= SENIOR_PHASE) return midY;
    const offset = BRANCH_Y_OFFSETS[branch];
    const phasesAfterSenior = phase - SENIOR_PHASE;
    const maxPhasesAfterSenior = PHASES.length - 1 - SENIOR_PHASE;
    const spread = phasesAfterSenior / maxPhasesAfterSenior;
    return midY + offset * branchSpacing * spread;
  };

  const getNodePos = (node) => ({
    x: phaseXPositions[node.phase],
    y: getBranchY(node.branch, node.phase),
  });

  const buildBranchPath = (branch) => {
    const branchNodes = NODES.filter((n) => n.branch === branch).sort(
      (a, b) => a.phase - b.phase
    );
    if (branchNodes.length === 0) return "";
    const points = branchNodes.map((n) => getNodePos(n));
    const firstNode = branchNodes[0];
    let path = "";

    if (firstNode.phase > 0) {
      const originPhase = firstNode.phase - 1;
      const originX = phaseXPositions[originPhase];
      const originY = getBranchY("ic", originPhase);
      const firstPoint = points[0];
      const cpX = originX + (firstPoint.x - originX) * 0.5;
      path = `M ${originX} ${originY} C ${cpX} ${originY}, ${cpX} ${firstPoint.y}, ${firstPoint.x} ${firstPoint.y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpX2 = prev.x + (curr.x - prev.x) * 0.5;
        path += ` C ${cpX2} ${prev.y}, ${cpX2} ${curr.y}, ${curr.x} ${curr.y}`;
      }
    } else {
      path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpX = prev.x + (curr.x - prev.x) * 0.5;
        path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
      }
    }
    return path;
  };

  const buildTrackPaths = () => {
    const trackEndX = W * 0.95;
    const staffY = midY - branchSpacing * 2.4;
    const emY = midY + branchSpacing * 3.8;
    const paths = [];

    const icLast = getNodePos(NODES.find((n) => n.id === "ic-cross"));
    const trdLast = getNodePos(NODES.find((n) => n.id === "trd-3"));
    const cpStaff = icLast.x + (trackEndX - icLast.x) * 0.4;
    paths.push({
      id: "staff-from-ic",
      d: `M ${icLast.x} ${icLast.y} C ${cpStaff} ${icLast.y}, ${cpStaff} ${staffY}, ${trackEndX} ${staffY}`,
      color: COLORS.staff,
    });
    paths.push({
      id: "staff-from-trd",
      d: `M ${trdLast.x} ${trdLast.y} C ${cpStaff} ${trdLast.y}, ${cpStaff} ${staffY}, ${trackEndX} ${staffY}`,
      color: COLORS.staff,
    });

    const delLast = getNodePos(NODES.find((n) => n.id === "del-3"));
    const pplLast = getNodePos(NODES.find((n) => n.id === "ppl-2"));
    const prcLast = getNodePos(NODES.find((n) => n.id === "prc-2"));
    const cpEm = delLast.x + (trackEndX - delLast.x) * 0.4;
    paths.push({
      id: "em-from-del",
      d: `M ${delLast.x} ${delLast.y} C ${cpEm} ${delLast.y}, ${cpEm} ${emY}, ${trackEndX} ${emY}`,
      color: COLORS.em,
    });
    paths.push({
      id: "em-from-ppl",
      d: `M ${pplLast.x} ${pplLast.y} C ${cpEm} ${pplLast.y}, ${cpEm} ${emY}, ${trackEndX} ${emY}`,
      color: COLORS.em,
    });
    paths.push({
      id: "em-from-prc",
      d: `M ${prcLast.x} ${prcLast.y} C ${cpEm} ${prcLast.y}, ${cpEm} ${emY}, ${trackEndX} ${emY}`,
      color: COLORS.em,
    });

    return { paths, staffPos: { x: trackEndX, y: staffY }, emPos: { x: trackEndX, y: emY } };
  };

  const trackData = buildTrackPaths();
  const selectedNode = NODES.find((n) => n.id === selected);
  const selectedTrackData = TRACKS.find((t) => t.id === selectedTrack);
  const selectedCurrentNode = activeTab === "current"
    ? (CURRENT_NODES.find((n) => n.id === selected) || (selected === "tech-lead" ? TECH_LEAD_ROLE : null))
    : null;

  const isRelatedToTrack = (nodeId, trackId) => {
    if (!trackId) return false;
    const track = TRACKS.find((t) => t.id === trackId);
    const node = NODES.find((n) => n.id === nodeId);
    return track.fromBranches.includes(node.branch);
  };

  const isEarlyCareer = (node) => node.phase <= SENIOR_PHASE && node.branch === "ic";

  const handleNodeHover = (node, e) => {
    setSelected(node.id);
    setSelectedTrack(null);
    setHovered(node.id);
    if (svgContainerRef.current && e) {
      const rect = svgContainerRef.current.getBoundingClientRect();
      const pos = getNodePos(node);
      const scaleX = rect.width / W;
      const scaleY = rect.height / H;
      setModalPos({
        x: rect.left + pos.x * scaleX,
        y: rect.top + pos.y * scaleY,
      });
    }
  };

  const handleNodeLeave = () => {
    setSelected(null);
    setHovered(null);
  };

  const handleTrackHover = (track, e) => {
    setSelectedTrack(track.id);
    setSelected(null);
    setHovered(`track-${track.id}`);
    if (svgContainerRef.current && e) {
      const rect = svgContainerRef.current.getBoundingClientRect();
      const pos = track.id === "staff" ? trackData.staffPos : trackData.emPos;
      const scaleX = rect.width / W;
      const scaleY = rect.height / H;
      setModalPos({
        x: rect.left + pos.x * scaleX,
        y: rect.top + pos.y * scaleY,
      });
    }
  };

  const handleTrackLeave = () => {
    setSelectedTrack(null);
    setHovered(null);
  };

  // Modal component for node/track details
  const DetailModal = ({ data, type, onClose }) => {
    if (!data) return null;

    const isNode = type === "node";
    const color = data._color || (isNode ? BRANCH_META[data.branch]?.color : data.color) || COLORS.ic;
    const icon = data._icon || (isNode ? BRANCH_META[data.branch]?.icon : null);
    const label = data._label || (isNode
      ? `${BRANCH_META[data.branch]?.label} · ${PHASES[data.phase]?.sublabel}`
      : "Distinct Track");

    // Calculate modal position - position near the clicked element
    const modalStyle = {
      position: "fixed",
      left: Math.min(modalPos.x + 20, window.innerWidth - 420),
      top: Math.max(20, Math.min(modalPos.y - 100, window.innerHeight - 400)),
      width: 380,
      maxHeight: "calc(100vh - 40px)",
      overflowY: "auto",
      background: COLORS.surface,
      border: `1px solid ${color}40`,
      borderRadius: 12,
      padding: "20px 24px",
      boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
      zIndex: 1000,
    };

    return (
      <div
        style={modalStyle}
        onMouseEnter={() => {
          // Keep modal open when hovering over it
        }}
        onMouseLeave={onClose}
      >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {icon && <span style={{ color, fontSize: 10 }}>{icon}</span>}
            <span
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {label}
            </span>
          </div>
          <h3 style={{ color: COLORS.textPrimary, fontSize: 18, fontWeight: 600, margin: "0 0 12px 0" }}>
            {isNode ? data.title : data.label}
          </h3>
          {!isNode && (
            <p style={{ color: COLORS.textMuted, fontSize: 11, margin: "0 0 12px 0", fontFamily: "'JetBrains Mono', monospace" }}>
              Primarily draws from: {data.fromBranches.map((b) => BRANCH_META[b].label).join(", ")}
            </p>
          )}
          {data.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: color,
                  marginTop: 7,
                  flexShrink: 0,
                  opacity: 0.6,
                }}
              />
              <span style={{ color: COLORS.textSecondary, fontSize: 13, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div
      style={{
        background: COLORS.bg,
        minHeight: "100vh",
        padding: isFullscreen ? "20px" : "32px 20px",
        fontFamily: "'DM Sans', sans-serif",
        ...(isFullscreen && {
          position: "fixed",
          inset: 0,
          zIndex: 100,
          overflow: "auto",
        }),
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Modal for node/track details */}
      {selectedNode && activeTab === "future" && (
        <DetailModal data={selectedNode} type="node" onClose={() => setSelected(null)} />
      )}
      {selectedTrackData && activeTab === "future" && (
        <DetailModal data={selectedTrackData} type="track" onClose={() => setSelectedTrack(null)} />
      )}
      {selectedCurrentNode && activeTab === "current" && (
        <DetailModal
          data={{
            ...selectedCurrentNode,
            _color: selectedCurrentNode.id === "tech-lead" ? TECH_LEAD_ROLE.color : COLORS.ic,
            _icon: selectedCurrentNode.id === "tech-lead" ? "★" : "◆",
            _label: selectedCurrentNode.id === "tech-lead"
              ? "Role · Senior+ Designation"
              : `Engineering Level · ${CURRENT_PHASES[selectedCurrentNode.phase]?.sublabel || ""}`,
          }}
          type="node"
          onClose={() => setSelected(null)}
        />
      )}

      <div ref={containerRef} style={{ maxWidth: isFullscreen ? "none" : 1060, margin: "0 auto", padding: isFullscreen ? "0 20px" : 0 }}>
        {!isFullscreen && (
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                color: COLORS.textPrimary,
                fontSize: 26,
                fontWeight: 700,
                margin: "0 0 6px 0",
                letterSpacing: "-0.02em",
              }}
            >
              Engineering Career Spectrum
            </h1>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: 14,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {activeTab === "future"
                ? "From junior through senior, additional responsibilities emerge and branch toward Staff or EM. Hover over any node to explore."
                : "Our current leveling structure with the Tech Lead role. Hover over any node to explore."}
            </p>
          </div>
        )}

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[
            { id: "current", label: "Current State" },
            { id: "future", label: "Future Vision" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelected(null);
                setSelectedTrack(null);
                setHovered(null);
              }}
              style={{
                padding: "8px 20px",
                background: activeTab === tab.id ? COLORS.surfaceHover : "transparent",
                border: `1px solid ${activeTab === tab.id ? COLORS.border : "transparent"}`,
                borderRadius: 6,
                color: activeTab === tab.id ? COLORS.textPrimary : COLORS.textMuted,
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "future" && (<>
        {/* Legend and controls */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 16,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            {BRANCH_ORDER.map((b) => (
              <div
                key={b}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <span style={{ color: BRANCH_META[b].color, fontSize: 10 }}>
                  {BRANCH_META[b].icon}
                </span>
                <span
                  style={{
                    color: COLORS.textMuted,
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {BRANCH_META[b].label}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 2, background: COLORS.staff, borderRadius: 1 }} />
              <span style={{ color: COLORS.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>→ Staff</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 2, background: COLORS.em, borderRadius: 1 }} />
              <span style={{ color: COLORS.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>→ EM</span>
            </div>
          </div>
          {/* Fullscreen toggle button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background: COLORS.surfaceHover,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 6,
              color: COLORS.textSecondary,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.border;
              e.currentTarget.style.color = COLORS.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = COLORS.surfaceHover;
              e.currentTarget.style.color = COLORS.textSecondary;
            }}
            title={isFullscreen ? "Exit fullscreen (Esc)" : "Enter fullscreen"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isFullscreen ? (
                <>
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </>
              ) : (
                <>
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </>
              )}
            </svg>
            {isFullscreen ? "Exit" : "Expand"}
          </button>
        </div>

        {/* SVG */}
        <div
          ref={svgContainerRef}
          style={{
            background: COLORS.surface,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            overflow: "hidden",
          }}
        >
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
            <defs>
              <filter id="nodeGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Subtle grid */}
            {Array.from({ length: Math.floor(W / 24) }).map((_, i) =>
              Array.from({ length: Math.floor(H / 24) }).map((_, j) => (
                <circle
                  key={`g-${i}-${j}`}
                  cx={i * 24 + 12}
                  cy={j * 24 + 12}
                  r={0.4}
                  fill={COLORS.textMuted}
                  opacity={0.12}
                />
              ))
            )}

            {/* Phase column guides */}
            {PHASES.map((p, i) => {
              const x = phaseXPositions[i];
              const isPreSenior = i < SENIOR_PHASE;
              return (
                <g key={p.id}>
                  <line
                    x1={x} y1={28} x2={x} y2={H - 12}
                    stroke={COLORS.border}
                    strokeWidth={0.5}
                    strokeDasharray="4 6"
                    opacity={isPreSenior ? 0.3 : 0.5}
                  />
                  {p.label.split("\n").map((line, li) => (
                    <text
                      key={li} x={x} y={18 + li * 13}
                      textAnchor="middle"
                      fill={COLORS.textMuted}
                      fontSize={10}
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight={500}
                      opacity={isPreSenior ? 0.4 : 0.6}
                    >
                      {line}
                    </text>
                  ))}
                  <text
                    x={x} y={H - 16}
                    textAnchor="middle"
                    fill={COLORS.textMuted}
                    fontSize={9}
                    fontFamily="'JetBrains Mono', monospace"
                    opacity={0.3}
                  >
                    {p.sublabel}
                  </text>
                </g>
              );
            })}

            {/* Branching zone background */}
            <rect
              x={phaseXPositions[SENIOR_PHASE] + 10}
              y={36}
              width={W - phaseXPositions[SENIOR_PHASE] - 18}
              height={H - 52}
              rx={8}
              fill={COLORS.ic}
              opacity={0.018}
            />

            {/* Branch paths */}
            {BRANCH_ORDER.map((branch) => {
              const path = buildBranchPath(branch);
              if (!path) return null;
              const meta = BRANCH_META[branch];
              const isFaded =
                (selectedTrack && !TRACKS.find((t) => t.id === selectedTrack)?.fromBranches.includes(branch)) ||
                (selected && NODES.find((n) => n.id === selected)?.branch !== branch);
              return (
                <g key={branch}>
                  <path d={path} stroke={meta.color} strokeWidth={4} fill="none" opacity={isFaded ? 0.04 : 0.15} />
                  <path d={path} stroke={meta.color} strokeWidth={1.5} fill="none" opacity={isFaded ? 0.12 : 0.6} strokeDasharray={branch === "ic" ? "none" : "6 4"} />
                </g>
              );
            })}

            {/* Track divergence paths */}
            {trackData.paths.map((tp) => {
              const isStaff = tp.id.startsWith("staff");
              const isFaded =
                (selectedTrack && selectedTrack !== (isStaff ? "staff" : "em")) ||
                (selected && !TRACKS.find((t) => t.id === (isStaff ? "staff" : "em"))?.fromBranches.includes(NODES.find((n) => n.id === selected)?.branch));
              return (
                <g key={tp.id}>
                  <path d={tp.d} stroke={tp.color} strokeWidth={3} fill="none" opacity={isFaded ? 0.03 : 0.12} />
                  <path d={tp.d} stroke={tp.color} strokeWidth={1} fill="none" opacity={isFaded ? 0.08 : 0.45} strokeDasharray="4 4" />
                </g>
              );
            })}

            {/* Track endpoint nodes */}
            {TRACKS.map((track) => {
              const pos = track.id === "staff" ? trackData.staffPos : trackData.emPos;
              const isActive = selectedTrack === track.id;
              const isFaded = selectedTrack && selectedTrack !== track.id;
              return (
                <g
                  key={track.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => handleTrackHover(track, e)}
                  onMouseLeave={handleTrackLeave}
                >
                  {(isActive || hovered === `track-${track.id}`) && (
                    <circle cx={pos.x} cy={pos.y} r={22} fill={track.color} opacity={0.12} filter="url(#nodeGlow)" />
                  )}
                  <circle cx={pos.x} cy={pos.y} r={14} fill={COLORS.surface} stroke={track.color} strokeWidth={isActive ? 2.5 : 2} opacity={isFaded ? 0.3 : 1} />
                  <circle cx={pos.x} cy={pos.y} r={4} fill={track.color} opacity={isFaded ? 0.2 : 0.8} />
                  <text
                    x={pos.x} y={track.id === "staff" ? pos.y - 22 : pos.y + 28}
                    textAnchor="middle"
                    fill={isActive ? COLORS.textPrimary : COLORS.textSecondary}
                    fontSize={12} fontWeight={600}
                    fontFamily="'DM Sans', sans-serif"
                    opacity={isFaded ? 0.3 : 1}
                  >
                    {track.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const pos = getNodePos(node);
              const meta = BRANCH_META[node.branch];
              const isActive = selected === node.id || hovered === node.id;
              const early = isEarlyCareer(node);
              const isFaded =
                (selectedTrack && !isRelatedToTrack(node.id, selectedTrack)) ||
                (selected && selected !== node.id);

              return (
                <g
                  key={node.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => handleNodeHover(node, e)}
                  onMouseLeave={handleNodeLeave}
                >
                  {isActive && (
                    <circle cx={pos.x} cy={pos.y} r={18} fill={meta.color} opacity={0.15} filter="url(#nodeGlow)" />
                  )}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={isActive ? 9 : early ? 6 : 7}
                    fill={COLORS.surface}
                    stroke={meta.color}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    opacity={isFaded ? 0.25 : 1}
                    style={{ transition: "all 0.15s ease" }}
                  />
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={early ? 2 : 2.5}
                    fill={meta.color}
                    opacity={isFaded ? 0.15 : isActive ? 1 : 0.6}
                  />
                  <text
                    x={pos.x}
                    y={BRANCH_Y_OFFSETS[node.branch] > 0 ? pos.y + 20 : BRANCH_Y_OFFSETS[node.branch] < 0 ? pos.y - 16 : pos.y + 20}
                    textAnchor="middle"
                    fill={isActive ? meta.color : COLORS.textMuted}
                    fontSize={early ? 8 : 9}
                    fontFamily="'JetBrains Mono', monospace"
                    opacity={isFaded ? 0.2 : isActive ? 1 : 0.5}
                  >
                    {node.title.length > 26 ? node.title.slice(0, 24) + "…" : node.title}
                  </text>
                </g>
              );
            })}

            {/* Scope arrow */}
            <line x1={W * 0.02} y1={H - 4} x2={W * 0.96} y2={H - 4} stroke={COLORS.textMuted} strokeWidth={0.5} opacity={0.2} />
            <polygon points={`${W * 0.96},${H - 7} ${W * 0.98},${H - 4} ${W * 0.96},${H - 1}`} fill={COLORS.textMuted} opacity={0.2} />
            <text x={W * 0.5} y={H - 4} textAnchor="middle" fill={COLORS.textMuted} fontSize={8} fontFamily="'JetBrains Mono', monospace" opacity={0.3}>
              increasing scope & responsibility →
            </text>
          </svg>
        </div>

        {!isFullscreen && !selectedNode && !selectedTrackData && (
          <div style={{ textAlign: "center", padding: "20px 0 4px", color: COLORS.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            Hover over any node to see details · Press Expand for fullscreen view
          </div>
        )}

        {/* How it works */}
        {!isFullscreen && (
        <div
          style={{
            marginTop: 28,
            padding: "18px 22px",
            background: COLORS.surface,
            borderRadius: 10,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: COLORS.ic, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
            The Model
          </div>
          <p style={{ color: COLORS.textSecondary, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            Engineers start as{" "}
            <span style={{ color: COLORS.ic }}>purely individual contributors</span>{" "}
            — learning the craft at junior, becoming reliable at mid-level, and owning
            features independently at senior. The entire early career is a single track
            focused on IC depth with no expectation of mentoring, delivery ownership,
            or process involvement. Once at senior and growing, new responsibility
            branches emerge:{" "}
            <span style={{ color: COLORS.delivery }}>delivery ownership</span> and{" "}
            <span style={{ color: COLORS.tradeoff }}>technical tradeoffs</span> first,
            then{" "}
            <span style={{ color: COLORS.people }}>people development</span> and{" "}
            <span style={{ color: COLORS.process }}>process shaping</span> at senior+.
            The EM coaches engineers through these expanding responsibilities. At the
            crossroads, the branches each engineer has invested most deeply in
            naturally point toward{" "}
            <span style={{ color: COLORS.staff }}>Staff Engineer</span> (IC depth +
            architectural judgment) or{" "}
            <span style={{ color: COLORS.em }}>Engineering Manager</span> (delivery +
            people + process at team scope).
          </p>
        </div>
        )}
        </>)}

        {/* ── Current State tab ───────────────────────────── */}
        {activeTab === "current" && (<>
          {/* Current state legend */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 16,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: COLORS.ic, fontSize: 10 }}>◆</span>
                <span style={{ color: COLORS.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                  Engineering Levels
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: TECH_LEAD_ROLE.color, fontSize: 10 }}>★</span>
                <span style={{ color: COLORS.textMuted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                  Tech Lead (Role)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                background: COLORS.surfaceHover,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                color: COLORS.textSecondary,
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.border;
                e.currentTarget.style.color = COLORS.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.surfaceHover;
                e.currentTarget.style.color = COLORS.textSecondary;
              }}
              title={isFullscreen ? "Exit fullscreen (Esc)" : "Enter fullscreen"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isFullscreen ? (
                  <>
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </>
                ) : (
                  <>
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </>
                )}
              </svg>
              {isFullscreen ? "Exit" : "Expand"}
            </button>
          </div>

          {/* Current State SVG */}
          {(() => {
            const curH = isFullscreen ? Math.max(400, window.innerHeight - 120) : 420;
            const curMidY = curH * 0.55;
            const tlY = curH * 0.32; // Tech Lead line above main track
            const curPhaseX = CURRENT_PHASES.map((p) => W * p.x);

            // Tech Lead line starts well into Senior (not right away) and goes through to Principal
            const tlStartX = curPhaseX[2] + (curPhaseX[3] - curPhaseX[2]) * 0.4; // 40% of the way from Senior to Staff
            const tlEndX = curPhaseX[4] + 40; // Extends past Principal

            // Build paths
            const levelPath = `M ${curPhaseX[0]} ${curMidY} L ${curPhaseX[4]} ${curMidY}`;
            const tlPath = `M ${tlStartX} ${tlY} L ${tlEndX} ${tlY}`;

            const handleCurrentNodeHover = (node, e) => {
              setSelected(node.id);
              setSelectedTrack(null);
              setHovered(node.id);
              if (svgContainerRef.current && e) {
                const rect = svgContainerRef.current.getBoundingClientRect();
                const nx = curPhaseX[node.phase];
                const ny = curMidY;
                const scaleX = rect.width / W;
                const scaleY = rect.height / curH;
                setModalPos({ x: rect.left + nx * scaleX, y: rect.top + ny * scaleY });
              }
            };

            const handleTLHover = (e) => {
              setSelected("tech-lead");
              setSelectedTrack(null);
              setHovered("tech-lead");
              if (svgContainerRef.current && e) {
                const rect = svgContainerRef.current.getBoundingClientRect();
                const scaleX = rect.width / W;
                const scaleY = rect.height / curH;
                // Position modal near the middle of the TL line
                const tlMidX = (tlStartX + tlEndX) / 2;
                setModalPos({ x: rect.left + tlMidX * scaleX, y: rect.top + tlY * scaleY });
              }
            };

            return (
              <div
                ref={svgContainerRef}
                style={{
                  background: COLORS.surface,
                  borderRadius: 12,
                  border: `1px solid ${COLORS.border}`,
                  overflow: "hidden",
                }}
              >
                <svg width="100%" viewBox={`0 0 ${W} ${curH}`} style={{ display: "block" }}>
                  <defs>
                    <filter id="curNodeGlow">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Subtle grid */}
                  {Array.from({ length: Math.floor(W / 24) }).map((_, i) =>
                    Array.from({ length: Math.floor(curH / 24) }).map((_, j) => (
                      <circle
                        key={`cg-${i}-${j}`}
                        cx={i * 24 + 12}
                        cy={j * 24 + 12}
                        r={0.4}
                        fill={COLORS.textMuted}
                        opacity={0.12}
                      />
                    ))
                  )}

                  {/* Phase column guides */}
                  {CURRENT_PHASES.map((p, i) => {
                    const x = curPhaseX[i];
                    return (
                      <g key={p.id}>
                        <line
                          x1={x} y1={28} x2={x} y2={curH - 12}
                          stroke={COLORS.border}
                          strokeWidth={0.5}
                          strokeDasharray="4 6"
                          opacity={0.5}
                        />
                        <text
                          x={x} y={18}
                          textAnchor="middle"
                          fill={COLORS.textMuted}
                          fontSize={10}
                          fontFamily="'JetBrains Mono', monospace"
                          fontWeight={500}
                          opacity={0.6}
                        >
                          {p.label}
                        </text>
                        <text
                          x={x} y={curH - 16}
                          textAnchor="middle"
                          fill={COLORS.textMuted}
                          fontSize={9}
                          fontFamily="'JetBrains Mono', monospace"
                          opacity={0.3}
                        >
                          {p.sublabel}
                        </text>
                      </g>
                    );
                  })}

                  {/* Main level path (horizontal line) */}
                  <path
                    d={levelPath}
                    stroke={COLORS.ic}
                    strokeWidth={4}
                    fill="none"
                    opacity={selected === "tech-lead" ? 0.06 : 0.15}
                  />
                  <path
                    d={levelPath}
                    stroke={COLORS.ic}
                    strokeWidth={1.5}
                    fill="none"
                    opacity={selected === "tech-lead" ? 0.15 : 0.6}
                  />

                  {/* Tech Lead parallel line (detached - not connected to main track) */}
                  <path
                    d={tlPath}
                    stroke={TECH_LEAD_ROLE.color}
                    strokeWidth={3}
                    fill="none"
                    opacity={selected && selected !== "tech-lead" ? 0.04 : 0.12}
                  />
                  <path
                    d={tlPath}
                    stroke={TECH_LEAD_ROLE.color}
                    strokeWidth={1.5}
                    fill="none"
                    opacity={selected && selected !== "tech-lead" ? 0.15 : 0.5}
                    strokeDasharray="6 4"
                  />

                  {/* Tech Lead label on the line */}
                  <text
                    x={(tlStartX + tlEndX) / 2}
                    y={tlY - 12}
                    textAnchor="middle"
                    fill={TECH_LEAD_ROLE.color}
                    fontSize={11}
                    fontFamily="'DM Sans', sans-serif"
                    fontWeight={600}
                    opacity={selected && selected !== "tech-lead" ? 0.3 : 0.8}
                  >
                    Tech Lead
                  </text>
                  <text
                    x={(tlStartX + tlEndX) / 2}
                    y={tlY + 16}
                    textAnchor="middle"
                    fill={TECH_LEAD_ROLE.color}
                    fontSize={8}
                    fontFamily="'JetBrains Mono', monospace"
                    opacity={selected && selected !== "tech-lead" ? 0.2 : 0.4}
                  >
                    additional responsibilities (not a level)
                  </text>

                  {/* Star markers along Tech Lead line - each with its own hover target */}
                  {[tlStartX, (tlStartX + tlEndX) / 2, tlEndX - 40].map((x, i) => {
                    const isActive = selected === "tech-lead" || hovered === "tech-lead";
                    const isFaded = selected && selected !== "tech-lead";
                    return (
                      <g
                        key={`tl-star-${i}`}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => handleTLHover(e)}
                        onMouseLeave={handleNodeLeave}
                      >
                        {/* Large invisible hover target for each node */}
                        <circle
                          cx={x} cy={tlY}
                          r={25}
                          fill="transparent"
                        />
                        {isActive && (
                          <circle cx={x} cy={tlY} r={18} fill={TECH_LEAD_ROLE.color} opacity={0.12} filter="url(#curNodeGlow)" />
                        )}
                        <circle
                          cx={x} cy={tlY}
                          r={isActive ? 10 : (i === 1 ? 8 : 6)}
                          fill={COLORS.surface}
                          stroke={TECH_LEAD_ROLE.color}
                          strokeWidth={isActive ? 2.5 : (i === 1 ? 2 : 1.5)}
                          opacity={isFaded ? 0.3 : 1}
                          style={{ transition: "all 0.15s ease" }}
                        />
                        <text
                          x={x} y={tlY + 4}
                          textAnchor="middle"
                          fill={TECH_LEAD_ROLE.color}
                          fontSize={i === 1 ? 10 : 8}
                          fontFamily="'JetBrains Mono', monospace"
                          fontWeight={600}
                          opacity={isFaded ? 0.2 : 0.8}
                        >
                          ★
                        </text>
                      </g>
                    );
                  })}

                  {/* Additional hover target covering the line between nodes */}
                  <rect
                    x={tlStartX}
                    y={tlY - 20}
                    width={tlEndX - tlStartX - 40}
                    height={40}
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => handleTLHover(e)}
                    onMouseLeave={handleNodeLeave}
                  />

                  {/* Level nodes */}
                  {CURRENT_NODES.map((node) => {
                    const nx = curPhaseX[node.phase];
                    const ny = curMidY;
                    const isActive = selected === node.id || hovered === node.id;
                    const isFaded = selected && selected !== node.id && selected !== "tech-lead";
                    return (
                      <g
                        key={node.id}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => handleCurrentNodeHover(node, e)}
                        onMouseLeave={handleNodeLeave}
                      >
                        {isActive && (
                          <circle cx={nx} cy={ny} r={18} fill={COLORS.ic} opacity={0.15} filter="url(#curNodeGlow)" />
                        )}
                        <circle
                          cx={nx} cy={ny}
                          r={isActive ? 9 : 7}
                          fill={COLORS.surface}
                          stroke={COLORS.ic}
                          strokeWidth={isActive ? 2.5 : 1.5}
                          opacity={isFaded ? 0.25 : 1}
                          style={{ transition: "all 0.15s ease" }}
                        />
                        <circle
                          cx={nx} cy={ny}
                          r={2.5}
                          fill={COLORS.ic}
                          opacity={isFaded ? 0.15 : isActive ? 1 : 0.6}
                        />
                        <text
                          x={nx} y={ny + 22}
                          textAnchor="middle"
                          fill={isActive ? COLORS.ic : COLORS.textMuted}
                          fontSize={9}
                          fontFamily="'JetBrains Mono', monospace"
                          opacity={isFaded ? 0.2 : isActive ? 1 : 0.5}
                        >
                          {node.title}
                        </text>
                      </g>
                    );
                  })}

                  {/* Scope arrow */}
                  <line x1={W * 0.02} y1={curH - 4} x2={W * 0.96} y2={curH - 4} stroke={COLORS.textMuted} strokeWidth={0.5} opacity={0.2} />
                  <polygon points={`${W * 0.96},${curH - 7} ${W * 0.98},${curH - 4} ${W * 0.96},${curH - 1}`} fill={COLORS.textMuted} opacity={0.2} />
                  <text x={W * 0.5} y={curH - 4} textAnchor="middle" fill={COLORS.textMuted} fontSize={8} fontFamily="'JetBrains Mono', monospace" opacity={0.3}>
                    career progression →
                  </text>
                </svg>
              </div>
            );
          })()}

          {!isFullscreen && !selectedCurrentNode && (
            <div style={{ textAlign: "center", padding: "20px 0 4px", color: COLORS.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
              Hover over any node to see details · Press Expand for fullscreen view
            </div>
          )}

          {/* Current State - How it works */}
          {!isFullscreen && (
            <div
              style={{
                marginTop: 28,
                padding: "18px 22px",
                background: COLORS.surface,
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: TECH_LEAD_ROLE.color, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
                Current Model
              </div>
              <p style={{ color: COLORS.textSecondary, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                Engineers progress through five levels:{" "}
                <span style={{ color: COLORS.ic }}>Junior</span>,{" "}
                <span style={{ color: COLORS.ic }}>Mid-Level</span>,{" "}
                <span style={{ color: COLORS.ic }}>Senior</span>,{" "}
                <span style={{ color: COLORS.ic }}>Staff</span>, and{" "}
                <span style={{ color: COLORS.ic }}>Principal</span>. Starting at Senior,
                high-performing engineers may be assigned the{" "}
                <span style={{ color: TECH_LEAD_ROLE.color }}>Tech Lead</span> role — shown
                as a parallel track above the main progression. This is a designation
                (not a level) that bundles delivery ownership, technical decision-making,
                mentoring, and process responsibilities into a single role. An engineer
                can be a Senior Tech Lead, Staff Tech Lead, or Principal Tech Lead — the
                role travels alongside their level progression. The{" "}
                <span style={{ color: COLORS.textPrimary }}>Future Vision</span> tab
                shows how we plan to embed these responsibilities into the natural
                progression from senior onward, so they develop organically rather than
                landing all at once in a separate designation.
              </p>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}
