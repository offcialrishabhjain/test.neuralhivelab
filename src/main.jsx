import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrainCircuit, Sparkles, RotateCcw, Play, ChevronRight, CircleHelp, MousePointer2, SlidersHorizontal, Github, ArrowUpRight, Layers3 } from 'lucide-react';
import './styles.css';

const W = 620, H = 420, PAD = 28;
const palette = ['#9B8CFF', '#55D6BE', '#FFB86B', '#FF7B9C', '#78B7FF', '#E6E86A'];
const initialPoints = [
  [0.18,0.25],[0.22,0.31],[0.28,0.19],[0.31,0.28],[0.14,0.36],[0.25,0.39],
  [0.69,0.23],[0.75,0.31],[0.81,0.2],[0.73,0.14],[0.86,0.33],[0.65,0.36],
  [0.45,0.7],[0.51,0.78],[0.58,0.68],[0.41,0.82],[0.57,0.86],[0.48,0.62],
  [0.36,0.47],[0.63,0.49],[0.35,0.57],[0.68,0.59],[0.52,0.43],[0.79,0.66],
  [0.12,0.68],[0.18,0.76],[0.25,0.66],[0.2,0.86],[0.31,0.75],[0.09,0.81]
].map(([x,y], i) => ({ x, y, id: i, cluster: null }));

