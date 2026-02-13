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

export default function CareerSpectrum() {
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
    const color = isNode ? BRANCH_META[data.branch].color : data.color;
    const icon = isNode ? BRANCH_META[data.branch].icon : null;
    const label = isNode
      ? `${BRANCH_META[data.branch].label} · ${PHASES[data.phase].sublabel}`
      : "Distinct Track";

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
      {selectedNode && (
        <DetailModal data={selectedNode} type="node" onClose={() => setSelected(null)} />
      )}
      {selectedTrackData && (
        <DetailModal data={selectedTrackData} type="track" onClose={() => setSelectedTrack(null)} />
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
              From junior through senior, additional responsibilities emerge and
              branch toward Staff or EM. Hover over any node to explore.
            </p>
          </div>
        )}

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
      </div>
    </div>
  );
}