function dist(a,b){ return Math.hypot(a.x-b.x, a.y-b.y); }
function assign(points, centers) {
  return points.map(p => ({...p, cluster: centers.reduce((best,c,i) => dist(p,c) < dist(p,centers[best]) ? i : best, 0)}));
}
function recompute(points, centers) {
  return centers.map((c,i) => {
    const group = points.filter(p => p.cluster === i);
    if (!group.length) return c;
    return {x: group.reduce((s,p)=>s+p.x,0)/group.length, y: group.reduce((s,p)=>s+p.y,0)/group.length};
  });
}
function randomPoints(n=30) {
  const centers = Array.from({length:3},()=>({x:.15+Math.random()*.7,y:.15+Math.random()*.7}));
  return Array.from({length:n},(_,i)=>{
    const c=centers[i%centers.length];
    return {id:i,x:Math.max(.04,Math.min(.96,c.x+(Math.random()-.5)*.28)),y:Math.max(.04,Math.min(.96,c.y+(Math.random()-.5)*.28)),cluster:null};
  });
}
function App(){
  const [points,setPoints]=useState(initialPoints);
  const [k,setK]=useState(3);
  const [centers,setCenters]=useState([]);
  const [step,setStep]=useState(0);
  const [running,setRunning]=useState(false);
  const [showCentroids,setShowCentroids]=useState(true);
  const [selected,setSelected]=useState('kmeans');
  const [help,setHelp]=useState(false);
  const [message,setMessage]=useState('Choose the number of clusters, then run the algorithm.');

  const start = () => {
    const shuffled=[...points].sort(()=>Math.random()-.5);
    let c=shuffled.slice(0,k).map(p=>({x:p.x,y:p.y}));
    const assigned=assign(points,c);
    setCenters(c); setPoints(assigned); setStep(1); setRunning(true);
    setMessage('Step 1: each point is assigned to its nearest centroid.');
  };
  const nextStep = () => {
    if(!centers.length){ start(); return; }
    const nextCenters=recompute(points,centers);
    const nextPoints=assign(points,nextCenters);
    const moved=nextCenters.some((c,i)=>dist(c,centers[i])>.002);
    setCenters(nextCenters); setPoints(nextPoints); setStep(s=>s+1);
    if(!moved || step>=12){setRunning(false);setMessage('Converged! The centroids have stabilised. Try changing K or generating a new dataset.');}
    else setMessage(`Step ${step+1}: centroids move to the mean position of their assigned points.`);
  };
  const reset = () => {setPoints(initialPoints.map(p=>({...p,cluster:null})));setCenters([]);setStep(0);setRunning(false);setMessage('Choose the number of clusters, then run the algorithm.');};
  const changeK = v => {setK(Number(v)); reset();};
  const generate = () => {setPoints(randomPoints());setCenters([]);setStep(0);setRunning(false);setMessage('Fresh dataset generated. Run K-means to discover its clusters.');};
  const inertia = useMemo(()=>centers.length?points.reduce((s,p)=>s+dist(p,centers[p.cluster ?? 0])**2,0):null,[points,centers]);
  const counts = useMemo(()=>Array.from({length:k},(_,i)=>points.filter(p=>p.cluster===i).length),[points,k]);
  const sx=x=>PAD+x*(W-PAD*2), sy=y=>PAD+y*(H-PAD*2);

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Neural Hive Lab home"><span className="brand-mark"><BrainCircuit size={22}/></span><span>NEURAL <b>HIVE</b><small>LAB / EXPERIMENT 001</small></span></a>
      <nav><a className="nav-active" href="#playground">Playground</a><a href="#how-it-works">How it works</a><a href="https://nh-club-website.vercel.app/" target="_blank" rel="noreferrer">Club website <ArrowUpRight size={14}/></a></nav>
      <a className="github-link" href="https://github.com/" target="_blank" rel="noreferrer"><Github size={16}/> <span>Open source</span></a>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> A HANDS-ON INTRODUCTION TO MACHINE LEARNING</div><h1>Make data make<br/><em>sense.</em></h1><p>Stop treating machine learning like a black box. Change the inputs, run an algorithm, and watch patterns emerge in real time.</p><div className="hero-actions"><a className="primary-btn" href="#playground">Enter the playground <ChevronRight size={17}/></a><span className="micro-note"><Sparkles size={14}/> No setup. Just curiosity.</span></div></div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="art-core"><BrainCircuit size={58} strokeWidth={1.15}/></div>{Array.from({length:22},(_,i)=><i key={i} className={`particle p${i+1}`}/)}<div className="art-label label-a">INPUT DATA <span>●●●</span></div><div className="art-label label-b">PATTERN FOUND <span>↗</span></div></div>
      </section>

      <section className="experiment" id="playground">
        <div className="section-heading"><div><div className="eyebrow">01 / INTERACTIVE EXPERIMENT</div><h2>The clustering lab</h2></div><div className="experiment-tag"><span className="status-dot"/> LIVE SIMULATION</div></div>
        <div className="workspace">
          <aside className="control-panel">
            <div className="panel-title"><SlidersHorizontal size={16}/> EXPERIMENT CONTROLS</div>
            <div className="control-group"><label>ALGORITHM <span className="tiny-badge">UNSUPERVISED</span></label><button className={`algorithm-option ${selected==='kmeans'?'chosen':''}`} onClick={()=>setSelected('kmeans')}><span className="algo-icon"><Layers3 size={17}/></span><span><b>K-means clustering</b><small>Group similar data points</small></span><span className="radio-dot"/></button><div className="disabled-option"><span className="algo-icon muted"><Sparkles size={17}/></span><span><b>More experiments</b><small>Coming soon</small></span><span className="soon-pill">SOON</span></div></div>
            <div className="control-group"><div className="label-row"><label htmlFor="clusters">NUMBER OF CLUSTERS (K)</label><output>{k}</output></div><input id="clusters" type="range" min="2" max="6" value={k} onChange={e=>changeK(e.target.value)} style={{'--range':`${(k-2)/4*100}%`}}/><div className="range-labels"><span>2 clusters</span><span>6 clusters</span></div><p className="control-hint">How many groups should the algorithm look for?</p></div>
            <div className="control-group"><label>DISPLAY OPTIONS</label><label className="toggle-row"><span>Show centroids <small>Cluster centre markers</small></span><input type="checkbox" checked={showCentroids} onChange={e=>setShowCentroids(e.target.checked)}/><i className="toggle"/></label></div>
            <div className="button-stack"><button className="run-btn" onClick={start}><Play size={16} fill="currentColor"/> {step===0?'Run K-means':'Restart experiment'}</button><button className="step-btn" onClick={nextStep} disabled={!centers.length||!running}><ChevronRight size={16}/> Next iteration</button><button className="reset-btn" onClick={reset}><RotateCcw size={14}/> Reset</button></div>
            <div className="tip-box"><CircleHelp size={16}/><p><b>Try this:</b> Run the model, then change K. Notice how the same data can be grouped in different ways.</p></div>
          </aside>

          <div className="chart-panel"><div className="chart-top"><div><div className="chart-title">DATASET VISUALISATION</div><div className="chart-subtitle">2-dimensional feature space</div></div><button className="generate-btn" onClick={generate}><RotateCcw size={13}/> New dataset</button></div>
            <div className="plot-wrap"><svg viewBox={`0 0 ${W} ${H}`} className="plot" role="img" aria-label="Scatter plot showing data points grouped into clusters"><defs><pattern id="grid" width="56.4" height="36.4" patternUnits="userSpaceOnUse" x="0" y="0"><path d="M 56.4 0 L 0 0 0 36.4" fill="none" stroke="rgba(180,180,210,.10)" strokeWidth="1"/></pattern></defs><rect x={PAD} y={PAD} width={W-PAD*2} height={H-PAD*2} fill="url(#grid)"/><line x1={PAD} y1={H-PAD} x2={W-PAD} y2={H-PAD} className="axis"/><line x1={PAD} y1={PAD} x2={PAD} y2={H-PAD} className="axis"/><text x={W/2} y={H-5} className="axis-label" textAnchor="middle">FEATURE 1 →</text><text x="11" y={H/2} className="axis-label" textAnchor="middle" transform={`rotate(-90 11 ${H/2})`}>FEATURE 2 →</text>
              {points.map(p=><circle key={p.id} cx={sx(p.x)} cy={sy(p.y)} r="6.2" fill={p.cluster==null?'#686779':palette[p.cluster%palette.length]} stroke={p.cluster==null?'#9997AA':'rgba(255,255,255,.48)'} strokeWidth="1.3" className="data-point"><title>{`Point ${p.id+1}${p.cluster!=null?`, cluster ${p.cluster+1}`:''}`}</title></circle>)}
              {showCentroids&&centers.map((c,i)=><g key={i} transform={`translate(${sx(c.x)} ${sy(c.y)})`}><circle r="12" fill={palette[i%palette.length]} opacity=".2"/><path d="M -7 0 H 7 M 0 -7 V 7" stroke={palette[i%palette.length]} strokeWidth="2.4" strokeLinecap="round"/><circle r="3" fill={palette[i%palette.length]} stroke="#11111a" strokeWidth="1"/></g>)}
            </svg></div>
            <div className="chart-legend">{Array.from({length:k},(_,i)=><span key={i}><i style={{background:centers.length?palette[i%palette.length]:'#686779'}}/>{centers.length?`Cluster ${i+1}`:`Group ${i+1}`}</span>)}<span className="legend-centroid"><b>✳</b> Centroid</span></div>
            <div className="chart-footer"><span><i className="footer-dot"/> {points.length} data points</span><span>ITERATION <b>{step}</b></span><span>STATUS <b className={running?'running':step?'complete':'idle'}>{running?'IN PROGRESS':step?'CONVERGED':'READY'}</b></span></div>
          </div>
        </div>
        <div className="insight-row"><div className="insight-icon"><Sparkles size={19}/></div><div className="insight-copy"><span className="insight-label">MODEL INSIGHT</span><p>{message}</p></div><div className="metric"><span>DATA POINTS</span><b>{points.length}</b></div><div className="metric"><span>CLUSTERS (K)</span><b>{k}</b></div><div className="metric"><span>WITHIN-CLUSTER ERROR</span><b>{inertia===null?'—':inertia.toFixed(3)}</b></div></div>
      </section>

      <section className="learn-section" id="how-it-works"><div className="learn-intro"><div className="eyebrow">02 / THE IDEA BEHIND THE CODE</div><h2>Three steps.<br/><em>One pattern.</em></h2><p>K-means is an unsupervised learning algorithm. It finds groups in data without being told the correct answers beforehand.</p></div><div className="steps"><article><span className="step-number">01</span><div className="step-icon">◎</div><h3>Pick the centres</h3><p>The algorithm starts with K randomly chosen points as the initial cluster centres, called centroids.</p></article><article><span className="step-number">02</span><div className="step-icon">⌁</div><h3>Assign each point</h3><p>Every point joins the cluster whose centroid is closest, usually measured by Euclidean distance.</p></article><article><span className="step-number">03</span><div className="step-icon">↻</div><h3>Update & repeat</h3><p>Centroids move to the average position of their points. Repeat until the groups stop changing much.</p></article></div></section>
      <section className="takeaway"><div><div className="eyebrow">YOUR TURN TO EXPLORE</div><h2>Curiosity is a pretty good <em>starting point.</em></h2><p>Change K. Generate new data. Run the experiment again. There isn't always one perfect way to group a dataset.</p></div><a href="#playground" className="primary-btn">Back to the lab <ChevronRight size={17}/></a></section>
    </main>
    <footer><a className="footer-brand" href="#top"><BrainCircuit size={18}/> NEURAL HIVE LAB</a><span>A community-powered learning experiment.</span><span>BUILT TO MAKE AI LESS OF A BLACK BOX.</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);
