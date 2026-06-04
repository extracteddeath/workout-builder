import { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronLeft, ChevronRight, ChevronUp, Check, Plus, Minus, Dumbbell, Target, Clock,
  Zap, Calendar, RefreshCw, X, Repeat, Ban, Save, Flame, Layers, Trophy,
  Settings2, Trash2, ChevronDown, Pencil, Wand2, Battery, Library, Search,
  Copy, BarChart3, PlusCircle,
  Play, Pause, SkipForward, CheckCircle2, TrendingUp, Timer, TrendingDown, Info,
  Home as HomeIcon, Palette, Activity, Award, GripVertical
} from "lucide-react";

/* ============================== DESIGN TOKENS ============================== */
// Full per-theme palettes (ported from the Pursuit running app — tinted, cohesive).
// Each theme defines its own background/surface/text tints, not just an accent swap.
const TOK = (p) => ({
  bg: p.bg, bg2: p.bgTint, card: p.surface, cardHi: p.surface2,
  border: p.border, borderSoft: p.borderSoft,
  text: p.cream, muted: p.muted, faint: p.mutedSoft,
  accent: p.accent, accentDim: p.accent + "22", accentText: p.onAccent,
  danger: p.danger, dangerDim: p.danger + "1E",
  warn: p.warm, warnDim: p.warm + "1E",
});
const THEMES = {
  lime:   { name: "Lime",   base: "dark",  accent: "#D4FF3D", palette: TOK({ bg: "#0A0908", bgTint: "#0F0D10", surface: "#15131A", surface2: "#1E1A25", border: "rgba(255,255,255,0.08)", borderSoft: "rgba(255,255,255,0.05)", cream: "#F2EEE4", muted: "#A29EA8", mutedSoft: "#6F6B76", accent: "#D4FF3D", onAccent: "#0A0908", warm: "#E4BC5D", danger: "#FF5D6C" }) },
  ember:  { name: "Ember",  base: "dark",  accent: "#FF8A3D", palette: TOK({ bg: "#120907", bgTint: "#17100C", surface: "#1E1511", surface2: "#2A1D17", border: "rgba(255,200,150,0.09)", borderSoft: "rgba(255,200,150,0.04)", cream: "#F5EDE2", muted: "#A3968A", mutedSoft: "#6B5F55", accent: "#FF8A3D", onAccent: "#120907", warm: "#F5B85D", danger: "#FF5D6C" }) },
  ice:    { name: "Ice",    base: "dark",  accent: "#5DD4E4", palette: TOK({ bg: "#090D12", bgTint: "#0D1219", surface: "#131A22", surface2: "#1B2430", border: "rgba(160,200,255,0.09)", borderSoft: "rgba(160,200,255,0.04)", cream: "#E8EDF2", muted: "#8A94A0", mutedSoft: "#5A6370", accent: "#5DD4E4", onAccent: "#090D12", warm: "#E4C25D", danger: "#FF5D8A" }) },
  rose:   { name: "Rose",   base: "dark",  accent: "#FF6B8A", palette: TOK({ bg: "#12091A", bgTint: "#170C20", surface: "#1D1227", surface2: "#281A35", border: "rgba(255,180,220,0.09)", borderSoft: "rgba(255,180,220,0.04)", cream: "#F0E8EE", muted: "#A0939E", mutedSoft: "#685D66", accent: "#FF6B8A", onAccent: "#12091A", warm: "#E4A55D", danger: "#FF5D6C" }) },
  forest: { name: "Forest", base: "dark",  accent: "#A8DC5D", palette: TOK({ bg: "#080C0A", bgTint: "#0C120F", surface: "#121A15", surface2: "#1A2620", border: "rgba(180,220,180,0.09)", borderSoft: "rgba(180,220,180,0.04)", cream: "#E8EFE6", muted: "#8A948A", mutedSoft: "#5A6560", accent: "#A8DC5D", onAccent: "#080C0A", warm: "#D4B85D", danger: "#E4615D" }) },
  light:  { name: "Mint",   base: "light", accent: "#2B9E8A", palette: TOK({ bg: "#F4F3F0", bgTint: "#EDECEA", surface: "#FFFFFF", surface2: "#F8F7F5", border: "rgba(20,20,18,0.10)", borderSoft: "rgba(20,20,18,0.05)", cream: "#1A1A18", muted: "#6B6A66", mutedSoft: "#999895", accent: "#2B9E8A", onAccent: "#FFFFFF", warm: "#B87A2E", danger: "#CC3F3F" }) },
  clay:   { name: "Clay",   base: "light", accent: "#C45A3C", palette: TOK({ bg: "#F2EDE1", bgTint: "#ECE5D4", surface: "#FFFFFF", surface2: "#FAF5EB", border: "rgba(26,21,16,0.10)", borderSoft: "rgba(26,21,16,0.05)", cream: "#1A1510", muted: "#78685A", mutedSoft: "#A89785", accent: "#C45A3C", onAccent: "#FFFFFF", warm: "#B88936", danger: "#C4413D" }) },
};
const C = { ...THEMES.lime.palette };
function applyTheme(id) {
  Object.assign(C, (THEMES[id] || THEMES.lime).palette);
}

function StyleTag() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
      *{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
      html{-webkit-text-size-adjust:100%;}
      .wpb,.wpb *{font-family:'Plus Jakarta Sans',sans-serif;}
      .wpb{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;}
      button,input,textarea,select{font-family:inherit;}
      button{cursor:pointer;}
      .mono{font-family:'Space Mono',monospace;}
      .wpb-scroll{-webkit-overflow-scrolling:touch;}
      .wpb-scroll::-webkit-scrollbar{width:8px;height:8px;}
      .wpb-scroll::-webkit-scrollbar-thumb{background:${C.border};border-radius:8px;}
      .wpb-scroll::-webkit-scrollbar-track{background:transparent;}
      .wpb ::selection{background:${C.accent}40;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
      @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
      @keyframes sheetUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
      @keyframes spin{to{transform:rotate(360deg);}}
      .wpb-spin{animation:spin .8s linear infinite;}
      @keyframes arrUp{0%{opacity:.15;transform:translateY(5px);}50%{opacity:1;transform:translateY(-5px);}100%{opacity:.15;transform:translateY(5px);}}
      @keyframes arrDown{0%{opacity:.15;transform:translateY(-5px);}50%{opacity:1;transform:translateY(5px);}100%{opacity:.15;transform:translateY(-5px);}}
      .exarr-up{animation:arrUp 1.5s ease-in-out infinite;}
      .exarr-down{animation:arrDown 1.5s ease-in-out infinite;}
      @keyframes slideL{from{opacity:0;transform:translateX(26px);}to{opacity:1;transform:translateX(0);}}
      @keyframes slideR{from{opacity:0;transform:translateX(-26px);}to{opacity:1;transform:translateX(0);}}
      .fadeUp{animation:fadeUp .35s cubic-bezier(.2,.7,.3,1) both;}
      @keyframes viewIn{from{opacity:0;transform:translateY(7px);}to{opacity:1;transform:translateY(0);}}
      .viewIn{animation:viewIn .24s cubic-bezier(.2,.7,.3,1) both;}
      .opt{transition:border-color .15s ease, background .15s ease, transform .08s ease;}
      .opt:active{transform:scale(.985);}
      .opt:hover{background:${C.cardHi};}
      .pressable{transition:transform .08s ease, opacity .15s ease, background .15s ease, border-color .15s;}
      .pressable:active{transform:scale(.96);}
      @media (prefers-reduced-motion: reduce){*{animation-duration:.01ms !important;animation-iteration-count:1 !important;}}
      input,textarea{outline:none;}
    `}</style>
  );
}

/* ============================== STATIC DATA ============================== */
const PART_LABEL = {
  chest: "Chest", lats: "Lats", upper_back: "Upper Back", shoulders: "Shoulders", biceps: "Biceps",
  triceps: "Triceps", quads: "Quads", hamstrings: "Hamstrings", glutes: "Glutes", lower_back: "Lower Back",
  calves: "Calves", abs: "Abs / Core", traps: "Traps", forearms: "Forearms", neck: "Neck",
  adductors: "Adductors", abductors: "Abductors",
};
const PART_ORDER = ["chest","lats","upper_back","shoulders","biceps","triceps","quads","hamstrings","glutes","lower_back","adductors","abductors","calves","abs","traps","forearms","neck"];

const EQUIPMENT = [
  { id: "barbell", label: "Barbell" }, { id: "dumbbell", label: "Dumbbells" },
  { id: "bench", label: "Adjustable Bench" }, { id: "cable", label: "Cable Machine" },
  { id: "machine", label: "Selectorized Machines" }, { id: "smith", label: "Smith Machine" },
  { id: "ezbar", label: "EZ Curl Bar" }, { id: "pullup", label: "Pull-up Bar" },
  { id: "dip", label: "Dip Station" }, { id: "kettlebell", label: "Kettlebells" },
  { id: "bands", label: "Resistance Bands" },
];

// [id, name, part, type, equip[]]  (empty equip = bodyweight, always available)
// [id, name, part, type, equip, repLo, repHi] — hypertrophy rep range per exercise.
// Ordered staple-first within each muscle (favoured by the generator). Ranges follow
// evidence-based norms (Nippard / Wolf / Ethier): heavy axial lifts low, isolation high.
const RAW = [
  ["bb-bench","Barbell Bench Press","chest","compound",["barbell","bench"],5,10],
  ["inc-db-press","Incline Dumbbell Press","chest","compound",["dumbbell","bench"],8,12],
  ["inc-bb-bench","Incline Barbell Press","chest","compound",["barbell","bench"],6,10],
  ["machine-press","Machine Chest Press","chest","compound",["machine"],8,12],
  ["db-bench","Dumbbell Bench Press","chest","compound",["dumbbell","bench"],8,12],
  ["dips-chest","Weighted Chest Dip","chest","compound",["dip"],6,12],
  ["cable-fly","Cable Fly","chest","isolation",["cable"],12,20],
  ["inc-cable-fly","Low-to-High Cable Fly","chest","isolation",["cable"],12,20],
  ["pec-deck","Pec Deck","chest","isolation",["machine"],12,20],
  ["smith-bench","Smith Machine Bench Press","chest","compound",["smith","bench"],6,10],
  ["db-fly","Dumbbell Fly","chest","isolation",["dumbbell","bench"],12,18],
  ["pushup","Push-Up","chest","compound",[],10,20],

  ["pullup","Weighted Pull-Up","lats","compound",["pullup"],6,12],
  ["lat-pulldown","Lat Pulldown","lats","compound",["cable"],8,12],
  ["chest-row","Chest-Supported Row","upper_back","compound",["machine"],8,12],
  ["bb-row","Barbell Row","upper_back","compound",["barbell"],6,10],
  ["seated-row","Seated Cable Row","upper_back","compound",["cable"],8,12],
  ["db-row","One-Arm Dumbbell Row","upper_back","compound",["dumbbell","bench"],8,12],
  ["tbar-row","T-Bar Row","upper_back","compound",["barbell"],8,12],
  ["machine-row","Machine Row","upper_back","compound",["machine"],8,12],
  ["deadlift","Deadlift","lower_back","compound",["barbell"],4,6],
  ["straight-pulldown","Straight-Arm Pulldown","lats","isolation",["cable"],12,20],
  ["inv-row","Inverted Row","upper_back","compound",[],8,15],
  ["superman","Superman Hold","lower_back","isolation",[],12,20],

  ["ohp","Overhead Press","shoulders","compound",["barbell"],5,10],
  ["db-shoulder","Dumbbell Shoulder Press","shoulders","compound",["dumbbell"],8,12],
  ["lat-raise","Dumbbell Lateral Raise","shoulders","isolation",["dumbbell"],12,20],
  ["cable-lat-raise","Cable Lateral Raise","shoulders","isolation",["cable"],12,20],
  ["machine-shoulder","Machine Shoulder Press","shoulders","compound",["machine"],8,12],
  ["rear-fly","Rear Delt Fly","shoulders","isolation",["dumbbell"],12,20],
  ["reverse-pec","Reverse Pec Deck","shoulders","isolation",["machine"],12,20],
  ["face-pull","Face Pull","shoulders","isolation",["cable"],12,20],
  ["arnold","Arnold Press","shoulders","compound",["dumbbell"],8,12],
  ["front-raise","Front Raise","shoulders","isolation",["dumbbell"],10,15],
  ["pike-pushup","Pike Push-Up","shoulders","compound",[],8,15],

  ["inc-curl","Incline Dumbbell Curl","biceps","isolation",["dumbbell","bench"],8,12],
  ["db-curl","Dumbbell Curl","biceps","isolation",["dumbbell"],8,12],
  ["bayesian-curl","Bayesian Cable Curl","biceps","isolation",["cable"],10,15],
  ["ez-curl","EZ-Bar Curl","biceps","isolation",["ezbar"],8,12],
  ["preacher","Preacher Curl","biceps","isolation",["ezbar","bench"],10,15],
  ["cable-curl","Cable Curl","biceps","isolation",["cable"],10,15],
  ["hammer","Hammer Curl","biceps","isolation",["dumbbell"],10,15],
  ["bb-curl","Barbell Curl","biceps","isolation",["barbell"],8,12],
  ["chinup","Chin-Up","biceps","compound",["pullup"],6,12],
  ["band-curl","Band Curl","biceps","isolation",["bands"],12,20],

  ["oh-cable-ext","Overhead Cable Extension","triceps","isolation",["cable"],10,15],
  ["pushdown","Tricep Pushdown","triceps","isolation",["cable"],10,15],
  ["rope-pushdown","Rope Pushdown","triceps","isolation",["cable"],10,15],
  ["cgbp","Close-Grip Bench Press","triceps","compound",["barbell","bench"],6,10],
  ["skullcrusher","Skull Crusher","triceps","isolation",["ezbar","bench"],8,12],
  ["db-oh-ext","DB Overhead Extension","triceps","isolation",["dumbbell"],10,15],
  ["dips-tri","Triceps Dip","triceps","compound",["dip"],8,12],
  ["diamond-pushup","Diamond Push-Up","triceps","compound",[],10,20],
  ["bench-dip","Bench Dip","triceps","compound",[],10,20],

  ["back-squat","Back Squat","quads","compound",["barbell"],5,8],
  ["hack-squat","Hack Squat","quads","compound",["machine"],8,12],
  ["leg-press","Leg Press","quads","compound",["machine"],8,15],
  ["front-squat","Front Squat","quads","compound",["barbell"],5,8],
  ["bulgarian","Bulgarian Split Squat","quads","compound",["dumbbell"],8,12],
  ["leg-ext","Leg Extension","quads","isolation",["machine"],12,20],
  ["smith-squat","Smith Machine Squat","quads","compound",["smith"],8,12],
  ["goblet","Goblet Squat","quads","compound",["dumbbell"],8,15],
  ["walking-lunge","Walking Lunge","quads","compound",["dumbbell"],10,15],
  ["bw-squat","Bodyweight Squat","quads","compound",[],15,25],
  ["bw-lunge","Bodyweight Lunge","quads","compound",[],12,20],
  ["bw-bulgarian","BW Bulgarian Split Squat","quads","compound",[],10,20],

  ["rdl","Romanian Deadlift","hamstrings","compound",["barbell"],6,10],
  ["lying-curl","Lying Leg Curl","hamstrings","isolation",["machine"],10,15],
  ["seated-curl","Seated Leg Curl","hamstrings","isolation",["machine"],10,15],
  ["db-rdl","Dumbbell RDL","hamstrings","compound",["dumbbell"],8,12],
  ["good-morning","Good Morning","hamstrings","compound",["barbell"],8,12],
  ["slrdl","Single-Leg RDL","hamstrings","compound",[],10,15],
  ["nordic","Nordic Curl","hamstrings","isolation",[],5,10],

  ["hip-thrust","Barbell Hip Thrust","glutes","compound",["barbell","bench"],8,12],
  ["db-hip-thrust","Dumbbell Hip Thrust","glutes","compound",["dumbbell","bench"],10,15],
  ["cable-kickback","Cable Kickback","glutes","isolation",["cable"],12,20],
  ["sl-hip-thrust","Single-Leg Hip Thrust","glutes","compound",[],10,15],
  ["glute-bridge","Glute Bridge","glutes","compound",[],12,20],
  ["sumo-dl","Sumo Deadlift","glutes","compound",["barbell"],4,8],

  ["standing-calf","Standing Calf Raise","calves","isolation",["machine"],8,15],
  ["seated-calf","Seated Calf Raise","calves","isolation",["machine"],12,20],
  ["smith-calf","Smith Calf Raise","calves","isolation",["smith"],10,15],
  ["db-calf","Dumbbell Calf Raise","calves","isolation",["dumbbell"],12,20],
  ["bw-calf","Bodyweight Calf Raise","calves","isolation",[],15,25],

  ["cable-crunch","Cable Crunch","abs","isolation",["cable"],10,20],
  ["hanging-raise","Hanging Leg Raise","abs","isolation",["pullup"],8,15],
  ["leg-raise","Lying Leg Raise","abs","isolation",[],10,20],
  ["crunch","Crunch","abs","isolation",[],12,25],
  ["bicycle","Bicycle Crunch","abs","isolation",[],15,25],
  ["russian-twist","Russian Twist","abs","isolation",[],15,25],
  ["plank","Plank","abs","isolation",[],12,20],

  ["bb-shrug","Barbell Shrug","traps","isolation",["barbell"],10,15],
  ["db-shrug","Dumbbell Shrug","traps","isolation",["dumbbell"],12,20],
  ["cable-shrug","Cable Shrug","traps","isolation",["cable"],12,20],

  ["wrist-curl","Wrist Curl","forearms","isolation",["dumbbell"],12,20],
  ["reverse-curl","Reverse Curl","forearms","isolation",["ezbar"],10,15],
  ["farmers","Farmer's Carry","forearms","compound",["dumbbell"],10,15],

  // ---- extended library (more variety for generation, swaps & manual add) ----
  // chest
  ["decline-bench","Decline Barbell Press","chest","compound",["barbell","bench"],6,10],
  ["decline-db-press","Decline Dumbbell Press","chest","compound",["dumbbell","bench"],8,12],
  ["incline-machine-press","Incline Machine Press","chest","compound",["machine"],8,12],
  ["floor-press","Floor Press","chest","compound",["barbell"],6,10],
  ["machine-dip","Machine Chest Dip","chest","compound",["machine"],8,12],
  ["high-cable-fly","High-to-Low Cable Fly","chest","isolation",["cable"],12,20],
  ["incline-pushup","Incline Push-Up","chest","compound",[],12,20],
  ["decline-pushup","Decline Push-Up","chest","compound",[],10,20],
  ["cable-press","Standing Cable Press","chest","compound",["cable"],10,15],
  // back
  ["pendlay-row","Pendlay Row","upper_back","compound",["barbell"],5,8],
  ["meadows-row","Meadows Row","upper_back","compound",["barbell"],8,12],
  ["seal-row","Seal Row","upper_back","compound",["barbell","bench"],8,12],
  ["inc-db-row","Incline Dumbbell Row","upper_back","compound",["dumbbell","bench"],8,12],
  ["wide-pulldown","Wide-Grip Lat Pulldown","lats","compound",["cable"],8,12],
  ["close-pulldown","Close-Grip Pulldown","lats","compound",["cable"],8,12],
  ["neutral-pulldown","Neutral-Grip Pulldown","lats","compound",["cable"],8,12],
  ["one-arm-pulldown","Single-Arm Lat Pulldown","lats","compound",["cable"],10,15],
  ["assisted-pullup","Assisted Pull-Up","lats","compound",["machine"],8,12],
  ["rack-pull","Rack Pull","lower_back","compound",["barbell"],4,8],
  ["kroc-row","Kroc Row","upper_back","compound",["dumbbell"],10,20],
  ["db-pullover","Dumbbell Pullover","lats","isolation",["dumbbell","bench"],10,15],
  // shoulders
  ["seated-ohp","Seated Barbell Press","shoulders","compound",["barbell","bench"],6,10],
  ["seated-db-press","Seated Dumbbell Press","shoulders","compound",["dumbbell","bench"],8,12],
  ["smith-ohp","Smith Machine Shoulder Press","shoulders","compound",["smith"],8,12],
  ["landmine-press","Landmine Press","shoulders","compound",["barbell"],8,12],
  ["machine-lat-raise","Machine Lateral Raise","shoulders","isolation",["machine"],12,20],
  ["leaning-lat-raise","Leaning Cable Lateral Raise","shoulders","isolation",["cable"],12,20],
  ["cable-rear-fly","Cable Rear Delt Fly","shoulders","isolation",["cable"],12,20],
  ["cable-front-raise","Cable Front Raise","shoulders","isolation",["cable"],10,15],
  ["upright-row","Upright Row","shoulders","compound",["barbell"],8,12],
  ["db-upright-row","Dumbbell Upright Row","shoulders","compound",["dumbbell"],10,15],
  // biceps
  ["concentration-curl","Concentration Curl","biceps","isolation",["dumbbell"],10,15],
  ["spider-curl","Spider Curl","biceps","isolation",["dumbbell","bench"],10,15],
  ["machine-curl","Machine Curl","biceps","isolation",["machine"],10,15],
  ["rope-hammer-curl","Cable Rope Hammer Curl","biceps","isolation",["cable"],10,15],
  ["cross-hammer","Cross-Body Hammer Curl","biceps","isolation",["dumbbell"],10,15],
  ["zottman-curl","Zottman Curl","biceps","isolation",["dumbbell"],10,15],
  ["drag-curl","Drag Curl","biceps","isolation",["barbell"],10,15],
  // triceps
  ["v-bar-pushdown","V-Bar Pushdown","triceps","isolation",["cable"],10,15],
  ["single-pushdown","Single-Arm Pushdown","triceps","isolation",["cable"],12,20],
  ["jm-press","JM Press","triceps","compound",["barbell","bench"],6,10],
  ["tricep-kickback","Tricep Kickback","triceps","isolation",["dumbbell"],12,20],
  ["machine-ext","Machine Triceps Extension","triceps","isolation",["machine"],10,15],
  ["ez-oh-ext","EZ-Bar Overhead Extension","triceps","isolation",["ezbar"],10,15],
  // quads
  ["pendulum-squat","Pendulum Squat","quads","compound",["machine"],8,12],
  ["belt-squat","Belt Squat","quads","compound",["machine"],10,15],
  ["box-squat","Box Squat","quads","compound",["barbell"],5,8],
  ["split-squat","Split Squat","quads","compound",["dumbbell"],8,12],
  ["step-up","Dumbbell Step-Up","quads","compound",["dumbbell"],10,15],
  ["reverse-lunge","Reverse Lunge","quads","compound",["dumbbell"],10,15],
  ["single-leg-press","Single-Leg Press","quads","compound",["machine"],10,15],
  ["sissy-squat","Sissy Squat","quads","isolation",[],10,20],
  // hamstrings
  ["stiff-deadlift","Stiff-Leg Deadlift","hamstrings","compound",["barbell"],6,10],
  ["standing-curl","Standing Leg Curl","hamstrings","isolation",["machine"],10,15],
  ["ghr","Glute-Ham Raise","hamstrings","compound",[],6,12],
  ["pull-through","Cable Pull-Through","hamstrings","compound",["cable"],12,20],
  ["kb-swing","Kettlebell Swing","hamstrings","compound",["kettlebell"],12,20],
  // glutes
  ["machine-hip-thrust","Machine Hip Thrust","glutes","compound",["machine"],8,12],
  ["smith-hip-thrust","Smith Machine Hip Thrust","glutes","compound",["smith","bench"],8,12],
  ["hip-abduction","Hip Abduction Machine","abductors","isolation",["machine"],12,20],
  ["cable-abduction","Cable Hip Abduction","abductors","isolation",["cable"],12,20],
  ["reverse-hyper","Reverse Hyperextension","glutes","isolation",["machine"],10,15],
  ["frog-pump","Frog Pump","glutes","isolation",[],15,25],
  // calves
  ["leg-press-calf","Leg Press Calf Raise","calves","isolation",["machine"],10,15],
  ["donkey-calf","Donkey Calf Raise","calves","isolation",["machine"],12,20],
  ["single-calf","Single-Leg Calf Raise","calves","isolation",["dumbbell"],12,20],
  // abs
  ["ab-wheel","Ab Wheel Rollout","abs","isolation",[],8,15],
  ["hanging-knee","Hanging Knee Raise","abs","isolation",["pullup"],10,20],
  ["machine-crunch","Machine Crunch","abs","isolation",["machine"],12,20],
  ["decline-situp","Decline Sit-Up","abs","isolation",["bench"],12,20],
  ["toes-to-bar","Toes to Bar","abs","isolation",["pullup"],8,15],
  ["side-plank","Side Plank","abs","isolation",[],12,20],
  ["pallof","Pallof Press","abs","isolation",["cable"],12,20],
  ["woodchopper","Cable Woodchopper","abs","isolation",["cable"],12,20],
  ["v-up","V-Up","abs","isolation",[],12,20],
  ["mountain-climber","Mountain Climber","abs","isolation",[],20,40],
  // traps
  ["smith-shrug","Smith Machine Shrug","traps","isolation",["smith"],12,20],
  ["machine-shrug","Machine Shrug","traps","isolation",["machine"],12,20],
  ["behind-shrug","Behind-the-Back Shrug","traps","isolation",["barbell"],12,20],
  // forearms
  ["reverse-wrist-curl","Reverse Wrist Curl","forearms","isolation",["dumbbell"],12,20],
  ["behind-wrist-curl","Behind-Back Wrist Curl","forearms","isolation",["barbell"],15,20],
  ["wrist-roller","Wrist Roller","forearms","isolation",[],10,15],
  ["plate-pinch","Plate Pinch Hold","forearms","isolation",[],10,15],

  // ---- granular variations (grip / angle / unilateral) ----
  ["push-press","Barbell Push Press","shoulders","compound",["barbell"],4,8],
  ["side-lying-raise","Side-Lying Lateral Raise","shoulders","isolation",["dumbbell","bench"],12,20],
  ["single-cable-raise","Single-Arm Cable Lateral Raise","shoulders","isolation",["cable"],12,20],
  ["underhand-row","Underhand-Grip Barbell Row","upper_back","compound",["barbell"],8,12],
  ["underhand-pulldown","Underhand-Grip Lat Pulldown","lats","compound",["cable"],8,12],
  ["single-cable-row","Single-Arm Cable Row","upper_back","compound",["cable"],10,15],
  ["kelso-shrug","Kelso Shrug","traps","isolation",["machine"],12,20],
  ["single-cable-curl","Single-Arm Cable Curl","biceps","isolation",["cable"],10,15],
  ["incline-hammer","Incline Hammer Curl","biceps","isolation",["dumbbell","bench"],10,15],
  // neck
  ["neck-extension","Weighted Neck Extension","neck","isolation",[],12,20],
  ["neck-curl","Weighted Neck Curl","neck","isolation",[],12,20],
  ["neck-harness","Neck Harness Raise","neck","isolation",[],12,20],
  ["neck-lateral","Lateral Neck Raise","neck","isolation",[],12,20],
  // --- expansion: additional staples across thinner categories ---
  ["cable-crossover","Cable Crossover","chest","isolation",["cable"],12,20],
  ["squeeze-press","Dumbbell Squeeze Press","chest","compound",["dumbbell","bench"],10,15],
  ["tate-press","Tate Press","triceps","isolation",["dumbbell"],10,15],
  ["z-press","Z Press","shoulders","compound",["barbell"],5,10],
  ["cable-y-raise","Cable Y-Raise","shoulders","isolation",["cable"],12,20],
  ["bstance-hip-thrust","B-Stance Hip Thrust","glutes","compound",["dumbbell","bench"],10,15],
  ["curtsy-lunge","Curtsy Lunge","glutes","compound",["dumbbell"],10,15],
  ["lateral-walk","Banded Lateral Walk","abductors","isolation",["bands"],15,25],
  ["band-leg-curl","Banded Leg Curl","hamstrings","isolation",["bands"],12,20],
  ["jefferson-curl","Jefferson Curl","hamstrings","isolation",["dumbbell"],8,12],
  ["bw-single-calf","Single-Leg BW Calf Raise","calves","isolation",[],15,25],
  ["trap-bar-shrug","Trap Bar Shrug","traps","isolation",["barbell"],10,15],
  ["power-shrug","Power Shrug","traps","isolation",["barbell"],6,10],
  ["dead-hang","Dead Hang","forearms","isolation",[],10,15],
  ["suitcase-carry","Suitcase Carry","forearms","compound",["dumbbell"],10,15],
  ["dead-bug","Dead Bug","abs","isolation",[],10,20],
  ["hollow-hold","Hollow Body Hold","abs","isolation",[],15,30],
  ["dragon-flag","Dragon Flag","abs","isolation",[],5,12],
  ["cable-side-bend","Cable Side Bend","abs","isolation",["cable"],12,20],
  ["copenhagen","Copenhagen Plank","adductors","isolation",[],10,20],
  ["cyclist-squat","Cyclist Squat","quads","compound",["barbell"],8,12],
  ["spanish-squat","Spanish Squat","quads","isolation",["bands"],12,20],

  // ---- expansion 2: deeper variety per muscle (angles, implements, unilateral) ----
  // chest
  ["incline-cable-press","Incline Cable Press","chest","compound",["cable"],10,15],
  ["smith-incline","Smith Machine Incline Press","chest","compound",["smith","bench"],6,10],
  ["low-incline-db","Low-Incline Dumbbell Press","chest","compound",["dumbbell","bench"],8,12],
  ["band-pushup","Banded Push-Up","chest","compound",["bands"],10,20],
  ["svend-press","Svend Press","chest","isolation",[],12,20],
  // back
  ["yates-row","Yates Row","upper_back","compound",["barbell"],8,12],
  ["cs-db-row","Chest-Supported Dumbbell Row","upper_back","compound",["dumbbell","bench"],8,12],
  ["cable-pullover","Cable Lat Pullover","lats","isolation",["cable"],12,20],
  ["machine-pullover","Machine Pullover","lats","isolation",["machine"],10,15],
  ["trap-bar-deadlift","Trap Bar Deadlift","lower_back","compound",["barbell"],4,8],
  ["snatch-deadlift","Snatch-Grip Deadlift","lower_back","compound",["barbell"],4,6],
  ["renegade-row","Renegade Row","upper_back","compound",["dumbbell"],8,12],
  ["band-pulldown","Banded Lat Pulldown","lats","compound",["bands"],12,20],
  // shoulders
  ["cable-upright-row","Cable Upright Row","shoulders","compound",["cable"],10,15],
  ["bradford-press","Bradford Press","shoulders","compound",["barbell"],8,12],
  ["viking-press","Viking Press","shoulders","compound",["machine"],8,12],
  ["rear-band-pull-apart","Band Pull-Apart","shoulders","isolation",["bands"],15,25],
  ["plate-front-raise","Plate Front Raise","shoulders","isolation",[],12,20],
  ["prone-y-raise","Prone Y-Raise","shoulders","isolation",["bench"],12,20],
  // biceps
  ["ez-cable-curl","EZ-Bar Cable Curl","biceps","isolation",["cable"],10,15],
  ["waiter-curl","Waiter Curl","biceps","isolation",["dumbbell"],10,15],
  ["seated-incline-curl","Seated Incline Cable Curl","biceps","isolation",["cable","bench"],10,15],
  ["rev-grip-curl","Reverse-Grip Barbell Curl","biceps","isolation",["barbell"],10,15],
  ["pinwheel-curl","Pinwheel Curl","biceps","isolation",["dumbbell"],10,15],
  // triceps
  ["underhand-pushdown","Reverse-Grip Pushdown","triceps","isolation",["cable"],12,20],
  ["pjr-pullover","PJR Pullover","triceps","isolation",["ezbar","bench"],8,12],
  ["lying-db-ext","Lying Dumbbell Extension","triceps","isolation",["dumbbell","bench"],10,15],
  ["cable-tri-kickback","Cable Triceps Kickback","triceps","isolation",["cable"],12,20],
  ["california-press","California Press","triceps","compound",["ezbar","bench"],8,12],
  // quads
  ["zercher-squat","Zercher Squat","quads","compound",["barbell"],6,10],
  ["lm-squat","Landmine Squat","quads","compound",["barbell"],8,12],
  ["heels-up-goblet","Heels-Elevated Goblet Squat","quads","compound",["dumbbell"],10,15],
  ["wall-sit","Wall Sit","quads","isolation",[],20,40],
  ["pistol-squat","Pistol Squat","quads","compound",[],5,12],
  ["v-squat","V-Squat Machine","quads","compound",["machine"],8,12],
  // hamstrings
  ["cable-rdl","Cable Romanian Deadlift","hamstrings","compound",["cable"],10,15],
  ["slider-curl","Slider Leg Curl","hamstrings","isolation",[],8,15],
  ["band-good-morning","Banded Good Morning","hamstrings","compound",["bands"],12,20],
  ["single-lying-curl","Single-Leg Lying Curl","hamstrings","isolation",["machine"],10,15],
  // glutes
  ["kas-glute-bridge","Kas Glute Bridge","glutes","compound",["barbell","bench"],10,15],
  ["band-hip-thrust","Banded Hip Thrust","glutes","compound",["bands"],15,25],
  ["glute-kickback-machine","Glute Kickback Machine","glutes","isolation",["machine"],12,20],
  ["sumo-squat","Sumo Squat","glutes","compound",["dumbbell"],10,15],
  ["step-through-lunge","Step-Through Lunge","glutes","compound",["dumbbell"],10,15],
  // calves
  ["hack-calf","Hack Squat Calf Raise","calves","isolation",["machine"],10,15],
  ["tibialis-raise","Tibialis Raise","calves","isolation",[],15,25],
  ["single-leg-press-calf","Single-Leg Press Calf Raise","calves","isolation",["machine"],12,20],
  // abs
  ["reverse-crunch","Reverse Crunch","abs","isolation",[],12,20],
  ["cable-reverse-crunch","Cable Reverse Crunch","abs","isolation",["cable"],12,20],
  ["l-sit","L-Sit Hold","abs","isolation",[],10,20],
  ["weighted-plank","Weighted Plank","abs","isolation",[],20,40],
  ["windshield-wiper","Hanging Windshield Wiper","abs","isolation",["pullup"],8,15],
  ["stir-pot","Stir the Pot","abs","isolation",[],10,20],
  // traps
  ["incline-shrug","Incline Dumbbell Shrug","traps","isolation",["dumbbell","bench"],12,20],
  ["cable-face-shrug","Cable Face Shrug","traps","isolation",["cable"],12,20],
  // forearms
  ["cable-wrist-curl","Cable Wrist Curl","forearms","isolation",["cable"],12,20],
  ["gripper","Hand Gripper","forearms","isolation",[],10,20],
  ["towel-hang","Towel Dead Hang","forearms","isolation",["pullup"],10,15],

  // ---- expansion 3: commonly-expected staples ----
  ["bw-pullup","Pull-Up","lats","compound",["pullup"],5,12],
  ["back-ext-45","45° Back Extension","lower_back","compound",["bench"],12,20],
  ["situp","Sit-Up","abs","isolation",[],15,25],

  // ---- adductors (inner thigh) ----
  ["adduction-machine","Hip Adduction Machine","adductors","isolation",["machine"],12,20],
  ["cable-adduction","Cable Hip Adduction","adductors","isolation",["cable"],12,20],
  ["band-adduction","Banded Hip Adduction","adductors","isolation",["bands"],15,25],
  ["cossack-squat","Cossack Squat","adductors","compound",["dumbbell"],10,15],
  ["adductor-sumo","Wide-Stance Sumo Squat","adductors","compound",["dumbbell"],10,15],
  // ---- abductors (hip / glute medius) ----
  ["standing-cable-abduction","Standing Cable Hip Abduction","abductors","isolation",["cable"],12,20],
  ["side-lying-abduction","Side-Lying Hip Abduction","abductors","isolation",[],15,25],
  ["band-abduction","Seated Banded Abduction","abductors","isolation",["bands"],15,25],
];
const EXERCISES = RAW.map(([id, name, part, type, equip, lo, hi], i) => ({ id, name, part, type, equip, rep: [lo, hi], pri: i }));
const EX_BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]));

const DAY_TEMPLATES = {
  push:           { label: "Push", parts: [["chest",2],["shoulders",1.5],["triceps",1.1]] },
  pull:           { label: "Pull", parts: [["lats",1.2],["upper_back",1.0],["biceps",1.2],["traps",0.6],["forearms",0.4]] },
  legs:           { label: "Legs", parts: [["quads",2],["hamstrings",1.4],["glutes",1],["calves",1.1]] },
  upper:          { label: "Upper", parts: [["chest",1.4],["lats",0.9],["upper_back",0.8],["shoulders",1],["biceps",0.8],["triceps",0.8]] },
  lower:          { label: "Lower", parts: [["quads",1.6],["hamstrings",1.3],["glutes",1],["calves",1.1]] },
  full:           { label: "Full Body", parts: [["quads",1.2],["chest",1.2],["lats",0.7],["upper_back",0.6],["shoulders",0.8],["hamstrings",0.8],["biceps",0.6],["triceps",0.6]] },
  // rotating full-body days (Nippard-style high frequency): each leads with a
  // different main lift and shifts emphasis, while still covering legs/push/pull.
  full_a:         { label: "Squat + Push", parts: [["quads",1.5],["chest",1.3],["lats",0.7],["upper_back",0.6],["shoulders",0.8],["hamstrings",0.7],["triceps",0.6],["biceps",0.5]] },
  full_b:         { label: "Hinge + Pull", parts: [["hamstrings",1.5],["lats",0.8],["upper_back",0.7],["lower_back",0.5],["shoulders",1.1],["chest",0.9],["glutes",0.7],["biceps",0.6]] },
  full_c:         { label: "Bench + Back", parts: [["chest",1.5],["lats",0.7],["upper_back",0.7],["quads",1.1],["shoulders",0.9],["triceps",0.7],["biceps",0.6]] },
  full_d:         { label: "Pull + Legs", parts: [["lats",0.9],["upper_back",0.8],["quads",1.2],["hamstrings",1.0],["chest",0.9],["shoulders",0.8],["biceps",0.6]] },
  full_e:         { label: "Press + Arms", parts: [["shoulders",1.4],["quads",1.2],["lats",0.6],["upper_back",0.6],["chest",1.0],["biceps",0.7],["triceps",0.7]] },
  upper_power:    { label: "Upper Power", parts: [["chest",1.6],["lats",1.0],["upper_back",0.9],["shoulders",1]] },
  lower_power:    { label: "Lower Power", parts: [["quads",1.8],["hamstrings",1.2],["glutes",0.8]] },
  upper_hyp:      { label: "Upper Hypertrophy", parts: [["chest",1.3],["lats",0.8],["upper_back",0.8],["shoulders",1],["biceps",0.9],["triceps",0.9]] },
  lower_hyp:      { label: "Lower Hypertrophy", parts: [["quads",1.4],["hamstrings",1.2],["glutes",1],["calves",1.1],["abductors",0.4],["adductors",0.4]] },
  back_shoulders: { label: "Back & Shoulders", parts: [["lats",1.2],["upper_back",1.1],["shoulders",1.5],["traps",0.8],["biceps",0.6]] },
  chest_arms:     { label: "Chest & Arms", parts: [["chest",2],["triceps",1.2],["biceps",1.2]] },
  chest_back:     { label: "Chest & Back", parts: [["chest",1.6],["lats",1.0],["upper_back",0.9]] },
  shoulders_arms: { label: "Shoulders & Arms", parts: [["shoulders",1.6],["biceps",1.2],["triceps",1.2]] },
  chest_day:      { label: "Chest Day", parts: [["chest",2.6],["triceps",0.5]] },
  back_day:       { label: "Back Day", parts: [["lats",1.5],["upper_back",1.4],["lower_back",0.5],["traps",0.6],["biceps",0.4]] },
  shoulders_day:  { label: "Shoulder Day", parts: [["shoulders",2.6],["traps",0.6]] },
  legs_day:       { label: "Leg Day", parts: [["quads",1.8],["hamstrings",1.3],["glutes",1],["calves",1.1],["abductors",0.4],["adductors",0.4]] },
  arms:           { label: "Arm Day", parts: [["biceps",1.4],["triceps",1.4],["forearms",0.6]] },
  // PPL rotation (A = horizontal/quad emphasis, B = vertical/posterior emphasis)
  push_a:         { label: "Push · Chest", parts: [["chest",2.0],["shoulders",1.2],["triceps",1.1]] },
  push_b:         { label: "Push · Delts", parts: [["shoulders",2.0],["chest",1.3],["triceps",1.0]] },
  pull_a:         { label: "Pull · Width", parts: [["lats",1.7],["upper_back",0.8],["biceps",1.2],["forearms",0.5],["traps",0.4]] },
  pull_b:         { label: "Pull · Thickness", parts: [["upper_back",1.5],["lats",0.7],["traps",1.1],["biceps",1.1],["forearms",0.5]] },
  legs_a:         { label: "Legs · Quads", parts: [["quads",2.0],["hamstrings",1.1],["glutes",0.9],["calves",1.1]] },
  legs_b:         { label: "Legs · Posterior", parts: [["hamstrings",1.8],["glutes",1.4],["lower_back",0.5],["quads",1.1],["calves",1.1]] },
  // Upper/Lower rotation
  upper_a:        { label: "Upper · Horizontal", parts: [["chest",1.5],["upper_back",1.1],["lats",0.6],["shoulders",0.9],["triceps",0.8],["biceps",0.8]] },
  upper_b:        { label: "Upper · Vertical", parts: [["shoulders",1.4],["lats",1.1],["upper_back",0.5],["chest",1.1],["biceps",1.0],["triceps",1.0]] },
  lower_a:        { label: "Lower · Quads", parts: [["quads",1.7],["hamstrings",1.2],["glutes",1.0],["calves",1.1]] },
  lower_b:        { label: "Lower · Hinge", parts: [["hamstrings",1.6],["glutes",1.4],["lower_back",0.5],["quads",1.1],["calves",1.1]] },
  // 5/3/1: each day is anchored on one of the four main barbell lifts, then accessories
  t531_press:     { label: "Press (OHP)", parts: [["shoulders",2.0],["triceps",1.2],["lats",0.5],["upper_back",0.4],["chest",0.6]] },
  t531_deadlift:  { label: "Deadlift", parts: [["hamstrings",1.7],["lower_back",0.9],["lats",0.6],["glutes",1.0],["traps",0.7],["abs",0.4]] },
  t531_bench:     { label: "Bench", parts: [["chest",2.0],["triceps",1.2],["shoulders",0.8],["upper_back",0.4],["lats",0.4]] },
  t531_squat:     { label: "Squat", parts: [["quads",2.0],["hamstrings",1.1],["glutes",0.9],["abs",0.6],["calves",0.5]] },
};

const SPLITS = {
  full_body:  { name: "Full Body", blurb: "Train everything each session with a rotating main lift & emphasis — scales from low frequency to Nippard-style high frequency.", days: [2,3,4,5,6], build: (d) => { const seq = ["full_a","full_b","full_c","full_d","full_e"]; return Array.from({length:d}, (_,i) => seq[i % seq.length]); } },
  upper_lower:{ name: "Upper / Lower", blurb: "Alternate upper & lower days, rotating horizontal/vertical and quad/hinge emphasis.", days: [2,4,6], build: (d) => Array.from({length:d}, (_,i) => `${i%2===0?"upper":"lower"}${Math.floor(i/2)%2===0?"_a":"_b"}`) },
  ppl:        { name: "Push / Pull / Legs", blurb: "The classic, with each repeat rotating emphasis (chest/delt, width/thickness, quad/posterior).", days: [3,5,6], build: (d) => { const A=["push_a","pull_a","legs_a"], B=["push_b","pull_b","legs_b"]; return Array.from({length:d},(_,i)=> (Math.floor(i/3)%2===0?A:B)[i%3]); } },
  ulppl:      { name: "Upper·Lower·Push·Pull·Legs", blurb: "Hybrid 5-day blending UL frequency with PPL volume.", days: [5], build: () => ["upper","lower","push","pull","legs"] },
  phul:       { name: "PHUL", blurb: "Power Hypertrophy Upper Lower — strength + size.", days: [4], build: () => ["upper_power","lower_power","upper_hyp","lower_hyp"] },
  phat:       { name: "PHAT", blurb: "Power Hypertrophy Adaptive Training (Layne Norton).", days: [5], build: () => ["upper_power","lower_power","back_shoulders","lower_hyp","chest_arms"] },
  bro:        { name: "Bro Split", blurb: "One muscle group per day, max volume each.", days: [5,6], build: (d) => d>=6 ? ["chest_day","back_day","shoulders_day","legs_day","arms","legs_day"] : ["chest_day","back_day","shoulders_day","legs_day","arms"] },
  arnold:     { name: "Arnold Split", blurb: "Chest+Back · Shoulders+Arms · Legs, twice over.", days: [6], build: () => ["chest_back","shoulders_arms","legs_day","chest_back","shoulders_arms","legs_day"] },
  five_three_one: { name: "5/3/1", blurb: "Four days, each built around one main barbell lift (Press · Deadlift · Bench · Squat) plus targeted accessories — Wendler-inspired strength.", days: [4], build: () => ["t531_press","t531_deadlift","t531_bench","t531_squat"] },
  strength_fb: { name: "Strength Full Body", blurb: "Squat, press and pull every session — the classic barbell linear-progression template for building base strength.", days: [3], build: () => ["full_a","full_b","full_c"] },
};

const SESSIONS = [
  { id: "s20", label: "Up to 20 minutes", count: 2 },
  { id: "s40", label: "20 to 40 minutes", count: 3 },
  { id: "s60", label: "40 to 60 minutes", count: 4 },
  { id: "s90", label: "60 to 90 minutes", count: 5 },
  { id: "s120", label: "90 to 120 minutes", count: 6 },
  { id: "s120p", label: "Over 120 minutes", count: 7 },
];
const EXP = {
  none: { label: "None", sub: "Brand new to lifting", setBase: 2 },
  beginner: { label: "Beginner", sub: "< 1 year training", setBase: 3 },
  intermediate: { label: "Intermediate", sub: "1–3 years training", setBase: 3 },
  advanced: { label: "Advanced", sub: "3+ years, dialled-in", setBase: 4 },
};
const GOALS = {
  hypertrophy: { label: "Hypertrophy", sub: "Build muscle & size", icon: Layers },
  strength: { label: "Strength", sub: "Get strong, lower reps", icon: Flame },
  both: { label: "Strength & Size", sub: "Heavy main lifts, hypertrophy accessories", icon: Zap },
};
// Proven, ready-to-run program presets (Boostcamp-style quick start)
const TEMPLATES = [
  { id: "ppl6", name: "Push / Pull / Legs", tag: "6 days · Hypertrophy", desc: "High-volume classic, trained six times a week", cfg: { split: "ppl", days: 6, session: "s90", goal: "hypertrophy", experience: "intermediate", weeks: 6 } },
  { id: "ul4", name: "Upper / Lower", tag: "4 days · Strength & Size", desc: "Balanced heavy lifts plus hypertrophy work", cfg: { split: "upper_lower", days: 4, session: "s90", goal: "both", experience: "intermediate", weeks: 6 } },
  { id: "fb3", name: "Full Body", tag: "3 days · Beginner", desc: "Hit everything three times a week", cfg: { split: "full_body", days: 3, session: "s60", goal: "hypertrophy", experience: "beginner", weeks: 4 } },
  { id: "fb5", name: "Full Body · High Frequency", tag: "5 days · Hypertrophy", desc: "Nippard-style high-frequency full body", cfg: { split: "full_body", days: 5, session: "s90", goal: "hypertrophy", experience: "intermediate", weeks: 6 } },
  { id: "phul", name: "PHUL", tag: "4 days · Power + Size", desc: "Power upper/lower then hypertrophy upper/lower", cfg: { split: "phul", days: 4, session: "s90", goal: "both", experience: "intermediate", weeks: 6 } },
  { id: "phat", name: "PHAT", tag: "5 days · Power + Size", desc: "Layne Norton's power-hypertrophy hybrid", cfg: { split: "phat", days: 5, session: "s90", goal: "both", experience: "advanced", weeks: 6 } },
  { id: "arnold", name: "Arnold Split", tag: "6 days · Hypertrophy", desc: "Chest+Back · Shoulders+Arms · Legs, twice", cfg: { split: "arnold", days: 6, session: "s90", goal: "hypertrophy", experience: "advanced", weeks: 6 } },
  { id: "bro5", name: "Bro Split", tag: "5 days · Hypertrophy", desc: "One muscle group per day, maximum volume", cfg: { split: "bro", days: 5, session: "s90", goal: "hypertrophy", experience: "intermediate", weeks: 6 } },
  { id: "p531", name: "5/3/1", tag: "4 days · Strength", desc: "Wendler-inspired: one main barbell lift per day, heavy & low-rep", cfg: { split: "five_three_one", days: 4, session: "s60", goal: "strength", experience: "intermediate", weeks: 4, percentScheme: "531" } },
  { id: "p531bbb", name: "5/3/1 · Boring But Big", tag: "4 days · Strength + Size", desc: "5/3/1 main work plus 5×10 supplemental sets of the same lift", cfg: { split: "five_three_one", days: 4, session: "s90", goal: "both", experience: "intermediate", weeks: 4, percentScheme: "531", assistance: "bbb" } },
  { id: "startstr", name: "Starting Strength", tag: "3 days · Beginner strength", desc: "Squat, press & pull every session — linear barbell progression", cfg: { split: "strength_fb", days: 3, session: "s60", goal: "strength", experience: "beginner", weeks: 4 } },
  { id: "madcow", name: "Madcow 5×5", tag: "3 days · Intermediate strength", desc: "Full-body 5×5 ramping to a top set each session", cfg: { split: "strength_fb", days: 3, session: "s60", goal: "strength", experience: "intermediate", weeks: 6, percentScheme: "madcow" } },
  { id: "nsuns", name: "nSuns 531 LP", tag: "4 days · Strength + Size", desc: "High-volume 5/3/1 linear progression — nine T1 sets ramping to a 95% AMRAP, with a weekly training-max bump", cfg: { split: "five_three_one", days: 4, session: "s120", goal: "both", experience: "intermediate", weeks: 4, percentScheme: "nsuns", deload: false } },
  { id: "redditppl", name: "Reddit PPL", tag: "6 days · Powerbuilding", desc: "The hugely popular Metallicadpa push/pull/legs — heavy compounds with linear progression plus hypertrophy accessories", cfg: { split: "ppl", days: 6, session: "s90", goal: "both", experience: "intermediate", weeks: 6 } },
];
const templateConfig = (t, equipment) => ({
  name: t.name, experience: "intermediate", goal: "hypertrophy", days: 4, split: "full_body", session: "s60",
  focus: {}, focusList: [], reduce: [], progression: "auto", weeks: 4, barbellCap: null, deload: true, percentScheme: null, assistance: null,
  ...t.cfg, equipment,
});
const TOTAL_WEEKS = 4;
const weeksOf = (program) => (program && (program.config?.weeks || program.weeks)) || TOTAL_WEEKS;

/* ============================== UTILITIES ============================== */
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const uid = () => Math.random().toString(36).slice(2, 9);

function availableFor(part, equipSet, banned, noBw = false) {
  return EXERCISES.filter(
    e => e.part === part && !banned.includes(e.id) && e.equip.every(q => equipSet.has(q)) && (e.equip.length > 0 || !noBw)
  );
}

/* core day builder: distribute `total` exercise slots across weighted parts, then pick */
function buildDaySlots(partsWeighted, total, equipSet, banned, globalUsed, barbellCap = Infinity, noBw = false) {
  const parts = partsWeighted.map(p => ({ ...p, slots: 0 }));
  const totalW = parts.reduce((s, p) => s + p.w, 0) || 1;
  parts.forEach(p => { p.slots = Math.floor((p.w / totalW) * total); });
  // guarantee the top weighted parts get at least one slot
  const sorted = [...parts].sort((a, b) => b.w - a.w);
  sorted.forEach((p, i) => { if (p.slots < 1 && i < total) p.slots = 1; });
  const sum = () => parts.reduce((s, p) => s + p.slots, 0);
  let guard = 0;
  while (sum() < total && guard++ < 60) {
    parts.slice().sort((a, b) => (b.w / (b.slots + 1)) - (a.w / (a.slots + 1)))[0].slots++;
  }
  while (sum() > total && guard++ < 120) {
    const c = parts.filter(p => p.slots > 0).sort((a, b) => (a.w / a.slots) - (b.w / b.slots))[0];
    if (!c) break; c.slots--;
  }
  const chosen = [];
  const dayUsed = new Set();
  const dayPatterns = new Set();
  let barbells = 0;
  const isBarbell = (ex) => ex.equip.includes("barbell");
  const canTake = (ex) => !(isBarbell(ex) && barbells >= barbellCap);
  parts.forEach(p => {
    if (p.slots <= 0) return;
    const pool = availableFor(p.part, equipSet, banned, noBw);
    if (!pool.length) return;
    let pickedForPart = 0;
    for (let s = 0; s < p.slots; s++) {
      const cands = pool.filter(ex => !dayUsed.has(ex.id) && canTake(ex));
      if (!cands.length) break;
      // lower score = better. Balances: a muscle's first slot should be a heavy compound;
      // later slots prefer a different stimulus (isolation / new movement pattern). Across the
      // week we avoid repeats, and within a day we avoid two near-identical movements.
      const score = (ex) => {
        let sc = 0;
        const isC = ex.type === "compound";
        if (pickedForPart === 0) sc += isC ? 0 : 2.2;        // open with a compound
        else if (pickedForPart >= 2) sc += isC ? 0.5 : 0;    // later slots lean toward isolation
        if (dayPatterns.has(movePattern(ex))) sc += 1.4;     // discourage (not forbid) repeat patterns
        if (globalUsed.has(ex.id)) sc += 1.6;                // spread movements across the week
        sc += (ex.pri || 0) * 0.012;                         // gentle staple-first bias
        sc += Math.random() * 0.5;                           // tiebreak → variety on regenerate
        return sc;
      };
      let bestEx = cands[0], bestS = Infinity;
      for (const e of cands) { const sc = score(e); if (sc < bestS) { bestS = sc; bestEx = e; } }
      const ex = bestEx;
      chosen.push(ex.id); dayUsed.add(ex.id); globalUsed.add(ex.id); dayPatterns.add(movePattern(ex));
      if (isBarbell(ex)) barbells++;
      pickedForPart++;
    }
  });
  // fill pass: if limited equipment / depleted pools left the day short, top it up from
  // the day's own muscles (most-staple first) so it still hits the requested exercise count
  if (chosen.length < total) {
    const fillPool = [];
    parts.forEach(p => availableFor(p.part, equipSet, banned, noBw).forEach(ex => fillPool.push(ex)));
    fillPool.sort((a, b) => {
      const ac = a.type === "compound" ? 0 : 1, bc = b.type === "compound" ? 0 : 1;
      if (ac !== bc) return ac - bc;
      const ag = globalUsed.has(a.id) ? 1 : 0, bg = globalUsed.has(b.id) ? 1 : 0;
      if (ag !== bg) return ag - bg;
      return a.pri - b.pri;
    });
    // first pass respecting the barbell cap, then a relaxed pass only if still short
    for (const ex of fillPool) {
      if (chosen.length >= total) break;
      if (dayUsed.has(ex.id) || !canTake(ex)) continue;
      chosen.push(ex.id); dayUsed.add(ex.id); globalUsed.add(ex.id);
      if (isBarbell(ex)) barbells++;
    }
    for (const ex of fillPool) {
      if (chosen.length >= total) break;
      if (dayUsed.has(ex.id)) continue;
      chosen.push(ex.id); dayUsed.add(ex.id); globalUsed.add(ex.id);
    }
  }
  // compounds first within the day
  chosen.sort((a, b) => (EX_BY_ID[a].type === "compound" ? 0 : 1) - (EX_BY_ID[b].type === "compound" ? 0 : 1));
  return chosen;
}

function generateProgram(config, banned, volBias) {
  const split = SPLITS[config.split];
  const types = split.build(config.days);
  const equipSet = new Set(config.equipment);
  const baseN = SESSIONS.find(s => s.id === config.session)?.count ?? 4;

  // count label occurrences for A/B suffixes
  const seen = {};
  const days = types.map((t, idx) => {
    const tmpl = DAY_TEMPLATES[t];
    seen[t] = (seen[t] || 0) + 1;
    return {
      id: uid(), type: t, baseLabel: tmpl.label, occ: seen[t],
      parts: tmpl.parts.map(([part, w]) => ({ part, w })),
      targetN: baseN,
    };
  });
  const counts = {};
  types.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
  days.forEach(d => {
    d.label = counts[d.type] > 1 ? `${d.baseLabel} ${String.fromCharCode(64 + d.occ)}` : d.baseLabel;
  });

  // REDUCE: dampen weight everywhere + drop one slot from its strongest day
  (config.reduce || []).forEach(rp => {
    days.forEach(d => d.parts.forEach(p => { if (p.part === rp) p.w *= 0.3; }));
    const cand = days.filter(d => d.parts.some(p => p.part === rp))
      .sort((a, b) => (b.parts.find(p => p.part === rp)?.w || 0) - (a.parts.find(p => p.part === rp)?.w || 0))[0];
    if (cand) cand.targetN = Math.max(2, cand.targetN - 1);
  });

  // FOCUS: each instance bumps the muscle's weight on every day it appears (spreading the
  // extra volume), then adds one slot to the LEAST-loaded day that trains it so multiple
  // focus muscles distribute across days instead of stacking onto a single session.
  (config.focusList || []).forEach(fp => {
    days.forEach(d => d.parts.forEach(p => { if (p.part === fp) p.w += 0.9; }));
    let cand = days.filter(d => d.parts.some(p => p.part === fp))
      .sort((a, b) => (a.targetN - b.targetN) || ((b.parts.find(p => p.part === fp)?.w || 0) - (a.parts.find(p => p.part === fp)?.w || 0)))[0];
    if (!cand) {
      cand = [...days].sort((a, b) => a.targetN - b.targetN)[0];
      if (cand) cand.parts.push({ part: fp, w: 1.6 });
    }
    if (cand) cand.targetN += 1;
  });

  days.forEach(d => { d.targetN = clamp(d.targetN, 2, 9); });

  const globalUsed = new Set();
  days.forEach(d => {
    d.exercises = buildDaySlots(d.parts, d.targetN, equipSet, banned, globalUsed, config.barbellCap || Infinity, !!config.noBodyweight);
    if (!d.exercises.length) {
      // last-resort fallback so a day is never empty
      const any = availableFor(d.parts[0].part, equipSet, banned, !!config.noBodyweight)[0] || availableFor(d.parts[0].part, equipSet, banned)[0];
      if (any) d.exercises = [any.id];
    }
    d.primaryIndex = d.exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
    if (d.primaryIndex < 0) d.primaryIndex = 0;
  });

  // Percentage-scheme programs (5/3/1, nSuns, Madcow) attach the training max to each day's
  // primary slot — so that slot MUST be the canonical barbell main lift, not whatever compound
  // the picker happened to lead with (e.g. Goblet Squat). Force it when a barbell is available.
  if (config.percentScheme && equipSet.has("barbell")) {
    const T531_MAIN = { t531_squat: "back-squat", t531_bench: "bb-bench", t531_deadlift: "deadlift", t531_press: "ohp" };
    days.forEach(d => {
      let wantId = T531_MAIN[d.type];
      if (!wantId && config.percentScheme === "madcow") wantId = "back-squat"; // Madcow squats every session
      if (!wantId || !EX_BY_ID[wantId] || banned.includes(wantId)) return;
      let idx = d.exercises.indexOf(wantId);
      if (idx === -1) { idx = d.primaryIndex >= 0 ? d.primaryIndex : 0; d.exercises[idx] = wantId; }
      d.primaryIndex = idx;
    });
  }

  const program = {
    id: uid(),
    name: config.name?.trim() || "My Program",
    createdAt: Date.now(),
    config,
    weeks: config.weeks || TOTAL_WEEKS,
    days: days.map(d => ({ id: d.id, label: d.label, type: d.type, exercises: d.exercises, primaryIndex: d.primaryIndex })),
    overrides: {},
  };
  distributeVolBias(program, volBias);
  if (config.progression === "manual") seedManual(program);
  return program;
}

// Spread each muscle's recommended set delta across that muscle's exercises in the
// program (one set at a time, compounds first). Mutates program.slotBias + config.autoVolume.
function distributeVolBias(program, volBias) {
  if (!volBias || !Object.keys(volBias).length) return;
  const slotBias = {};
  PART_ORDER.forEach(part => {
    const delta = volBias[part] || 0;
    if (!delta) return;
    const slots = [];
    program.days.forEach(d => d.exercises.forEach((id, si) => { if (EX_BY_ID[id]?.part === part) slots.push({ key: `${d.id}:${si}`, comp: EX_BY_ID[id]?.type === "compound" }); }));
    slots.sort((a, b) => (a.comp === b.comp ? 0 : a.comp ? -1 : 1));
    const sign = delta > 0 ? 1 : -1;
    for (let k = 0; k < Math.min(Math.abs(delta), slots.length); k++) slotBias[slots[k].key] = (slotBias[slots[k].key] || 0) + sign;
  });
  if (Object.keys(slotBias).length) { program.slotBias = slotBias; program.config = { ...program.config, autoVolume: true }; }
}

/* ---- per-exercise rep ranges ----
   Each exercise carries its own evidence-based hypertrophy range (stored on the
   exercise). Strength goals shift that range toward heavier, lower-rep work. */
function repRange(goal, ex, isPrimary) {
  const [lo, hi] = ex.rep;
  const strength = goal === "strength" || (goal === "both" && isPrimary);
  if (!strength) return [lo, hi];
  const sLo = clamp(Math.round(lo * 0.55), 2, Math.max(2, lo - 1));
  const sHi = clamp(Math.round(hi * 0.6), sLo + 1, hi);
  return [sLo, sHi];
}
/* RIR (reps in reserve) — proximity to failure tightens across the block:
   ~3 RIR in week 1 down toward failure by week 4, then a high-RIR deload.
   Heavy compounds keep one more rep in reserve for technique & fatigue. */
function rirFor(program, ex, isPrimary, weekIndex) {
  const weeks = weeksOf(program);
  if (program.config.deload && weekIndex > weeks) return "4-5";
  const comp = ex.type === "compound";
  const strength = program.config.goal === "strength" || (program.config.goal === "both" && isPrimary);
  const w = clamp(weekIndex, 1, weeks);
  // linear ramp from 3 RIR in week 1 down to 0 in the final week (any block length)
  let rir = weeks <= 1 ? 1 : Math.round(3 * (1 - (w - 1) / (weeks - 1)));
  if (strength && comp) rir += 1;
  return rir <= 0 ? "0-1" : String(rir);
}
/* Working sets per exercise — role-based, the way evidence-based coaches program:
   the day's main lift carries the most sets, secondary compounds fewer, isolation
   moderate; strength adds work to compounds and trims isolation; volume scales with
   experience. Produces a natural spread (e.g. 4 / 3 / 3 / 2) rather than one number. */
function baseSetsFor(config, ex, isPrimary) {
  const comp = ex.type === "compound";
  let s;
  if (config.goal === "strength") s = isPrimary ? 5 : comp ? 4 : 2;
  else if (config.goal === "hypertrophy") s = isPrimary ? 4 : comp ? 3 : 3;
  else /* both */ s = isPrimary ? 4 : comp ? 3 : 3;
  if (config.experience === "none") s = Math.max(2, s - 1);
  else if (config.experience === "beginner") s = isPrimary ? Math.max(3, s - 1) : s;
  else if (config.experience === "advanced") s += isPrimary ? 1 : 0;
  return clamp(s, 2, 5);
}
function seedManual(program) {
  program.days.forEach(d => {
    d.exercises.forEach((id, i) => {
      const ex = EX_BY_ID[id];
      const isP = i === d.primaryIndex;
      const [lo, hi] = repRange(program.config.goal, ex, isP);
      program.overrides[`${d.id}:${i}`] = { sets: baseSetsFor(program.config, ex, isP), reps: `${lo}-${hi}` };
    });
  });
}

/* compute a cell {sets,reps,note,range,rir} for a given week.
   Auto mode prescribes each lift's own rep RANGE; the week selector drives
   load & RIR (and a small overreach set in the last hypertrophy week). */
function computeCell(program, day, id, slotIndex, weekIndex) {
  const ex = EX_BY_ID[id];
  const isPrimary = slotIndex === day.primaryIndex;
  const [lo, hi] = repRange(program.config.goal, ex, isPrimary);
  const range = `${lo}-${hi}`;
  const base = baseSetsFor(program.config, ex, isPrimary);
  const strength = program.config.goal === "strength" || (program.config.goal === "both" && isPrimary);

  if (program.config.progression === "manual") {
    const o = program.overrides[`${day.id}:${slotIndex}`] || { sets: base, reps: range };
    return { sets: o.sets, reps: o.reps, note: "Manual", range, rir: strength && ex.type === "compound" ? "2-3" : "1-2" };
  }

  const weeks = weeksOf(program);
  const rir = rirFor(program, ex, isPrimary, weekIndex);
  const isDeload = program.config.deload && weekIndex > weeks;
  if (isDeload) {
    return { sets: Math.max(2, Math.round(base * 0.5)), reps: `${lo}`, note: "Deload · ~50% volume & load", range, rir };
  }
  const w = clamp(weekIndex, 1, weeks);
  const p = weeks <= 1 ? 1 : (w - 1) / (weeks - 1); // 0 at start → 1 at peak
  const bias = program.slotBias?.[`${day.id}:${slotIndex}`] || 0;
  // Accumulation: volume climbs across the block (hypertrophy). Strength holds sets and
  // adds load instead. Primary lifts accrue the most added volume.
  const ramp = strength ? 0 : Math.round(p * (isPrimary ? 2 : 1));
  let sets = clamp(base + bias + ramp, 2, 6);
  const fixed = program.rounds?.[`${day.id}:${slotIndex}`];
  if (fixed) sets = clamp(fixed, 1, 10);
  const note = fixed ? "Circuit rounds"
    : strength
    ? (w === weeks ? "Peak · heaviest load" : p < 0.34 ? "Build · technique focus" : p < 0.67 ? "Add load" : "Heavy — near limit")
    : (w === weeks ? "Overreach · top volume" : p < 0.34 ? "MEV · ease in" : p < 0.67 ? "Add a set + load" : "Push volume up");
  return { sets, reps: range, note, range, rir };
}

/* ---- estimated session length + weekly volume ---- */
const SESSION_BOUNDS = { s20: [0, 20], s40: [20, 40], s60: [40, 60], s90: [60, 90], s120: [90, 120], s120p: [120, Infinity] };

function restSec(goal, ex, isPrimary) {
  const comp = ex.type === "compound";
  const strength = goal === "strength" || (goal === "both" && isPrimary);
  if (comp) return strength ? 180 : 135;
  return strength ? 105 : 75;
}
function estimateMinutes(program, day, weekIndex) {
  let sec = 0;
  day.exercises.forEach((id, slot) => {
    const ex = EX_BY_ID[id];
    const isP = slot === day.primaryIndex;
    const cell = computeCell(program, day, id, slot, weekIndex);
    const sets = Number(cell.sets) || 0;
    const warmup = ex.type === "compound" ? 165 : 75;
    sec += warmup + sets * (45 + restSec(program.config.goal, ex, isP));
  });
  return Math.round(sec / 60);
}
function fitChip(program, mins) {
  const [lo, hi] = SESSION_BOUNDS[program.config.session] || [0, Infinity];
  if (mins > hi) return { text: "over target", color: C.warn, dim: C.warnDim };
  if (mins < lo * 0.7) return { text: "under target", color: C.muted, dim: C.bg2 };
  return { text: "on target", color: C.accent, dim: C.accentDim };
}
/* Secondary (indirect) muscle involvement. A working set counts fully (1.0) toward
   the target muscle and a fraction toward strongly-involved synergists — the
   "fractional set" convention used in evidence-based volume tracking. */
const SECONDARY = {
  "bb-bench": [["triceps", .5], ["shoulders", .4]], "inc-bb-bench": [["triceps", .5], ["shoulders", .5]],
  "inc-db-press": [["triceps", .5], ["shoulders", .5]], "db-bench": [["triceps", .5], ["shoulders", .4]],
  "machine-press": [["triceps", .4], ["shoulders", .3]], "smith-bench": [["triceps", .5], ["shoulders", .4]],
  "dips-chest": [["triceps", .5], ["shoulders", .3]], "pushup": [["triceps", .4], ["shoulders", .3]],
  "ohp": [["triceps", .5]], "db-shoulder": [["triceps", .4]], "machine-shoulder": [["triceps", .4]],
  "arnold": [["triceps", .4]], "pike-pushup": [["triceps", .4]],
  "bb-row": [["biceps", .4], ["shoulders", .3]], "chest-row": [["biceps", .4], ["shoulders", .3]],
  "seated-row": [["biceps", .4], ["shoulders", .3]], "db-row": [["biceps", .4]], "tbar-row": [["biceps", .4], ["shoulders", .3]],
  "machine-row": [["biceps", .4], ["shoulders", .3]], "inv-row": [["biceps", .4]],
  "pullup": [["biceps", .5]], "lat-pulldown": [["biceps", .5]], "chinup": [["lats", .5]],
  "deadlift": [["hamstrings", .5], ["glutes", .5], ["traps", .3]], "sumo-dl": [["lower_back", .4], ["quads", .4], ["hamstrings", .3]],
  "back-squat": [["glutes", .5], ["hamstrings", .3]], "front-squat": [["glutes", .4], ["hamstrings", .2]],
  "hack-squat": [["glutes", .4]], "leg-press": [["glutes", .4], ["hamstrings", .2]], "smith-squat": [["glutes", .4], ["hamstrings", .2]],
  "bulgarian": [["glutes", .5], ["hamstrings", .3]], "goblet": [["glutes", .4]], "walking-lunge": [["glutes", .5], ["hamstrings", .2]],
  "bw-squat": [["glutes", .4]], "bw-lunge": [["glutes", .4]], "bw-bulgarian": [["glutes", .5]],
  "rdl": [["glutes", .5], ["lower_back", .3]], "db-rdl": [["glutes", .5], ["lower_back", .2]], "good-morning": [["glutes", .4], ["lower_back", .3]],
  "slrdl": [["glutes", .5]], "hip-thrust": [["hamstrings", .3]], "db-hip-thrust": [["hamstrings", .3]], "sl-hip-thrust": [["hamstrings", .3]], "glute-bridge": [["hamstrings", .2]],
  "cgbp": [["chest", .4], ["shoulders", .2]], "dips-tri": [["chest", .4], ["shoulders", .2]], "diamond-pushup": [["chest", .4]], "bench-dip": [["chest", .2]],
  "hammer": [["forearms", .4]], "reverse-curl": [["forearms", .5]], "farmers": [["traps", .4]],
  // extended library
  "decline-bench": [["triceps", .5], ["shoulders", .3]], "decline-db-press": [["triceps", .5], ["shoulders", .3]],
  "incline-machine-press": [["triceps", .4], ["shoulders", .4]], "floor-press": [["triceps", .5], ["shoulders", .3]],
  "machine-dip": [["triceps", .5], ["shoulders", .3]], "incline-pushup": [["triceps", .4], ["shoulders", .3]],
  "decline-pushup": [["triceps", .4], ["shoulders", .4]], "cable-press": [["triceps", .4], ["shoulders", .3]],
  "pendlay-row": [["biceps", .4], ["shoulders", .3]], "meadows-row": [["biceps", .4], ["shoulders", .3]],
  "seal-row": [["biceps", .4], ["shoulders", .3]], "inc-db-row": [["biceps", .4]],
  "wide-pulldown": [["biceps", .4]], "close-pulldown": [["biceps", .5]], "neutral-pulldown": [["biceps", .5]],
  "one-arm-pulldown": [["biceps", .4]], "assisted-pullup": [["biceps", .5]], "rack-pull": [["traps", .4], ["hamstrings", .3], ["glutes", .3]],
  "kroc-row": [["biceps", .4], ["traps", .3]], "db-pullover": [["chest", .3]],
  "seated-ohp": [["triceps", .5]], "seated-db-press": [["triceps", .4]], "smith-ohp": [["triceps", .4]],
  "landmine-press": [["triceps", .4], ["chest", .3]], "upright-row": [["traps", .4]], "db-upright-row": [["traps", .4]],
  "cross-hammer": [["forearms", .4]], "rope-hammer-curl": [["forearms", .4]], "zottman-curl": [["forearms", .5]],
  "jm-press": [["chest", .4]],
  "pendulum-squat": [["glutes", .4], ["hamstrings", .2]], "belt-squat": [["glutes", .4]], "box-squat": [["glutes", .5], ["hamstrings", .3]],
  "split-squat": [["glutes", .4], ["hamstrings", .2]], "step-up": [["glutes", .5], ["hamstrings", .2]],
  "reverse-lunge": [["glutes", .5], ["hamstrings", .2]], "single-leg-press": [["glutes", .4]],
  "stiff-deadlift": [["glutes", .4], ["lower_back", .3]], "ghr": [["glutes", .4], ["calves", .2]],
  "pull-through": [["glutes", .5], ["lower_back", .2]], "kb-swing": [["glutes", .4], ["lower_back", .2]],
  "machine-hip-thrust": [["hamstrings", .3]], "smith-hip-thrust": [["hamstrings", .3]], "reverse-hyper": [["hamstrings", .3], ["lower_back", .2]],
  "push-press": [["triceps", .4]], "underhand-row": [["biceps", .5]], "underhand-pulldown": [["biceps", .5]], "single-cable-row": [["biceps", .4]],
  "squeeze-press": [["triceps", .4], ["shoulders", .3]], "z-press": [["triceps", .5]],
  "bstance-hip-thrust": [["hamstrings", .3]], "curtsy-lunge": [["glutes", .5], ["hamstrings", .2]],
  "cyclist-squat": [["glutes", .2]], "suitcase-carry": [["traps", .3], ["abs", .3]],
  "trap-bar-shrug": [], "power-shrug": [["upper_back", .2]], "jefferson-curl": [["glutes", .3], ["lower_back", .3]],
  "tate-press": [["chest", .2]], "cable-crossover": [],
  // expansion 2 + 3 compounds
  "incline-cable-press": [["triceps", .4], ["shoulders", .4]], "smith-incline": [["triceps", .5], ["shoulders", .4]],
  "low-incline-db": [["triceps", .5], ["shoulders", .5]], "band-pushup": [["triceps", .4], ["shoulders", .3]],
  "yates-row": [["biceps", .4], ["traps", .3]], "cs-db-row": [["biceps", .4]], "renegade-row": [["biceps", .4], ["abs", .3]],
  "band-pulldown": [["biceps", .4]], "bw-pullup": [["biceps", .5]],
  "trap-bar-deadlift": [["traps", .4], ["hamstrings", .4], ["glutes", .4], ["quads", .3]],
  "snatch-deadlift": [["traps", .4], ["hamstrings", .4], ["glutes", .4]],
  "cable-upright-row": [["traps", .4]], "bradford-press": [["triceps", .5]], "viking-press": [["triceps", .4]],
  "california-press": [["chest", .4]],
  "zercher-squat": [["glutes", .5], ["hamstrings", .3], ["abs", .3]], "lm-squat": [["glutes", .4], ["hamstrings", .2]],
  "heels-up-goblet": [["glutes", .3]], "pistol-squat": [["glutes", .4]], "v-squat": [["glutes", .4]],
  "cable-rdl": [["glutes", .5], ["lower_back", .2]], "band-good-morning": [["glutes", .4], ["lower_back", .3]],
  "back-ext-45": [["glutes", .5], ["hamstrings", .4]],
  "kas-glute-bridge": [["hamstrings", .3]], "band-hip-thrust": [["hamstrings", .3]],
  "sumo-squat": [["quads", .3], ["hamstrings", .2]], "step-through-lunge": [["quads", .4], ["hamstrings", .2]],
  // adductors / abductors
  "hip-abduction": [["glutes", .3]], "cable-abduction": [["glutes", .3]], "lateral-walk": [["glutes", .3]],
  "standing-cable-abduction": [["glutes", .3]], "side-lying-abduction": [["glutes", .2]], "band-abduction": [["glutes", .2]],
  "copenhagen": [["abs", .3]], "cossack-squat": [["glutes", .4], ["quads", .3]],
  "adductor-sumo": [["glutes", .4], ["quads", .3], ["hamstrings", .2]],
  "adduction-machine": [], "cable-adduction": [], "band-adduction": [],
};
const secondaryOf = (ex) => {
  const base = SECONDARY[ex.id] || [];
  // Compound back movements train both regions: rows hit the lats, vertical pulls hit the
  // mid-back/rhomboids. Credit the non-primary region so volume tracking reflects reality.
  if (ex.type === "compound") {
    if (ex.part === "upper_back" && !base.some(([p]) => p === "lats")) return [...base, ["lats", 0.4]];
    if (ex.part === "lats" && !base.some(([p]) => p === "upper_back")) return [...base, ["upper_back", 0.4]];
  }
  return base;
};

/* short, evidence-based technique cues by movement pattern */
function cuesFor(ex) {
  const n = ex.id, has = (...k) => k.some(s => n.includes(s));
  if (ex.part === "chest" && has("fly", "pec")) return ["Soft, fixed elbow angle throughout", "Stretch wide, squeeze hands toward each other", "Slow eccentric — no bouncing at the bottom"];
  if (ex.part === "chest" || (ex.part === "triceps" && has("cgbp", "dip", "pushup"))) return ["Shoulder blades back & down, slight arch", "Elbows ~45° from torso, not flared", "Touch lower chest, drive through mid-foot"];
  if (has("ohp", "shoulder", "arnold", "pike")) return ["Brace abs & squeeze glutes — no excess lean", "Bar/dumbbells over mid-foot at lockout", "Press in a slight arc, head 'through' at top"];
  if (has("lat-raise", "lateral", "rear", "reverse", "face")) return ["Lead with the elbows, not the hands", "Slight forward lean; stop ~shoulder height", "Control the lowering for 2–3 sec"];
  if (has("pulldown", "pullup", "chinup")) return ["Depress & lead with the elbows", "Full stretch at the top, no swinging", "Drive elbows to the hips, squeeze lats"];
  if (ex.part === "lats") return ["Depress the shoulder, lead with the elbow", "Full stretch overhead, no swinging", "Drive the elbows down & in, squeeze the lats"];
  if (ex.part === "upper_back") return ["Hinge slightly, flat back, braced", "Pull elbows toward the hips", "Pause & squeeze the shoulder blades together"];
  if (ex.part === "lower_back") return ["Brace hard, neutral spine throughout", "Drive from the hips, don't round under load", "Control the range — slow, no jerking"];
  if (has("deadlift", "rdl", "good-morning", "slrdl")) return ["Brace hard, neutral spine, lats tight", "Keep the bar dragging close to the body", "Hips back on the way down, drive through floor"];
  if (has("squat", "leg-press", "lunge", "bulgarian", "goblet")) return ["Big breath, brace the core before descending", "Knees track over the toes", "Control to depth, drive up evenly"];
  if (has("hip-thrust", "glute-bridge", "kickback")) return ["Tuck the chin, ribs down", "Drive through the heels", "Squeeze glutes hard at the top, pause"];
  if (ex.part === "biceps" || has("curl")) return ["Pin the elbows, no swinging", "Full stretch at the bottom", "Squeeze at the top, slow the negative"];
  if (ex.part === "triceps") return ["Keep elbows tucked & still", "Lock out fully each rep", "Control the stretch, don't bounce"];
  if (ex.part === "calves") return ["Pause & stretch at the bottom", "Full plantarflexion at the top", "Slow, controlled — no bouncing"];
  if (ex.part === "abs") return ["Move through the spine, not the hips", "Exhale and crunch hard", "Control the return, keep tension"];
  if (ex.part === "neck") return ["Move slowly through a comfortable range", "Light load, high reps — never jerk", "Build up volume gradually over weeks"];
  if (ex.part === "adductors") return ["Control the stretch — feel the inner thigh lengthen", "Squeeze legs together at the top", "Slow, full range — no bouncing out of the stretch"];
  if (ex.part === "abductors") return ["Drive the knee out, lead with the heel", "Slight forward lean loads the glute medius", "Pause at the top, control the return"];
  if (ex.type === "compound") return ["Brace your core before each rep", "Full range of motion under control", "Own the eccentric — 2 sec down"];
  return ["Slow eccentric, full range of motion", "Squeeze the target muscle at peak", "Keep tension — avoid using momentum"];
}

// classify an exercise into a movement pattern for the schematic illustration
function movePattern(ex) {
  const n = ex.id, has = (...k) => k.some(s => n.includes(s));
  if (ex.part === "neck") return "generic";
  if (ex.part === "adductors") return "adduction";
  if (ex.part === "abductors") return "abduction";
  if (ex.part === "calves") return "calf";
  if (ex.part === "abs") return "ab";
  if (ex.part === "traps" || has("shrug")) return "shrug";
  if (ex.part === "forearms") return "curl";
  if (ex.part === "chest") return has("fly", "pec", "crossover") ? "fly" : "press";
  if (has("ohp", "shoulder", "arnold", "push-press", "pike", "upright", "landmine", "z-press")) return "overhead";
  if (has("lateral", "rear", "reverse", "face", "front-raise", "y-raise")) return "lateral";
  if (has("pulldown", "pullup", "chinup", "straight-pulldown")) return "pulldown";
  if (has("deadlift", "rdl", "good-morning", "slrdl", "stiff", "pull-through", "swing", "ghr", "hyper", "rack")) return "hinge";
  if (has("hip-thrust", "glute-bridge", "thrust", "bridge", "frog", "abduction")) return "hipthrust";
  if (ex.part === "upper_back" && has("row", "pull", "pendlay", "meadows", "seal", "kroc")) return "row";
  if (ex.part === "lats") return "pulldown";
  if (ex.part === "upper_back") return "row";
  if (ex.part === "lower_back") return "hinge";
  if (ex.part === "quads" && (has("leg-ext", "extension"))) return "legext";
  if (has("squat", "leg-press", "lunge", "split", "bulgarian", "step-up", "goblet", "pendulum", "belt", "sissy", "hack")) return "squat";
  if (ex.part === "quads") return "squat";
  if (ex.part === "hamstrings" && has("curl")) return "legcurl";
  if (ex.part === "hamstrings" || ex.part === "glutes") return "hinge";
  if (ex.part === "biceps" || has("curl")) return "curl";
  if (ex.part === "triceps") return "triceps";
  return "generic";
}

// fractional weekly volume actually logged, from history within the last `days`
function weeklyActualVolume(history, days = 7) {
  const cutoff = Date.now() - days * 86400000;
  const map = {};
  (history || []).forEach(h => {
    if (!h.date || h.date < cutoff) return;
    Object.entries(h.perf || {}).forEach(([id, p]) => {
      const ex = EX_BY_ID[id];
      const n = ex && p.sets ? p.sets.length : 0;
      if (!n) return;
      map[ex.part] = (map[ex.part] || 0) + n;
      secondaryOf(ex).forEach(([pp, f]) => { map[pp] = (map[pp] || 0) + n * f; });
    });
  });
  return map;
}

// Per-muscle recovery / freshness (Fitbod-style) from recent logged sessions.
// readiness 0–100%: 100 = fully recovered. Heavier recent sessions take longer to recover.
function muscleRecovery(history) {
  const now = Date.now();
  const last = {}; // part -> {date, sets}
  const sorted = [...(history || [])].filter(h => h.date).sort((a, b) => b.date - a.date);
  sorted.forEach(h => {
    const sess = {};
    Object.entries(h.perf || {}).forEach(([id, p]) => {
      const ex = EX_BY_ID[id];
      const n = ex && p.sets ? p.sets.length : 0;
      if (!ex || !n) return;
      sess[ex.part] = (sess[ex.part] || 0) + n;
      secondaryOf(ex).forEach(([pp, f]) => { sess[pp] = (sess[pp] || 0) + n * f; });
    });
    Object.entries(sess).forEach(([part, sets]) => { if (!last[part]) last[part] = { date: h.date, sets }; });
  });
  return PART_ORDER.map(part => {
    const l = last[part];
    if (!l) return { part, readiness: 100, daysSince: null, status: "fresh", sets: 0 };
    const hours = (now - l.date) / 3600000;
    const recoveryHours = 38 + clamp(l.sets, 0, 24) * 2.2; // heavier session → longer recovery
    const readiness = Math.round(clamp(hours / recoveryHours, 0, 1) * 100);
    return { part, readiness, daysSince: Math.floor(hours / 24), status: readiness >= 85 ? "fresh" : readiness >= 55 ? "recovering" : "fatigued", sets: l.sets };
  });
}

// 7-day training recap vs the prior 7 days
function weeklyRecap(history) {
  const now = Date.now(), wk = 7 * 86400000;
  const inWin = (h, a, b) => h.date > now - a && h.date <= now - b;
  const thisW = (history || []).filter(h => h.date > now - wk);
  const prevW = (history || []).filter(h => inWin(h, 2 * wk, wk));
  const sets = arr => arr.reduce((s, h) => s + (h.setsDone || 0), 0);
  const vol = arr => arr.reduce((s, h) => s + (h.volume || 0), 0);
  const muscle = {};
  thisW.forEach(h => Object.entries(h.perf || {}).forEach(([id, p]) => { const ex = EX_BY_ID[id]; if (!ex || !p.sets) return; muscle[ex.part] = (muscle[ex.part] || 0) + p.sets.length; }));
  const topMuscle = Object.entries(muscle).sort((a, b) => b[1] - a[1])[0] || null;
  const byId = {};
  (history || []).forEach(h => Object.entries(h.perf || {}).forEach(([id, p]) => {
    if (!(p && p.weight > 0)) return;
    const best = (p.sets && p.sets.length) ? Math.max(...p.sets.map(s => e1rm(s.w, s.r || 1))) : e1rm(p.weight, p.reps || 1);
    (byId[id] = byId[id] || []).push({ date: h.date, best });
  }));
  let prs = 0;
  Object.values(byId).forEach(arr => {
    const prior = arr.filter(x => x.date <= now - wk).map(x => x.best);
    const cur = arr.filter(x => x.date > now - wk).map(x => x.best);
    if (cur.length && prior.length && Math.max(...cur) > Math.max(...prior)) prs++;
  });
  return { count: thisW.length, sets: sets(thisW), vol: Math.round(vol(thisW)), prevCount: prevW.length, prevSets: sets(prevW), prevVol: Math.round(vol(prevW)), topMuscle, prs };
}

function weeklyVolume(program, weekIndex) {
  const map = {};
  program.days.forEach(day => {
    day.exercises.forEach((id, slot) => {
      const ex = EX_BY_ID[id];
      const sets = Number(computeCell(program, day, id, slot, weekIndex).sets) || 0;
      map[ex.part] = (map[ex.part] || 0) + sets;                               // direct
      secondaryOf(ex).forEach(([p, f]) => { map[p] = (map[p] || 0) + sets * f; }); // fractional
    });
  });
  return map;
}
const fmtSets = (v) => (Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : v.toFixed(1));
// effort display: reps-in-reserve or RPE (RPE = 10 − RIR)
function effortLabel(rir, mode) {
  if (mode !== "rpe" || rir == null) return `${rir} RIR`;
  const conv = n => 10 - n;
  if (typeof rir === "string" && rir.includes("-")) { const [a, b] = rir.split("-").map(Number); return `RPE ${conv(b)}-${conv(a)}`; }
  const n = parseInt(rir); return isNaN(n) ? `${rir}` : `RPE ${conv(n)}`;
}

/* Weekly volume landmarks (sets/muscle/week), adapted from Renaissance Periodization
   (Israetel et al.): MEV = minimum effective volume, MRV = maximum recoverable volume.
   These are population starting points — individuals vary. Fractional-set inclusive. */
const LANDMARKS = {
  chest: { mev: 8, mrv: 22 }, lats: { mev: 8, mrv: 25 }, upper_back: { mev: 8, mrv: 22 }, shoulders: { mev: 8, mrv: 26 },
  lower_back: { mev: 2, mrv: 12 },
  biceps: { mev: 8, mrv: 24 }, triceps: { mev: 6, mrv: 22 }, quads: { mev: 8, mrv: 20 },
  hamstrings: { mev: 6, mrv: 20 }, glutes: { mev: 4, mrv: 20 }, calves: { mev: 8, mrv: 22 },
  abs: { mev: 6, mrv: 25 }, traps: { mev: 6, mrv: 26 }, forearms: { mev: 4, mrv: 20 }, neck: { mev: 4, mrv: 16 },
  adductors: { mev: 4, mrv: 16 }, abductors: { mev: 4, mrv: 16 },
};
const landmarkFor = (part) => LANDMARKS[part] || { mev: 8, mrv: 22 };
// zone: below MEV (under-stimulating), MEV–MRV (productive), above MRV (junk / overreaching)
function volumeZone(part, sets) {
  const { mev, mrv } = landmarkFor(part);
  if (sets < mev) return { color: C.muted, label: "below MEV" };
  if (sets <= mrv) return { color: C.accent, label: "productive" };
  return { color: C.warn, label: "over MRV" };
}
function volumeColor(sets) { return sets < 8 ? C.muted : sets <= 20 ? C.accent : C.warn; }

/* ---- safe progressive overload (double progression) ----
   Reads last logged performance for a lift and suggests next week's load:
   • hit the top of the rep range  → add one small increment, reset reps to the bottom
   • inside the range              → hold load, chase more reps
   • below the bottom              → ease the load to rebuild
   Jumps are a single plate increment (smaller for upper/isolation) to stay safe. */
const roundTo = (x, step) => Math.round(x / step) * step;
const LOWER_PARTS = ["quads", "hamstrings", "glutes"];
// User-configurable smallest achievable jump (microplates). 0 = use sensible defaults.
// Stored with the unit it was set in, so a unit switch safely falls back to defaults.
let LOAD_INC = { v: 0, unit: null };
function setLoadInc(v, unit) { LOAD_INC = { v: v || 0, unit: unit || null }; }
function loadStep(ex, unit) {
  if (LOAD_INC.v > 0 && LOAD_INC.unit === unit) return LOAD_INC.v;
  const lower = LOWER_PARTS.includes(ex.part);
  if (unit === "lb") return lower ? 10 : 5;
  return lower ? 5 : 2.5;
}
// Percentage-of-Training-Max loading for strength programs. The "main lift" of each day
// follows a weekly wave; weights = Training Max × percent, rounded to the bar.
const PCT_SCHEMES = {
  "531": {
    name: "5/3/1",
    basis: "Training Max (90% of 1RM)",
    weeks: [
      { label: "5s",      sets: [[0.65, "5"], [0.75, "5"], [0.85, "5+"]] },
      { label: "3s",      sets: [[0.70, "3"], [0.80, "3"], [0.90, "3+"]] },
      { label: "5/3/1",   sets: [[0.75, "5"], [0.85, "3"], [0.95, "1+"]] },
      { label: "Deload",  sets: [[0.40, "5"], [0.50, "5"], [0.60, "5"]] },
    ],
    deloadWeek: 3,
  },
  madcow: {
    name: "Madcow 5×5",
    basis: "top 5×5 weight",
    // ramp to a top set of 5; week-over-week the top rises ~2.5% (handled via TM growth note)
    weeks: [
      { label: "Ramp 5×5", sets: [[0.50, "5"], [0.625, "5"], [0.75, "5"], [0.875, "5"], [1.0, "5"]] },
    ],
  },
  nsuns: {
    name: "nSuns LP",
    basis: "Training Max (90% of 1RM)",
    // T1 nine-set ramp (Scheme B): up to a 95% AMRAP single, then descending back-off sets.
    // The top AMRAP drives a weekly training-max bump — pure linear progression, no monthly waves.
    weeks: [
      { label: "T1 · 9 sets", sets: [
        [0.75, "5"], [0.85, "3"], [0.95, "1+"], [0.90, "3"], [0.85, "3"],
        [0.80, "5"], [0.75, "5"], [0.70, "5"], [0.65, "5+"],
      ] },
    ],
  },
};
// returns [{ pct, reps, weight, amrap }] for the main lift this week, or null
function pctSetsFor(scheme, tm, weekIndex, weeksTotal, unit, ex) {
  const S = PCT_SCHEMES[scheme];
  if (!S || !(tm > 0)) return null;
  let wk;
  if (scheme === "531") {
    // cycle through the 4 waves; a block's final week (or beyond) is the deload
    const cyc = S.weeks;
    wk = cyc[(weekIndex - 1) % cyc.length];
    if (weekIndex > weeksTotal) wk = cyc[3]; // explicit deload week
  } else {
    wk = S.weeks[0];
  }
  const step = loadStep(ex, unit);
  // Madcow ramps the top set ~2.5% per week of the block (auto linear progression)
  let mult = 1, suffix = "";
  if (scheme === "madcow" && weekIndex > 1) {
    mult = 1 + 0.025 * (weekIndex - 1);
    suffix = ` · wk ${weekIndex} (+${Math.round((mult - 1) * 100)}%)`;
  }
  return {
    label: wk.label + suffix,
    sets: wk.sets.map(([pct, reps]) => ({
      pct, reps, amrap: String(reps).includes("+"),
      weight: roundTo(tm * pct * mult, step),
    })),
  };
}
// Project the next cycle's training maxes from the current ones + last AMRAP performance.
function projectNextTM(program, history, unit) {
  const out = {};
  const tm = program.trainingMax || {};
  Object.keys(tm).forEach(id => {
    const ex = EX_BY_ID[id];
    if (!ex || !(tm[id] > 0)) { out[id] = tm[id]; return; }
    const lower = LOWER_PARTS.includes(ex.part);
    const inc = unit === "lb" ? (lower ? 10 : 5) : (lower ? 5 : 2.5);
    const last = (history || []).find(h => h.perf?.[id]);
    const reps = last ? parseInt(last.perf[id].reps) || 0 : null;
    let factor = 1;
    if (reps != null) { if (reps === 0) factor = 0; else if (reps >= 8) factor = 2; else if (reps <= 2) factor = 0.5; }
    out[id] = factor > 0 ? roundTo(tm[id] + inc * factor, loadStep(ex, unit)) : tm[id];
  });
  return out;
}
function summarizeSets(sets) {
  const done = sets.filter(s => s.done && !s.warm && parseFloat(s.weight) > 0 && parseInt(s.reps) > 0);
  if (!done.length) return null;
  const weight = Math.max(...done.map(s => parseFloat(s.weight)));
  const atTop = done.filter(s => parseFloat(s.weight) === weight);
  const reps = Math.min(...atTop.map(s => parseInt(s.reps)));
  return { weight, reps };
}

/* Dynamic warm-up & mobility, tailored to the day's movements (raise temp → mobilize the
   joints you're about to load → a couple of ramp sets, which the logger already programs). */
const MOBILITY = {
  quads: ["Bodyweight squats × 15", "Walking lunges × 10/side", "Ankle rocks × 10/side"],
  hamstrings: ["Leg swings front-to-back × 10/side", "Bodyweight hip hinges × 12"],
  glutes: ["Glute bridges × 15", "Lateral band walks × 10/side"],
  upper_back: ["Cat–cow × 8", "Band pull-aparts × 15", "Scapular pull-ups / dead hang × 20s"],
  lower_back: ["Cat–cow × 8", "Bird-dog × 8/side", "Bodyweight hip hinges × 12"],
  lats: ["Dead hang × 20–30s", "Band lat pulldowns × 15"],
  chest: ["Band chest opener × 10", "Scapular push-ups × 10", "Push-ups × 8"],
  shoulders: ["Shoulder dislocates (band/PVC) × 10", "Arm circles × 10 each way", "Band external rotations × 12"],
  biceps: ["Light band curls × 15"],
  triceps: ["Band press-downs × 15", "Elbow circles × 10"],
  core: ["Dead bug × 8/side", "Cat–cow × 8"],
  calves: ["Ankle rocks × 12", "Calf raises × 15"],
  traps: ["Shrug rolls × 10", "Band pull-aparts × 15"],
  forearms: ["Wrist circles × 10", "Wrist flexor/extensor stretch × 20s"],
};
function warmupRoutine(day) {
  if (!day || !day.exercises || !day.exercises.length) return null;
  const order = [day.primaryIndex, ...day.exercises.map((_, i) => i).filter(i => i !== day.primaryIndex)];
  const parts = [];
  order.forEach(i => { const ex = EX_BY_ID[day.exercises[i]]; if (ex && !parts.includes(ex.part)) parts.push(ex.part); });
  const moves = ["3–5 min easy cardio to raise your core temperature"];
  parts.slice(0, 3).forEach(p => (MOBILITY[p] || []).forEach(m => { if (!moves.includes(m)) moves.push(m); }));
  const out = moves.slice(0, 6);
  out.push("Then ramp with 1–2 light sets on your first lift before working weight");
  return out;
}
/* warm-up ramp before the first working set of heavy compounds */
function warmupPlan(ex, isPrimary) {
  if (ex.type !== "compound") return null;
  const heavy = ex.rep[0] <= 6; // low-rep, loadable compound
  if (isPrimary) return { pct: [0.5, 0.7, 0.85], reps: [8, 5, 3] };
  if (heavy) return { pct: [0.6, 0.8], reps: [6, 4] };
  return null;
}

/* plate math: which plates per side for a target on a loaded bar */
const BARS = { barbell: { kg: 20, lb: 45 }, women: { kg: 15, lb: 35 }, ezbar: { kg: 10, lb: 25 }, smith: { kg: 15, lb: 35 }, trap: { kg: 25, lb: 55 }, ssb: { kg: 30, lb: 65 } };
const BAR_LABEL = { barbell: "Barbell", women: "Women's", ezbar: "EZ bar", smith: "Smith", trap: "Trap bar", ssb: "SSB" };
const PLATES = { kg: [25, 20, 15, 10, 5, 2.5, 1.25], lb: [45, 35, 25, 10, 5, 2.5] };
// Full denomination list (incl. microplates) the user can toggle on/off in Settings.
const ALL_PLATES = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 0.5, 0.25], lb: [45, 35, 25, 10, 5, 2.5, 1.25, 1, 0.5] };
let AVAIL_PLATES = { kg: null, lb: null };
function setAvailPlates(p) { AVAIL_PLATES = p || { kg: null, lb: null }; }
function barFor(ex) {
  if (ex.equip.includes("barbell")) return "barbell";
  if (ex.equip.includes("ezbar")) return "ezbar";
  if (ex.equip.includes("smith")) return "smith";
  return null;
}
function platesPerSide(total, bar, unit) {
  const barW = BARS[bar]?.[unit] ?? 0;
  let perSide = (total - barW) / 2;
  if (!(perSide > 0)) return { barW, plates: [], leftover: 0 };
  const list = (AVAIL_PLATES[unit] && AVAIL_PLATES[unit].length) ? [...AVAIL_PLATES[unit]].sort((a, b) => b - a) : PLATES[unit];
  const plates = [];
  for (const p of list) { while (perSide >= p - 1e-6) { plates.push(p); perSide -= p; } }
  return { barW, plates, leftover: Math.round(perSide * 100) / 100 };
}
/* Cross-session calibration: the next session's opening load is sized from the lifter's
   revealed strength last time. We estimate e1RM from the best logged set — using the actual
   reps-in-reserve when it was recorded, otherwise assuming that set sat at the target RIR —
   then solve for the load that lands the prescribed reps at the prescribed RIR. Double
   progression still governs direction (top the range → step up & reset low; miss the bottom
   → ease off; inside → hold and build reps), but the jump size is e1RM-accurate rather than a
   blind fixed increment, and a set logged as easy (high RIR) calibrates to a bigger jump than
   a grind (low RIR). */
function suggestWeight(perf, ex, range, unit, targetRIR = 2) {
  const p = perf && perf[ex.id];
  if (!p || !(p.weight > 0)) return null;
  const [lo, hi] = range;
  const step = loadStep(ex, unit);
  const sets = (p.sets && p.sets.length) ? p.sets : [{ w: p.weight, r: p.reps }];
  let e1 = 0;
  sets.forEach(s => {
    if (!(s.w > 0) || !(s.r > 0)) return;
    const rir = (s.rir != null) ? s.rir : targetRIR;             // use logged reserve when present
    const est = s.w * (1 + (s.r + rir) / 30);
    if (est > e1) e1 = est;
  });
  const loadFor = (reps) => Math.max(step, roundTo(e1 / (1 + (reps + targetRIR) / 30), step));
  if (p.reps == null || !(e1 > 0)) return { weight: p.weight, dir: "hold", reason: "Repeat last load, then build reps", last: p };
  if (p.reps >= hi) {
    const w = Math.max(roundTo(p.weight + step, step), Math.min(loadFor(lo), roundTo(p.weight * 1.1, step))); // ≥1 step, ≤+10%
    return { weight: w, dir: "up", delta: w - p.weight, reason: `Hit ${p.reps} reps last time — step up, reset toward ${lo}`, last: p };
  }
  if (p.reps < lo) {
    const w = Math.min(roundTo(p.weight - step, step), Math.max(loadFor(hi), roundTo(p.weight * 0.9, step))); // ≤1 step down, ≥−10%
    return { weight: Math.max(step, w), dir: "down", delta: w - p.weight, reason: `Under ${lo} reps last time — ease the load`, last: p };
  }
  return { weight: p.weight, dir: "hold", reason: `Same load — push toward ${hi} reps`, last: p };
}

/* ---- intra-session autoregulation (RIR-based, fatigue-aware) ----
   From a just-logged set (weight × reps performed at the prescribed RIR) we estimate the
   lifter's current strength, then prescribe the NEXT set so it lands at the same RIR.

   Science encoded here:
   • Reps-in-reserve → reps-to-failure = reps + RIR → estimated 1RM via Epley
     (1RM = w·(1 + repsToFailure/30)). This is the standard RIR/RPE load–velocity proxy.
   • Intra-session fatigue: to hold the same RIR, performance drops set-to-set, so the next
     set's working 1RM is discounted by one set's worth of fatigue (~3%). Because each
     estimate is derived from the set just performed (which already reflects prior fatigue),
     this is applied per-set rather than cumulatively — yielding a realistic ~one-rep / few-
     percent drift per set, not a runaway collapse.
   • Straight-set friendly: if the same load still lands inside the rep range, keep it and
     let reps drift down with fatigue (what most lifters actually do).
   • Rep-range flexibility: when the precise load isn't on the gym's increment, we don't
     force an oversized jump that would tank reps — we keep the lighter load and bank a few
     extra reps (allowed to exceed the top of the range by a couple), since a slightly
     higher-rep set at marginally lower load is the more productive, higher-quality set.
   • Only steps the load when reps would otherwise fall outside the prescribed range. */
const FAT_PER_SET = 0.03, OVER_RANGE = 3;
function parseRIRNum(r) {
  if (r == null) return 2;
  const s = String(r);
  if (s.includes("-")) { const [a, b] = s.split("-").map(Number); return (a + b) / 2; }
  const n = Number(s);
  return isNaN(n) ? 2 : n;
}
// predicted reps at load L for a given estimated 1RM, leaving `rir` in reserve (inverse Epley)
function repsAtLoad(e1, L, rir) { return Math.round(30 * (e1 / L - 1) - rir); }
// rirActual = reps-in-reserve actually experienced on the logged set (sets capacity);
// rirTarget = the reserve we want to hold on the next set (the prescription). Logging an
// easier-than-planned set (high actual RIR) → more capacity → hold/heavier; a to-failure
// set (RIR 0) → less headroom → lighter.
function nextSetWeight(W, R, rirActual, rirTarget, lo, hi, ex, unit) {
  if (!(W > 0) || !(R > 0)) return null;
  const e1 = W * (1 + (R + rirActual) / 30);                       // strength from the logged set
  const e1Next = e1 * (1 - FAT_PER_SET);                            // one set's worth of fatigue
  const step = loadStep(ex, unit);
  const predSame = repsAtLoad(e1Next, W, rirTarget);

  // 1) same load still in range → straight set; reps simply drift down with fatigue
  if (predSame >= lo && predSame <= hi) return { weight: W, target: predSame, dir: "hold" };

  // 2) still strong enough to overshoot the top → add one increment if it stays productive,
  //    otherwise keep the load and bank the extra reps
  if (predSame > hi) {
    const up = roundTo(W + step, step);
    const predUp = repsAtLoad(e1Next, up, rirTarget);
    if (predUp >= lo) return { weight: up, target: clamp(predUp, lo, hi), dir: "up" };
    return { weight: W, target: Math.min(predSame, hi + OVER_RANGE), dir: "hold", over: predSame > hi };
  }

  // 3) fatigued below the bottom → shed load one increment at a time until reps return to range.
  //    If the only available increment overshoots the top (couldn't micro-load), keep the
  //    lighter weight and take the extra reps rather than staying too heavy.
  let L = W;
  for (let k = 0; k < 4; k++) {
    const next = Math.max(step, roundTo(L - step, step));
    if (next === L) break;
    L = next;
    const pr = repsAtLoad(e1Next, L, rirTarget);
    if (pr >= lo) return { weight: L, target: Math.min(pr, hi + OVER_RANGE), dir: "down", over: pr > hi };
    if (L <= step) break;
  }
  return { weight: L, target: Math.max(lo, repsAtLoad(e1Next, L, rirTarget)), dir: "down" };
}

/* ============================== PERSISTENCE ============================== */
const MEM = { data: null };
const KEY = "wpb:v1";
async function loadStore() {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const r = await window.storage.get(KEY);
      return r ? JSON.parse(r.value) : null;
    }
  } catch (e) { /* missing key or unavailable */ }
  return MEM.data;
}
async function saveStore(data) {
  MEM.data = data;
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.set(KEY, JSON.stringify(data));
    }
  } catch (e) { /* ignore, kept in memory */ }
}

/* ============================== SMALL UI PIECES ============================== */
function Radio({ on }) {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 999, flexShrink: 0,
      border: `2px solid ${on ? C.accent : C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: on ? C.accent : "transparent", transition: "all .15s",
    }}>
      {on && <Check size={15} color={C.accentText} strokeWidth={3.5} />}
    </div>
  );
}
function CheckBox({ on }) {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
      border: `2px solid ${on ? C.accent : C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: on ? C.accent : "transparent", transition: "all .15s",
    }}>
      {on && <Check size={15} color={C.accentText} strokeWidth={3.5} />}
    </div>
  );
}
function OptionCard({ icon: Icon, label, sub, selected, onClick, kind = "radio" }) {
  return (
    <button className="opt pressable" onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 16, textAlign: "left",
      background: selected ? C.cardHi : C.card,
      border: `1.5px solid ${selected ? C.accent : C.border}`,
      borderRadius: 18, padding: "18px 18px", cursor: "pointer", color: C.text,
    }}>
      {Icon && (
        <div style={{
          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
          background: selected ? C.accentDim : C.bg2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={22} color={selected ? C.accent : C.text} strokeWidth={2.2} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{label}</div>
        {sub && <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {kind === "radio" ? <Radio on={selected} /> : <CheckBox on={selected} />}
    </button>
  );
}

/* ============================== WIZARD ============================== */
const STEP_KEYS = ["name","experience","goal","days","split","session","equipment","focus","reduce","progression","length","deload"];

const REC_SPLIT = { 1: "full_body", 2: "full_body", 3: "full_body", 4: "upper_lower", 5: "ppl", 6: "ppl", 7: "ppl" };
function Wizard({ initialEquipment, onCancel, onDone }) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    name: "",
    experience: "intermediate",
    goal: "hypertrophy",
    days: 4,
    split: null,
    session: "s60",
    equipment: initialEquipment && initialEquipment.length ? initialEquipment : EQUIPMENT.map(e => e.id),
    focus: {},      // {part: 0..2}
    reduce: [],     // [part]
    progression: "auto",
    weeks: 4,
    barbellCap: null,
    noBodyweight: false,
    deload: true,
  });
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [step]);

  const key = STEP_KEYS[step];
  const set = (patch) => setConfig(c => ({ ...c, ...patch }));

  const compatibleSplits = useMemo(
    () => Object.entries(SPLITS).filter(([, s]) => s.days.includes(config.days)),
    [config.days]
  );
  // keep split valid for day count; default to the recommended split rather than clearing
  useEffect(() => {
    if (config.split && SPLITS[config.split].days.includes(config.days)) return;
    const rec = REC_SPLIT[config.days];
    const fallback = Object.entries(SPLITS).find(([, s]) => s.days.includes(config.days))?.[0] || null;
    set({ split: rec && SPLITS[rec]?.days.includes(config.days) ? rec : fallback });
  }, [config.days]); // eslint-disable-line

  const focusTotal = Object.values(config.focus).reduce((a, b) => a + b, 0);

  const canNext = (() => {
    if (key === "name") return config.name.trim().length > 0;
    if (key === "split") return !!config.split;
    if (key === "equipment") return true; // bodyweight always works
    return true;
  })();

  const next = () => {
    if (step < STEP_KEYS.length - 1) { setStep(step + 1); return; }
    // build final config and generate
    const focusList = [];
    Object.entries(config.focus).forEach(([p, n]) => { for (let i = 0; i < n; i++) focusList.push(p); });
    onDone({ ...config, focusList, reduce: config.reduce.filter(r => !(config.focus[r] > 0)) });
  };
  const back = () => { if (step === 0) onCancel(); else setStep(step - 1); };

  const progress = (step + 1) / STEP_KEYS.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", height: 34 }}>
          <button onClick={back} className="pressable" style={{ position: "absolute", left: 0, background: "none", border: "none", color: C.text, cursor: "pointer", padding: 4 }}>
            <ChevronLeft size={28} />
          </button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Create Program</div>
        </div>
        <div style={{ height: 4, background: C.border, borderRadius: 99, marginTop: 16, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: C.accent, borderRadius: 99, transition: "width .35s cubic-bezier(.2,.7,.3,1)" }} />
        </div>
      </div>

      {/* content */}
      <div ref={scrollRef} className="wpb-scroll" style={{ flex: 1, overflowY: "auto", padding: "22px 20px 8px" }}>
        <div key={step} className="fadeUp">
          <StepBody
            key={key} stepKey={key} config={config} set={set}
            compatibleSplits={compatibleSplits} focusTotal={focusTotal}
          />
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: "10px 20px 24px", background: `linear-gradient(to top, ${C.bg} 60%, transparent)` }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={back} className="pressable" style={{
            flex: step === 0 ? "0 0 auto" : "0 0 33%", padding: "17px", borderRadius: 16, border: `1px solid ${C.border}`, cursor: "pointer",
            fontSize: 16, fontWeight: 800, background: C.card, color: C.text,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <ChevronLeft size={18} /> {step === 0 ? "Cancel" : "Back"}
          </button>
          <button onClick={next} disabled={!canNext} className="pressable" style={{
            flex: 1, padding: "17px", borderRadius: 16, border: "none", cursor: canNext ? "pointer" : "default",
            fontSize: 17, fontWeight: 800,
            background: canNext ? C.accent : C.card,
            color: canNext ? C.accentText : C.faint,
          }}>
            {step === STEP_KEYS.length - 1 ? "Generate Program" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Heading({ children, sub }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h1 style={{ fontSize: 30, lineHeight: 1.12, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>{children}</h1>
      {sub && <p style={{ color: C.muted, marginTop: 10, fontSize: 14.5, lineHeight: 1.45 }}>{sub}</p>}
    </div>
  );
}
const Col = ({ children }) => <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>;

function StepBody({ stepKey, config, set, compatibleSplits, focusTotal }) {
  if (stepKey === "name") {
    return (
      <>
        <Heading sub="You can rename it any time after it's built.">What should we call this program?</Heading>
        <input
          autoFocus value={config.name} onChange={(e) => set({ name: e.target.value })}
          placeholder="e.g. Summer Hypertrophy Block"
          style={{
            width: "100%", padding: "18px", borderRadius: 16, fontSize: 18, fontWeight: 600,
            background: C.card, border: `1.5px solid ${config.name ? C.accent : C.border}`, color: C.text,
          }}
        />
      </>
    );
  }
  if (stepKey === "experience") {
    return (
      <>
        <Heading sub="This scales your weekly set volume sensibly.">What's your experience level?</Heading>
        <Col>
          {Object.entries(EXP).map(([k, v]) => (
            <OptionCard key={k} icon={Trophy} label={v.label} sub={v.sub} selected={config.experience === k} onClick={() => set({ experience: k })} />
          ))}
        </Col>
      </>
    );
  }
  if (stepKey === "goal") {
    return (
      <>
        <Heading sub="Drives rep ranges, set counts and progression.">What's your main goal?</Heading>
        <Col>
          {Object.entries(GOALS).map(([k, v]) => (
            <OptionCard key={k} icon={v.icon} label={v.label} sub={v.sub} selected={config.goal === k} onClick={() => set({ goal: k })} />
          ))}
        </Col>
      </>
    );
  }
  if (stepKey === "days") {
    return (
      <>
        <Heading sub="We'll only show splits that fit this frequency.">How many days per week?</Heading>
        <Col>
          {[2,3,4,5,6].map(d => (
            <OptionCard key={d} icon={Calendar} label={`${d} days / week`}
              sub={`${Object.values(SPLITS).filter(s=>s.days.includes(d)).length} compatible splits`}
              selected={config.days === d} onClick={() => set({ days: d })} />
          ))}
        </Col>
      </>
    );
  }
  if (stepKey === "split") {
    const rec = REC_SPLIT[config.days];
    const ordered = [...compatibleSplits].sort((a, b) => (a[0] === rec ? -1 : b[0] === rec ? 1 : 0));
    return (
      <>
        <Heading sub={`Programs that work with ${config.days} days per week.`}>Pick your split</Heading>
        <Col>
          {ordered.map(([k, s]) => (
            <OptionCard key={k} icon={Repeat} label={k === rec ? `${s.name}  ·  Recommended` : s.name} sub={s.blurb} selected={config.split === k} onClick={() => set({ split: k })} />
          ))}
        </Col>
      </>
    );
  }
  if (stepKey === "session") {
    return (
      <>
        <Heading sub="Longer sessions add more exercises per day.">How much time per session?</Heading>
        <Col>
          {SESSIONS.map(s => (
            <OptionCard key={s.id} icon={Clock} label={s.label} sub={`~${s.count} exercises`} selected={config.session === s.id} onClick={() => set({ session: s.id })} />
          ))}
        </Col>
      </>
    );
  }
  if (stepKey === "equipment") {
    const toggle = (id) => set({ equipment: config.equipment.includes(id) ? config.equipment.filter(x => x !== id) : [...config.equipment, id] });
    const hasBarbell = config.equipment.includes("barbell");
    return (
      <>
        <Heading sub="Only exercises you can actually perform get programmed. Bodyweight is always included.">What equipment do you have?</Heading>
        <div className="wpb-scroll" style={{ display: "flex", gap: 7, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
          {[
            ["Full gym", ["barbell", "dumbbell", "bench", "cable", "machine", "smith", "ezbar", "pullup", "dip", "kettlebell", "bands"]],
            ["Barbell + rack", ["barbell", "bench", "ezbar", "pullup"]],
            ["Dumbbells + bench", ["dumbbell", "bench", "pullup"]],
            ["Dumbbells only", ["dumbbell"]],
            ["Bodyweight", []],
          ].map(([label, eq]) => {
            const active = eq.length === config.equipment.length && eq.every(x => config.equipment.includes(x));
            return (
              <button key={label} onClick={() => set({ equipment: eq })} className="pressable" style={{ flexShrink: 0, padding: "8px 13px", borderRadius: 99, border: `1px solid ${active ? C.accent : C.border}`, background: active ? C.accent : C.card, color: active ? C.accentText : C.muted, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{label}</button>
            );
          })}
        </div>
        <Col>
          {EQUIPMENT.map(e => (
            <OptionCard key={e.id} kind="check" icon={Dumbbell} label={e.label} selected={config.equipment.includes(e.id)} onClick={() => toggle(e.id)} />
          ))}
        </Col>
        <button onClick={() => set({ noBodyweight: !config.noBodyweight })} className="pressable" style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", borderRadius: 12, border: `1px solid ${config.noBodyweight ? C.accent : C.border}`, background: config.noBodyweight ? C.accentDim : C.card, color: C.text, cursor: "pointer", textAlign: "left" }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${config.noBodyweight ? C.accent : C.border}`, background: config.noBodyweight ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{config.noBodyweight && <Check size={14} color={C.accentText} />}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Skip bodyweight exercises</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>No push-ups, planks, bodyweight squats, etc. — only loaded movements</div>
          </div>
        </button>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: .4, color: C.faint, textTransform: "uppercase", margin: "22px 2px 4px" }}>Barbell limit</div>
        <div style={{ fontSize: 12.5, color: C.muted, margin: "0 2px 12px", lineHeight: 1.5 }}>Cap barbell movements per session so a busy commercial gym (racks, platforms) doesn't bottleneck your workout — we'll sub in dumbbell, machine &amp; cable lifts instead.{!hasBarbell && " Applies once you add a barbell."}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[[null, "No limit"], [1, "1"], [2, "2"], [3, "3"]].map(([v, label]) => (
            <button key={label} onClick={() => set({ barbellCap: v })} className="pressable" style={{ flex: 1, padding: "13px 4px", borderRadius: 12, cursor: "pointer", fontSize: 13.5, fontWeight: 800, border: `1px solid ${(config.barbellCap ?? null) === v ? C.accent : C.border}`, background: (config.barbellCap ?? null) === v ? C.accentDim : C.card, color: (config.barbellCap ?? null) === v ? C.accent : C.muted }}>{label}</button>
          ))}
        </div>
      </>
    );
  }
  if (stepKey === "focus") {
    const bump = (p, delta) => {
      const cur = config.focus[p] || 0;
      const total = Object.values(config.focus).reduce((a, b) => a + b, 0);
      let nv = clamp(cur + delta, 0, 2);
      if (delta > 0 && total >= 5) nv = cur; // cap
      const f = { ...config.focus, [p]: nv };
      if (nv === 0) delete f[p];
      set({ focus: f });
    };
    return (
      <>
        <Heading sub="Each level adds one extra exercise for that muscle. Pick a part twice to really specialise.">
          Focus on any muscles?
        </Heading>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "10px 16px", background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <span style={{ color: C.muted, fontSize: 14 }}>Focus points used</span>
          <span className="mono" style={{ fontWeight: 700, color: focusTotal >= 5 ? C.accent : C.text }}>{focusTotal} / 5</span>
        </div>
        <Col>
          {PART_ORDER.map(p => {
            const v = config.focus[p] || 0;
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 14, background: v ? C.cardHi : C.card, border: `1.5px solid ${v ? C.accent : C.border}`, borderRadius: 16, padding: "12px 16px" }}>
                <div style={{ flex: 1, fontWeight: 700, fontSize: 16 }}>{PART_LABEL[p]}</div>
                <Stepper value={v} onMinus={() => bump(p, -1)} onPlus={() => bump(p, 1)} plusDisabled={focusTotal >= 5 && v < 2} />
              </div>
            );
          })}
        </Col>
      </>
    );
  }
  if (stepKey === "reduce") {
    const toggle = (p) => set({ reduce: config.reduce.includes(p) ? config.reduce.filter(x => x !== p) : [...config.reduce, p] });
    const avail = PART_ORDER.filter(p => !(config.focus[p] > 0));
    return (
      <>
        <Heading sub="The opposite of focusing — these get trimmed back. Focused muscles are hidden here.">
          Any muscles to reduce?
        </Heading>
        <Col>
          {avail.map(p => (
            <OptionCard key={p} kind="check" icon={Minus} label={PART_LABEL[p]} selected={config.reduce.includes(p)} onClick={() => toggle(p)} />
          ))}
        </Col>
      </>
    );
  }
  if (stepKey === "progression") {
    return (
      <>
        <Heading sub="Auto applies double-progression / load ramps across the block. Manual lets you set everything yourself.">
          Sets &amp; reps
        </Heading>
        <Col>
          <OptionCard icon={Wand2} label="Auto progressive overload" sub="We adjust sets & reps each week" selected={config.progression === "auto"} onClick={() => set({ progression: "auto" })} />
          <OptionCard icon={Pencil} label="Manual" sub="Fill in your own sets & reps" selected={config.progression === "manual"} onClick={() => set({ progression: "manual" })} />
        </Col>
      </>
    );
  }
  if (stepKey === "length") {
    return (
      <>
        <Heading sub="How many weeks of progressive overload before the block resets? Longer blocks ramp volume & intensity more gradually.">
          Mesocycle length
        </Heading>
        <Col>
          {[[4, "4 weeks", "Classic short block — fast progression"], [6, "6 weeks", "Balanced accumulation"], [8, "8 weeks", "Long block — gradual ramp"], [10, "10 weeks", "Extended accumulation for advanced lifters"]].map(([w, label, sub]) => (
            <OptionCard key={w} icon={Calendar} label={label} sub={sub} selected={config.weeks === w} onClick={() => set({ weeks: w })} />
          ))}
        </Col>
      </>
    );
  }
  if (stepKey === "deload") {
    return (
      <>
        <Heading sub={`Your block runs ${config.weeks || TOTAL_WEEKS} weeks. A deload adds a lighter recovery week at the end.`}>
          Add a deload week?
        </Heading>
        <Col>
          <OptionCard icon={Battery} label="Yes, add a deload" sub={`Week ${(config.weeks || TOTAL_WEEKS) + 1} · reduced volume & load`} selected={config.deload === true} onClick={() => set({ deload: true })} />
          <OptionCard icon={Flame} label="No deload" sub="Train through the whole block" selected={config.deload === false} onClick={() => set({ deload: false })} />
        </Col>
      </>
    );
  }
  return null;
}

function Stepper({ value, onMinus, onPlus, plusDisabled }) {
  const btn = (disabled) => ({
    width: 34, height: 34, borderRadius: 10, border: `1.5px solid ${C.border}`,
    background: disabled ? C.bg2 : C.bg2, color: disabled ? C.faint : C.text,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "default" : "pointer",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button className="pressable" onClick={onMinus} disabled={value === 0} style={btn(value === 0)}><Minus size={16} /></button>
      <span className="mono" style={{ width: 16, textAlign: "center", fontWeight: 700, color: value ? C.accent : C.muted }}>{value}</span>
      <button className="pressable" onClick={onPlus} disabled={plusDisabled} style={btn(plusDisabled)}><Plus size={16} /></button>
    </div>
  );
}

/* ============================== PROGRAM VIEW ============================== */
// Reconstruct an editable program from exported share-text. Lossy but robust: matches
// exercise names to the library, rebuilds days, supersets, and notes; config is inferred.
function parseProgramText(text) {
  if (!text || !text.trim()) return null;
  const lines = text.split(/\r?\n/);
  const nameToId = {};
  EXERCISES.forEach(e => { nameToId[e.name.toLowerCase()] = e.id; });
  const name = (lines[0] || "").trim() || "Imported program";
  const meta = (lines[1] || "").toLowerCase();
  const goal = meta.includes("strength") && (meta.includes("hyper") || meta.includes("both")) ? "both" : meta.includes("strength") ? "strength" : "hypertrophy";
  const wkM = meta.match(/(\d+)\s*-?\s*week/);
  const weeks = wkM ? clamp(parseInt(wkM[1]), 4, 10) : 4;
  const days = [], ss = {}, overrides = {};
  let cur = null;
  const exLine = /^\s*(?:\d+\.|↳)\s*(.+?)\s+[—-]\s+(.+)$/;
  const trainingMax = {}; let detectedScheme = null;
  const mainSlots = {}; // dayId -> slot of the main lift
  for (let i = 2; i < lines.length; i++) {
    const raw = lines[i]; const t = raw.trim();
    if (!t || /^made with/i.test(t) || /^main lifts use/i.test(t)) continue;
    // weekly wave detail lines from a percentage program (e.g. "W1 (5s): 90×5 · …") — skip
    if (/^\s+(?:w\d|wk\s|\+)/i.test(raw)) continue;
    const m = raw.match(exLine);
    if (m && cur) {
      const id = nameToId[m[1].trim().toLowerCase()];
      if (id) {
        const slot = cur.exercises.length;
        const grouped = /↳/.test(raw);
        cur.exercises.push(id);
        if (grouped && slot > 0) ss[`${cur.id}:${slot - 1}`] = true;
        const rest = m[2];
        const mainM = rest.match(/(5\/3\/1|madcow)\s+main lift/i);
        if (mainM) {
          detectedScheme = /madcow/i.test(mainM[1]) ? "madcow" : "531";
          mainSlots[cur.id] = slot;
          const tmM = rest.match(/tm\s*([\d.]+)/i);
          if (tmM) trainingMax[id] = parseFloat(tmM[1]);
        } else {
          const sr = rest.match(/(\d+)\s*[×x]\s*([\d]+(?:-[\d]+)?)/);
          if (sr) overrides[`${cur.id}:${slot}`] = { sets: clamp(parseInt(sr[1]), 1, 10), reps: sr[2] };
        }
      }
    } else if (/^[—-]\s/.test(t) && cur) {
      cur.note = t.replace(/^[—-]\s*/, "");
    } else if (!/^\s/.test(raw)) {
      // only a non-indented line begins a new day
      cur = { id: uid(), label: t, exercises: [], primaryIndex: 0 };
      days.push(cur);
    }
  }
  const validDays = days.filter(d => d.exercises.length);
  if (!validDays.length) return null;
  validDays.forEach(d => {
    const main = mainSlots[d.id];
    const pi = main != null && main < d.exercises.length ? main : d.exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
    d.primaryIndex = pi < 0 ? 0 : pi;
  });
  const splitEntry = Object.entries(SPLITS).find(([, s]) => s.name.toLowerCase() === meta.split("·")[0].trim()) || Object.entries(SPLITS).find(([, s]) => s.days.includes(validDays.length));
  const config = {
    name, goal, days: validDays.length, weeks,
    split: splitEntry ? splitEntry[0] : "full_body",
    session: "s60", experience: "intermediate",
    equipment: ["barbell", "dumbbell", "bench", "cable", "machine", "smith", "ezbar", "pullup", "dip", "kettlebell", "bands"],
    focus: {}, reduce: [], progression: "manual", barbellCap: null, noBodyweight: false, deload: false,
    percentScheme: detectedScheme,
    assistance: /boring but big|\bbbb\b/i.test(text) ? "bbb" : null,
  };
  return { id: uid(), name, createdAt: Date.now(), config, days: validDays, overrides, ss, trainingMax, edited: true };
}
// Training-phase narrative — borrowed from Pursuit (Foundation → Development → Peak framing).
// Maps each week of a non-percentage block to a phase with a one-line "why".
const PHASES = {
  accumulation:    { label: "Accumulation",    tagline: "Build the work",   why: "Volume is high and effort moderate — bank the work that later intensity will sharpen.", color: "#8EBE6B" },
  intensification: { label: "Intensification", tagline: "Add the load",     why: "Sets get heavier and closer to failure while volume holds — tension and strength climb.", color: "#D4B85D" },
  peak:            { label: "Peak",            tagline: "Push the ceiling", why: "The hardest sets of the block. Leave it all here, then back off to recover.", color: "#D45D6C" },
  deload:          { label: "Deload",          tagline: "Recover & adapt",  why: "Volume and load drop so your body catches up to the training — you return fresher and stronger.", color: "#5DB4D4" },
};
function phaseFor(program, weekIndex) {
  const weeks = weeksOf(program);
  if (program.config?.deload && weekIndex > weeks) return PHASES.deload;
  const p = weeks <= 1 ? 1 : (weekIndex - 1) / (weeks - 1);
  if (p >= 0.8) return PHASES.peak;
  if (p >= 0.4) return PHASES.intensification;
  return PHASES.accumulation;
}
// "Why this session" — a short coach note tailored to the day's intent (phase, scheme, main lift).
function coachNote(program, day, weekIndex) {
  const cfg = program.config || {};
  if (program.quick) return null;
  const mainId = day.exercises[day.primaryIndex];
  const main = EX_BY_ID[mainId]?.name;
  const weeks = weeksOf(program);
  const isDeload = cfg.deload && weekIndex > weeks;
  if (cfg.percentScheme === "531" && main) {
    const wave = PCT_SCHEMES["531"].weeks[weekIndex > weeks ? 3 : (weekIndex - 1) % 4];
    if (wave.label === "Deload") return `Deload — light, crisp technique work on ${main}. Bank the recovery; don't chase weight.`;
    return `Work up to your top set on ${main} and chase reps on the final set — that AMRAP is what drives next cycle's training max.`;
  }
  if (cfg.percentScheme === "madcow") return `Ramp to today's top set of five${main ? ` on ${main}` : ""}. Beat last week's top set to keep the linear progression rolling.`;
  if (cfg.percentScheme === "nsuns" && main) return `Nine sets on ${main}: ramp to the 95% AMRAP single, then grind the back-off sets. Hit 2+ on that top set and bump the training max next week.`;
  if (isDeload) return `Deload session — drop the loads and keep 3–4 reps in reserve. You're here to recover and let adaptations catch up, not to grind.`;
  const ph = phaseFor(program, weekIndex);
  const parts = [...new Set(day.exercises.map(id => EX_BY_ID[id]?.part).filter(Boolean))].slice(0, 2).map(p => PART_LABEL[p]).join(" & ");
  if (ph === PHASES.peak) return `Peak week${main ? ` — open with ${main}` : ""}. These are the hardest sets of the block: bring full intent on every working set, then stop.`;
  if (ph === PHASES.intensification) return `Intensification — loads are up and RIR is low. Push the working sets close to failure with clean technique${main ? `, starting with ${main}` : ""}.`;
  return `Accumulation — moderate effort, quality reps. Bank volume across ${parts || "each muscle"} and leave 2–3 in reserve; the work compounds.`;
}
// Render a program as clean, shareable plain text (sets × reps @ effort, with grouping).
function programToText(program, loadMode = "rir", unit = "kg") {
  const cfg = program.config || {};
  const splitName = SPLITS[cfg.split]?.name || cfg.split || "Custom";
  const goalName = (GOALS[cfg.goal]?.name) || cfg.goal || "";
  const scheme = cfg.percentScheme;
  const wk = weeksOf(program);
  const L = [];
  L.push(program.name || "My Program");
  L.push(`${splitName} · ${program.days.length} days/week${goalName ? " · " + goalName : ""} · ${wk}-week block`);
  if (scheme && PCT_SCHEMES[scheme]) L.push(`Main lifts use ${PCT_SCHEMES[scheme].name} percentages of ${PCT_SCHEMES[scheme].basis}.`);
  L.push("");
  program.days.forEach((day) => {
    L.push(day.label || "Day");
    if (day.note) L.push(`  — ${day.note}`);
    day.exercises.forEach((id, slot) => {
      const ex = EX_BY_ID[id]; if (!ex) return;
      const grouped = program.ss?.[`${day.id}:${slot}`] || (slot > 0 && program.ss?.[`${day.id}:${slot - 1}`]);
      const bullet = grouped ? "   ↳" : `  ${slot + 1}.`;
      // main lift of a percentage program → print the weekly waves
      if (scheme && PCT_SCHEMES[scheme] && slot === day.primaryIndex) {
        const S = PCT_SCHEMES[scheme];
        const tm = program.trainingMax?.[id] || 0;
        L.push(`${bullet} ${ex.name} — ${S.name} main lift${tm > 0 ? ` · TM ${tm}${unit}` : ""}`);
        const wkCount = scheme === "531" ? S.weeks.length : Math.min(wk, 4);
        for (let w = 1; w <= wkCount; w++) {
          const wave = scheme === "531" ? S.weeks[w - 1] : S.weeks[0];
          const mult = scheme === "madcow" && w > 1 ? 1 + 0.025 * (w - 1) : 1;
          const parts = wave.sets.map(([pct, reps]) => tm > 0 ? `${roundTo(tm * pct * mult, loadStep(ex, unit))}×${reps}` : `${Math.round(pct * 100)}%×${reps}`);
          const wlabel = scheme === "531" ? `W${w} (${wave.label})` : `Wk ${w}`;
          L.push(`       ${wlabel}: ${parts.join(" · ")}`);
        }
        if (cfg.assistance === "bbb") L.push(`       + BBB supplemental: 5 × ${tm > 0 ? `${roundTo(tm * 0.5, loadStep(ex, unit))}×10` : "50%×10"}`);
        return;
      }
      const cell = computeCell(program, day, id, slot, 1);
      const eff = cell.rir != null ? ` @ ${effortLabel(cell.rir, loadMode)}` : (cell.range ? " to failure" : "");
      L.push(`${bullet} ${ex.name} — ${cell.sets} × ${cell.range}${eff}`);
    });
    L.push("");
  });
  L.push("Made with Workout Program Builder");
  return L.join("\n");
}
function ProgramView({ program, setProgram, banned, addBan, loadMode = "rir", unit = "kg", history = [], onSave, onBack, isSaved, onRegenerate, onNextCycle, onStartDay, onCreateCustom, initialWeek, onWeekChange }) {
  const [weekIndex, setWeekIndex] = useState(initialWeek || 1);
  const pickWeek = (w) => { setWeekIndex(w); onWeekChange && onWeekChange(w); };
  const flashUndo = (msg, snap) => setToast({ msg, undo: () => { setProgram(snap); setToast(null); } });
  // Drag-to-reorder exercises within a day (pointer-based; up/down buttons remain as a fallback).
  const dragRef = useRef(null);
  const [dragKey, setDragKey] = useState(null);
  const onGripDown = (e, dayId, slot) => {
    const rowEl = e.currentTarget.closest("[data-exrow]");
    const step = rowEl ? rowEl.getBoundingClientRect().height + 8 : 64;
    dragRef.current = { dayId, slot, anchorY: e.clientY, step, snap: program, moved: false };
    setDragKey(`${dayId}:${slot}`);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  };
  const onGripMove = (e) => {
    const d = dragRef.current; if (!d) return;
    const day = program.days.find(x => x.id === d.dayId); if (!day) return;
    let dy = e.clientY - d.anchorY;
    while (dy > d.step && d.slot < day.exercises.length - 1) { moveSlot(d.dayId, d.slot, 1, true); d.slot++; d.anchorY += d.step; dy -= d.step; d.moved = true; setDragKey(`${d.dayId}:${d.slot}`); }
    while (dy < -d.step && d.slot > 0) { moveSlot(d.dayId, d.slot, -1, true); d.slot--; d.anchorY -= d.step; dy += d.step; d.moved = true; setDragKey(`${d.dayId}:${d.slot}`); }
  };
  const onGripUp = () => {
    const d = dragRef.current; if (!d) return;
    dragRef.current = null; setDragKey(null);
    if (d.moved) flashUndo("Reordered", d.snap);
  };
  const [openDay, setOpenDay] = useState(program.days[0]?.id);
  const [swap, setSwap] = useState(null); // {dayId, slot}
  const [addDay, setAddDay] = useState(null); // dayId for the add-exercise sheet
  const [showVol, setShowVol] = useState(false);
  const [toast, setToast] = useState(null);
  const [cfgSheet, setCfgSheet] = useState(false);
  const [schedSheet, setSchedSheet] = useState(false);
  const cycleSchedule = (weekday) => setProgram(p => {
    const sched = { ...(p.schedule || {}) };
    const ids = p.days.map(d => d.id);
    const cur = sched[weekday] ?? null;
    const curIdx = cur === null ? -1 : ids.indexOf(cur);
    const nextIdx = curIdx + 1; // -1(rest)->0->1...->len-1->rest
    if (nextIdx >= ids.length) delete sched[weekday]; else sched[weekday] = ids[nextIdx];
    return { ...p, schedule: sched };
  });
  const [renamingId, setRenamingId] = useState(null);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [shareSheet, setShareSheet] = useState(false);
  const [tmSheet, setTmSheet] = useState(false);
  const [cycleSheet, setCycleSheet] = useState(false);
  // unique "main lifts" (each day's primary compound) for percentage-based programs
  const mainLifts = useMemo(() => {
    const ids = [];
    (program.days || []).forEach(d => { const id = d.exercises[d.primaryIndex]; if (id && !ids.includes(id) && EX_BY_ID[id]) ids.push(id); });
    return ids;
  }, [program.days]);
  const tmSet = program.config?.percentScheme ? mainLifts.filter(id => (program.trainingMax?.[id] || 0) > 0).length : 0;
  const [shareCopied, setShareCopied] = useState(false);
  const hasEdits = !!(program.edited
    || (program.overrides && Object.keys(program.overrides).length)
    || (program.ss && Object.keys(program.ss).length)
    || (program.rounds && Object.keys(program.rounds).length)
    || (program.schedule && Object.keys(program.schedule).length)
    || program.days.some(d => d.note));
  const [renameVal, setRenameVal] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [noteVal, setNoteVal] = useState("");
  const setDayNote = (dayId, note) => setProgram(p => ({ ...p, days: p.days.map(d => d.id === dayId ? { ...d, note: note.trim() || undefined } : d) }));
  const renameDay = (dayId, label) => setProgram(p => ({ ...p, days: p.days.map(d => d.id === dayId ? { ...d, label: label.trim() || d.label } : d) }));
  const moveDay = (dayId, dir) => setProgram(p => {
    const i = p.days.findIndex(d => d.id === dayId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= p.days.length) return p;
    const days = [...p.days];
    [days[i], days[j]] = [days[j], days[i]];
    return { ...p, days };
  });
  const applyConstraints = (next) => {
    setProgram(p => {
      const config = { ...p.config, ...next };
      const noBw = !!config.noBodyweight;
      const cap = config.barbellCap || Infinity;
      const eq = new Set(config.equipment);
      const isBarbell = id => EX_BY_ID[id]?.equip.includes("barbell");
      const days = p.days.map(d => {
        const dayUsed = new Set(d.exercises);
        let barbells = 0;
        const exercises = d.exercises.map(id => {
          const ex = EX_BY_ID[id]; if (!ex) return id;
          const bwViolation = noBw && ex.equip.length === 0;
          const capViolation = isBarbell(id) && barbells >= cap;
          if (bwViolation || capViolation) {
            const alt = availableFor(ex.part, eq, banned, noBw).find(a => !dayUsed.has(a.id) && !(capViolation && a.equip.includes("barbell")));
            if (alt) { dayUsed.delete(id); dayUsed.add(alt.id); if (isBarbell(alt.id)) barbells++; return alt.id; }
          }
          if (isBarbell(id)) barbells++;
          return id;
        });
        const primaryIndex = exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
        return { ...d, exercises, primaryIndex: primaryIndex < 0 ? 0 : primaryIndex };
      });
      return { ...p, config, days };
    });
    setToast("Program settings updated");
  };
  // Assistance presets for percentage programs: rebuild each day's accessories to match the style.
  const setAssistance = (val) => {
    setProgram(p => {
      const cfg = { ...p.config, assistance: val };
      const eq = new Set(cfg.equipment);
      const cap = cfg.barbellCap || Infinity;
      const noBw = !!cfg.noBodyweight;
      const baseN = SESSIONS.find(s => s.id === cfg.session)?.count ?? 4;
      const target = val === "jack_shit" ? 1 : val === "triumvirate" ? 3 : val === "bbb" ? 3 : baseN;
      const globalUsed = {};
      const days = p.days.map(d => {
        const tpl = DAY_TEMPLATES[d.type];
        const parts = tpl ? tpl.parts : null;
        let exercises;
        if (parts) exercises = buildDaySlots(parts, target, eq, banned, globalUsed, cap, noBw);
        else { exercises = d.exercises.slice(0, target); exercises.forEach(id => { globalUsed[id] = true; }); }
        if (!exercises.length) exercises = d.exercises.slice(0, 1);
        const pi = exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
        return { ...d, exercises, primaryIndex: pi < 0 ? 0 : pi };
      });
      return { ...p, config: cfg, days, edited: true };
    });
    setToast("Assistance updated");
  };
  useEffect(() => { if (!toast) return; const ms = (typeof toast === "object" && toast.undo) ? 4500 : 2200; const t = setTimeout(() => setToast(null), ms); return () => clearTimeout(t); }, [toast]);
  const equipSet = useMemo(() => new Set(program.config.equipment), [program.config.equipment]);
  const manual = program.config.progression === "manual";
  const totalWeeks = weeksOf(program);
  const weeks = [];
  for (let i = 1; i <= totalWeeks; i++) weeks.push(i);
  const deloadWeek = program.config.deload ? totalWeeks + 1 : null;

  const splitName = SPLITS[program.config.split].name;

  const replaceSlot = (dayId, slot, newId) => {
    setProgram(p => {
      const days = p.days.map(d => {
        if (d.id !== dayId) return d;
        const exercises = [...d.exercises]; exercises[slot] = newId;
        const primaryIndex = exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
        return { ...d, exercises, primaryIndex: primaryIndex < 0 ? 0 : primaryIndex };
      });
      const overrides = { ...p.overrides };
      if (manual) {
        const ex = EX_BY_ID[newId];
        const day = days.find(d => d.id === dayId);
        const [lo, hi] = repRange(p.config.goal, ex, slot === day.primaryIndex);
        overrides[`${dayId}:${slot}`] = { sets: baseSetsFor(p.config, ex, slot === day.primaryIndex), reps: `${lo}-${hi}` };
      }
      return { ...p, days, overrides, edited: true };
    });
  };

  const altsFor = (dayId, slot) => {
    const day = program.days.find(d => d.id === dayId);
    const curId = day.exercises[slot];
    const part = EX_BY_ID[curId]?.part;
    const usedElsewhere = new Set(day.exercises.filter((_, i) => i !== slot));
    return availableFor(part, equipSet, banned, !!program.config.noBodyweight)
      .filter(e => e.id !== curId && !usedElsewhere.has(e.id))
      .sort((a, b) => (a.type === "compound" ? 0 : 1) - (b.type === "compound" ? 0 : 1));
  };

  const banAndReplace = (dayId, slot, snap) => {
    snap = snap || program;
    const day = program.days.find(d => d.id === dayId);
    if (!day) return;
    const curId = day.exercises[slot];
    const curName = EX_BY_ID[curId]?.name || "exercise";
    const nb = addBan(curId); // returns updated banned list
    const part = EX_BY_ID[curId]?.part;
    const usedElsewhere = new Set(day.exercises.filter((_, i) => i !== slot));
    const alt = availableFor(part, equipSet, nb, !!program.config.noBodyweight)
      .filter(e => !usedElsewhere.has(e.id))[0];
    if (alt) { replaceSlot(dayId, slot, alt.id); flashUndo(`Banned ${curName} — swapped in ${alt.name}`, snap); }
    else if (day.exercises.length > 1) { removeSlot(dayId, slot, true); flashUndo(`Banned & removed ${curName}`, snap); }
    else { flashUndo(`Banned ${curName}`, snap); }
  };

  const editOverride = (dayId, slot, field, val) => {
    setProgram(p => {
      const k = `${dayId}:${slot}`;
      const cur = p.overrides[k] || {};
      return { ...p, overrides: { ...p.overrides, [k]: { ...cur, [field]: val } } };
    });
  };

  const setGroupRounds = (dayId, startSlot, len, rounds) => {
    setProgram(p => {
      const r = { ...(p.rounds || {}) };
      for (let s = startSlot; s < startSlot + len; s++) {
        if (rounds == null) delete r[`${dayId}:${s}`];
        else r[`${dayId}:${s}`] = rounds;
      }
      return { ...p, rounds: r };
    });
  };
  const copyDay = (dayId) => {
    setProgram(p => {
      const src = p.days.find(d => d.id === dayId);
      if (!src) return p;
      const nid = uid();
      const newDay = { ...src, id: nid, label: `${src.label} (copy)`, exercises: [...src.exercises] };
      const overrides = { ...p.overrides };
      Object.entries(p.overrides).forEach(([k, v]) => { const [dId, s] = k.split(":"); if (dId === dayId) overrides[`${nid}:${s}`] = { ...v }; });
      const ss = { ...(p.ss || {}) };
      Object.entries(p.ss || {}).forEach(([k, v]) => { const [dId, s] = k.split(":"); if (dId === dayId) ss[`${nid}:${s}`] = v; });
      const rounds = { ...(p.rounds || {}) };
      Object.entries(p.rounds || {}).forEach(([k, v]) => { const [dId, s] = k.split(":"); if (dId === dayId) rounds[`${nid}:${s}`] = v; });
      const idx = p.days.findIndex(d => d.id === dayId);
      const days = [...p.days.slice(0, idx + 1), newDay, ...p.days.slice(idx + 1)];
      return { ...p, days, overrides, ss, rounds, config: { ...p.config, days: days.length }, edited: true };
    });
    setToast("Day duplicated");
  };
  const toggleSS = (dayId, slot) => setProgram(p => {
    const ss = { ...(p.ss || {}) };
    const key = `${dayId}:${slot}`;
    if (ss[key]) delete ss[key]; else ss[key] = true;
    return { ...p, ss, rounds: clearDayRounds(p, dayId) };
  });
  const clearDaySS = (p, dayId) => { if (!p.ss) return p.ss; const ss = {}; Object.keys(p.ss).forEach(k => { if (!k.startsWith(dayId + ":")) ss[k] = p.ss[k]; }); return ss; };
  const clearDayRounds = (p, dayId) => { if (!p.rounds) return p.rounds; const r = {}; Object.keys(p.rounds).forEach(k => { if (!k.startsWith(dayId + ":")) r[k] = p.rounds[k]; }); return r; };
  const moveSlot = (dayId, slot, dir, _silent) => {
    const day0 = program.days.find(d => d.id === dayId);
    const target = slot + dir;
    if (!day0 || target < 0 || target >= day0.exercises.length) return;
    const snap = program;
    setProgram(p => {
      const day = p.days.find(d => d.id === dayId);
      if (!day || target < 0 || target >= day.exercises.length) return p;
      const days = p.days.map(d => {
        if (d.id !== dayId) return d;
        const exercises = [...d.exercises];
        [exercises[slot], exercises[target]] = [exercises[target], exercises[slot]];
        const primaryIndex = exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
        return { ...d, exercises, primaryIndex: primaryIndex < 0 ? 0 : primaryIndex };
      });
      // swap the two slots' manual overrides
      const overrides = { ...p.overrides };
      const a = `${dayId}:${slot}`, b = `${dayId}:${target}`;
      const va = overrides[a], vb = overrides[b];
      if (va !== undefined) overrides[b] = va; else delete overrides[b];
      if (vb !== undefined) overrides[a] = vb; else delete overrides[a];
      return { ...p, days, overrides, ss: clearDaySS(p, dayId), rounds: clearDayRounds(p, dayId), edited: true };
    });
    if (!_silent) flashUndo("Reordered", snap);
  };
  const removeSlot = (dayId, slot, _silent) => {
    const day0 = program.days.find(d => d.id === dayId);
    if (day0 && day0.exercises.length <= 1) return; // keep at least one
    const snap = program;
    const nm = EX_BY_ID[day0?.exercises[slot]]?.name || "exercise";
    setProgram(p => {
      const days = p.days.map(d => {
        if (d.id !== dayId || d.exercises.length <= 1) return d;
        const exercises = d.exercises.filter((_, i) => i !== slot);
        const primaryIndex = exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
        return { ...d, exercises, primaryIndex: primaryIndex < 0 ? 0 : primaryIndex };
      });
      const overrides = {}; // reindex slots above the removed one
      Object.entries(p.overrides).forEach(([k, v]) => {
        const [dId, sStr] = k.split(":"); const s = +sStr;
        if (dId !== dayId) { overrides[k] = v; return; }
        if (s === slot) return;
        overrides[`${dId}:${s > slot ? s - 1 : s}`] = v;
      });
      return { ...p, days, overrides, ss: clearDaySS(p, dayId), rounds: clearDayRounds(p, dayId), edited: true };
    });
    if (!_silent) flashUndo(`Removed ${nm}`, snap);
  };

  const addExercise = (dayId, part) => {
    setProgram(p => {
      const day = p.days.find(d => d.id === dayId);
      const used = new Set(day.exercises);
      const pick = availableFor(part, equipSet, banned, !!program.config.noBodyweight)
        .filter(e => !used.has(e.id))
        .sort((a, b) => (a.type === "compound" ? 0 : 1) - (b.type === "compound" ? 0 : 1))[0];
      if (!pick) return p;
      const newSlot = day.exercises.length;
      const days = p.days.map(d => {
        if (d.id !== dayId) return d;
        const exercises = [...d.exercises, pick.id];
        const primaryIndex = exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
        return { ...d, exercises, primaryIndex: primaryIndex < 0 ? 0 : primaryIndex };
      });
      const overrides = { ...p.overrides };
      if (manual) {
        const [lo, hi] = repRange(p.config.goal, pick, false);
        overrides[`${dayId}:${newSlot}`] = { sets: baseSetsFor(p.config, pick, false), reps: `${lo}-${hi}` };
      }
      return { ...p, days, overrides, edited: true };
    });
  };
  // append a specific exercise by id (used for custom exercises)
  const addSpecific = (dayId, exId) => {
    setProgram(p => {
      const day = p.days.find(d => d.id === dayId);
      if (!day || day.exercises.includes(exId)) return p;
      const ex = EX_BY_ID[exId];
      const newSlot = day.exercises.length;
      const days = p.days.map(d => {
        if (d.id !== dayId) return d;
        const exercises = [...d.exercises, exId];
        const primaryIndex = exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
        return { ...d, exercises, primaryIndex: primaryIndex < 0 ? 0 : primaryIndex };
      });
      const overrides = { ...p.overrides };
      if (manual && ex) {
        const [lo, hi] = repRange(p.config.goal, ex, false);
        overrides[`${dayId}:${newSlot}`] = { sets: baseSetsFor(p.config, ex, false), reps: `${lo}-${hi}` };
      }
      return { ...p, days, overrides, edited: true };
    });
  };
  // muscles that still have an available, unused exercise for a given day
  const addablePartsFor = (dayId) => {
    const day = program.days.find(d => d.id === dayId);
    const used = new Set(day.exercises);
    return PART_ORDER.filter(part => availableFor(part, equipSet, banned, !!program.config.noBodyweight).some(e => !used.has(e.id)));
  };

  const activeWeek = weekIndex;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{ padding: "14px 18px 12px", borderBottom: `1px solid ${C.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onBack} className="pressable" style={{ background: "none", border: "none", color: C.text, cursor: "pointer", padding: 4 }}>
            <ChevronLeft size={26} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{program.name}</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
              {splitName} · {program.config.days}d · {GOALS[program.config.goal].label}
            </div>
          </div>
          {!isSaved && (
            <button onClick={() => hasEdits ? setConfirmRegen(true) : onRegenerate()} className="pressable" title="Regenerate exercises" style={iconBtn()}>
              <RefreshCw size={18} />
            </button>
          )}
          <button onClick={() => setSchedSheet(true)} className="pressable" title="Weekly schedule" style={iconBtn()}>
            <Calendar size={18} />
          </button>
          <button onClick={() => setCfgSheet(true)} className="pressable" title="Program settings" style={iconBtn()}>
            <Settings2 size={18} />
          </button>
          <button onClick={onSave} className="pressable" style={{ ...iconBtn(), background: C.accent, borderColor: C.accent, color: C.accentText, width: "auto", padding: "0 14px", gap: 6, fontWeight: 800, fontSize: 14 }}>
            <Save size={16} />{isSaved ? "Update" : "Save"}
          </button>
        </div>

        {/* week pills */}
        <div className="wpb-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 14, paddingBottom: 2 }}>
          {weeks.map(w => (
            <WeekPill key={w} label={`Week ${w}`} active={activeWeek === w && !manual} onClick={() => pickWeek(w)} dim={manual} />
          ))}
          {deloadWeek && <WeekPill label="Deload" deload active={activeWeek === deloadWeek && !manual} onClick={() => pickWeek(deloadWeek)} dim={manual} />}
        </div>
        {program.config?.percentScheme === "531" && !manual && (() => {
          const total = weeksOf(program);
          const wave = PCT_SCHEMES["531"].weeks[activeWeek > total ? 3 : (activeWeek - 1) % 4];
          const pcts = wave.sets.map(s => `${Math.round(s[0] * 100)}%`).join(" · ");
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, padding: "9px 12px", background: wave.label === "Deload" ? (C.warn ? `${C.warn}1a` : C.accentDim) : C.accentDim, border: `1px solid ${(wave.label === "Deload" ? (C.warn || C.accent) : C.accent)}33`, borderRadius: 12 }}>
              <Activity size={14} color={wave.label === "Deload" ? (C.warn || C.accent) : C.accent} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: C.text }}>
                <span style={{ fontWeight: 800 }}>{wave.label === "Deload" ? "Deload week" : `${wave.label} week`}</span>
                <span style={{ color: C.muted }}> · main lift {pcts} of TM</span>
              </div>
            </div>
          );
        })()}
        {!program.config?.percentScheme && (() => {
          const ph = phaseFor(program, activeWeek);
          return (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginTop: 10, padding: "10px 12px", background: `${ph.color}14`, border: `1px solid ${ph.color}44`, borderRadius: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: ph.color, flexShrink: 0, marginTop: 4 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: C.text }}><span style={{ fontWeight: 800 }}>{ph.label}</span><span style={{ color: C.muted }}> · {ph.tagline}</span></div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{ph.why}</div>
              </div>
            </div>
          );
        })()}
        {manual
          ? <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Manual mode — tap any number to edit. ~RIR shows the suggested effort.</div>
          : <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Each lift gets its own rep range; volume climbs week to week as RIR drops 3 → 0, then a deload.</div>}
        {program.config.autoVolume && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8, padding: "9px 11px", borderRadius: 11, background: C.accentDim, border: `1px solid ${C.accent}33` }}>
            <Wand2 size={14} color={C.accent} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 11.5, color: C.text }}>Starting volume was auto-tuned per muscle from your training history.</div>
          </div>
        )}
      </div>

      {/* days */}
      <div className="wpb-scroll" style={{ flex: 1, overflowY: "auto", padding: "12px 14px 90px" }}>
        {!isSaved && (
          <div style={{ display: "flex", alignItems: "center", gap: 9, background: C.accentDim, border: `1px solid ${C.accent}33`, borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
            <Save size={16} color={C.accent} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 12.5, color: C.text }}>Tap Save to keep this program, or just hit play on a day — starting a workout saves it automatically.</div>
          </div>
        )}
        {program.config?.percentScheme && (
          <button onClick={() => setTmSheet(true)} className="pressable" style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 11, background: tmSet < mainLifts.length ? (C.warn ? `${C.warn}1a` : C.accentDim) : C.card, border: `1px solid ${tmSet < mainLifts.length ? (C.warn || C.accent) + "55" : C.border}`, borderRadius: 14, padding: "13px 14px", marginBottom: 14, cursor: "pointer", color: C.text }}>
            <Dumbbell size={18} color={tmSet < mainLifts.length ? (C.warn || C.accent) : C.accent} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 800 }}>Training maxes · {PCT_SCHEMES[program.config.percentScheme]?.name}</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>
                {tmSet < mainLifts.length ? `Set your ${PCT_SCHEMES[program.config.percentScheme]?.basis} for each main lift — ${tmSet}/${mainLifts.length} done` : `${tmSet} main lift${tmSet === 1 ? "" : "s"} set · tap to edit`}
              </div>
            </div>
            <ChevronRight size={17} color={C.faint} />
          </button>
        )}
        <VolumeCard volume={weeklyVolume(program, activeWeek)} program={program} open={showVol} onToggle={() => setShowVol(v => !v)} />
        {(() => {
          const shortDays = program.days.filter(d => d.exercises.length < 3).length;
          if (!shortDays) return null;
          const noBw = program.config.noBodyweight;
          return (
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.warn ? `${C.warn}1a` : C.accentDim, border: `1px solid ${(C.warn || C.accent)}44`, borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
              <Info size={16} color={C.warn || C.accent} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>
                {shortDays === 1 ? "One day is" : `${shortDays} days are`} a little short on exercises — your equipment{noBw ? " (with bodyweight skipped)" : ""} limits the available options. Add equipment{noBw ? " or re-allow bodyweight" : ""} via the <Settings2 size={11} style={{ display: "inline", verticalAlign: "-1px" }} /> settings, or add exercises to any day below.
              </div>
            </div>
          );
        })()}
        {program.schedule && Object.keys(program.schedule).length > 0 && (() => {
          const WD = ["M", "T", "W", "T", "F", "S", "S"];
          const idx2wd = [1, 2, 3, 4, 5, 6, 0];
          const todayWd = new Date().getDay();
          return (
            <button onClick={() => setSchedSheet(true)} className="pressable" style={{ width: "100%", display: "flex", gap: 5, marginBottom: 14, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              {WD.map((label, i) => {
                const wd = idx2wd[i];
                const on = !!program.schedule[wd];
                const isToday = wd === todayWd;
                return (
                  <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 9, background: on ? C.accent : C.card, border: `1px solid ${isToday ? C.accent : on ? "transparent" : C.border}`, color: on ? C.accentText : C.faint }}>
                    <div style={{ fontSize: 11, fontWeight: 800 }}>{label}</div>
                    <div style={{ fontSize: 8, fontWeight: 700, marginTop: 1 }}>{on ? "train" : "rest"}</div>
                  </div>
                );
              })}
            </button>
          );
        })()}
        {program.days.map((day, di) => {
          const open = openDay === day.id;
          const mins = estimateMinutes(program, day, activeWeek);
          const chip = fitChip(program, mins);
          return (
            <div key={day.id} style={{ marginBottom: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {renamingId === day.id ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "12px 12px 12px 16px" }}>
                    <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { renameDay(day.id, renameVal); setRenamingId(null); } }}
                      style={{ flex: 1, minWidth: 0, padding: "9px 11px", borderRadius: 10, border: `1px solid ${C.accent}`, background: C.bg2, color: C.text, fontSize: 15, fontWeight: 700 }} />
                    <button className="pressable" onClick={() => { renameDay(day.id, renameVal); setRenamingId(null); }} style={{ ...iconBtn(), width: 36, height: 36, color: C.accent, borderColor: `${C.accent}66` }}><Check size={17} /></button>
                    <button className="pressable" onClick={() => setRenamingId(null)} style={{ ...iconBtn(), width: 36, height: 36, marginRight: 8 }}><X size={16} /></button>
                  </div>
                ) : (
                <>
                <button className="pressable" onClick={() => setOpenDay(open ? null : day.id)} style={{
                  flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, padding: "16px 6px 16px 16px", background: "none", border: "none", color: C.text, cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: C.bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>D{di + 1}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 7 }}>{day.label}</div>
                    <div style={{ fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <Clock size={12} style={{ verticalAlign: "middle" }} /> ~{mins} min · {day.exercises.length} exercises
                      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: .3, color: chip.color, background: chip.dim, padding: "2px 6px", borderRadius: 6 }}>{chip.text}</span>
                    </div>
                  </div>
                  <ChevronDown size={20} color={C.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </button>
                <button className="pressable" onClick={() => { setRenameVal(day.label); setRenamingId(day.id); }} title="Rename day" style={{ ...iconBtn(), flexShrink: 0, width: 38, height: 38 }}>
                  <Pencil size={15} />
                </button>
                <button className="pressable" onClick={() => copyDay(day.id)} title="Duplicate this day" style={{ ...iconBtn(), flexShrink: 0, width: 38, height: 38, marginRight: isSaved ? 0 : 10 }}>
                  <Copy size={16} />
                </button>
                <button className="pressable" onClick={() => onStartDay(day, activeWeek)} title="Start workout" style={{
                  flexShrink: 0, margin: "0 12px 0 2px", width: 42, height: 42, borderRadius: 13, border: "none",
                  background: C.accent, color: C.accentText, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}>
                  <Play size={18} fill={C.accentText} />
                </button>
                </>
                )}
              </div>

              {open && (
                <div style={{ padding: "0 12px 12px" }}>
                  {day.note && (
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.accentDim, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
                      <Info size={14} color={C.accent} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.45 }}>{day.note}</span>
                    </div>
                  )}
                  {day.exercises.map((id, slot) => {
                    const ex = EX_BY_ID[id];
                    if (!ex) return null; // resilient to a removed/unknown exercise id
                    const cell = computeCell(program, day, id, slot, activeWeek);
                    const isPrimary = slot === day.primaryIndex;
                    const pctMain = (program.config?.percentScheme && isPrimary && program.trainingMax?.[id] > 0)
                      ? pctSetsFor(program.config.percentScheme, program.trainingMax[id], activeWeek, weeksOf(program), unit, ex) : null;
                    const canRemove = day.exercises.length > 1;
                    const ssKey = s => `${day.id}:${s}`;
                    const linkedPrev = slot > 0 && !!program.ss?.[ssKey(slot - 1)];
                    const linkedNext = !!program.ss?.[ssKey(slot)];
                    const inGroup = linkedPrev || linkedNext;
                    const groupStart = linkedNext && !linkedPrev;
                    let groupLen = 0;
                    if (groupStart) { let s = slot; while (program.ss?.[ssKey(s)]) { groupLen++; s++; } groupLen++; }
                    return (
                      <div key={slot}>
                        {groupStart && (() => {
                          const curRounds = program.rounds?.[`${day.id}:${slot}`] || null;
                          return (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 2px 0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 800, letterSpacing: .5, color: C.accent, textTransform: "uppercase" }}>
                                <Layers size={12} /> {groupLen >= 3 ? `Circuit · ${groupLen} exercises` : "Superset"}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 10.5, color: C.muted, fontWeight: 700 }}>{curRounds ? "Rounds" : "Auto sets"}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 2, background: C.bg2, borderRadius: 8, border: `1px solid ${C.border}`, padding: 2 }}>
                                  <button className="pressable" onClick={() => setGroupRounds(day.id, slot, groupLen, Math.max(1, (curRounds || cell.sets) - 1))} style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: "none", color: C.muted, cursor: "pointer", fontSize: 15, fontWeight: 800, lineHeight: 1 }}>−</button>
                                  <span className="mono" style={{ minWidth: 16, textAlign: "center", fontSize: 12, fontWeight: 700, color: curRounds ? C.accent : C.faint }}>{curRounds || cell.sets}</span>
                                  <button className="pressable" onClick={() => setGroupRounds(day.id, slot, groupLen, Math.min(10, (curRounds || cell.sets) + 1))} style={{ width: 22, height: 22, borderRadius: 6, border: "none", background: "none", color: C.muted, cursor: "pointer", fontSize: 15, fontWeight: 800, lineHeight: 1 }}>+</button>
                                </div>
                                {curRounds && <button className="pressable" onClick={() => setGroupRounds(day.id, slot, groupLen, null)} title="Back to auto sets" style={{ background: "none", border: "none", color: C.faint, cursor: "pointer", padding: 2 }}><X size={13} /></button>}
                              </div>
                            </div>
                          );
                        })()}
                      <div data-exrow style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 10px 12px 6px", background: dragKey === `${day.id}:${slot}` ? C.cardHi : C.bg2, borderRadius: 14, marginTop: linkedPrev ? 3 : 8, borderLeft: inGroup ? `3px solid ${C.accent}` : "none", boxShadow: dragKey === `${day.id}:${slot}` ? `0 6px 18px rgba(0,0,0,.3)` : "none", transition: "background .12s" }}>
                        <div
                          onPointerDown={(e) => onGripDown(e, day.id, slot)}
                          onPointerMove={onGripMove}
                          onPointerUp={onGripUp}
                          onPointerCancel={onGripUp}
                          title="Drag to reorder"
                          style={{ flexShrink: 0, alignSelf: "stretch", display: "flex", alignItems: "center", padding: "0 2px", color: C.faint, cursor: "grab", touchAction: "none" }}
                        >
                          <GripVertical size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.name}</span>
                            {isPrimary && <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: .5, color: C.accent, background: C.accentDim, padding: "2px 6px", borderRadius: 6 }}>KEY LIFT</span>}
                          </div>
                          <div style={{ fontSize: 11.5, color: C.faint, marginTop: 3 }}>
                            {PART_LABEL[ex.part]} · {ex.type}
                          </div>
                          {/* action row */}
                          <div style={{ display: "flex", gap: 6, marginTop: 9 }}>
                            <button className="pressable" onClick={() => setSwap({ dayId: day.id, slot })} style={{ ...tinyBtn(), width: "auto", height: 28, padding: "0 9px", gap: 5, fontSize: 11.5, fontWeight: 700 }}>
                              <Repeat size={12} /> Swap
                            </button>
                            <button className="pressable" onClick={() => banAndReplace(day.id, slot)} title="Ban from all programs" style={{ ...tinyBtn(), width: "auto", height: 28, padding: "0 9px", gap: 5, fontSize: 11.5, fontWeight: 700, color: C.danger, borderColor: C.dangerDim }}>
                              <Ban size={12} /> Ban
                            </button>
                            <div style={{ flex: 1 }} />
                            {slot < day.exercises.length - 1 && (
                              <button className="pressable" onClick={() => toggleSS(day.id, slot)} title={program.ss?.[`${day.id}:${slot}`] ? "Unlink superset" : "Superset with next exercise"} style={{ ...tinyBtn(), width: 28, height: 28, color: program.ss?.[`${day.id}:${slot}`] ? C.accent : C.muted, borderColor: program.ss?.[`${day.id}:${slot}`] ? `${C.accent}66` : C.border }}>
                                <Layers size={14} />
                              </button>
                            )}
                            <button className="pressable" onClick={() => moveSlot(day.id, slot, -1)} disabled={slot === 0} title="Move up" style={{ ...tinyBtn(), width: 28, height: 28, color: slot === 0 ? C.faint : C.muted }}>
                              <ChevronUp size={15} />
                            </button>
                            <button className="pressable" onClick={() => moveSlot(day.id, slot, 1)} disabled={slot === day.exercises.length - 1} title="Move down" style={{ ...tinyBtn(), width: 28, height: 28, color: slot === day.exercises.length - 1 ? C.faint : C.muted }}>
                              <ChevronDown size={15} />
                            </button>
                            {canRemove && (
                              <button className="pressable" onClick={() => removeSlot(day.id, slot)} title="Remove from this day" style={{ ...tinyBtn(), width: 28, height: 28, color: C.muted }}>
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* sets x reps */}
                        {pctMain ? (
                          <div style={{ textAlign: "right", minWidth: 96, marginTop: 2 }}>
                            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{pctMain.sets.map(s => s.weight).join("/")}</div>
                            <div className="mono" style={{ fontSize: 10, fontWeight: 800, color: pctMain.label.toLowerCase().includes("deload") ? C.warn : C.accent, marginTop: 2 }}>{pctMain.sets.map(s => s.reps).join("/")}</div>
                            <div style={{ fontSize: 9, color: C.faint, marginTop: 1 }}>{unit} · {pctMain.label}</div>
                          </div>
                        ) : manual ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, marginTop: 2 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <input type="number" min={1} value={(program.overrides[`${day.id}:${slot}`]?.sets) ?? cell.sets}
                                onChange={(e) => editOverride(day.id, slot, "sets", clamp(parseInt(e.target.value || "1"), 1, 20))}
                                className="mono" style={miniInput(38)} />
                              <span className="mono" style={{ color: C.faint }}>×</span>
                              <input value={(program.overrides[`${day.id}:${slot}`]?.reps) ?? cell.reps}
                                onChange={(e) => editOverride(day.id, slot, "reps", e.target.value)}
                                className="mono" style={miniInput(52)} />
                            </div>
                            <div className="mono" style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>~{effortLabel(cell.rir, loadMode)}</div>
                          </div>
                        ) : (
                          <div style={{ textAlign: "right", minWidth: 86, marginTop: 2 }}>
                            <div className="mono" style={{ fontSize: 15.5, fontWeight: 700, color: C.text }}>
                              {cell.sets}<span style={{ color: C.faint }}>×</span>{cell.reps}
                            </div>
                            <div className="mono" style={{ fontSize: 10.5, fontWeight: 800, color: cell.note.includes("Deload") ? C.warn : C.accent, marginTop: 2 }}>@ {effortLabel(cell.rir, loadMode)}</div>
                            <div style={{ fontSize: 9.5, color: cell.note.includes("Deload") ? C.danger : C.faint, marginTop: 1 }}>{cell.note}</div>
                          </div>
                        )}
                      </div>
                      </div>
                    );
                  })}

                  <button className="pressable" onClick={() => setAddDay(day.id)} style={{
                    width: "100%", marginTop: 8, padding: "11px", borderRadius: 12, border: `1px dashed ${C.border}`,
                    background: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <PlusCircle size={15} /> Add exercise
                  </button>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button className="pressable" onClick={() => { setRenameVal(day.label); setRenamingId(day.id); }} style={{ flex: 1, padding: "9px", borderRadius: 11, border: `1px solid ${C.border}`, background: "none", color: C.muted, cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <Pencil size={13} /> Rename
                    </button>
                    <button className="pressable" onClick={() => { setNoteVal(day.note || ""); setNoteId(day.id); }} style={{ flex: 1, padding: "9px", borderRadius: 11, border: `1px solid ${day.note ? C.accent + "66" : C.border}`, background: day.note ? C.accentDim : "none", color: day.note ? C.accent : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <Info size={13} /> Note
                    </button>
                    {program.days.length > 1 && (<>
                      <button className="pressable" onClick={() => moveDay(day.id, -1)} disabled={di === 0} style={{ flex: 1, padding: "9px", borderRadius: 11, border: `1px solid ${C.border}`, background: "none", color: di === 0 ? C.faint : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        <ChevronUp size={14} /> Up
                      </button>
                      <button className="pressable" onClick={() => moveDay(day.id, 1)} disabled={di === program.days.length - 1} style={{ flex: 1, padding: "9px", borderRadius: 11, border: `1px solid ${C.border}`, background: "none", color: di === program.days.length - 1 ? C.faint : C.muted, cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        <ChevronDown size={14} /> Down
                      </button>
                    </>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isSaved && program.config?.percentScheme && onNextCycle && tmSet > 0 && (
          <button className="pressable" onClick={() => setCycleSheet(true)} style={{ width: "100%", marginTop: 16, padding: "13px", borderRadius: 13, border: `1px solid ${C.accent}55`, background: C.accentDim, color: C.accent, cursor: "pointer", fontSize: 13.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <RefreshCw size={16} /> Start next cycle
          </button>
        )}

        <button className="pressable" onClick={() => { setShareCopied(false); setShareSheet(true); }} style={{ width: "100%", marginTop: 16, padding: "13px", borderRadius: 13, border: `1px solid ${C.border}`, background: C.card, color: C.text, cursor: "pointer", fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Copy size={16} /> Share as text
        </button>

        <div style={{ textAlign: "center", color: C.faint, fontSize: 12, marginTop: 18, padding: "0 24px", lineHeight: 1.5 }}>
          {banned.length > 0 && <div>{banned.length} exercise{banned.length > 1 ? "s" : ""} banned from all programs.</div>}
          <div style={{ marginTop: 6 }}>Open the volume panel to balance sets per muscle · swap, ban or remove any lift · add more anytime</div>
        </div>
      </div>

      {/* swap sheet */}
      {swap && (
        <SwapSheet
          ex={EX_BY_ID[program.days.find(d => d.id === swap.dayId).exercises[swap.slot]]}
          alts={altsFor(swap.dayId, swap.slot)}
          onPick={(id) => { const snap = program; const nm = EX_BY_ID[id]?.name || "exercise"; replaceSlot(swap.dayId, swap.slot, id); setSwap(null); flashUndo(`Swapped in ${nm}`, snap); }}
          onBanCurrent={() => { const snap = program; banAndReplace(swap.dayId, swap.slot, snap); setSwap(null); }}
          onClose={() => setSwap(null)}
        />
      )}

      {/* add-exercise sheet */}
      {addDay && (
        <AddSheet
          parts={addablePartsFor(addDay)}
          usedIds={program.days.find(d => d.id === addDay)?.exercises || []}
          onPick={(part) => { addExercise(addDay, part); setAddDay(null); }}
          onAddById={(exId) => { addSpecific(addDay, exId); setAddDay(null); }}
          onCreate={(partial) => { const ex = onCreateCustom(partial); addSpecific(addDay, ex.id); setAddDay(null); }}
          onClose={() => setAddDay(null)}
        />
      )}
      {/* next-cycle preview (percentage programs) */}
      {cycleSheet && (() => {
        const next = projectNextTM(program, history, unit);
        const rows = mainLifts.filter(id => (program.trainingMax?.[id] || 0) > 0).map(id => {
          const cur = program.trainingMax[id]; const nw = next[id];
          const last = (history || []).find(h => h.perf?.[id]);
          const reps = last ? parseInt(last.perf[id].reps) || 0 : null;
          const note = reps == null ? "no AMRAP logged — standard jump" : reps === 0 ? "missed — holding" : reps >= 8 ? `${reps} reps — big jump` : reps <= 2 ? `${reps} reps — small jump` : `${reps} reps — standard jump`;
          return { id, name: EX_BY_ID[id]?.name, cur, nw, note, up: nw > cur };
        });
        return (
          <div onClick={() => setCycleSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 70, animation: "fadeIn .2s both" }}>
            <div onClick={e => e.stopPropagation()} className="wpb-scroll" style={{ width: "100%", maxHeight: "86%", overflowY: "auto", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
              <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Start next cycle</div>
                <button className="pressable" onClick={() => setCycleSheet(false)} style={iconBtn()}><X size={18} /></button>
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>New training maxes are projected from your last top-set AMRAP on each lift. This creates a fresh block — your current one is kept.</div>
              {rows.map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: `1px solid ${C.borderSoft || C.border}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{r.note}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 13.5, color: C.muted }}>{r.cur}</div>
                  <ChevronRight size={14} color={C.faint} />
                  <div className="mono" style={{ fontSize: 15, fontWeight: 800, color: r.up ? C.accent : C.muted }}>{r.nw}<span style={{ fontSize: 10, color: C.faint }}> {unit}</span></div>
                </div>
              ))}
              <button onClick={() => { setCycleSheet(false); onNextCycle(program); }} className="pressable" style={{ width: "100%", padding: "14px", borderRadius: 13, border: "none", background: C.accent, color: C.accentText, fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <RefreshCw size={16} /> Create next block
              </button>
            </div>
          </div>
        );
      })()}

      {/* training-max entry sheet (percentage-based programs) */}
      {tmSheet && (
        <div onClick={() => setTmSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 70, animation: "fadeIn .2s both" }}>
          <div onClick={e => e.stopPropagation()} className="wpb-scroll" style={{ width: "100%", maxHeight: "86%", overflowY: "auto", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Training maxes</div>
              <button className="pressable" onClick={() => setTmSheet(false)} style={iconBtn()}><X size={18} /></button>
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>{PCT_SCHEMES[program.config.percentScheme]?.name} loads each main lift from its {PCT_SCHEMES[program.config.percentScheme]?.basis}. Enter your training max, or tap “Use 1RM” to set it to 90% of a one-rep max.</div>
            {mainLifts.map(id => {
              const ex = EX_BY_ID[id]; if (!ex) return null;
              const cur = program.trainingMax?.[id] || "";
              return (
                <div key={id} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 6 }}>{ex.name}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input inputMode="decimal" value={cur === "" ? "" : String(cur)} placeholder={`Training max (${unit})`}
                      onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, ""); setProgram(p => ({ ...p, trainingMax: { ...(p.trainingMax || {}), [id]: v === "" ? 0 : parseFloat(v) }, edited: true })); }}
                      className="mono" style={{ flex: 1, padding: "11px 12px", borderRadius: 11, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 15, fontWeight: 700 }} />
                    <button className="pressable" onClick={() => { let oneRm = null; try { oneRm = window.prompt(`1RM for ${ex.name} (${unit})?`); } catch { oneRm = null; } const n = parseFloat(String(oneRm).replace(/[^0-9.]/g, "")); if (n > 0) setProgram(p => ({ ...p, trainingMax: { ...(p.trainingMax || {}), [id]: roundTo(n * 0.9, loadStep(ex, unit)) }, edited: true })); }}
                      style={{ padding: "11px 12px", borderRadius: 11, border: `1px solid ${C.border}`, background: C.card, color: C.accent, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Use 1RM</button>
                  </div>
                  {cur > 0 && (() => {
                    const wk = pctSetsFor(program.config.percentScheme, cur, 1, weeksOf(program), unit, ex);
                    if (!wk) return null;
                    return <div style={{ fontSize: 10.5, color: C.faint, marginTop: 5 }} className="mono">Week 1 ({wk.label}): {wk.sets.map(s => `${s.weight}×${s.reps}`).join("  ·  ")}</div>;
                  })()}
                </div>
              );
            })}
            <button onClick={() => setTmSheet(false)} className="pressable" style={{ width: "100%", padding: "14px", borderRadius: 13, border: "none", background: C.accent, color: C.accentText, fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 6 }}>Done</button>
          </div>
        </div>
      )}

      {/* share program as text */}
      {shareSheet && (() => {
        const text = programToText(program, loadMode, unit);
        const copy = async () => {
          try { await navigator.clipboard.writeText(text); setShareCopied(true); }
          catch { setShareCopied(false); }
        };
        return (
          <div onClick={() => setShareSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 70, animation: "fadeIn .2s both" }}>
            <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
              <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Share program</div>
                <button className="pressable" onClick={() => setShareSheet(false)} style={iconBtn()}><X size={18} /></button>
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>Copy this plain-text plan to send to anyone — sets × reps and target effort for each lift.</div>
              <textarea readOnly value={text} onFocus={e => e.target.select()} className="wpb-scroll mono" style={{ width: "100%", height: 200, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 11.5, lineHeight: 1.5, resize: "none", marginBottom: 12 }} />
              <button onClick={copy} className="pressable" style={{ width: "100%", padding: "14px", borderRadius: 13, border: "none", background: C.accent, color: C.accentText, fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Copy size={16} /> {shareCopied ? "Copied ✓" : "Copy to clipboard"}
              </button>
            </div>
          </div>
        );
      })()}

      {/* regenerate confirm (only when there are manual edits) */}
      {confirmRegen && (
        <div onClick={() => setConfirmRegen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, animation: "fadeIn .2s both", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 340, background: C.bg2, borderRadius: 20, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Regenerate program?</div>
            <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>You've made manual changes — swaps, supersets, set tweaks, notes or schedule. Regenerating builds a fresh layout and replaces all of them.</div>
            <button onClick={() => { setConfirmRegen(false); onRegenerate(); }} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: C.accent, color: C.accentText, fontWeight: 800, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><RefreshCw size={16} /> Regenerate</button>
            <button onClick={() => setConfirmRegen(false)} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.text, fontWeight: 700, cursor: "pointer" }}>Keep my edits</button>
          </div>
        </div>
      )}

      {/* day note modal */}
      {noteId && (
        <div onClick={() => setNoteId(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, animation: "fadeIn .2s both", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 360, background: C.bg2, borderRadius: 20, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 16.5, fontWeight: 800, marginBottom: 3 }}>Day note</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 14 }}>Shown at the top of this workout — e.g. focus cues, tempo, reminders.</div>
            <textarea value={noteVal} autoFocus onChange={e => setNoteVal(e.target.value)} placeholder="e.g. Focus on slow eccentrics; leave 2 in the tank on squats." className="wpb-scroll"
              style={{ width: "100%", height: 88, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 14, resize: "none", marginBottom: 16, lineHeight: 1.45 }} />
            <button onClick={() => { setDayNote(noteId, noteVal); setNoteId(null); }} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 13, border: "none", background: C.accent, color: C.accentText, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Save</button>
            <button onClick={() => setNoteId(null)} className="pressable" style={{ width: "100%", marginTop: 8, padding: "11px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* weekly schedule sheet */}
      {schedSheet && (() => {
        const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const idx2wd = [1, 2, 3, 4, 5, 6, 0]; // map display order to JS weekday (0=Sun)
        const sched = program.schedule || {};
        const trainingDays = idx2wd.filter(wd => sched[wd]).length;
        const todayWd = new Date().getDay();
        return (
          <div onClick={() => setSchedSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 60, animation: "fadeIn .2s both" }}>
            <div onClick={e => e.stopPropagation()} className="wpb-scroll" style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}`, maxHeight: "86%", overflowY: "auto" }}>
              <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Weekly schedule</div>
                <button className="pressable" onClick={() => setSchedSheet(false)} style={iconBtn()}><X size={18} /></button>
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 16 }}>Tap a day to assign a workout — {trainingDays} training {trainingDays === 1 ? "day" : "days"}, {7 - trainingDays} rest. Cycles through your days, then rest.</div>
              {WD.map((label, i) => {
                const wd = idx2wd[i];
                const dayId = sched[wd];
                const day = dayId ? program.days.find(d => d.id === dayId) : null;
                const isToday = wd === todayWd;
                return (
                  <button key={wd} onClick={() => cycleSchedule(wd)} className="pressable" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 7, borderRadius: 13, cursor: "pointer", textAlign: "left", background: day ? C.accentDim : C.card, border: `1px solid ${isToday ? C.accent : day ? C.accent + "44" : C.border}` }}>
                    <div style={{ width: 42, flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: day ? C.accent : C.muted }}>{label}</span>
                      {isToday && <div style={{ fontSize: 8.5, fontWeight: 800, color: C.accent, textTransform: "uppercase", letterSpacing: .5 }}>Today</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {day ? <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{day.label}</span>
                        : <span style={{ fontSize: 13.5, color: C.faint }}>Rest day</span>}
                    </div>
                    {day ? <Dumbbell size={15} color={C.accent} style={{ flexShrink: 0 }} /> : <span style={{ fontSize: 11, color: C.faint, flexShrink: 0 }}>tap to set</span>}
                  </button>
                );
              })}
              {Object.keys(sched).length > 0 && (
                <button onClick={() => setProgram(p => ({ ...p, schedule: {} }))} className="pressable" style={{ width: "100%", marginTop: 6, padding: "11px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Clear schedule</button>
              )}
            </div>
          </div>
        );
      })()}

      {/* program settings sheet */}
      {cfgSheet && (
        <div onClick={() => setCfgSheet(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 60, animation: "fadeIn .2s both" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Program settings</div>
              <button className="pressable" onClick={() => setCfgSheet(false)} style={iconBtn()}><X size={18} /></button>
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 16 }}>Changes re-balance your current exercises right away.</div>

            {program.config?.percentScheme && (
              <>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>Assistance work</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
                  {[
                    ["triumvirate", "Triumvirate", "Main lift + 2 targeted accessories"],
                    ["bbb", "Boring But Big", "Main lift + 5×10 supplemental @ 50%"],
                    ["jack_shit", "Jack Shit", "Main lift only — nothing else"],
                    [null, "Full accessories", "Main lift + a full slate of accessories"],
                  ].map(([v, label, sub]) => {
                    const on = (program.config.assistance ?? null) === v;
                    return (
                      <button key={label} onClick={() => setAssistance(v)} className="pressable" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: 12, border: `1px solid ${on ? C.accent : C.border}`, background: on ? C.accentDim : C.card, color: C.text, cursor: "pointer", textAlign: "left" }}>
                        <div style={{ width: 18, height: 18, borderRadius: 99, border: `2px solid ${on ? C.accent : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{on && <div style={{ width: 8, height: 8, borderRadius: 99, background: C.accent }} />}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{label}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>Barbell movements per session</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {[[null, "No limit"], [1, "1"], [2, "2"], [3, "3"]].map(([v, label]) => {
                const on = (program.config.barbellCap ?? null) === v;
                return <button key={label} onClick={() => applyConstraints({ barbellCap: v })} className="pressable" style={{ flex: 1, padding: "12px 4px", borderRadius: 11, cursor: "pointer", fontSize: 13, fontWeight: 800, border: `1px solid ${on ? C.accent : C.border}`, background: on ? C.accentDim : C.card, color: on ? C.accent : C.muted }}>{label}</button>;
              })}
            </div>

            <button onClick={() => applyConstraints({ noBodyweight: !program.config.noBodyweight })} className="pressable" style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", borderRadius: 12, border: `1px solid ${program.config.noBodyweight ? C.accent : C.border}`, background: program.config.noBodyweight ? C.accentDim : C.card, color: C.text, cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${program.config.noBodyweight ? C.accent : C.border}`, background: program.config.noBodyweight ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{program.config.noBodyweight && <Check size={14} color={C.accentText} />}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Skip bodyweight exercises</div>
                <div style={{ fontSize: 11.5, color: C.muted }}>Replace any bodyweight movements with loaded ones</div>
              </div>
            </button>
            <div style={{ fontSize: 11, color: C.faint, marginTop: 12, lineHeight: 1.5 }}>Tip: if no suitable loaded alternative exists for a slot, the original exercise is kept.</div>
          </div>
        </div>
      )}

      {/* transient confirmation toast */}
      {toast && (() => {
        const tmsg = typeof toast === "string" ? toast : toast.msg;
        const tundo = typeof toast === "object" ? toast.undo : null;
        return (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, display: "flex", justifyContent: "center", zIndex: 70, pointerEvents: "none", padding: "0 18px" }}>
            <div style={{ background: C.text, color: C.bg, fontSize: 13, fontWeight: 700, padding: "11px 16px", borderRadius: 12, maxWidth: "100%", boxShadow: "0 8px 24px rgba(0,0,0,.35)", animation: "fadeIn .18s both", display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tmsg}</span>
              {tundo && <button onClick={tundo} className="pressable" style={{ background: "none", border: "none", color: C.accent, fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0, padding: "0 2px" }}>Undo</button>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function WeekPill({ label, active, onClick, deload, dim }) {
  return (
    <button onClick={onClick} className="pressable" style={{
      flexShrink: 0, padding: "8px 16px", borderRadius: 99, fontSize: 13.5, fontWeight: 700, cursor: "pointer",
      border: `1.5px solid ${active ? (deload ? C.danger : C.accent) : C.border}`,
      background: active ? (deload ? C.dangerDim : C.accentDim) : "transparent",
      color: dim ? C.faint : active ? (deload ? C.danger : C.accent) : C.muted,
      opacity: dim ? 0.55 : 1,
    }}>{label}</button>
  );
}
function ExercisePickerSheet({ onPick, onClose, banned = [], title = "Add exercise" }) {
  const [q, setQ] = useState("");
  const [part, setPart] = useState("all");
  const list = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return EXERCISES.filter(e => (part === "all" || e.part === part) && (!ql || e.name.toLowerCase().includes(ql))).slice(0, 100);
  }, [q, part]);
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 75, animation: "fadeIn .2s both" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxHeight: "88%", display: "flex", flexDirection: "column", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 10, animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 12px" }} />
        <div style={{ padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
          <button className="pressable" onClick={onClose} style={iconBtn()}><X size={18} /></button>
        </div>
        <div style={{ padding: "0 18px", display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Search size={16} color={C.faint} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${EXERCISES.length} exercises…`} autoFocus style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.text, fontSize: 15 }} />
        </div>
        <div className="wpb-scroll" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "0 18px 10px" }}>
          {["all", ...PART_ORDER].map(p => (
            <button key={p} onClick={() => setPart(p)} className="pressable" style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 99, border: `1px solid ${part === p ? C.accent : C.border}`, background: part === p ? C.accent : C.card, color: part === p ? C.accentText : C.muted, fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize", whiteSpace: "nowrap" }}>{p === "all" ? "All" : PART_LABEL[p]}</button>
          ))}
        </div>
        <div className="wpb-scroll" style={{ flex: 1, overflowY: "auto", padding: "0 18px calc(env(safe-area-inset-bottom) + 20px)" }}>
          {list.map(e => (
            <button key={e.id} onClick={() => onPick(e.id)} className="pressable" style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", marginBottom: 7, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, cursor: "pointer", textAlign: "left", opacity: banned.includes(e.id) ? 0.5 : 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{e.name}{banned.includes(e.id) ? " · banned" : ""}</div>
                <div style={{ fontSize: 11.5, color: C.muted, textTransform: "capitalize" }}>{PART_LABEL[e.part]} · {e.type}</div>
              </div>
              <Plus size={16} color={C.accent} />
            </button>
          ))}
          {list.length === 0 && <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: "30px 0" }}>No exercises match.</div>}
        </div>
      </div>
    </div>
  );
}
function SwapSheet({ ex, alts, onPick, onBanCurrent, onClose, trend }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 50, animation: "fadeIn .2s both" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 16px calc(env(safe-area-inset-bottom) + 24px)", maxHeight: "75%", display: "flex", flexDirection: "column", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Swap exercise</div>
            <div style={{ fontSize: 13, color: C.muted }}>Replacing {ex.name}</div>
          </div>
          <button className="pressable" onClick={onClose} style={iconBtn()}><X size={18} /></button>
        </div>
        {trend && trend.pts.length >= 2 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "9px 12px", margin: "8px 0 2px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: .4, color: C.faint, textTransform: "uppercase" }}>Your est. 1RM trend</div>
              <div className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: trend.delta >= 0 ? C.accent : C.warn }}>{Math.round(trend.last.best)} {trend.unit} · {trend.delta >= 0 ? "+" : ""}{Math.round(trend.delta)}</div>
            </div>
            <Sparkline values={trend.pts} width={120} height={32} />
          </div>
        )}
        <button className="pressable" onClick={onBanCurrent} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "center", padding: "12px", borderRadius: 12, border: `1px solid ${C.dangerDim}`, background: C.dangerDim, color: C.danger, fontWeight: 700, cursor: "pointer", margin: "10px 0 6px" }}>
          <Ban size={16} /> Never use {ex.name} again
        </button>
        <div className="wpb-scroll" style={{ overflowY: "auto", marginTop: 6 }}>
          {alts.length === 0 && <div style={{ color: C.muted, textAlign: "center", padding: 24, fontSize: 14 }}>No other {PART_LABEL[ex.part]} exercises available with your equipment.</div>}
          {alts.map(a => (
            <button key={a.id} className="pressable opt" onClick={() => onPick(a.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, color: C.text, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: C.bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Dumbbell size={16} color={C.accent} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: C.faint }}>{a.type}{a.equip.length ? " · " + a.equip.map(q => EQUIPMENT.find(e => e.id === q)?.label || q).join(", ") : " · bodyweight"}</div>
              </div>
              <ChevronRight size={18} color={C.muted} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VolumeBars({ volume }) {
  const parts = PART_ORDER.filter(p => (volume[p] || 0) > 0.05);
  if (!parts.length) return <div style={{ fontSize: 12.5, color: C.muted, padding: "6px 2px" }}>No volume logged yet.</div>;
  return (
    <>
      {parts.map(p => {
        const v = volume[p];
        const { mev, mrv } = landmarkFor(p);
        const zone = volumeZone(p, v);
        const scale = Math.max(mrv * 1.1, v); // bar axis tops out a bit past MRV
        return (
          <div key={p} style={{ marginTop: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 12.5, marginBottom: 4 }}>
              <span style={{ color: C.text, fontWeight: 600 }}>{PART_LABEL[p]}</span>
              <span><span className="mono" style={{ color: zone.color, fontWeight: 700 }}>{fmtSets(v)}</span> <span style={{ fontSize: 10.5, color: C.faint }}>{zone.label}</span></span>
            </div>
            <div style={{ position: "relative", height: 9, borderRadius: 99, background: C.bg2, overflow: "hidden" }}>
              {/* productive band MEV→MRV */}
              <div style={{ position: "absolute", left: `${(mev / scale) * 100}%`, width: `${((mrv - mev) / scale) * 100}%`, top: 0, bottom: 0, background: C.accent, opacity: 0.13 }} />
              <div style={{ width: `${Math.min(100, (v / scale) * 100)}%`, height: "100%", background: zone.color, borderRadius: 99, transition: "width .3s", position: "relative" }} />
              {/* MEV / MRV ticks */}
              <div style={{ position: "absolute", left: `${(mev / scale) * 100}%`, top: -1, bottom: -1, width: 2, background: C.faint, opacity: 0.6 }} />
              <div style={{ position: "absolute", left: `${(mrv / scale) * 100}%`, top: -1, bottom: -1, width: 2, background: C.warn, opacity: 0.7 }} />
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 11, color: C.faint, marginTop: 12, lineHeight: 1.5 }}>
        Bars include fractional sets from compounds. The shaded band runs from <span style={{ color: C.muted }}>MEV</span> (minimum effective) to <span style={{ color: C.warn }}>MRV</span> (max recoverable) — staying inside it is the productive zone. Landmarks are population estimates and vary by individual.
      </div>
    </>
  );
}

function VolumeRampTable({ program }) {
  const weeks = weeksOf(program);
  const cols = [];
  for (let w = 1; w <= weeks; w++) cols.push({ w, label: `W${w}` });
  if (program.config.deload) cols.push({ w: weeks + 1, label: "DL" });
  const vols = cols.map(c => weeklyVolume(program, c.w));
  const parts = PART_ORDER.filter(p => vols.some(v => (v[p] || 0) > 0.05));
  const CW = 30;
  if (!parts.length) return null;
  return (
    <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.borderSoft}` }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 2 }}>Volume across the block</div>
      <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>Sets per muscle each week — color shows the MEV → MRV zone</div>
      <div className="wpb-scroll" style={{ overflowX: "auto" }}>
        <div style={{ display: "inline-block", minWidth: "100%" }}>
          <div style={{ display: "flex", marginBottom: 6 }}>
            <div style={{ width: 72, flexShrink: 0 }} />
            {cols.map(c => (<div key={c.w} style={{ width: CW, textAlign: "center", fontSize: 10, fontWeight: 800, color: c.label === "DL" ? C.muted : C.faint }}>{c.label}</div>))}
          </div>
          {parts.map(p => (
            <div key={p} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
              <div style={{ width: 72, flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 5 }}>{PART_LABEL[p]}</div>
              {cols.map((c, ci) => { const s = vols[ci][p] || 0; const z = volumeZone(p, s); return (
                <div key={c.w} style={{ width: CW, display: "flex", justifyContent: "center" }}>
                  <div className="mono" title={`${PART_LABEL[p]} · ${z.label}`} style={{ width: 25, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, background: `${z.color}22`, color: z.color }}>{fmtSets(s)}</div>
                </div>
              ); })}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 10.5, color: C.muted }}>
        {[["below MEV", C.muted], ["productive", C.accent], ["over MRV", C.warn]].map(([l, col]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: `${col}33`, border: `1px solid ${col}` }} />{l}</span>
        ))}
      </div>
    </div>
  );
}

function VolumeCard({ volume, program, open, onToggle }) {
  const parts = PART_ORDER.filter(p => (volume[p] || 0) > 0.05);
  const total = parts.reduce((s, p) => s + volume[p], 0);
  const flags = parts.filter(p => volumeZone(p, volume[p]).label !== "productive").length;
  return (
    <div style={{ marginBottom: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
      <button className="pressable" onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "none", border: "none", color: C.text, cursor: "pointer", textAlign: "left" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: C.bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <BarChart3 size={17} color={C.accent} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15.5, fontWeight: 800 }}>Weekly volume</div>
          <div style={{ fontSize: 12, color: C.muted }}>{fmtSets(total)} sets · {parts.length} muscles{flags ? ` · ${flags} outside MEV–MRV` : " · all in range"}</div>
        </div>
        <ChevronDown size={20} color={C.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && <div style={{ padding: "0 16px 14px" }}><VolumeBars volume={volume} />{program && <VolumeRampTable program={program} />}</div>}
    </div>
  );
}

function AddSheet({ parts, usedIds = [], onPick, onAddById, onCreate, onClose }) {
  const [mode, setMode] = useState("pick"); // pick | create
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [part, setPart] = useState("chest");
  const [type, setType] = useState("compound");
  const [equip, setEquip] = useState(["dumbbell"]);
  const [lo, setLo] = useState("8");
  const [hi, setHi] = useState("12");
  const toggleEquip = (id) => setEquip(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id]);
  const valid = name.trim() && Number(lo) > 0 && Number(hi) >= Number(lo);
  const save = () => {
    if (!valid) return;
    onCreate({ name: name.trim(), part, type, equip, rep: [Math.round(Number(lo)), Math.round(Number(hi))] });
  };
  const used = new Set(usedIds);
  const results = q.trim().length >= 2
    ? EXERCISES.filter(e => !used.has(e.id) && e.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 30)
    : [];
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 50, animation: "fadeIn .2s both" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 16px calc(env(safe-area-inset-bottom) + 24px)", maxHeight: "82%", display: "flex", flexDirection: "column", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{mode === "pick" ? "Add exercise" : "Create exercise"}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{mode === "pick" ? "Search any lift, or pick a muscle" : "Build your own movement"}</div>
          </div>
          <button className="pressable" onClick={onClose} style={iconBtn()}><X size={18} /></button>
        </div>

        {mode === "pick" ? (
          <div className="wpb-scroll" style={{ overflowY: "auto" }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search  exercises…`} autoFocus
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 14.5, marginBottom: 12 }} />
            {q.trim().length >= 2 ? (
              results.length ? results.map(e => (
                <button key={e.id} className="pressable opt" onClick={() => onAddById(e.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "11px 13px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, color: C.text, cursor: "pointer", marginBottom: 7 }}>
                  <PlusCircle size={16} color={C.accent} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                    <div style={{ fontSize: 11.5, color: C.muted }}>{PART_LABEL[e.part]} · {e.type}{e.custom ? " · custom" : ""}</div>
                  </div>
                </button>
              )) : <div style={{ color: C.muted, textAlign: "center", padding: "14px 0", fontSize: 13.5 }}>No matches. Try another term or create a custom exercise.</div>
            ) : (
              <>
                <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", margin: "2px 2px 8px" }}>Add a fitting movement by muscle</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  {parts.length === 0 && <div style={{ color: C.muted, textAlign: "center", padding: "10px 0 8px", fontSize: 13.5, width: "100%" }}>No more stock exercises for this day with your equipment — search above or create one.</div>}
                  {parts.map(p => (
                    <button key={p} className="pressable opt" onClick={() => onPick(p)} style={{ padding: "12px 16px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, color: C.text, cursor: "pointer", fontSize: 14.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
                      <PlusCircle size={15} color={C.accent} /> {PART_LABEL[p]}
                    </button>
                  ))}
                </div>
              </>
            )}
            <button className="pressable" onClick={() => setMode("create")} style={{ width: "100%", marginTop: 12, padding: "13px", borderRadius: 12, border: `1px dashed ${C.accent}66`, background: "none", color: C.accent, cursor: "pointer", fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Pencil size={15} /> Create custom exercise
            </button>
          </div>
        ) : (
          <div className="wpb-scroll" style={{ overflowY: "auto" }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Exercise name" autoFocus
              style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 15.5, fontWeight: 700, marginBottom: 14 }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: C.faint, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7 }}>Muscle</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
              {PART_ORDER.map(p => (
                <button key={p} onClick={() => setPart(p)} className="pressable" style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${part === p ? C.accent : C.border}`, background: part === p ? C.accentDim : C.card, color: part === p ? C.accent : C.muted, cursor: "pointer", fontSize: 12.5, fontWeight: 700 }}>{PART_LABEL[p]}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.faint, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7 }}>Type</div>
                <div style={{ display: "flex", background: C.card, borderRadius: 10, padding: 3, border: `1px solid ${C.border}` }}>
                  {["compound", "isolation"].map(t => (
                    <button key={t} onClick={() => setType(t)} className="pressable" style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: type === t ? C.accent : "transparent", color: type === t ? C.accentText : C.muted }}>{t[0].toUpperCase() + t.slice(1)}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.faint, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7 }}>Rep range</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input inputMode="numeric" value={lo} onChange={e => setLo(e.target.value)} className="mono" style={{ width: 48, padding: "9px 4px", textAlign: "center", borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 15, fontWeight: 700 }} />
                  <span style={{ color: C.faint }}>–</span>
                  <input inputMode="numeric" value={hi} onChange={e => setHi(e.target.value)} className="mono" style={{ width: 48, padding: "9px 4px", textAlign: "center", borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 15, fontWeight: 700 }} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.faint, letterSpacing: .5, textTransform: "uppercase", marginBottom: 7 }}>Equipment</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
              {EQUIPMENT.map(eq => (
                <button key={eq.id} onClick={() => toggleEquip(eq.id)} className="pressable" style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${equip.includes(eq.id) ? C.accent : C.border}`, background: equip.includes(eq.id) ? C.accentDim : C.card, color: equip.includes(eq.id) ? C.accent : C.muted, cursor: "pointer", fontSize: 12.5, fontWeight: 700 }}>{eq.label}</button>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: C.faint, marginBottom: 14 }}>Leave equipment empty for bodyweight. Custom lifts work everywhere — generation, swaps, suggestions, and progress charts.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="pressable" onClick={() => setMode("pick")} style={{ flex: 1, padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.muted, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Back</button>
              <button className="pressable" onClick={save} disabled={!valid} style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", background: valid ? C.accent : C.card, color: valid ? C.accentText : C.faint, cursor: valid ? "pointer" : "default", fontSize: 14.5, fontWeight: 800 }}>Add to workout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== ACTIVE WORKOUT ============================== */
const repsLow = (s) => String(s).includes("-") ? String(s).split("-")[0] : String(s);
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ac = new Ctx();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.value = 880;
    g.gain.value = 0.06;
    o.connect(g); g.connect(ac.destination);
    o.start();
    o.frequency.setValueAtTime(660, ac.currentTime + 0.12);
    setTimeout(() => { o.stop(); ac.close(); }, 260);
  } catch (e) { /* no audio */ }
}
const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Schematic movement illustrations (simple line silhouettes) for the exercise info sheet.
function ExerciseFigure({ ex, height = 116 }) {
  const A = C.accent, M = C.faint;
  const S = { fill: "none", stroke: A, strokeWidth: 3.2, strokeLinecap: "round", strokeLinejoin: "round" };
  const T = { fill: "none", stroke: M, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
  const plate = (x, y) => <rect x={x - 2.5} y={y - 9} width="5" height="18" rx="2" {...S} />;
  const db = (x, y) => <g {...S}><rect x={x - 7} y={y - 3.5} width="4" height="7" rx="1.5" /><line x1={x - 4} y1={y} x2={x + 4} y2={y} /><rect x={x + 3} y={y - 3.5} width="4" height="7" rx="1.5" /></g>;
  const ground = <line x1="14" y1="90" x2="106" y2="90" {...T} />;
  const p = movePattern(ex);
  // animated motion cue: position + direction of the working rep
  const ARR = {
    press: [62, 30, "up"], overhead: [60, 12, "up"], pulldown: [60, 30, "down"],
    row: [40, 50, "down"], hinge: [60, 52, "down"], squat: [80, 52, "down"],
    legext: [90, 54, "up"], legcurl: [88, 60, "down"], hipthrust: [66, 44, "up"],
    curl: [72, 40, "up"], triceps: [60, 56, "down"], ab: [72, 58, "up"],
    shrug: [60, 40, "up"], calf: [60, 40, "up"],
  };
  const arr = ARR[p];
  const F = {
    press: <>{<line x1="22" y1="64" x2="98" y2="64" {...T} />}<circle cx="34" cy="57" r="6" {...S} /><path d="M40 60 H74" {...S} /><path d="M74 60 l9 -3" {...S} /><path d="M58 60 V42 M66 60 V42" {...S} /><line x1="48" y1="40" x2="80" y2="40" {...S} />{plate(48, 40)}{plate(80, 40)}</>,
    fly: <>{<line x1="22" y1="64" x2="98" y2="64" {...T} />}<circle cx="34" cy="57" r="6" {...S} /><path d="M40 60 H74" {...S} /><path d="M74 60 l9 -3" {...S} /><path d="M56 60 Q44 50 40 40 M64 60 Q76 50 80 40" {...S} />{db(40, 39)}{db(80, 39)}</>,
    overhead: <>{ground}<circle cx="60" cy="20" r="7" {...S} /><path d="M60 27 V58" {...S} /><path d="M60 58 l-9 30 M60 58 l9 30" {...S} /><path d="M60 33 L46 18 M60 33 L74 18" {...S} /><line x1="40" y1="15" x2="80" y2="15" {...S} />{plate(40, 15)}{plate(80, 15)}</>,
    lateral: <>{ground}<circle cx="60" cy="22" r="7" {...S} /><path d="M60 29 V60" {...S} /><path d="M60 60 l-9 28 M60 60 l9 28" {...S} /><path d="M60 36 H40 M60 36 H80" {...S} />{db(38, 36)}{db(82, 36)}</>,
    overheadx: null,
    pulldown: <>{<line x1="30" y1="14" x2="90" y2="14" {...S} />}{plate(30, 14)}{plate(90, 14)}<path d="M50 14 L56 36 M70 14 L64 36" {...S} /><circle cx="60" cy="42" r="7" {...S} /><path d="M60 49 V74" {...S} /><path d="M60 74 l-8 16 M60 74 l8 16" {...S} /></>,
    row: <>{ground}<circle cx="36" cy="34" r="6" {...S} /><path d="M40 38 Q60 44 78 40" {...S} /><path d="M78 40 V86" {...S} /><path d="M70 62 L78 56 M70 62 L62 56" {...S} /><path d="M62 56 V40" {...S} />{plate(62, 38)}{plate(62, 58)}</>,
    hinge: <>{ground}<circle cx="40" cy="30" r="6" {...S} /><path d="M44 33 Q62 40 80 38" {...S} /><path d="M80 38 L84 86" {...S} /><path d="M80 38 L60 64" {...S} /><path d="M60 64 V86" {...S} /><line x1="52" y1="66" x2="68" y2="66" {...S} />{plate(52, 66)}{plate(68, 66)}</>,
    squat: <>{ground}<circle cx="60" cy="22" r="7" {...S} /><path d="M60 29 V52" {...S} /><path d="M60 52 L48 66 L52 88 M60 52 L72 66 L68 88" {...S} /><line x1="44" y1="34" x2="76" y2="34" {...S} />{plate(44, 34)}{plate(76, 34)}<path d="M60 36 L48 34 M60 36 L72 34" {...S} /></>,
    legext: <>{<path d="M30 40 H86 V78 H30 Z" {...T} />}<circle cx="44" cy="34" r="6" {...S} /><path d="M44 40 V58 H66" {...S} /><path d="M66 58 L84 48" {...S} /><line x1="84" y1="48" x2="84" y2="60" {...S} /></>,
    legcurl: <>{<path d="M30 36 H86 V72 H30 Z" {...T} />}<circle cx="44" cy="30" r="6" {...S} /><path d="M44 36 V52 H68" {...S} /><path d="M68 52 L82 64" {...S} /><line x1="82" y1="58" x2="82" y2="70" {...S} /></>,
    hipthrust: <>{ground}<path d="M30 70 L52 50" {...T} />{/* bench */}<circle cx="34" cy="50" r="6" {...S} /><path d="M40 52 L66 60" {...S} /><path d="M66 60 L84 60 M66 60 L72 82" {...S} /><line x1="58" y1="50" x2="74" y2="50" {...S} />{plate(58, 50)}{plate(74, 50)}<path d="M66 60 V52" {...S} /></>,
    curl: <>{ground}<circle cx="60" cy="22" r="7" {...S} /><path d="M60 29 V60" {...S} /><path d="M60 60 l-8 28 M60 60 l8 28" {...S} /><path d="M60 35 L52 52 L62 46" {...S} />{db(64, 44)}<path d="M60 35 L70 50" {...S} /></>,
    triceps: <>{<line x1="34" y1="24" x2="86" y2="24" {...S} />}{/* cable top */}<circle cx="60" cy="40" r="7" {...S} /><path d="M60 47 V74" {...S} /><path d="M60 74 l-8 14 M60 74 l8 14" {...S} /><path d="M56 50 L52 64 M64 50 L68 64" {...S} /><path d="M52 30 V64 M68 30 V64" {...T} /></>,
    ab: <>{<line x1="20" y1="78" x2="100" y2="78" {...T} />}<path d="M30 78 Q40 60 58 58" {...S} /><circle cx="64" cy="54" r="6" {...S} /><path d="M58 60 L78 78" {...S} /><path d="M58 60 L46 50" {...S} /></>,
    shrug: <>{ground}<circle cx="60" cy="22" r="7" {...S} /><path d="M60 29 V58" {...S} /><path d="M60 58 l-8 30 M60 58 l8 30" {...S} /><path d="M60 33 V52 M48 36 V54 M72 36 V54" {...S} />{db(44, 56)}{db(76, 56)}</>,
    calf: <>{ground}<circle cx="60" cy="22" r="7" {...S} /><path d="M60 29 V56" {...S} /><path d="M60 56 L52 84 M60 56 L68 84" {...S} /><path d="M60 36 V54 M50 40 V54 M70 40 V54" {...S} />{db(46, 56)}{db(74, 56)}<path d="M48 84 h8 M64 84 h8" {...S} /></>,
    generic: <>{ground}<circle cx="60" cy="22" r="7" {...S} /><path d="M60 29 V58" {...S} /><path d="M60 58 l-8 30 M60 58 l8 30" {...S} /><path d="M60 34 L46 52 M60 34 L74 52" {...S} />{db(44, 54)}{db(76, 54)}</>,
  };
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: "10px 0", marginBottom: 14, display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 120 96" style={{ height, width: "auto" }} aria-hidden="true">
        {F[p] || F.generic}
        {arr && (
          <path className={arr[2] === "up" ? "exarr-up" : "exarr-down"} d={arr[2] === "up" ? `M${arr[0]} ${arr[1]} l-5 7 h10 z` : `M${arr[0]} ${arr[1]} l-5 -7 h10 z`} fill={C.accent} opacity="0.85" />
        )}
      </svg>
    </div>
  );
}

function WorkoutSession({ program, day: rawDay, weekIndex, unit, setUnit, perf, onExit, onFinish, onSaveRoutine, onBan, banned = [], history = [], loadMode = "rir", onEditHistory, goals = {}, onSetGoal, restAutoStart = true, restScale = 1 }) {
  // Resilient to a removed/unknown exercise id lingering in a saved program: drop it cleanly.
  const day = useMemo(() => (
    rawDay.exercises.every(id => EX_BY_ID[id]) ? rawDay : { ...rawDay, exercises: rawDay.exercises.filter(id => EX_BY_ID[id]) }
  ), [rawDay]);
  const [histEdit, setHistEdit] = useState(null); // { histId, exId, w, r }
  const [goalEdit, setGoalEdit] = useState(null); // { exId, w }
  const trendById = useMemo(() => Object.fromEntries(exerciseTrends(history).map(t => [t.id, t])), [history]);
  // Per-occurrence performance: the previous weight for an exercise is taken from the most
  // recent session of THIS day, so e.g. bench done fresh on one day and pre-fatigued on
  // another each progress on their own loads. Falls back to global perf for never-here lifts.
  const dayPerf = useMemo(() => {
    const out = {};
    day.exercises.forEach(id => {
      for (const h of history) {
        if (h.dayId === day.id && h.perf && h.perf[id] && h.perf[id].weight > 0) { out[id] = h.perf[id]; break; }
      }
      if (!out[id] && perf && perf[id]) out[id] = perf[id];
    });
    return out;
  }, [history, day, perf]);
  const suggestions = useMemo(() => day.exercises.map((id, slot) => {
    const ex = EX_BY_ID[id];
    const isP = slot === day.primaryIndex;
    const tRIR = parseRIRNum(computeCell(program, day, id, slot, weekIndex).rir);
    return suggestWeight(dayPerf, ex, repRange(program.config.goal, ex, isP), unit, tRIR);
  }), [day, program, dayPerf, unit, weekIndex]);

  const buildSets = (ex, slot, sug, withWarm) => {
    const isP = slot === day.primaryIndex;
    // Percentage-of-Training-Max scheme (5/3/1, Madcow): the day's main lift follows a weekly wave
    const scheme = program.config?.percentScheme;
    const tm = program.trainingMax?.[ex.id];
    if (scheme && isP && tm > 0) {
      const pct = pctSetsFor(scheme, tm, weekIndex, weeksOf(program), unit, ex);
      if (pct) {
        const sets = [];
        const plan = withWarm ? warmupPlan(ex, true) : null;
        if (plan) plan.pct.forEach((p, i) => {
          const w = roundTo(pct.sets[0].weight * 0.85 * p, loadStep(ex, unit));
          sets.push({ weight: String(w), reps: String(plan.reps[i]), warm: true, done: false, target: { w: String(w), reps: String(plan.reps[i]) } });
        });
        pct.sets.forEach(s => {
          const reps = repsLow(s.reps);
          sets.push({ weight: String(s.weight), reps, warm: false, done: false, auto: true, target: { w: String(s.weight), reps: s.reps, pct: Math.round(s.pct * 100), amrap: s.amrap } });
        });
        // Boring But Big: 5×10 supplemental sets of the same lift at ~50% of Training Max
        if (program.config?.assistance === "bbb" && weekIndex <= weeksOf(program)) {
          const bw = roundTo(tm * 0.5, loadStep(ex, unit));
          for (let i = 0; i < 5; i++) sets.push({ weight: String(bw), reps: "10", warm: false, done: false, auto: true, bbb: true, target: { w: String(bw), reps: "10", pct: 50 } });
        }
        return sets;
      }
    }
    const cell = computeCell(program, day, ex.id, slot, weekIndex);
    const n = Number(cell.sets) || 3;
    const work = sug ? sug.weight : null;
    const wStr = work != null ? String(work) : "";
    const sets = [];
    const weeks = weeksOf(program);
    const plan = withWarm && weekIndex <= weeks ? warmupPlan(ex, isP) : null;
    if (plan) plan.pct.forEach((pct, i) => {
      const w = work != null ? roundTo(work * pct, loadStep(ex, unit)) : null;
      const ws = w != null ? String(w) : "";
      sets.push({ weight: ws, reps: String(plan.reps[i]), warm: true, done: false, target: { w: ws, reps: String(plan.reps[i]) } });
    });
    for (let i = 0; i < n; i++) {
      const isLast = i === n - 1;
      // last working set is taken closer to failure; on the peak (final loading) week it's a
      // true to-failure / AMRAP set — the "Failure" set type in evidence-based programs
      const failure = isLast && !isP && weekIndex === weeks;
      const baseR = parseRIRNum(cell.rir);
      const rir = isLast && !failure && weekIndex <= weeks ? String(Math.max(0, Math.round(baseR) - 1)) : cell.rir;
      sets.push({ weight: wStr, reps: repsLow(cell.reps), warm: false, done: false, auto: true, target: { w: wStr, reps: failure ? `${repsLow(cell.reps)}+` : cell.range, rir: failure ? null : rir, failure } });
    }
    return sets;
  };

  const [data, setData] = useState(() => day.exercises.map((id, slot) =>
    ({ id, slot, sets: buildSets(EX_BY_ID[id], slot, suggestions[slot], true), note: "", superset: !!program.ss?.[`${day.id}:${slot}`] })));
  const [exIdx, setExIdx] = useState(0);
  const [info, setInfo] = useState(false);
  const [swap, setSwap] = useState(false);
  const [addEx, setAddEx] = useState(false);
  const [showWarmup, setShowWarmup] = useState(true);
  const [copiedRecap, setCopiedRecap] = useState(false);
  const [readiness, setReadiness] = useState(null); // {label, factor} once answered
  const [feedback, setFeedback] = useState({}); // part -> -1 | 0 | 1 (next-block volume nudge)
  const [rest, setRest] = useState(0);
  const [restMax, setRestMax] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [calc, setCalc] = useState(false);
  const [, forceTick] = useState(0);
  const startRef = useRef(Date.now());
  const prevRest = useRef(0);
  const [prFlash, setPrFlash] = useState(null);
  const [snack, setSnack] = useState(null); // { msg, undo } for in-session undo
  useEffect(() => { if (!snack) return; const t = setTimeout(() => setSnack(null), 4500); return () => clearTimeout(t); }, [snack]);
  const flashSnack = (msg, snapData, snapIdx) => setSnack({ msg, undo: () => { setData(snapData); setExIdx(snapIdx); setSnack(null); } });
  const prHitRef = useRef(new Set());
  const prFlashTimer = useRef(null);
  // all-time best estimated 1RM per exercise BEFORE this session (this session isn't in history yet)
  const prBaseline = useMemo(() => {
    const m = {};
    (history || []).forEach(h => Object.entries(h.perf || {}).forEach(([id, p]) => {
      const sets = (p.sets && p.sets.length) ? p.sets : [{ w: p.weight, r: p.reps }];
      sets.forEach(s => { if (s.w > 0 && s.r > 0) { const e = e1rm(s.w, s.r); if (e > (m[id] || 0)) m[id] = e; } });
    }));
    return m;
  }, [history]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setRest(r => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [paused]);
  useEffect(() => { const t = setInterval(() => forceTick(n => n + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (prevRest.current > 0 && rest === 0) beep();
    prevRest.current = rest;
  }, [rest]);

  const toggleWarmups = (ei) => setData(d => d.map((e, i) => {
    if (i !== ei) return e;
    const hasWarm = e.sets.some(s => s.warm);
    if (hasWarm) return { ...e, sets: e.sets.filter(s => !s.warm) };
    const ex = EX_BY_ID[e.id];
    const plan = warmupPlan(ex, e.slot === day.primaryIndex);
    if (!plan) return e;
    const work = parseFloat(workOnly(e)[0]?.weight) || (suggestions[ei] ? suggestions[ei].weight : null);
    const warm = plan.pct.map((pct, k) => {
      const w = work ? roundTo(work * pct, loadStep(ex, unit)) : null;
      const ws = w != null ? String(w) : "";
      return { weight: ws, reps: String(plan.reps[k]), warm: true, done: false, target: { w: ws, reps: String(plan.reps[k]) } };
    });
    return { ...e, sets: [...warm, ...e.sets] };
  }));

  const workOnly = (e) => e.sets.filter(x => !x.warm && !x.sub);
  const totalSets = data.reduce((s, e) => s + workOnly(e).length, 0);
  const doneSets = data.reduce((s, e) => s + workOnly(e).filter(x => x.done).length, 0);
  const volume = data.reduce((sum, e) =>
    sum + e.sets.reduce((s, x) => s + (x.done && !x.warm ? (parseFloat(x.weight) || 0) * (parseInt(x.reps) || 0) : 0), 0), 0);

  // sanitize numeric entry: keep digits (+ one decimal for weight), strip pasted junk, clamp absurd values
  const cleanWeight = (v) => {
    let s = String(v).replace(/[^0-9.]/g, "");
    const i = s.indexOf(".");
    if (i !== -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, "");
    if (parseFloat(s) > 2000) s = "2000";
    return s;
  };
  const cleanReps = (v) => {
    let s = String(v).replace(/[^0-9]/g, "");
    if (parseInt(s) > 100) s = "100";
    return s;
  };
  const editSet = (ei, si, field, val) => setData(d => d.map((e, i) => i !== ei ? e :
    { ...e, sets: e.sets.map((s, j) => j !== si ? s : { ...s, [field]: field === "reps" ? cleanReps(val) : val }) }));
  // user typing a weight takes manual control of that set (and clears any auto hint)
  const editWeight = (ei, si, val) => setData(d => d.map((e, i) => i !== ei ? e :
    { ...e, sets: e.sets.map((s, j) => j !== si ? s : { ...s, weight: cleanWeight(val), auto: false, hint: undefined }) }));

  // Add an exercise to this session on the fly (freestyle logging + extending a program workout)
  const addExerciseToSession = (id) => {
    const ex = EX_BY_ID[id]; if (!ex) return;
    const slot = data.length;
    setData(d => [...d, { id, slot, sets: buildSets(ex, slot, suggestWeight(perf, ex, repRange(program.config.goal, ex, false), unit), true), note: "", superset: false, added: true }]);
    setExIdx(slot);
    setAddEx(false);
  };
  const removeExerciseFromSession = (ei) => {
    const snap = data, snapIdx = exIdx, nm = EX_BY_ID[data[ei]?.id]?.name || "exercise";
    setData(d => d.filter((_, i) => i !== ei));
    setExIdx(i => Math.max(0, i >= ei && i > 0 ? i - 1 : i));
    flashSnack(`Removed ${nm}`, snap, snapIdx);
  };
  const moveExerciseInSession = (ei, dir) => {
    const j = ei + dir;
    if (j < 0 || j >= data.length) return;
    const snap = data, snapIdx = exIdx;
    setData(d => { const nd = [...d]; const t = nd[ei]; nd[ei] = nd[j]; nd[j] = t; return nd; });
    setExIdx(j);
    flashSnack("Reordered", snap, snapIdx);
  };

  const toggleDone = (ei, si) => {
    const ex = EX_BY_ID[data[ei].id];
    const set = data[ei].sets[si];
    const wasDone = set.done;
    if (!wasDone && !(doneSets + 1 >= totalSets) && restAutoStart) {
      const base = set.warm ? 45 : data[ei].superset ? 30 : (data[ei].restCustom > 0 ? data[ei].restCustom : restSec(program.config.goal, ex, data[ei].slot === day.primaryIndex));
      const r = Math.max(10, Math.round(base * restScale));
      setRestMax(r); setRest(r); setPaused(false);
    }
    setData(d => d.map((e, i) => {
      if (i !== ei) return e;
      let sets = e.sets.map((s, j) => j === si ? { ...s, done: !wasDone, hint: undefined } : s);
      // on completing a working set, estimate & prefill the next undone working set
      if (!wasDone && !set.warm && !set.sub) {
        const W = parseFloat(set.weight), R = parseInt(set.reps);
        if (W > 0 && R > 0) {
          // live PR flash: this set's estimated 1RM beats the all-time best for this lift
          const est = e1rm(W, R);
          if (est > (prBaseline[e.id] || 0) && !prHitRef.current.has(e.id) && (history || []).length > 0) {
            prHitRef.current.add(e.id);
            setPrFlash({ name: ex.name, est, w: W, r: R });
            try { beep(); setTimeout(beep, 160); } catch {}
            if (prFlashTimer.current) clearTimeout(prFlashTimer.current);
            prFlashTimer.current = setTimeout(() => setPrFlash(null), 3200);
          }
          sets = computeNextPrefill(sets, si, ex, e.slot, set.actualRIR);
        }
      }
      return { ...e, sets };
    }));
  };
  // recompute the next undone working set's suggestion from set `si`'s logged weight/reps at the given actual RIR
  const computeNextPrefill = (sets, si, ex, slot, rirActual) => {
    const set = sets[si];
    const W = parseFloat(set.weight), R = parseInt(set.reps);
    if (!(W > 0) || !(R > 0)) return sets;
    const cell = computeCell(program, day, ex.id, slot, weekIndex);
    const [lo, hi] = String(cell.range).split("-").map(Number);
    const rirTarget = parseRIRNum(cell.rir);
    const sug = (lo > 0 && hi >= lo) ? nextSetWeight(W, R, rirActual != null ? rirActual : rirTarget, rirTarget, lo, hi, ex, unit) : null;
    if (!sug) return sets;
    const ni = sets.findIndex((s, j) => j > si && !s.warm && !s.sub && !s.done && s.auto !== false);
    if (ni < 0) return sets;
    return sets.map((s, j) => j === ni
      ? { ...s, target: { ...s.target, w: sug.weight, reps: sug.target }, weight: String(sug.weight), reps: String(sug.target), hint: sug.dir === "hold" ? undefined : sug.dir, over: !!sug.over }
      : s);
  };
  // record actual reps-in-reserve for a completed set and re-tune the next set's prescription
  const setRestCustom = (ei, sec) => setData(d => d.map((e, i) => i === ei ? { ...e, restCustom: sec > 0 ? sec : 0 } : e));
  const setActualRIR = (ei, si, rir) => setData(d => d.map((e, i) => {
    if (i !== ei) return e;
    const ex = EX_BY_ID[e.id];
    let sets = e.sets.map((s, j) => j === si ? { ...s, actualRIR: rir } : s);
    sets = computeNextPrefill(sets, si, ex, e.slot, rir);
    return { ...e, sets };
  }));
  const addSetRow = (ei) => setData(d => d.map((e, i) => i !== ei ? e :
    { ...e, sets: [...e.sets, { ...(e.sets[e.sets.length - 1] || { weight: "", reps: "" }), warm: false, done: false, auto: true, hint: undefined }] }));
  // mark every remaining set of the current exercise done (using its prefilled targets)
  const completeRemaining = (ei) => setData(d => d.map((e, i) => i !== ei ? e :
    { ...e, sets: e.sets.map(s => {
      if (s.done) return s;
      const reps = s.reps && parseInt(s.reps) > 0 ? s.reps : repsLow(s.target?.reps || s.reps || "");
      return { ...s, done: true, hint: undefined, reps: reps || s.reps };
    }) }));
  const editNote = (ei, val) => setData(d => d.map((e, i) => i !== ei ? e : { ...e, note: val }));

  // advanced set types: drop set (strip load, rep out) & myo-reps (activation + minis)
  const addAdvanced = (ei, kind) => setData(d => d.map((e, i) => {
    if (i !== ei) return e;
    const ex = EX_BY_ID[e.id];
    const work = e.sets.filter(s => !s.warm && !s.sub);
    const baseW = parseFloat(work[work.length - 1]?.weight) || (suggestions[ei] ? suggestions[ei].weight : 0);
    const step = loadStep(ex, unit);
    let extra;
    if (kind === "drop") {
      extra = [0.8, 0.6].map(f => {
        const w = baseW ? roundTo(baseW * f, step) : null;
        return { weight: w != null ? String(w) : "", reps: "", warm: false, sub: true, kind: "drop", done: false, target: { w: w != null ? String(w) : "—", reps: "to failure" } };
      });
    } else {
      extra = [0, 1, 2].map(() => ({ weight: baseW ? String(baseW) : "", reps: "5", warm: false, sub: true, kind: "myo", done: false, target: { w: baseW ? String(baseW) : "—", reps: "3-5" } }));
    }
    return { ...e, sets: [...e.sets, ...extra] };
  }));
  const toggleSuperset = (ei) => setData(d => d.map((e, i) => i === ei && ei < d.length - 1 ? { ...e, superset: !e.superset } : e));

  // readiness check-in: scale the day's suggested loads up/down before training
  const applyReadiness = (label, factor) => {
    setReadiness({ label, factor });
    if (factor !== 1) setData(d => d.map(e => {
      const step = loadStep(EX_BY_ID[e.id], unit);
      return { ...e, sets: e.sets.map(s => {
        if (s.done || s.auto === false || !(parseFloat(s.weight) > 0)) return s;
        const w = String(Math.max(step, roundTo(parseFloat(s.weight) * factor, step)));
        return { ...s, weight: w, target: { ...s.target, w } };
      }) };
    }));
  };

  // ----- exercise navigation: pills, swipe, prev/next (with directional slide) -----
  const [slideDir, setSlideDir] = useState("l");
  const goEx = (idx) => { const t = clamp(idx, 0, data.length - 1); setSlideDir(t >= exIdx ? "l" : "r"); setExIdx(t); setInfo(false); };
  const touch = useRef(null);
  const onTouchStart = (ev) => { const t = ev.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (ev) => {
    if (!touch.current) return;
    const t = ev.changedTouches[0];
    const dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) goEx(exIdx + (dx < 0 ? 1 : -1));
  };

  // ----- swap the current exercise for the session only -----
  const doSwap = (newId) => {
    const ei = exIdx, slot = data[ei].slot;
    if (data.some((x, i) => i !== ei && x.id === newId)) { setSwap(false); return; } // no duplicates
    const newEx = EX_BY_ID[newId];
    const isP = slot === day.primaryIndex;
    const sug = suggestWeight(perf, newEx, repRange(program.config.goal, newEx, isP), unit);
    const keepWarm = data[ei].sets.some(s => s.warm);
    const snap = data, snapIdx = exIdx;
    setData(d => d.map((e, i) => i !== ei ? e : { id: newId, slot, sets: buildSets(newEx, slot, sug, keepWarm), note: "" }));
    setSwap(false);
    flashSnack(`Swapped in ${newEx.name}`, snap, snapIdx);
  };

  const finish = () => {
    const perfOut = {};
    data.forEach(e => {
      const s = summarizeSets(e.sets);
      const note = e.note.trim() || (perf[e.id] && perf[e.id].note) || undefined;
      if (s) {
        const logged = e.sets.filter(x => x.done && !x.warm && parseFloat(x.weight) > 0 && parseInt(x.reps) > 0)
          .map(x => ({ w: parseFloat(x.weight), r: parseInt(x.reps), ...(x.actualRIR != null ? { rir: x.actualRIR } : {}) }));
        perfOut[e.id] = { weight: s.weight, reps: s.reps, date: Date.now(), sets: logged, note };
      }
    });
    onFinish({
      programId: program.id, programName: program.name, dayLabel: day.label, dayId: day.id,
      setsDone: doneSets, totalSets, volume: Math.round(volume), unit,
      durationMin: Math.max(1, Math.round((Date.now() - startRef.current) / 60000)),
      perf: perfOut,
      feedback,
    });
  };

  const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
  const fmtEl = `${Math.floor(elapsed / 3600)}:${String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* top bar */}
      <div style={{ padding: "14px 14px 10px", borderBottom: `1px solid ${C.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => (doneSets > 0 ? setConfirmExit(true) : onExit())} className="pressable" style={{ background: "none", border: "none", color: C.text, cursor: "pointer", padding: 4 }}><X size={23} /></button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.muted, fontSize: 13 }}>
            <Clock size={14} /> <span className="mono" style={{ fontWeight: 700, color: C.text }}>{fmtEl}</span>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setCalc(true)} className="pressable" title="Plate calculator" style={{ ...iconBtn(), width: 34, height: 34 }}><Dumbbell size={16} /></button>
          <button onClick={() => setFinishing(true)} className="pressable" style={{ ...iconBtn(), width: "auto", padding: "0 13px", gap: 6, background: C.accent, borderColor: C.accent, color: C.accentText, fontWeight: 800, fontSize: 13.5 }}><CheckCircle2 size={16} /> Finish</button>
        </div>
        <div style={{ marginTop: 10, height: 6, borderRadius: 99, background: C.bg2, overflow: "hidden" }}>
          <div style={{ width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%`, height: "100%", background: C.accent, borderRadius: 99, transition: "width .3s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 5 }}>
          <span>{doneSets} / {totalSets} sets · ex {exIdx + 1}/{data.length}{readiness && readiness.factor < 1 ? ` · ${readiness.label} −${Math.round((1 - readiness.factor) * 100)}%` : ""}</span>
          <span className="mono">{Math.round(volume).toLocaleString()} {unit}</span>
        </div>
        {/* exercise navigator */}
        <div className="wpb-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 11, paddingBottom: 2 }}>
          {data.map((e, i) => {
            const exDone = workOnly(e).length > 0 && workOnly(e).every(s => s.done);
            const on = i === exIdx;
            return (
              <button key={i} onClick={() => goEx(i)} className="pressable" style={{
                flexShrink: 0, minWidth: 38, height: 38, padding: "0 8px", borderRadius: 11, cursor: "pointer",
                border: `1px solid ${on ? C.accent : exDone ? C.accentDim : C.border}`,
                background: on ? C.accent : C.card, color: on ? C.accentText : exDone ? C.accent : C.muted,
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13,
              }}>
                {exDone && !on ? <Check size={15} strokeWidth={3} /> : (i + 1)}
              </button>
            );
          })}
        </div>
      </div>

      {day.note && (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.accentDim, borderBottom: `1px solid ${C.accent}22`, padding: "10px 16px" }}>
          <Info size={14} color={C.accent} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.4 }}>{day.note}</span>
        </div>
      )}
      {(() => {
        const note = coachNote(program, day, weekIndex);
        if (!note) return null;
        return (
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.bg2, borderBottom: `1px solid ${C.borderSoft}`, padding: "11px 16px" }}>
            <div style={{ flexShrink: 0, fontSize: 9, fontWeight: 800, letterSpacing: .4, color: C.accent, background: C.accentDim, padding: "3px 6px", borderRadius: 6, textTransform: "uppercase", marginTop: 1 }}>Coach</div>
            <span style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.45 }}>{note}</span>
          </div>
        );
      })()}

      {/* dynamic warm-up & mobility — shown before the first working set */}
      {showWarmup && exIdx === 0 && doneSets === 0 && (() => {
        const moves = warmupRoutine(day);
        if (!moves) return null;
        return (
          <div style={{ margin: "12px 16px 0", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Flame size={15} color={C.accent} />
              <span style={{ fontSize: 14, fontWeight: 800 }}>Warm-up &amp; mobility</span>
              <button onClick={() => setShowWarmup(false)} className="pressable" style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 700, color: C.muted, background: "none", border: "none", cursor: "pointer" }}>Skip</button>
            </div>
            {moves.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: i < moves.length - 1 ? 7 : 0 }}>
                <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 6, background: C.accentDim, color: C.accent, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{i + 1}</span>
                <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.45 }}>{m}</span>
              </div>
            ))}
            <button onClick={() => setShowWarmup(false)} className="pressable" style={{ width: "100%", marginTop: 12, padding: "10px", borderRadius: 11, border: "none", background: C.accent, color: C.accentText, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>Warmed up — let’s train</button>
          </div>
        );
      })()}

      {/* current exercise */}
      {(() => {
        const ei = exIdx;
        const e = data[ei];
        if (!e) return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Dumbbell size={26} color={C.faint} /></div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>No exercises yet</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>Add a lift to start logging this workout.</div>
            <button onClick={() => setAddEx(true)} className="pressable" style={{ marginTop: 18, padding: "13px 22px", borderRadius: 13, border: "none", background: C.accent, color: C.accentText, fontWeight: 800, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Plus size={17} /> Add exercise</button>
          </div>
        );
        const ex = EX_BY_ID[e.id];
        const cell = computeCell(program, day, e.id, e.slot, weekIndex);
        const isPrimary = e.slot === day.primaryIndex;
        const wTotal = workOnly(e).length;
        const wDone = workOnly(e).filter(s => s.done).length;
        const sug = suggestWeight(perf, ex, repRange(program.config.goal, ex, isPrimary), unit);
        const bar = barFor(ex);
        const wkt = parseFloat(workOnly(e)[0]?.weight);
        const pl = bar && wkt > 0 ? platesPerSide(wkt, bar, unit) : null;
        return (
          <div className="wpb-scroll" key={ei} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 130px", animation: `${slideDir === "l" ? "slideL" : "slideR"} .22s ease both` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.15 }}>{ex.name}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{(e.superset || (ei > 0 && data[ei - 1].superset)) ? "Round" : "Set"} {Math.min(wDone + 1, wTotal)} of {wTotal} · {PART_LABEL[ex.part]}</div>
                {e.superset && data[ei + 1] && (
                  <div style={{ marginTop: 5 }}>
                    <div style={{ fontSize: 11.5, color: C.accent, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}><Layers size={12} /> Superset → {EX_BY_ID[data[ei + 1].id].name}</div>
                    <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>Do a set here, then go straight to {EX_BY_ID[data[ei + 1].id].name} — rest after the pair, not between.</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                {isPrimary && <span style={{ fontSize: 9.5, fontWeight: 800, color: C.accent, background: C.accentDim, padding: "3px 7px", borderRadius: 7 }}>KEY LIFT</span>}
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => moveExerciseInSession(ei, -1)} disabled={ei === 0} title="Move up" className="pressable" style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: ei === 0 ? C.faint : C.muted, cursor: ei === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronUp size={15} /></button>
                  <button onClick={() => moveExerciseInSession(ei, 1)} disabled={ei === data.length - 1} title="Move down" className="pressable" style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: ei === data.length - 1 ? C.faint : C.muted, cursor: ei === data.length - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronDown size={15} /></button>
                  <button onClick={() => removeExerciseFromSession(ei)} title="Remove from this workout" className="pressable" style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.danger, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>

            {/* action chips */}
            <div className="wpb-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", margin: "14px 0 8px", paddingBottom: 2 }}>
              {[
                { k: "info", label: "Info", icon: Info, on: () => setInfo(true) },
                { k: "warm", label: e.sets.some(s => s.warm) ? "Remove warm-up" : "Warm-up", icon: Flame, on: () => toggleWarmups(ei) },
                { k: "ss", label: e.superset ? "Unlink superset" : "Superset", icon: Layers, on: () => toggleSuperset(ei) },
                { k: "swap", label: "Swap", icon: Repeat, on: () => setSwap(true) },
                { k: "plates", label: "Plates", icon: Dumbbell, on: () => setCalc({ bar: barFor(ex) || "barbell", weight: workOnly(e)[0]?.weight || "" }) },
              ].map(c => (
                <button key={c.k} onClick={c.on} className="pressable" style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 99, border: `1px solid ${C.border}`, background: C.card, color: C.text, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                  <c.icon size={14} color={C.accent} /> {c.label}
                </button>
              ))}
            </div>

            {sug ? (() => {
              const col = sug.dir === "up" ? C.accent : sug.dir === "down" ? C.warn : C.muted;
              const Arrow = sug.dir === "up" ? TrendingUp : sug.dir === "down" ? TrendingDown : Minus;
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "9px 11px", borderRadius: 11, background: C.bg2, border: `1px solid ${C.border}` }}>
                  <Arrow size={15} color={col} style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>
                      <span className="mono" style={{ color: col }}>{sug.weight} {unit}</span>
                      {sug.last?.reps != null && <span style={{ color: C.faint, fontWeight: 400 }}> · last {sug.last.weight}×{sug.last.reps}</span>}
                    </div>
                    <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>{sug.reason}</div>
                  </div>
                </div>
              );
            })() : (
              <div style={{ fontSize: 11.5, color: C.faint, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Info size={12} /> First time logging this — your data sets next time's suggestion.</div>
            )}

            {/* set table */}
            <div style={{ display: "flex", color: C.faint, fontSize: 10, fontWeight: 800, letterSpacing: .4, padding: "2px 2px 6px", gap: 8 }}>
              <span style={{ width: 26 }}>SET</span>
              <span style={{ width: 82 }}>TARGET</span>
              <span style={{ flex: 1, textAlign: "center" }}>{unit.toUpperCase()}</span>
              <span style={{ flex: 1, textAlign: "center" }}>REPS</span>
              <span style={{ width: 36 }} />
            </div>
            {e.sets.map((s, si) => {
              const label = s.warm ? `W${e.sets.slice(0, si + 1).filter(x => x.warm).length}`
                : s.sub ? (s.kind === "drop" ? "↓" : "M")
                  : e.sets.slice(0, si + 1).filter(x => !x.warm && !x.sub).length;
              return (
                <div key={si}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 2px", paddingLeft: s.sub ? 12 : 2, opacity: (s.warm || s.sub) && !s.done ? 0.85 : 1, borderLeft: s.sub ? `2px solid ${C.accentDim}` : "none" }}>
                  <span className="mono" style={{ width: s.sub ? 22 : 26, fontSize: s.warm || s.sub ? 11 : 13.5, fontWeight: 700, color: s.warm || s.sub ? C.faint : (s.done ? C.accent : C.muted) }}>{label}</span>
                  <div style={{ width: s.sub ? 72 : 82, lineHeight: 1.2 }}>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>{s.target?.w || "—"}<span style={{ color: C.faint }}>×</span>{s.target?.reps || "—"}</div>
                    {s.target?.rir != null && <div style={{ fontSize: 9.5, fontWeight: 800, color: C.accent }}>{effortLabel(s.target.rir, loadMode)}{s.over && !s.done ? " · +reps" : ""}</div>}
                    {s.target?.pct != null && <div style={{ fontSize: 9.5, fontWeight: 800, color: s.target.amrap ? C.warn : C.accent }}>{s.target.pct}% TM{s.target.amrap ? " · AMRAP" : s.bbb ? " · BBB" : ""}</div>}
                    {s.target?.failure && <div style={{ fontSize: 9.5, fontWeight: 800, color: C.warn }}>to failure</div>}
                    {s.warm && <div style={{ fontSize: 9.5, color: C.faint }}>warm-up</div>}
                    {s.sub && <div style={{ fontSize: 9.5, color: C.faint }}>{s.kind === "drop" ? "drop set" : "myo-rep"}</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                    <input inputMode="decimal" value={s.weight} placeholder="—" onChange={ev => editWeight(ei, si, ev.target.value)}
                      className="mono" style={{ width: "100%", padding: "10px 6px", textAlign: "center", borderRadius: 10, border: s.hint && !s.done ? `1px solid ${s.hint === "up" ? C.accent : C.warn}` : (s.warm || s.sub ? `1px dashed ${C.border}` : `1px solid ${C.border}`), background: s.done ? C.accentDim : C.bg2, color: C.text, fontSize: 15.5, fontWeight: 700 }} />
                    {s.hint && !s.done && (
                      <span title="Estimated from your last set" style={{ position: "absolute", top: -6, right: -5, width: 16, height: 16, borderRadius: 99, background: s.hint === "up" ? C.accent : C.warn, color: C.accentText, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {s.hint === "up" ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                      </span>
                    )}
                    {(() => {
                      if (!bar) return null;
                      const w = parseFloat(s.weight);
                      if (!(w > 0)) return null;
                      const sp = platesPerSide(w, bar, unit);
                      if (!sp.plates.length) return null;
                      return <div className="mono" title={`${sp.barW}${unit} bar + ${sp.plates.join(" + ")} per side`} style={{ fontSize: 8.5, fontWeight: 700, color: C.faint, textAlign: "center", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sp.plates.join("·")}/s{sp.leftover > 0 ? "*" : ""}</div>;
                    })()}
                  </div>
                  <input inputMode="numeric" value={s.reps} placeholder="—" onChange={ev => editSet(ei, si, "reps", ev.target.value)}
                    className="mono" style={{ flex: 1, minWidth: 0, padding: "10px 6px", textAlign: "center", borderRadius: 10, border: s.warm || s.sub ? `1px dashed ${C.border}` : `1px solid ${C.border}`, background: s.done ? C.accentDim : C.bg2, color: C.text, fontSize: 15.5, fontWeight: 700 }} />
                  <button onClick={() => toggleDone(ei, si)} className="pressable" style={{
                    width: 36, height: 36, borderRadius: 10, border: `1px solid ${s.done ? C.accent : C.border}`, cursor: "pointer", flexShrink: 0,
                    background: s.done ? C.accent : "transparent", color: s.done ? C.accentText : C.faint, display: "flex", alignItems: "center", justifyContent: "center",
                  }}><Check size={18} strokeWidth={3} /></button>
                </div>
                {s.done && !s.warm && !s.sub && parseFloat(s.weight) > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 2px 7px 30px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: C.faint, textTransform: "uppercase", letterSpacing: .3, marginRight: 1 }}>Reps left</span>
                    {[0, 1, 2, 3, 4].map(v => {
                      const on = s.actualRIR === v;
                      return (
                        <button key={v} onClick={() => setActualRIR(ei, si, v)} className="pressable" title={v === 0 ? "Failure" : `${v} rep${v === 1 ? "" : "s"} in reserve`} style={{ minWidth: 24, padding: "3px 7px", borderRadius: 7, border: `1px solid ${on ? C.accent : C.border}`, background: on ? C.accent : C.bg2, color: on ? C.accentText : C.muted, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>{v === 4 ? "4+" : v}</button>
                      );
                    })}
                    {s.actualRIR != null && <span style={{ fontSize: 9.5, color: C.faint }}>tunes next set</span>}
                  </div>
                )}
                </div>
              );
            })}
            {pl && pl.plates.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, padding: "8px 10px", borderRadius: 9, background: C.bg2, fontSize: 11, color: C.muted }}>
                <Dumbbell size={12} color={C.accent} style={{ flexShrink: 0 }} />
                <span className="mono" style={{ color: C.text, fontWeight: 700 }}>{pl.barW}</span> bar +
                <span className="mono" style={{ color: C.accent, fontWeight: 700 }}>{pl.plates.join(" · ")}</span>
                <span>/ side{pl.leftover > 0 ? ` · ${pl.leftover} over` : ""}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 7, marginTop: 6 }}>
              <button onClick={() => addSetRow(ei)} className="pressable" style={{ flex: 1, background: "none", border: `1px dashed ${C.border}`, borderRadius: 10, color: C.muted, cursor: "pointer", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px" }}>
                <Plus size={14} /> Add set
              </button>
              <button onClick={() => addAdvanced(ei, "drop")} className="pressable" title="Drop set" style={{ background: "none", border: `1px dashed ${C.border}`, borderRadius: 10, color: C.muted, cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "10px 12px", whiteSpace: "nowrap" }}>+ Drop</button>
              <button onClick={() => addAdvanced(ei, "myo")} className="pressable" title="Myo-reps" style={{ background: "none", border: `1px dashed ${C.border}`, borderRadius: 10, color: C.muted, cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "10px 12px", whiteSpace: "nowrap" }}>+ Myo</button>
            </div>
            {e.sets.some(s => !s.done && !s.warm) && (
              <button onClick={() => completeRemaining(ei)} className="pressable" style={{ width: "100%", marginTop: 7, background: C.accentDim, border: `1px solid ${C.accent}44`, borderRadius: 10, color: C.accent, cursor: "pointer", fontSize: 12.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px" }}>
                <Check size={14} /> Complete remaining sets
              </button>
            )}
            {perf[e.id]?.note && (
              <div style={{ fontSize: 11, color: C.muted, margin: "12px 0 6px", display: "flex", gap: 6, alignItems: "flex-start" }}>
                <Pencil size={11} style={{ marginTop: 2, flexShrink: 0, color: C.faint }} />
                <span><span style={{ color: C.faint }}>Last note:</span> {perf[e.id].note}</span>
              </div>
            )}
            <input value={e.note} onChange={ev => editNote(ei, ev.target.value)} placeholder="Add a note…"
              style={{ width: "100%", marginTop: perf[e.id]?.note ? 2 : 12, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, fontSize: 12.5 }} />

            {/* exercise info sheet */}
            {info && (
              <div onClick={() => setInfo(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 55, animation: "fadeIn .2s both" }}>
                <div onClick={ev => ev.stopPropagation()} style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
                  <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
                  <div style={{ fontSize: 19, fontWeight: 800 }}>{ex.name}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 2, marginBottom: 14 }}>{PART_LABEL[ex.part]} · {ex.type}{ex.equip.length ? " · " + ex.equip.map(q => EQUIPMENT.find(x => x.id === q)?.label || q).join(", ") : " · bodyweight"}</div>
                  <ExerciseFigure ex={ex} />
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    {(() => {
                      const restNow = e.restCustom > 0 ? e.restCustom : restSec(program.config.goal, ex, e.slot === day.primaryIndex);
                      const fmt = r => r >= 60 ? `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}` : `${r}s`;
                      return [["Reps", cell.range], ["Effort", effortLabel(cell.rir, loadMode)], ["Sets", String(wTotal)], ["Rest", fmt(restNow)]].map(([k, v]) => (
                        <div key={k} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 4px", textAlign: "center" }}>
                          <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{v}</div>
                          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{k}</div>
                        </div>
                      ));
                    })()}
                  </div>
                  {(() => {
                    const auto = restSec(program.config.goal, ex, e.slot === day.primaryIndex);
                    const restNow = e.restCustom > 0 ? e.restCustom : auto;
                    const fmt = r => r >= 60 ? `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}` : `${r}s`;
                    return (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 14 }}>
                        <Timer size={15} color={C.accent} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>Rest for this exercise</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{e.restCustom > 0 ? "Custom" : "Auto"} · {fmt(restNow)}{restScale !== 1 ? " (×" + restScale + " applied)" : ""}</div>
                        </div>
                        <button onClick={() => setRestCustom(exIdx, Math.max(15, restNow - 15))} className="pressable" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>−</button>
                        <button onClick={() => setRestCustom(exIdx, restNow + 15)} className="pressable" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>+</button>
                        {e.restCustom > 0 && <button onClick={() => setRestCustom(exIdx, 0)} className="pressable" style={{ padding: "0 10px", height: 34, borderRadius: 9, border: `1px solid ${C.border}`, background: C.bg2, color: C.muted, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Auto</button>}
                      </div>
                    );
                  })()}
                  {secondaryOf(ex).length > 0 && <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>Also trains {secondaryOf(ex).map(([p]) => PART_LABEL[p]).join(", ")} as a secondary mover.</div>}
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .6, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>Technique cues</div>
                  <div style={{ marginBottom: 16 }}>
                    {cuesFor(ex).map((c, ci) => (
                      <div key={ci} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 99, background: C.accent, flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: 13, color: C.text, lineHeight: 1.35 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  {(() => {
                    const t = trendById[ex.id];
                    if (!t || t.pts.length < 2) return null;
                    return (
                      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase" }}>Your progress · est. 1RM</span>
                          <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: t.delta >= 0 ? C.accent : C.warn }}>{t.delta >= 0 ? "+" : ""}{Math.round(t.delta)} {t.unit}</span>
                        </div>
                        <Sparkline values={t.pts} width={400} height={54} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 6 }}>
                          <span>{t.sessionsCount} sessions</span>
                          <span className="mono">best {Math.round(t.prBest)} {t.unit}</span>
                        </div>
                      </div>
                    );
                  })()}
                  {(() => {
                    const goal = goals[ex.id];
                    let bestW = 0;
                    (history || []).forEach(h => (h.perf?.[ex.id]?.sets || []).forEach(s => { if (s.w > bestW) bestW = s.w; }));
                    if (!bestW && perf?.[ex.id]?.weight) bestW = perf[ex.id].weight;
                    if (!goal) {
                      return (
                        <button onClick={() => setGoalEdit({ exId: ex.id, w: bestW ? String(Math.round(bestW * 1.05)) : "" })} className="pressable" style={{ width: "100%", padding: "11px", borderRadius: 12, border: `1px dashed ${C.accent}66`, background: "none", color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 16 }}>
                          <Target size={15} /> Set a goal weight
                        </button>
                      );
                    }
                    const pct = goal > 0 ? clamp(Math.round(bestW / goal * 100), 0, 100) : 0;
                    const reached = bestW >= goal;
                    return (
                      <div onClick={() => setGoalEdit({ exId: ex.id, w: String(goal) })} style={{ cursor: "pointer", background: C.card, border: `1px solid ${reached ? C.accent : C.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}><Target size={12} color={reached ? C.accent : C.faint} /> Goal {reached ? "· reached!" : ""}</span>
                          <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: reached ? C.accent : C.text }}>{Math.round(bestW)} / {goal} {unit}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: C.bg2, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: C.accent, borderRadius: 99, transition: "width .4s" }} />
                        </div>
                        <div style={{ fontSize: 10.5, color: C.faint, marginTop: 6 }}>{reached ? "Goal hit — tap to set a new target." : `${pct}% there · ${Math.max(0, goal - Math.round(bestW))} ${unit} to go · tap to edit`}</div>
                      </div>
                    );
                  })()}
                  {(() => {
                    const notes = (history || []).filter(h => h.perf?.[ex.id]?.note).slice(0, 3).map(h => ({ date: h.date, note: h.perf[ex.id].note }));
                    if (!notes.length) return null;
                    return (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .6, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>Your notes</div>
                        {notes.map((n, i) => (
                          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8 }}>
                            <span className="mono" style={{ fontSize: 10.5, color: C.faint, flexShrink: 0, marginTop: 1, width: 44 }}>{new Date(n.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                            <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.35 }}>{n.note}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  {(() => {
                    const log = (history || [])
                      .filter(h => h.perf?.[ex.id] && (h.perf[ex.id].sets?.length || h.perf[ex.id].weight > 0))
                      .map(h => {
                        const p = h.perf[ex.id];
                        const work = (p.sets || []).filter(s => s.w > 0);
                        const top = work.length ? work.reduce((a, b) => (e1rm(b.w, b.r || 1) > e1rm(a.w, a.r || 1) ? b : a)) : { w: p.weight, r: p.reps || 1 };
                        return { id: h.id, date: h.date, dayLabel: h.dayLabel, sets: work.length || (p.weight > 0 ? 1 : 0), top, best: e1rm(top.w, top.r || 1) };
                      })
                      .filter(x => x.top.w > 0);
                    if (log.length < 1) return null;
                    return (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .6, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>Full history · {log.length} session{log.length === 1 ? "" : "s"} <span style={{ fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>· tap to edit</span></div>
                        <div className="wpb-scroll" style={{ maxHeight: 200, overflowY: "auto" }}>
                          {log.map((x, i) => (
                            <button key={x.id + i} onClick={() => setHistEdit({ histId: x.id, exId: ex.id, w: String(x.top.w), r: String(x.top.r) })} className="pressable" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < log.length - 1 ? `1px solid ${C.borderSoft}` : "none", width: "100%", background: "none", border: "none", borderRadius: 0, cursor: "pointer", textAlign: "left" }}>
                              <div style={{ width: 46, flexShrink: 0 }}>
                                <div className="mono" style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{new Date(x.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{x.top.w}{unit} × {x.top.r}</div>
                                <div style={{ fontSize: 10.5, color: C.faint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.dayLabel} · {x.sets} set{x.sets === 1 ? "" : "s"}</div>
                              </div>
                              <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: C.accent, flexShrink: 0 }}>{Math.round(x.best)} e1RM</span>
                              <Pencil size={12} color={C.faint} style={{ flexShrink: 0 }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  <button onClick={() => { onBan(e.id); setInfo(false); }} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 12, border: `1px solid ${C.dangerDim}`, background: "none", color: C.danger, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    <Ban size={15} /> Ban from all programs
                  </button>
                </div>
              </div>
            )}

            {/* swap sheet */}
            {swap && (() => {
              const sessionIds = new Set(data.map(x => x.id).filter(id => id !== ex.id));
              const pool = availableFor(ex.part, new Set(program.config.equipment), banned, !!program.config.noBodyweight).filter(a => a.id !== ex.id && !sessionIds.has(a.id));
              return (
                <SwapSheet
                  ex={ex}
                  alts={pool}
                  trend={trendById[ex.id]}
                  onPick={doSwap}
                  onBanCurrent={() => { onBan(ex.id); const alt = availableFor(ex.part, new Set(program.config.equipment), [...banned, ex.id], !!program.config.noBodyweight).find(a => !sessionIds.has(a.id)); if (alt) doSwap(alt.id); else setSwap(false); }}
                  onClose={() => setSwap(false)}
                />
              );
            })()}
          </div>
        );
      })()}

      {addEx && <ExercisePickerSheet onPick={addExerciseToSession} onClose={() => setAddEx(false)} banned={banned} title="Add exercise" />}

      {prFlash && (
        <div onClick={() => setPrFlash(null)} style={{ position: "absolute", top: "calc(env(safe-area-inset-top) + 14px)", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 90, pointerEvents: "auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, maxWidth: 360, padding: "12px 16px", borderRadius: 16, background: C.warn, color: "#1A1205", boxShadow: "0 12px 30px rgba(0,0,0,.4)", animation: "fadeUp .35s cubic-bezier(.2,.8,.3,1) both" }}>
            <div style={{ fontSize: 24, lineHeight: 1 }}>🏆</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: .2 }}>New PR — {prFlash.name}</div>
              <div className="mono" style={{ fontSize: 12, fontWeight: 700, opacity: .85, marginTop: 1 }}>est {prFlash.est} {unit} · {prFlash.w}{unit}×{prFlash.r}</div>
            </div>
          </div>
        </div>
      )}

      {snack && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "calc(env(safe-area-inset-bottom) + 92px)", display: "flex", justifyContent: "center", zIndex: 88, pointerEvents: "none", padding: "0 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.text, color: C.bg, fontSize: 13, fontWeight: 700, padding: "11px 16px", borderRadius: 12, maxWidth: "100%", boxShadow: "0 8px 24px rgba(0,0,0,.35)", animation: "fadeUp .2s both", pointerEvents: "auto" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{snack.msg}</span>
            <button onClick={snack.undo} className="pressable" style={{ background: "none", border: "none", color: C.accent, fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0, padding: "0 2px" }}>Undo</button>
          </div>
        </div>
      )}

      {/* readiness check-in (shown once at start) */}
      {!readiness && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.66)", display: "flex", alignItems: "flex-end", zIndex: 80, animation: "fadeIn .2s both" }}>
          <div style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 16px" }} />
            <div style={{ fontSize: 20, fontWeight: 800 }}>How are you feeling?</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 3, marginBottom: 16 }}>We'll fine-tune today's loads to match your readiness.</div>
            {[
              { label: "Feeling strong", sub: "Hit the prescribed loads", factor: 1, icon: Flame },
              { label: "A little off", sub: "Trim loads ~5%", factor: 0.95, icon: Battery },
              { label: "Run down", sub: "Back off ~12%, focus on quality", factor: 0.88, icon: Battery },
            ].map(o => (
              <button key={o.label} onClick={() => applyReadiness(o.label, o.factor)} className="pressable opt" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px", borderRadius: 14, background: C.card, border: `1px solid ${C.border}`, color: C.text, cursor: "pointer", marginBottom: 9, textAlign: "left" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: C.bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><o.icon size={18} color={C.accent} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{o.label}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{o.sub}</div>
                </div>
                <ChevronRight size={18} color={C.muted} />
              </button>
            ))}
            <button onClick={() => applyReadiness("—", 1)} className="pressable" style={{ width: "100%", padding: "11px", marginTop: 4, borderRadius: 12, border: "none", background: "none", color: C.muted, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Skip</button>
          </div>
        </div>
      )}

      {/* sticky footer: rest timer OR finish */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 16px 22px", background: `linear-gradient(to top, ${C.bg} 70%, transparent)` }}>
        {rest > 0 ? (
          <div style={{ background: C.card, border: `1px solid ${C.accentDim}`, borderRadius: 16, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Timer size={20} color={C.accent} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700 }}>REST</div>
                <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1 }}>{fmtTime(rest)}</div>
              </div>
              <button onClick={() => setRest(r => Math.max(0, r - 15))} className="pressable" style={{ ...tinyBtn(), width: 40, height: 34, fontSize: 12, fontWeight: 700, color: C.text }}>-15</button>
              <button onClick={() => setRest(r => r + 15)} className="pressable" style={{ ...tinyBtn(), width: 40, height: 34, fontSize: 12, fontWeight: 700, color: C.text }}>+15</button>
              <button onClick={() => setPaused(p => !p)} className="pressable" style={{ ...tinyBtn(), width: 38, height: 34, color: C.text }}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
              <button onClick={() => setRest(0)} className="pressable" style={{ ...tinyBtn(), width: 38, height: 34, color: C.accent, borderColor: C.accentDim }}><SkipForward size={15} /></button>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: C.bg2, overflow: "hidden", marginTop: 10 }}>
              <div style={{ width: `${restMax ? (rest / restMax) * 100 : 0}%`, height: "100%", background: C.accent, transition: "width 1s linear" }} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => goEx(exIdx - 1)} disabled={exIdx === 0} className="pressable" style={{ width: 54, flexShrink: 0, padding: "16px 0", borderRadius: 16, border: `1px solid ${C.border}`, background: C.card, color: exIdx === 0 ? C.faint : C.text, cursor: exIdx === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={22} />
            </button>
            {exIdx < data.length - 1 ? (
              <button onClick={() => goEx(exIdx + 1)} className="pressable" style={{ flex: 1, padding: "16px", borderRadius: 16, border: "none", background: C.accent, color: C.accentText, fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Next exercise <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            ) : (
              <button onClick={() => setFinishing(true)} className="pressable" style={{ flex: 1, padding: "16px", borderRadius: 16, border: "none", background: doneSets > 0 ? C.accent : C.card, color: doneSets > 0 ? C.accentText : C.muted, fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: doneSets > 0 ? 0 : 1, borderStyle: "solid", borderColor: C.border }}>
                <CheckCircle2 size={19} /> Finish workout
              </button>
            )}
            <button onClick={() => setAddEx(true)} title="Add exercise" className="pressable" style={{ width: 54, flexShrink: 0, padding: "16px 0", borderRadius: 16, border: `1px solid ${C.accent}55`, background: C.accentDim, color: C.accent, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={22} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {/* finish summary */}
      {finishing && (() => {
        const prs = data.map(e => {
          const work = e.sets.filter(s => s.done && !s.warm && parseFloat(s.weight) > 0 && parseInt(s.reps) > 0);
          if (!work.length) return null;
          const best = Math.max(...work.map(s => e1rm(parseFloat(s.weight), parseInt(s.reps))));
          const pr = dayPerf[e.id];
          const prior = pr && pr.reps != null && parseFloat(pr.weight) > 0 ? e1rm(parseFloat(pr.weight), parseInt(pr.reps)) : null;
          return prior != null && best > prior ? { name: EX_BY_ID[e.id].name, gain: best - prior } : null;
        }).filter(Boolean);
        const trainedParts = [...new Set(data
          .filter(e => e.sets.some(s => s.done && !s.warm))
          .map(e => EX_BY_ID[e.id].part))];
        const goalsHit = data.map(e => {
          const goal = goals[e.id];
          if (!goal) return null;
          const work = e.sets.filter(s => s.done && !s.warm && parseFloat(s.weight) > 0);
          if (!work.length) return null;
          const bestNow = Math.max(...work.map(s => parseFloat(s.weight)));
          if (bestNow < goal) return null;
          let priorBest = 0;
          (history || []).forEach(h => (h.perf?.[e.id]?.sets || []).forEach(s => { if (s.w > priorBest) priorBest = s.w; }));
          return priorBest < goal ? { name: EX_BY_ID[e.id].name, goal } : null; // newly reached
        }).filter(Boolean);
        // Estimated 1RM from the main lift's top set (AMRAP) — most meaningful on percentage programs
        const mainE1rm = (() => {
          const mainId = day.exercises[day.primaryIndex];
          const e = data.find(x => x.id === mainId); if (!e) return null;
          const work = e.sets.filter(s => s.done && !s.warm && !s.bbb && parseFloat(s.weight) > 0 && parseInt(s.reps) > 0);
          if (!work.length) return null;
          const top = work.reduce((a, b) => e1rm(parseFloat(b.weight), parseInt(b.reps)) > e1rm(parseFloat(a.weight), parseInt(a.reps)) ? b : a);
          let prevBest = 0;
          (history || []).forEach(h => (h.perf?.[mainId]?.sets || []).forEach(s => { const v = e1rm(s.w, s.r); if (v > prevBest) prevBest = v; }));
          return { name: EX_BY_ID[mainId]?.name, weight: parseFloat(top.weight), reps: parseInt(top.reps), est: Math.round(e1rm(parseFloat(top.weight), parseInt(top.reps))), prev: Math.round(prevBest) };
        })();
        return (
        <div onClick={() => setFinishing(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 60, animation: "fadeIn .2s both" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}`, maxHeight: "86%", overflowY: "auto" }} className="wpb-scroll">
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 16px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}><Trophy size={22} color={C.accent} /></div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 800 }}>Nice work</div>
                <div style={{ fontSize: 13, color: C.muted }}>{day.label} · Week {weekIndex > weeksOf(program) ? "Deload" : weekIndex}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {[["Sets", `${doneSets}/${totalSets}`], ["Volume", `${Math.round(volume).toLocaleString()} ${unit}`], ["Time", `${Math.max(1, Math.round((Date.now() - startRef.current) / 60000))}m`]].map(([k, v]) => (
                <div key={k} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div className="mono" style={{ fontSize: 17, fontWeight: 700, color: C.accent }}>{v}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>
            {prs.length > 0 && (
              <div style={{ background: C.accentDim, border: `1px solid ${C.accent}44`, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: prs.length ? 8 : 0 }}>
                  <Trophy size={14} color={C.accent} /><span style={{ fontSize: 13.5, fontWeight: 800, color: C.accent }}>{prs.length} estimated-1RM PR{prs.length === 1 ? "" : "s"}!</span>
                </div>
                {prs.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3px 0" }}>
                    <span style={{ color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 8 }}>{p.name}</span>
                    <span className="mono" style={{ color: C.accent, fontWeight: 700, flexShrink: 0 }}>+{p.gain} {unit}</span>
                  </div>
                ))}
              </div>
            )}
            {mainE1rm && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 15px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .4, color: C.faint, textTransform: "uppercase" }}>Estimated 1RM · {mainE1rm.name}</div>
                  {mainE1rm.prev > 0 && mainE1rm.est > mainE1rm.prev && <span className="mono" style={{ fontSize: 11, fontWeight: 800, color: C.accent }}>+{mainE1rm.est - mainE1rm.prev} {unit}</span>}
                </div>
                <div className="mono" style={{ fontSize: 28, fontWeight: 800, color: C.accent, lineHeight: 1.1, marginTop: 4 }}>{mainE1rm.est} <span style={{ fontSize: 15, color: C.muted }}>{unit}</span></div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>from your top set of {mainE1rm.weight} {unit} × {mainE1rm.reps}{mainE1rm.prev > 0 ? ` · previous best ${mainE1rm.prev} ${unit}` : ""}</div>
              </div>
            )}
            {goalsHit.length > 0 && (
              <div style={{ background: C.accentDim, border: `1px solid ${C.accent}55`, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <Target size={15} color={C.accent} /><span style={{ fontSize: 13.5, fontWeight: 800, color: C.accent }}>{goalsHit.length} goal{goalsHit.length === 1 ? "" : "s"} reached! 🎯</span>
                </div>
                {goalsHit.map((g, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3px 0" }}>
                    <span style={{ color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 8 }}>{g.name}</span>
                    <span className="mono" style={{ color: C.accent, fontWeight: 700, flexShrink: 0 }}>{g.goal} {unit} ✓</span>
                  </div>
                ))}
              </div>
            )}
            {trainedParts.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 3 }}>How did each muscle feel?</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 11 }}>Tunes next block's volume — optional, skip any you're unsure about.</div>
                {trainedParts.map(part => (
                  <div key={part} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{PART_LABEL[part]}</span>
                    {[[1, "Easy", "+set"], [0, "Good", "keep"], [-1, "Smashed", "−set"]].map(([v, label, hint]) => {
                      const on = feedback[part] === v;
                      const col = v > 0 ? C.accent : v < 0 ? C.danger : C.muted;
                      return (
                        <button key={label} onClick={() => setFeedback(f => ({ ...f, [part]: on ? undefined : v }))} className="pressable"
                          style={{ padding: "7px 10px", borderRadius: 9, cursor: "pointer", fontSize: 11.5, fontWeight: 700, border: `1px solid ${on ? col : C.border}`, background: on ? (v === 0 ? C.bg2 : C.accentDim) : C.card, color: on ? (v === 0 ? C.text : col) : C.muted, minWidth: 58, textAlign: "center" }}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
            <button onClick={finish} className="pressable" style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: C.accent, color: C.accentText, fontSize: 15.5, fontWeight: 800, cursor: "pointer" }}>Save &amp; finish</button>
            <button onClick={() => {
              const durMin = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));
              const tops = data.map(e => {
                const w = e.sets.filter(s => s.done && !s.warm && parseFloat(s.weight) > 0 && parseInt(s.reps) > 0);
                if (!w.length) return null;
                const t = w.reduce((a, b) => parseFloat(b.weight) > parseFloat(a.weight) ? b : a);
                return `• ${EX_BY_ID[e.id]?.name}: ${parseFloat(t.weight)}${unit}×${parseInt(t.reps)}`;
              }).filter(Boolean).slice(0, 8);
              const lines = [
                `🏋️ ${day.label} — ${new Date().toLocaleDateString()}`,
                `⏱ ${durMin} min · ${doneSets} sets · ${Math.round(volume).toLocaleString()} ${unit} total`,
              ];
              if (mainE1rm) lines.push(`💪 Est. 1RM ${mainE1rm.name}: ${mainE1rm.est} ${unit}`);
              if (prs.length) lines.push(`🏆 New PRs: ${prs.map(p => p.name).join(", ")}`);
              lines.push("", ...tops);
              const text = lines.join("\n");
              try {
                if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
                else { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
                setCopiedRecap(true); setTimeout(() => setCopiedRecap(false), 2200);
              } catch { setCopiedRecap(true); setTimeout(() => setCopiedRecap(false), 2200); }
            }} className="pressable" style={{ width: "100%", padding: "13px", marginTop: 8, borderRadius: 14, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              {copiedRecap ? <><Check size={15} color={C.accent} /> Recap copied</> : <><Copy size={15} /> Share recap</>}
            </button>
            <button onClick={() => {
              const durMin = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));
              const tops = data.map(e => {
                const w = e.sets.filter(s => s.done && !s.warm && parseFloat(s.weight) > 0 && parseInt(s.reps) > 0);
                if (!w.length) return null;
                const t = w.reduce((a, b) => parseFloat(b.weight) > parseFloat(a.weight) ? b : a);
                return { name: EX_BY_ID[e.id]?.name || "", set: `${parseFloat(t.weight)}${unit}×${parseInt(t.reps)}` };
              }).filter(Boolean).slice(0, 7);
              const W = 1080, H = 1350, cnv = document.createElement("canvas"); cnv.width = W; cnv.height = H;
              const ctx = cnv.getContext("2d");
              const rr = (x, y, w, h, r) => { if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); } else { ctx.beginPath(); ctx.rect(x, y, w, h); } };
              ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
              ctx.fillStyle = C.card; rr(56, 56, W - 112, H - 112, 44); ctx.fill();
              ctx.fillStyle = C.accent; rr(56, 56, W - 112, 18, 9); ctx.fill();
              ctx.textBaseline = "top";
              ctx.fillStyle = C.accent; ctx.font = "800 30px system-ui, -apple-system, sans-serif"; ctx.fillText("WORKOUT COMPLETE", 104, 132);
              ctx.fillStyle = C.text; ctx.font = "800 76px system-ui, -apple-system, sans-serif"; ctx.fillText(day.label.slice(0, 20), 104, 176);
              ctx.fillStyle = C.muted; ctx.font = "500 34px system-ui, -apple-system, sans-serif"; ctx.fillText(new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }), 104, 268);
              const tiles = [["MIN", String(durMin)], ["SETS", String(doneSets)], ["VOLUME", Math.round(volume).toLocaleString()]];
              const tw = (W - 208 - 32) / 3;
              tiles.forEach((t, i) => {
                const x = 104 + i * (tw + 16);
                ctx.fillStyle = C.bg2; rr(x, 360, tw, 150, 22); ctx.fill();
                ctx.fillStyle = C.accent; ctx.font = "800 56px system-ui, -apple-system, sans-serif"; ctx.fillText(t[1], x + 24, 384);
                ctx.fillStyle = C.muted; ctx.font = "700 24px system-ui, -apple-system, sans-serif"; ctx.fillText(t[0] + (t[0] === "VOLUME" ? " " + unit : ""), x + 24, 452);
              });
              let y = 560;
              if (mainE1rm) { ctx.fillStyle = C.text; ctx.font = "700 36px system-ui, -apple-system, sans-serif"; ctx.fillText(`Est. 1RM ${mainE1rm.name}: ${mainE1rm.est} ${unit}`, 104, y); y += 64; }
              if (prs.length) { ctx.fillStyle = C.accent; ctx.font = "700 34px system-ui, -apple-system, sans-serif"; ctx.fillText(`🏆 New PRs: ${prs.map(p => p.name).join(", ").slice(0, 40)}`, 104, y); y += 64; }
              y += 10; ctx.fillStyle = C.faint; ctx.font = "700 26px system-ui, -apple-system, sans-serif"; ctx.fillText("TOP SETS", 104, y); y += 48;
              tops.forEach(t => {
                ctx.fillStyle = C.text; ctx.font = "600 36px system-ui, -apple-system, sans-serif"; ctx.fillText(t.name.slice(0, 24), 104, y);
                ctx.fillStyle = C.accent; ctx.font = "700 36px system-ui, -apple-system, sans-serif"; ctx.textAlign = "right"; ctx.fillText(t.set, W - 104, y); ctx.textAlign = "left";
                y += 58;
              });
              ctx.fillStyle = C.faint; ctx.font = "600 28px system-ui, -apple-system, sans-serif"; ctx.fillText("Tracked set by set · autoregulated", 104, H - 150);
              const finishDownload = (blob) => {
                try {
                  if (navigator.canShare && typeof File !== "undefined") {
                    const file = new File([blob], "workout-recap.png", { type: "image/png" });
                    if (navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: "Workout recap" }).catch(() => {}); return; }
                  }
                } catch {}
                try { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "workout-recap.png"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); } catch {}
              };
              if (cnv.toBlob) cnv.toBlob(b => b && finishDownload(b), "image/png");
              else { const a = document.createElement("a"); a.href = cnv.toDataURL("image/png"); a.download = "workout-recap.png"; a.click(); }
            }} className="pressable" style={{ width: "100%", padding: "13px", marginTop: 8, borderRadius: 14, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <BarChart3 size={15} /> Save recap image
            </button>
            {program.quick && onSaveRoutine && data.length > 0 && (
              <button onClick={() => { let nm = null; try { nm = window.prompt("Name this routine", day.label === "Quick workout" ? "My routine" : day.label); } catch { nm = "My routine"; } if (nm) { onSaveRoutine(data.map(e => e.id), nm); finish(); } }} className="pressable" style={{ width: "100%", padding: "13px", marginTop: 8, borderRadius: 14, border: `1px solid ${C.accent}55`, background: C.accentDim, color: C.accent, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><Save size={15} /> Save as routine &amp; finish</button>
            )}
            <button onClick={() => setFinishing(false)} className="pressable" style={{ width: "100%", padding: "13px", marginTop: 8, borderRadius: 14, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Keep training</button>
          </div>
        </div>
        );
      })()}

      {/* plate calculator */}
      {calc && <PlateCalcSheet unit={unit} initialBar={calc.bar} initialWeight={calc.weight} onClose={() => setCalc(false)} />}
      {goalEdit && (
        <div onClick={() => setGoalEdit(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, animation: "fadeIn .2s both", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 320, background: C.bg2, borderRadius: 20, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 16.5, fontWeight: 800, display: "flex", alignItems: "center", gap: 7 }}><Target size={17} color={C.accent} /> Goal weight</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2, marginBottom: 16 }}>{EX_BY_ID[goalEdit.exId]?.name} — the top-set weight you're working toward.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <input inputMode="decimal" value={goalEdit.w} autoFocus onChange={e => setGoalEdit(g => ({ ...g, w: e.target.value }))} className="mono" style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 17, fontWeight: 700, textAlign: "center" }} />
              <span style={{ fontSize: 14, color: C.muted, fontWeight: 700 }}>{unit}</span>
            </div>
            <button onClick={() => { onSetGoal?.(goalEdit.exId, parseFloat(goalEdit.w) || 0); setGoalEdit(null); }} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 13, border: "none", background: C.accent, color: C.accentText, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Save goal</button>
            <div style={{ display: "flex", gap: 10, marginTop: 9 }}>
              {goals[goalEdit.exId] && <button onClick={() => { onSetGoal?.(goalEdit.exId, 0); setGoalEdit(null); }} className="pressable" style={{ flex: 1, padding: "11px", borderRadius: 12, border: `1px solid ${C.dangerDim}`, background: "none", color: C.danger, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Clear</button>}
              <button onClick={() => setGoalEdit(null)} className="pressable" style={{ flex: 1, padding: "11px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {histEdit && (
        <div onClick={() => setHistEdit(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, animation: "fadeIn .2s both", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 340, background: C.bg2, borderRadius: 20, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 16.5, fontWeight: 800 }}>Edit logged set</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2, marginBottom: 16 }}>{EX_BY_ID[histEdit.exId]?.name} · top set</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, marginBottom: 5 }}>WEIGHT ({unit})</div>
                <input inputMode="decimal" value={histEdit.w} onChange={e => setHistEdit(h => ({ ...h, w: e.target.value }))} className="mono" style={{ width: "100%", padding: "11px 12px", borderRadius: 11, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 16, fontWeight: 700, textAlign: "center" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, marginBottom: 5 }}>REPS</div>
                <input inputMode="numeric" value={histEdit.r} onChange={e => setHistEdit(h => ({ ...h, r: e.target.value }))} className="mono" style={{ width: "100%", padding: "11px 12px", borderRadius: 11, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 16, fontWeight: 700, textAlign: "center" }} />
              </div>
            </div>
            <button onClick={() => { const w = parseFloat(histEdit.w), r = parseInt(histEdit.r); if (w > 0 && r > 0) onEditHistory?.(histEdit.histId, histEdit.exId, { weight: w, reps: r }); setHistEdit(null); }} className="pressable" style={{ width: "100%", padding: "14px", borderRadius: 13, border: "none", background: C.accent, color: C.accentText, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Save</button>
            <div style={{ display: "flex", gap: 10, marginTop: 9 }}>
              <button onClick={() => { onEditHistory?.(histEdit.histId, histEdit.exId, null); setHistEdit(null); }} className="pressable" style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${C.dangerDim}`, background: "none", color: C.danger, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Delete entry</button>
              <button onClick={() => setHistEdit(null)} className="pressable" style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* exit confirm */}
      {confirmExit && (
        <div onClick={() => setConfirmExit(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 24, animation: "fadeIn .2s both" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 320, background: C.bg2, borderRadius: 20, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Leave this workout?</div>
            <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 16 }}>You've logged {doneSets} set{doneSets === 1 ? "" : "s"}. You can save them now or discard them.</div>
            <button onClick={() => { setConfirmExit(false); setFinishing(true); }} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: C.accent, color: C.accentText, fontWeight: 800, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><Check size={16} /> Finish &amp; save</button>
            <button onClick={onExit} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: C.dangerDim, color: C.danger, fontWeight: 800, cursor: "pointer", marginBottom: 8 }}>Discard</button>
            <button onClick={() => setConfirmExit(false)} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.text, fontWeight: 700, cursor: "pointer" }}>Keep going</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* estimated 1RM (Epley) lets us compare progress across different rep counts */
function e1rm(w, reps) { return Math.round(w * (1 + (reps || 0) / 30)); }
function exerciseTrends(history) {
  const map = {};
  [...history].reverse().forEach(h => {
    if (!h.perf) return;
    Object.entries(h.perf).forEach(([id, p]) => {
      if (!(p && p.weight > 0)) return;
      const unit = h.unit || "kg";
      const raw = (p.sets && p.sets.length) ? p.sets : [{ w: p.weight, r: p.reps }];
      const sets = raw.filter(s => s.w > 0).map(s => ({ w: s.w, r: s.r ?? null, e1rm: s.r != null ? e1rm(s.w, s.r) : s.w }));
      if (!sets.length) return;
      const best = sets.reduce((m, s) => (s.e1rm > m.e1rm ? s : m), sets[0]);
      (map[id] = map[id] || []).push({ date: h.date, unit, sets, best: best.e1rm, top: { w: p.weight, r: p.reps ?? null } });
    });
  });
  return Object.entries(map).map(([id, sessions]) => {
    const ex = EX_BY_ID[id];
    if (!ex) return null;
    const last = sessions[sessions.length - 1];
    const prBest = Math.max(...sessions.map(s => s.best));
    return {
      id, name: ex.name, part: ex.part, sessions, first: sessions[0], last,
      sessionsCount: sessions.length, pts: sessions.map(s => s.best),
      prBest, unit: last.unit, delta: last.best - sessions[0].best,
    };
  }).filter(Boolean).sort((a, b) => b.last.date - a.last.date);
}

/* ---- plateau detection: sessions since the last estimated-1RM PR ---- */
function plateauOf(trend) {
  if (!trend || trend.sessionsCount < 3) return null;
  const pts = trend.pts;
  const prIdx = pts.lastIndexOf(Math.max(...pts));
  const since = (pts.length - 1) - prIdx;
  if (since < 2) return null;
  const high = since >= 3;
  return {
    since, high,
    advice: high
      ? `No estimated-1RM PR in ${since} sessions. Swap in a fresh variation or run a deload to shed fatigue, then rebuild.`
      : `No PR in ${since} sessions. Add a set or chase 1–2 more reps at this load before adding weight.`,
  };
}

/* ---- strength standards: e1RM as a multiple of bodyweight ----
   Thresholds (male, ×bodyweight) for Beginner/Novice/Intermediate/Advanced/Elite,
   adapted from published strength-standard tables. Female factor ≈ 0.72. */
const STD_LEVELS = ["Untrained", "Beginner", "Novice", "Intermediate", "Advanced", "Elite"];
const SEX_FACTOR = { male: 1, female: 0.72 };
const STANDARDS = {
  "bb-bench": [0.5, 0.75, 1.0, 1.5, 2.0], "inc-bb-bench": [0.4, 0.6, 0.85, 1.25, 1.6], "smith-bench": [0.5, 0.75, 1.0, 1.45, 1.9],
  "back-squat": [0.75, 1.25, 1.5, 2.25, 2.75], "front-squat": [0.6, 1.0, 1.3, 1.85, 2.25],
  "deadlift": [1.0, 1.5, 2.0, 2.5, 3.0], "sumo-dl": [1.0, 1.5, 2.0, 2.5, 3.0],
  "ohp": [0.35, 0.55, 0.8, 1.1, 1.4], "bb-row": [0.5, 0.75, 1.0, 1.35, 1.7], "cgbp": [0.45, 0.7, 0.95, 1.4, 1.85],
  "bb-curl": [0.2, 0.35, 0.5, 0.65, 0.85], "ez-curl": [0.2, 0.35, 0.5, 0.65, 0.85], "hip-thrust": [1.0, 1.5, 2.0, 2.75, 3.5],
  "decline-bench": [0.5, 0.75, 1.0, 1.5, 2.0], "seated-ohp": [0.35, 0.55, 0.8, 1.1, 1.4], "pendlay-row": [0.5, 0.75, 1.0, 1.35, 1.7],
  "box-squat": [0.75, 1.25, 1.5, 2.25, 2.75], "stiff-deadlift": [0.9, 1.35, 1.8, 2.3, 2.8], "rack-pull": [1.1, 1.6, 2.1, 2.7, 3.2],
};
const toUnit = (v, from, to) => from === to ? v : (to === "lb" ? v * 2.2046226 : v / 2.2046226);
function strengthLevel(exId, e1rmVal, e1rmUnit, bw, bwUnit, sex) {
  const base = STANDARDS[exId];
  if (!base || !(bw > 0) || !(e1rmVal > 0)) return null;
  const bwL = toUnit(bw, bwUnit, e1rmUnit); // bodyweight in the lift's unit
  const thresh = base.map(m => m * (SEX_FACTOR[sex] ?? 1) * bwL);
  let idx = 0;
  thresh.forEach((t, i) => { if (e1rmVal >= t) idx = i + 1; });
  const prevT = idx > 0 ? thresh[idx - 1] : 0;
  const nextT = idx < thresh.length ? thresh[idx] : thresh[thresh.length - 1];
  const within = idx >= thresh.length ? 1 : clamp((e1rmVal - prevT) / ((nextT - prevT) || 1), 0, 1);
  return { level: STD_LEVELS[idx], idx, ratio: e1rmVal / bwL, within, thresh, unit: e1rmUnit };
}
// Overall strength status across all lifts with published standards (for the Home snapshot).
function strengthSnapshot(history, bw, bwUnit, sex) {
  if (!(bw > 0)) return null;
  const trends = exerciseTrends(history);
  const lifts = trends.map(t => {
    const lvl = strengthLevel(t.id, t.prBest, t.unit, bw, bwUnit, sex);
    return lvl ? { id: t.id, name: t.name, prBest: t.prBest, unit: t.unit, lvl } : null;
  }).filter(Boolean);
  if (!lifts.length) return null;
  const score = lifts.reduce((s, l) => s + l.lvl.idx + (l.lvl.idx < 5 ? l.lvl.within : 0), 0) / lifts.length;
  const overallIdx = Math.max(0, Math.min(5, Math.round(score)));
  lifts.sort((a, b) => (b.lvl.idx - a.lvl.idx) || (b.lvl.within - a.lvl.within));
  return { lifts, overallIdx, overallLabel: STD_LEVELS[overallIdx], score };
}

/* ---- auto-regulated volume: per-muscle starting-set advice for the next block ---- */
function volumeAdvice(history) {
  const vol = weeklyActualVolume(history, 7);
  const trends = exerciseTrends(history);
  const out = [];
  PART_ORDER.forEach(part => {
    const v = vol[part] || 0;
    if (v < 0.5) return;
    const { mev, mrv } = landmarkFor(part);
    const ms = trends.filter(t => t.part === part);
    const stalled = ms.length > 0 && ms.every(t => plateauOf(t));
    let delta, reason;
    if (v < mev) { delta = 2; reason = `Below MEV (${fmtSets(v)}/${mev} sets) — room to add volume`; }
    else if (v > mrv) { delta = -2; reason = `Over MRV (${fmtSets(v)}/${mrv}) — pull volume back to recover`; }
    else if (stalled) { delta = -1; reason = `Productive volume but lifts stalling — hold/reduce, push intensity & sleep`; }
    else { delta = 1; reason = `Productive & progressing (${fmtSets(v)}/${mrv}) — small bump to keep overloading`; }
    out.push({ part, v, mev, mrv, delta, reason });
  });
  return out.sort((a, b) => b.delta - a.delta);
}

// Recommend a deload when fatigue signals stack: stalled lifts + low recovery + heavy feedback.
// Weekly average reps-in-reserve from logged sets; detects a sustained drop in reserve
// (training closer to failure week over week) — a fatigue signal that argues for a deload.
function rirTrend(history) {
  const weekKey = d => { const dt = new Date(d); const off = (dt.getDay() + 6) % 7; const m = new Date(dt); m.setDate(dt.getDate() - off); m.setHours(0, 0, 0, 0); return m.getTime(); };
  const byWeek = {};
  (history || []).forEach(h => Object.values(h.perf || {}).forEach(p => (p.sets || []).forEach(s => {
    if (s.rir == null || !(s.r > 0)) return;
    const k = weekKey(h.date); (byWeek[k] = byWeek[k] || []).push(s.rir);
  })));
  const weeks = Object.keys(byWeek).map(Number).sort((a, b) => a - b);
  const pts = weeks.map(k => byWeek[k].reduce((a, b) => a + b, 0) / byWeek[k].length);
  const n = weeks.reduce((a, k) => a + byWeek[k].length, 0);
  let declining2 = false;
  if (pts.length >= 3 && n >= 9) {
    const a = pts[pts.length - 3], b = pts[pts.length - 2], c = pts[pts.length - 1];
    declining2 = (b < a - 0.2 && c < b - 0.2) || (c <= a - 1.0);
  }
  const latest = pts.length ? pts[pts.length - 1] : null;
  const prior = pts.length > 1 ? pts.slice(0, -1).reduce((x, y) => x + y, 0) / (pts.length - 1) : null;
  return { pts, n, declining2, latest, prior };
}
function deloadAdvice(history) {
  if ((history || []).length < 6) return null;
  const trends = exerciseTrends(history);
  let stalled = 0, hardStall = 0;
  trends.forEach(t => { const pl = plateauOf(t); if (pl) { stalled++; if (pl.high) hardStall++; } });
  const rec = muscleRecovery(history);
  const major = ["chest", "lats", "upper_back", "shoulders", "quads", "hamstrings", "glutes", "biceps", "triceps"];
  const mt = rec.filter(r => major.includes(r.part) && r.daysSince != null);
  const avgReady = mt.length ? mt.reduce((s, r) => s + r.readiness, 0) / mt.length : 100;
  let smashed = 0;
  (history || []).slice(0, 8).forEach(h => { if (h.feedback) smashed += Object.values(h.feedback).filter(v => v < 0).length; });
  const rt = rirTrend(history);
  const advised = hardStall >= 2 || stalled >= 3 || (stalled >= 2 && avgReady < 60) || (avgReady < 48 && mt.length >= 4) || (smashed >= 5 && stalled >= 1) || rt.declining2 || (rt.declining2 && stalled >= 1);
  if (!advised) return null;
  const reasons = [];
  if (rt.declining2) reasons.push(`your reps-in-reserve has been falling for 2+ weeks (now ~${rt.latest.toFixed(1)} vs ${rt.prior.toFixed(1)} earlier) — a sign fatigue is outrunning recovery`);
  if (stalled >= 2) reasons.push(`${stalled} lifts haven't set a PR in a while`);
  if (avgReady < 60 && mt.length >= 3) reasons.push(`recovery is low across muscles (avg ${Math.round(avgReady)}%)`);
  if (smashed >= 4) reasons.push(`you've flagged muscles as "smashed" repeatedly`);
  return { reasons, stalled, avgReady: Math.round(avgReady), fatigue: rt.declining2 };
}

function Sparkline({ values, width = 140, height = 40, color = C.accent }) {
  if (!values || values.length < 2) {
    return <div style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center", color: C.faint, fontSize: 11 }}>one session so far</div>;
  }
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1, pad = 4;
  const w = width - pad * 2, h = height - pad * 2;
  const pts = values.map((v, i) => [pad + (i / (values.length - 1)) * w, pad + h - ((v - min) / range) * h]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${height - pad} L${pts[0][0].toFixed(1)},${height - pad} Z`;
  const lastPt = pts[pts.length - 1];
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <path d={area} fill={color} opacity="0.12" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="2.8" fill={color} />
    </svg>
  );
}

function PlateCalcSheet({ unit, onClose, initialBar = "barbell", initialWeight = "" }) {
  const [bar, setBar] = useState(BARS[initialBar] ? initialBar : "barbell");
  const [w, setW] = useState(initialWeight ? String(initialWeight) : "");
  const total = parseFloat(w);
  const res = total > 0 ? platesPerSide(total, bar, unit) : null;
  const achievable = res ? res.barW + res.plates.reduce((s, p) => s + p, 0) * 2 : 0;
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 60, animation: "fadeIn .2s both" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Plate calculator</div>
          <button className="pressable" onClick={onClose} style={iconBtn()}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {Object.entries(BARS).map(([k, v]) => (
            <button key={k} onClick={() => setBar(k)} className="pressable" style={{
              flex: "1 1 28%", minWidth: 70, padding: "9px 4px", borderRadius: 11, border: `1px solid ${bar === k ? C.accent : C.border}`, cursor: "pointer",
              background: bar === k ? C.accentDim : C.card, color: bar === k ? C.accent : C.muted, fontSize: 12, fontWeight: 700,
            }}>{BAR_LABEL[k] || k}<div style={{ fontSize: 10, fontWeight: 400, marginTop: 1 }}>{v[unit]} {unit}</div></button>
          ))}
        </div>
        <input inputMode="decimal" value={w} placeholder={`Target weight (${unit})`} onChange={e => setW(e.target.value)}
          className="mono" style={{ width: "100%", padding: "14px", textAlign: "center", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 14 }} />
        {res && (res.plates.length ? (
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Load per side:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {res.plates.map((p, i) => (
                <span key={i} className="mono" style={{ fontSize: 16, fontWeight: 700, color: C.accentText, background: C.accent, padding: "10px 14px", borderRadius: 10 }}>{p}</span>
              ))}
            </div>
            <div style={{ textAlign: "center", fontSize: 12.5, color: C.muted, marginTop: 12 }}>
              {res.barW} {unit} bar + {res.plates.length} plate{res.plates.length === 1 ? "" : "s"} per side
              {achievable !== total && <div style={{ color: C.warn, marginTop: 3 }}>Closest loadable: {achievable} {unit}</div>}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", fontSize: 13, color: C.muted, padding: "8px 0" }}>{total <= res.barW ? "That's at or below the empty bar." : "—"}</div>
        ))}
      </div>
    </div>
  );
}

function ProgressChart({ trend }) {
  // viewBox space so it scales to container width
  const VW = 400, VH = 230, padL = 40, padR = 14, padT = 16, padB = 30;
  const plotW = VW - padL - padR, plotH = VH - padT - padB;
  const n = trend.sessions.length;
  const allE = trend.sessions.flatMap(s => s.sets.map(x => x.e1rm));
  let lo = Math.min(...allE), hi = Math.max(...allE);
  if (lo === hi) { lo -= 1; hi += 1; }
  const span = hi - lo || 1;
  lo = lo - span * 0.12; hi = hi + span * 0.12;
  const xOf = (i) => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yOf = (v) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;
  const bestLine = trend.sessions.map((s, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(s.best).toFixed(1)}`).join(" ");
  // y gridlines
  const ticks = 4;
  const grid = Array.from({ length: ticks + 1 }, (_, k) => lo + (k / ticks) * (hi - lo));
  // PR location
  let prI = 0, prV = -1;
  trend.sessions.forEach((s, i) => { if (s.best > prV) { prV = s.best; prI = i; } });
  const dF = (t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ display: "block" }}>
      {grid.map((g, k) => (
        <g key={k}>
          <line x1={padL} y1={yOf(g)} x2={VW - padR} y2={yOf(g)} stroke={C.borderSoft} strokeWidth="1" />
          <text x={padL - 6} y={yOf(g) + 3} textAnchor="end" fontSize="9" fill={C.faint} fontFamily="monospace">{Math.round(g)}</text>
        </g>
      ))}
      {/* best-per-session area + line */}
      {n >= 2 && <path d={`${bestLine} L${xOf(n - 1).toFixed(1)},${(VH - padB).toFixed(1)} L${xOf(0).toFixed(1)},${(VH - padB).toFixed(1)} Z`} fill={C.accent} opacity="0.10" />}
      {n >= 2 && <path d={bestLine} fill="none" stroke={C.accent} strokeWidth="2" strokeLinejoin="round" />}
      {/* every set as a dot */}
      {trend.sessions.map((s, i) => s.sets.map((x, j) => {
        const jitter = s.sets.length > 1 ? (j - (s.sets.length - 1) / 2) * 4 : 0;
        return <circle key={`${i}-${j}`} cx={xOf(i) + jitter} cy={yOf(x.e1rm)} r="2.4" fill={C.muted} opacity="0.8" />;
      }))}
      {/* best markers */}
      {trend.sessions.map((s, i) => <circle key={`b${i}`} cx={xOf(i)} cy={yOf(s.best)} r="3.2" fill={C.accent} />)}
      {/* PR marker */}
      <circle cx={xOf(prI)} cy={yOf(prV)} r="6" fill="none" stroke={C.accent} strokeWidth="2" />
      <text x={xOf(prI)} y={yOf(prV) - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill={C.accent}>PR {Math.round(prV)}</text>
      {/* x labels: first & last */}
      <text x={xOf(0)} y={VH - 10} textAnchor="start" fontSize="9" fill={C.faint}>{dF(trend.first.date)}</text>
      {n >= 2 && <text x={xOf(n - 1)} y={VH - 10} textAnchor="end" fontSize="9" fill={C.faint}>{dF(trend.last.date)}</text>}
    </svg>
  );
}

function ProgressDetail({ trend, onClose, bodyweight, sex, unit: userUnit }) {
  const unit = trend.unit;
  const recent = [...trend.sessions].reverse().slice(0, 8);
  const dF = (t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const pl = plateauOf(trend);
  const lvl = strengthLevel(trend.id, trend.prBest, unit, parseFloat(bodyweight), userUnit || unit, sex);
  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, zIndex: 70, display: "flex", flexDirection: "column", animation: "fadeIn .2s both" }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onClose} className="pressable" style={{ background: "none", border: "none", color: C.text, cursor: "pointer", padding: 4 }}><ChevronLeft size={26} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trend.name}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{PART_LABEL[trend.part]} · {trend.sessionsCount} session{trend.sessionsCount === 1 ? "" : "s"}</div>
        </div>
      </div>
      <div className="wpb-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 40px" }}>
        {/* stat row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[["Best 1RM", `${trend.prBest} ${unit}`], ["Latest", `${trend.last.top.w}${trend.last.top.r != null ? "×" + trend.last.top.r : ""}`], ["Change", `${trend.delta > 0 ? "+" : ""}${trend.delta} ${unit}`]].map(([k, v], i) => (
            <div key={k} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: i === 2 && trend.delta < 0 ? C.warn : C.accent }}>{v}</div>
              <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>{k}</div>
            </div>
          ))}
        </div>
        {pl && (
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: C.warnDim, border: `1px solid ${C.warn}44`, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
            <Battery size={16} color={C.warn} style={{ flexShrink: 0, marginTop: 1 }} />
            <div><div style={{ fontSize: 13, fontWeight: 800, color: C.warn }}>Plateau detected</div><div style={{ fontSize: 12, color: C.text, marginTop: 2, lineHeight: 1.4 }}>{pl.advice}</div></div>
          </div>
        )}
        {lvl && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 9 }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Strength level</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: C.accent }}>{lvl.level} <span className="mono" style={{ color: C.muted, fontWeight: 600 }}>· {lvl.ratio.toFixed(2)}× BW</span></div>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {STD_LEVELS.slice(1).map((nm, i) => (
                <div key={nm} style={{ flex: 1, height: 8, borderRadius: 4, background: i < lvl.idx ? C.accent : C.bg2, border: i + 1 === lvl.idx ? `1px solid ${C.accent}` : "none" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: C.faint }}>
              {STD_LEVELS.slice(1).map(nm => <span key={nm} style={{ flex: 1, textAlign: "center" }}>{nm.slice(0, 4)}</span>)}
            </div>
            <div style={{ fontSize: 10.5, color: C.faint, marginTop: 8, lineHeight: 1.4 }}>Based on best est. 1RM ({trend.prBest}{unit}) vs {sex} bodyweight standards. Set bodyweight in Settings.</div>
          </div>
        )}
        {/* chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 8px 6px", marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, padding: "0 8px 6px" }}>Estimated 1RM · every set plotted</div>
          <ProgressChart trend={trend} />
        </div>
        {/* recent sessions with sets */}
        <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1, color: C.faint, textTransform: "uppercase", margin: "0 2px 10px" }}>Recent sessions</div>
        {recent.map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{dF(s.date)}</span>
              <span className="mono" style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>est 1RM {s.best}{unit}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {s.sets.map((x, j) => (
                <span key={j} className="mono" style={{ fontSize: 12, fontWeight: 700, color: x.e1rm === s.best ? C.accent : C.text, background: x.e1rm === s.best ? C.accentDim : C.bg2, padding: "3px 8px", borderRadius: 7 }}>
                  {x.w}{x.r != null ? `×${x.r}` : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecoveryTrendCard({ history }) {
  const rec = useMemo(() => muscleRecovery(history), [history]);
  const fb = useMemo(() => {
    const m = {};
    [...(history || [])].slice().reverse().forEach(h => { if (!h.feedback) return; Object.entries(h.feedback).forEach(([p, v]) => { if (v == null) return; (m[p] = m[p] || []).push(v); }); });
    Object.keys(m).forEach(p => m[p] = m[p].slice(-8));
    return m;
  }, [history]);
  const rows = rec.filter(r => r.daysSince != null || fb[r.part]).sort((a, b) => a.readiness - b.readiness);
  if (!rows.length) return null;
  const color = s => s === "fresh" ? C.accent : s === "recovering" ? (C.warn || "#e0a31e") : C.danger;
  const dot = v => v > 0 ? C.accent : v < 0 ? C.danger : C.muted;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><Activity size={16} color={C.accent} /><span style={{ fontSize: 15, fontWeight: 800 }}>Recovery &amp; feedback</span></div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>Freshness now, plus how each muscle has felt recently</div>
      {rows.map(r => (
        <div key={r.part} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{PART_LABEL[r.part]}</span>
            <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: color(r.status) }}>{r.readiness}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 99, background: C.bg2, overflow: "hidden" }}>
              <div style={{ width: `${r.readiness}%`, height: "100%", background: color(r.status), borderRadius: 99 }} />
            </div>
            {fb[r.part] && <div style={{ display: "flex", gap: 3 }}>{fb[r.part].map((v, i) => (<span key={i} title={v > 0 ? "Easy" : v < 0 ? "Smashed" : "Good"} style={{ width: 7, height: 7, borderRadius: 99, background: dot(v) }} />))}</div>}
          </div>
        </div>
      ))}
      <div style={{ fontSize: 10.5, color: C.faint, marginTop: 4, display: "flex", gap: 12, justifyContent: "flex-end" }}>
        {[["easy", C.accent], ["good", C.muted], ["smashed", C.danger]].map(([l, c]) => (<span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: 99, background: c }} />{l}</span>))}
      </div>
    </div>
  );
}

function TrainingHeatmap({ history }) {
  const { cells, months, stats } = useMemo(() => {
    const WEEKS = 18;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dow = today.getDay();
    const start = new Date(today); start.setDate(today.getDate() - dow - (WEEKS - 1) * 7);
    const key = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const totals = {};
    (history || []).forEach(h => { if (!h.date) return; const d = new Date(h.date); d.setHours(0, 0, 0, 0); const k = key(d); totals[k] = (totals[k] || 0) + (h.setsDone || 0); });
    const cells = []; const months = []; let lastMonth = -1;
    for (let w = 0; w < WEEKS; w++) {
      const col = [];
      for (let r = 0; r < 7; r++) {
        const d = new Date(start); d.setDate(start.getDate() + w * 7 + r);
        col.push({ date: new Date(d), sets: totals[key(d)] || 0, future: d > today });
      }
      const m = col[0].date.getMonth();
      if (m !== lastMonth) { months.push({ w, label: col[0].date.toLocaleDateString(undefined, { month: "short" }) }); lastMonth = m; }
      cells.push(col);
    }
    const daySet = new Set(Object.keys(totals).filter(k => totals[k] > 0));
    let cur = 0; for (let i = 0; i < 400; i++) { const d = new Date(today); d.setDate(today.getDate() - i); if (daySet.has(key(d))) cur++; else if (i > 0) break; }
    let longest = 0, run = 0;
    for (let i = 0; i < WEEKS * 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); if (d > today) break; if (daySet.has(key(d))) { run++; longest = Math.max(longest, run); } else run = 0; }
    const monthCount = (history || []).filter(h => { const d = new Date(h.date); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(); }).length;
    return { cells, months, stats: { cur, longest, monthCount } };
  }, [history]);
  const level = (s) => s <= 0 ? 0 : s <= 10 ? 1 : s <= 20 ? 2 : 3;
  const cellColor = (lv, future) => future ? "transparent" : lv === 0 ? C.bg2 : lv === 1 ? `${C.accent}44` : lv === 2 ? `${C.accent}88` : C.accent;
  const SIZE = 13, GAP = 3;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Calendar size={16} color={C.accent} /><span style={{ fontSize: 15, fontWeight: 800 }}>Training calendar</span>
      </div>
      <div className="wpb-scroll" style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "inline-block" }}>
          <div style={{ position: "relative", height: 13, marginBottom: 3 }}>
            {months.map((m, i) => (<span key={i} style={{ position: "absolute", left: m.w * (SIZE + GAP), fontSize: 9.5, color: C.faint, fontWeight: 700 }}>{m.label}</span>))}
          </div>
          <div style={{ display: "flex", gap: GAP }}>
            {cells.map((col, ci) => (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                {col.map((cell, ri) => (
                  <div key={ri} title={cell.future ? "" : `${cell.date.toLocaleDateString()} · ${cell.sets} sets`} style={{ width: SIZE, height: SIZE, borderRadius: 3, background: cellColor(level(cell.sets), cell.future), border: cell.future ? "none" : `1px solid ${C.borderSoft}` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {[["Current", `${stats.cur}d`], ["Longest", `${stats.longest}d`], ["This month", `${stats.monthCount}`]].map(([k, v]) => (
          <div key={k} style={{ flex: 1, textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>{v}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5, marginTop: 10, fontSize: 10, color: C.faint }}>
        Less {[0, 1, 2, 3].map(lv => (<span key={lv} style={{ width: 10, height: 10, borderRadius: 2, background: cellColor(lv, false), border: `1px solid ${C.borderSoft}`, display: "inline-block" }} />))} More
      </div>
    </div>
  );
}

// Achievements / milestones — borrowed from Pursuit's gamification (First Step, On a Roll, Iron Habit…)
function computeMilestones(history) {
  const n = history.length;
  const totalVol = history.reduce((a, h) => a + (h.volume || 0), 0);
  const weekKey = (d) => { const dt = new Date(d); const off = (dt.getDay() + 6) % 7; const m = new Date(dt); m.setDate(dt.getDate() - off); m.setHours(0, 0, 0, 0); return m.getTime(); };
  const byWeek = {};
  history.forEach(h => { const k = weekKey(h.date); byWeek[k] = (byWeek[k] || 0) + 1; });
  const weeks = Object.keys(byWeek).map(Number).sort((a, b) => a - b);
  const maxInWeek = weeks.length ? Math.max(...Object.values(byWeek)) : 0;
  let streak = 0, best = 0;
  for (let i = 0; i < weeks.length; i++) { streak = (i > 0 && weeks[i] - weeks[i - 1] === 7 * 86400000) ? streak + 1 : 1; best = Math.max(best, streak); }
  const tiers = [
    { id: "first", icon: "🌱", label: "First Step", desc: "Log your first workout", target: 1, value: n },
    { id: "five", icon: "🔥", label: "Getting Going", desc: "5 workouts logged", target: 5, value: n },
    { id: "fifteen", icon: "💪", label: "Committed", desc: "15 workouts logged", target: 15, value: n },
    { id: "fifty", icon: "🏋️", label: "Iron Habit", desc: "50 workouts logged", target: 50, value: n },
    { id: "century", icon: "🏆", label: "Century", desc: "100 workouts logged", target: 100, value: n },
    { id: "week3", icon: "📅", label: "Week Warrior", desc: "3 workouts in one week", target: 3, value: maxInWeek },
    { id: "streak3", icon: "⚡", label: "On a Roll", desc: "Train 3 weeks straight", target: 3, value: best },
    { id: "streak8", icon: "🔗", label: "Unbroken", desc: "Train 8 weeks straight", target: 8, value: best },
    { id: "vol1", icon: "🪨", label: "Tonnage", desc: "50k total volume lifted", target: 50000, value: totalVol },
    { id: "vol2", icon: "⛰️", label: "Heavy Mover", desc: "250k total volume lifted", target: 250000, value: totalVol },
    { id: "vol3", icon: "🌋", label: "Million Club", desc: "1M total volume lifted", target: 1000000, value: totalVol },
  ];
  return tiers.map(t => ({ ...t, done: t.value >= t.target, progress: Math.min(1, t.value / t.target) }));
}
function MilestonesCard({ history }) {
  const ms = useMemo(() => computeMilestones(history), [history]);
  const earned = ms.filter(m => m.done);
  const next = ms.find(m => !m.done);
  const fmt = (v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(Math.round(v));
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: next ? 12 : 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Trophy size={15} color={C.accent} /><span style={{ fontSize: 14.5, fontWeight: 800 }}>Achievements</span></div>
        <span className="mono" style={{ fontSize: 12.5, fontWeight: 800, color: C.muted }}>{earned.length}/{ms.length}</span>
      </div>
      {next && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12.5, color: C.text }}><span style={{ marginRight: 5 }}>{next.icon}</span>Next: <span style={{ fontWeight: 700 }}>{next.label}</span></span>
            <span className="mono" style={{ fontSize: 11, color: C.faint }}>{fmt(next.value)}/{fmt(next.target)}</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: C.bg2, overflow: "hidden" }}>
            <div style={{ width: `${Math.round(next.progress * 100)}%`, height: "100%", background: C.accent, borderRadius: 99 }} />
          </div>
        </div>
      )}
      <div className="wpb-scroll" style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 2 }}>
        {ms.map(m => (
          <div key={m.id} title={`${m.label} — ${m.desc}`} style={{ flexShrink: 0, width: 60, textAlign: "center", opacity: m.done ? 1 : 0.4 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: m.done ? C.accentDim : C.bg2, border: `1px solid ${m.done ? C.accent + "55" : C.border}`, filter: m.done ? "none" : "grayscale(1)" }}>{m.icon}</div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: m.done ? C.text : C.faint, marginTop: 5, lineHeight: 1.2 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function HistoryView({ history, onBack, onClear, embedded, bodyweight, sex, unit, bwLog, onLogBodyweight, goals = {}, onRepeat, measurements = {}, onLogMeasurement }) {
  const [tab, setTab] = useState("sessions");
  const [detail, setDetail] = useState(null);
  const [expandedPR, setExpandedPR] = useState(false);
  const [bwInput, setBwInput] = useState("");
  const [mInputs, setMInputs] = useState({});
  const trends = useMemo(() => exerciseTrends(history), [history]);
  const weekVol = useMemo(() => weeklyActualVolume(history, 7), [history]);
  const inRangeTrend = useMemo(() => {
    const volWindow = (start, end) => {
      const map = {};
      (history || []).forEach(h => {
        if (!h.date || h.date <= start || h.date > end) return;
        Object.entries(h.perf || {}).forEach(([id, p]) => {
          const ex = EX_BY_ID[id]; const n = ex && p.sets ? p.sets.length : 0; if (!n) return;
          map[ex.part] = (map[ex.part] || 0) + n;
          secondaryOf(ex).forEach(([pp, f]) => { map[pp] = (map[pp] || 0) + n * f; });
        });
      });
      return map;
    };
    const out = []; const now = Date.now();
    for (let w = 5; w >= 0; w--) {
      const end = now - w * 7 * 86400000, start = end - 7 * 86400000;
      const vol = volWindow(start, end);
      let inRange = 0, trained = 0;
      PART_ORDER.forEach(p => { const v = vol[p] || 0; if (v > 0.05) { trained++; if (volumeZone(p, v).label === "productive") inRange++; } });
      out.push({ inRange, trained });
    }
    return out;
  }, [history]);
  const advice = useMemo(() => volumeAdvice(history), [history]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: embedded ? "26px 18px 0" : "16px 16px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!embedded && <button onClick={onBack} className="pressable" style={{ background: "none", border: "none", color: C.text, cursor: "pointer", padding: 4 }}><ChevronLeft size={26} /></button>}
          <div style={{ flex: 1, fontSize: embedded ? 30 : 20, fontWeight: 800, letterSpacing: embedded ? -0.6 : 0 }}>{embedded ? "Progress" : "History"}</div>
          {history.length > 0 && <button onClick={onClear} className="pressable" style={{ ...tinyBtn(), width: "auto", height: 32, padding: "0 10px", fontSize: 12, fontWeight: 700, color: C.danger, borderColor: C.dangerDim }}>Clear</button>}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
          {[["sessions", "Sessions"], ["progress", "Lifts"], ["body", "Body"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className="pressable" style={{
              padding: "10px 4px", flex: 1, background: "none", border: "none", borderBottom: `2px solid ${tab === k ? C.accent : "transparent"}`,
              color: tab === k ? C.text : C.muted, fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="wpb-scroll" style={{ flex: 1, overflowY: "auto", padding: "14px 16px 40px" }}>
        {tab === "body" ? (() => {
          const sorted = [...(bwLog || [])];
          const cur = sorted.length ? sorted[sorted.length - 1] : null;
          const first = sorted.length ? sorted[0] : null;
          const change = cur && first ? +(cur.w - first.w).toFixed(1) : 0;
          const vals = sorted.map(e => e.w);
          return (
            <>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: sorted.length >= 2 ? 12 : 0 }}>
                  <div>
                    <div style={{ fontSize: 12, color: C.muted }}>Current</div>
                    <div className="mono" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>{cur ? cur.w : "—"}<span style={{ fontSize: 15, color: C.muted, fontWeight: 600 }}> {cur ? cur.unit : unit}</span></div>
                  </div>
                  {sorted.length >= 2 && (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: C.muted }}>Since start</div>
                      <div className="mono" style={{ fontSize: 17, fontWeight: 800, color: change > 0 ? C.accent : change < 0 ? C.warn : C.muted }}>{change > 0 ? "+" : ""}{change} {cur.unit}</div>
                    </div>
                  )}
                </div>
                {sorted.length >= 2 && <Sparkline values={vals} width={400} height={90} />}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                <input inputMode="decimal" value={bwInput} onChange={e => setBwInput(e.target.value)} placeholder={`Today's weight (${unit})`}
                  className="mono" style={{ flex: 1, padding: "13px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 15, fontWeight: 700 }} />
                <button onClick={() => { onLogBodyweight(bwInput); setBwInput(""); }} disabled={!(parseFloat(bwInput) > 0)} className="pressable" style={{ padding: "0 20px", borderRadius: 12, border: "none", background: parseFloat(bwInput) > 0 ? C.accent : C.card, color: parseFloat(bwInput) > 0 ? C.accentText : C.faint, fontWeight: 800, fontSize: 14.5, cursor: "pointer" }}>Log</button>
              </div>
              {sorted.length === 0 ? (
                <div style={{ marginTop: 24, textAlign: "center", color: C.faint }}>
                  <TrendingUp size={42} color={C.border} style={{ margin: "0 auto" }} />
                  <div style={{ marginTop: 12, fontSize: 14, color: C.muted }}>Log your bodyweight to track the trend.</div>
                  <div style={{ fontSize: 12.5, marginTop: 3 }}>It also powers your strength-level standards.</div>
                </div>
              ) : (
                [...sorted].reverse().map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: C.muted }}>{new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="mono" style={{ fontSize: 15, fontWeight: 700 }}>{e.w} {e.unit}</span>
                  </div>
                ))
              )}

              {onLogMeasurement && (
                <>
                  <div style={{ marginTop: 26, fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 10 }}>Body measurements ({unit === "lb" ? "in" : "cm"})</div>
                  {[["waist", "Waist"], ["chest", "Chest"], ["arms", "Arm (flexed)"], ["thighs", "Thigh"], ["hips", "Hips"], ["shoulders", "Shoulders"], ["calves", "Calf"], ["neck", "Neck"]].map(([key, label]) => {
                    const log = measurements[key] || [];
                    const latest = log[log.length - 1];
                    const delta = log.length > 1 ? +(latest.v - log[0].v).toFixed(1) : 0;
                    return (
                      <div key={key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "11px 13px", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{label}</div>
                            {latest ? (
                              <div className="mono" style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{latest.v}{delta !== 0 && <span style={{ color: delta > 0 ? C.warn : C.accent }}> · {delta > 0 ? "+" : ""}{delta}</span>}</div>
                            ) : <div style={{ fontSize: 11, color: C.faint, marginTop: 1 }}>not logged</div>}
                          </div>
                          {log.length > 1 && <Sparkline values={log.map(e => e.v)} width={88} height={32} />}
                          <input inputMode="decimal" value={mInputs[key] || ""} onChange={e => setMInputs(p => ({ ...p, [key]: e.target.value.replace(/[^0-9.]/g, "") }))} placeholder={latest ? String(latest.v) : "—"}
                            className="mono" style={{ width: 58, padding: "9px 8px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, fontSize: 14, fontWeight: 700, textAlign: "center" }} />
                          <button onClick={() => { onLogMeasurement(key, mInputs[key]); setMInputs(p => ({ ...p, [key]: "" })); }} disabled={!(parseFloat(mInputs[key]) > 0)} className="pressable" style={{ padding: "9px 13px", borderRadius: 10, border: "none", background: parseFloat(mInputs[key]) > 0 ? C.accent : C.card, color: parseFloat(mInputs[key]) > 0 ? C.accentText : C.faint, fontWeight: 800, fontSize: 13, cursor: parseFloat(mInputs[key]) > 0 ? "pointer" : "default" }}>Log</button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          );
        })() : history.length === 0 ? (
          <div style={{ marginTop: 40, textAlign: "center", color: C.faint }}>
            <TrendingUp size={46} color={C.border} style={{ margin: "0 auto" }} />
            <div style={{ marginTop: 14, fontSize: 15, color: C.muted }}>No workouts logged yet.</div>
            <div style={{ fontSize: 13.5, marginTop: 4 }}>Hit play on a day to start training.</div>
          </div>
        ) : tab === "sessions" ? (
          history.length === 0 ? (
            <div style={{ marginTop: 40, textAlign: "center", color: C.faint }}>
              <Calendar size={46} color={C.border} style={{ margin: "0 auto" }} />
              <div style={{ marginTop: 14, fontSize: 15, color: C.muted }}>No workouts logged yet.</div>
              <div style={{ fontSize: 13.5, marginTop: 4 }}>Finish a session and it'll show up here, building your streak and training heatmap.</div>
            </div>
          ) : (
          <>
            <TrainingHeatmap history={history} />
            <MilestonesCard history={history} />
            {history.map(h => (
            <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accentDim, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: C.accent, lineHeight: 1 }}>{new Date(h.date).getDate()}</span>
                <span style={{ fontSize: 8.5, color: C.accent, textTransform: "uppercase" }}>{new Date(h.date).toLocaleDateString(undefined, { month: "short" })}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.dayLabel}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{h.programName}</div>
                <div className="mono" style={{ fontSize: 11, color: C.faint, marginTop: 3 }}>{h.setsDone} sets · {h.volume.toLocaleString()} {h.unit || "kg"} · {h.durationMin}m</div>
              </div>
              {onRepeat && (
                <button onClick={() => onRepeat(h)} title="Repeat this workout" className="pressable" style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, border: `1px solid ${C.border}`, background: C.bg2, color: C.accent, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RefreshCw size={16} />
                </button>
              )}
            </div>
            ))}
          </>
          )
        ) : trends.length === 0 && Object.keys(weekVol).length === 0 ? (
          <div style={{ marginTop: 40, textAlign: "center", color: C.faint }}>
            <BarChart3 size={46} color={C.border} style={{ margin: "0 auto" }} />
            <div style={{ marginTop: 14, fontSize: 15, color: C.muted }}>No lift data yet.</div>
            <div style={{ fontSize: 13.5, marginTop: 4 }}>Log weights in a workout to track progress.</div>
          </div>
        ) : (
          <>
            <RecoveryTrendCard history={history} />
            {(() => {
              const trends = exerciseTrends(history);
              if (!trends.length) return null;
              const records = trends.map(t => {
                let heavy = { w: 0, r: 0 }, bestVol = 0, bestReps = { w: 0, r: 0 };
                t.sessions.forEach(s => {
                  let vol = 0;
                  s.sets.forEach(st => {
                    vol += (st.w || 0) * (st.r || 0);
                    if (st.w > heavy.w) heavy = { w: st.w, r: st.r };
                    if ((st.r || 0) > bestReps.r) bestReps = { w: st.w, r: st.r };
                  });
                  if (vol > bestVol) bestVol = vol;
                });
                return { t, prBest: t.prBest, unit: t.unit, heavy, bestVol, name: t.name, n: t.sessionsCount, lvl: strengthLevel(t.id, t.prBest, t.unit, parseFloat(bodyweight), unit, sex) };
              }).sort((a, b) => b.prBest - a.prBest);
              const show = expandedPR ? records : records.slice(0, 5);
              return (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                    <Award size={15} color={C.accent} /><div style={{ fontSize: 14.5, fontWeight: 800 }}>Personal records</div>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: C.faint, fontWeight: 700 }}>{records.length} lift{records.length === 1 ? "" : "s"}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 12 }}>Estimated 1RM &amp; heaviest set logged</div>
                  {show.map((r, i) => (
                    <button key={r.t.id} onClick={() => setDetail(r.t)} className="pressable" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: i === 0 ? "none" : `1px solid ${C.borderSoft}`, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                          {r.lvl && r.lvl.idx > 0 && <span style={{ flexShrink: 0, fontSize: 9, fontWeight: 800, letterSpacing: .3, textTransform: "uppercase", padding: "2px 6px", borderRadius: 6, color: r.lvl.idx >= 4 ? C.warn : C.accent, background: r.lvl.idx >= 4 ? C.warnDim : C.accentDim }}>{r.lvl.level}</span>}
                        </div>
                        <div className="mono" style={{ fontSize: 11, color: C.faint, marginTop: 1 }}>top {Math.round(r.heavy.w)}{r.heavy.r ? `×${r.heavy.r}` : ""} {r.unit} · {r.n} session{r.n === 1 ? "" : "s"}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div className="mono" style={{ fontSize: 15, fontWeight: 800, color: C.accent }}>{Math.round(r.prBest)}</div>
                        <div style={{ fontSize: 9.5, color: C.faint, textTransform: "uppercase", letterSpacing: .3 }}>est 1RM</div>
                      </div>
                      <ChevronRight size={15} color={C.faint} style={{ flexShrink: 0 }} />
                    </button>
                  ))}
                  {records.length > 5 && (
                    <button onClick={() => setExpandedPR(v => !v)} className="pressable" style={{ width: "100%", marginTop: 10, padding: "9px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg2, color: C.muted, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>{expandedPR ? "Show less" : `Show all ${records.length}`}</button>
                  )}
                </div>
              );
            })()}
            {(() => {
              const cutoff = Date.now() - 28 * 86400000;
              const recent = (history || []).filter(h => h.date >= cutoff);
              const rep = { strength: 0, hypertrophy: 0, endurance: 0 };
              const eff = { failure: 0, hard: 0, moderate: 0 };
              let withRIR = 0, totalSets = 0;
              recent.forEach(h => Object.values(h.perf || {}).forEach(p => (p.sets || []).forEach(s => {
                const r = s.r || 0; if (r <= 0) return;
                totalSets++;
                rep[r <= 5 ? "strength" : r <= 12 ? "hypertrophy" : "endurance"]++;
                if (s.rir != null) { withRIR++; eff[s.rir <= 0 ? "failure" : s.rir <= 2 ? "hard" : "moderate"]++; }
              })));
              if (totalSets < 3) return null;
              const useEffort = withRIR >= Math.max(3, totalSets * 0.5);   // most sets carry a logged RIR
              const zones = useEffort ? eff : rep;
              const total = useEffort ? withRIR : totalSets;
              const ZD = useEffort ? [
                { key: "failure", label: "To failure", sub: "0 RIR", color: "#E85D5D" },
                { key: "hard", label: "Hard", sub: "1–2 RIR", color: "#F7955C" },
                { key: "moderate", label: "Moderate", sub: "3+ RIR", color: "#62C0A0" },
              ] : [
                { key: "strength", label: "Strength", sub: "1–5 reps", color: "#E85D5D" },
                { key: "hypertrophy", label: "Hypertrophy", sub: "6–12 reps", color: "#F7955C" },
                { key: "endurance", label: "Endurance", sub: "13+ reps", color: "#62C0A0" },
              ];
              const pct = (k) => Math.round(zones[k] / total * 100);
              return (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                    <Activity size={15} color={C.accent} /><div style={{ fontSize: 14.5, fontWeight: 800 }}>Intensity distribution</div>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: C.faint, fontWeight: 700 }}>last 4 weeks</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 12 }}>{useEffort ? "Working sets by logged effort (reps in reserve)" : "Working sets by rep-range stimulus"}</div>
                  <div style={{ display: "flex", height: 14, borderRadius: 99, overflow: "hidden", background: C.bg2, marginBottom: 14 }}>
                    {ZD.map(z => zones[z.key] > 0 && (
                      <div key={z.key} title={`${z.label}: ${pct(z.key)}%`} style={{ width: `${zones[z.key] / total * 100}%`, height: "100%", background: z.color }} />
                    ))}
                  </div>
                  {ZD.map((z, i) => (
                    <div key={z.key} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: i < ZD.length - 1 ? 9 : 0 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 99, background: z.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{z.label}</span>
                      <span style={{ fontSize: 11, color: C.faint }}>{z.sub}</span>
                      <span className="mono" style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: C.muted }}>{zones[z.key]} sets · {pct(z.key)}%</span>
                    </div>
                  ))}
                  {!useEffort && withRIR > 0 && <div style={{ fontSize: 10.5, color: C.faint, marginTop: 11 }}>Log “reps left” on more sets to see this by true effort.</div>}
                </div>
              );
            })()}
            {(() => {
              const rt = rirTrend(history);
              const pts = rt.pts.slice(-6);
              if (pts.length < 2 || rt.n < 6) return null;
              const latest = rt.latest, prior = rt.prior;
              const diff = latest - prior;
              const down = diff <= -0.3;
              const msg = rt.declining2 ? "Your reserve has dropped for 2+ weeks — fatigue is likely outrunning recovery. A deload now will set up your next push."
                : diff <= -0.6 ? "You're leaving less in reserve than usual — fatigue may be accumulating. Mind sleep & nutrition."
                : diff >= 0.6 ? "Lots in reserve lately — you look well recovered and ready to push."
                : "Effort is steady week to week.";
              return (
                <div style={{ background: C.card, border: `1px solid ${rt.declining2 ? (C.warn || "#e0a31e") + "66" : C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                    <Battery size={15} color={down ? C.warn : C.accent} /><div style={{ fontSize: 14.5, fontWeight: 800 }}>Fatigue trend</div>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: C.faint, fontWeight: 700 }}>avg reps in reserve</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 12 }}>From the “reps left” you log each set</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 10 }}>
                    <span className="mono" style={{ fontSize: 26, fontWeight: 900, color: down ? C.warn : C.accent, lineHeight: 1 }}>{latest.toFixed(1)}</span>
                    <span style={{ fontSize: 11.5, color: C.muted, marginBottom: 2 }}>this week {diff >= 0.3 ? "▲" : down ? "▼" : "→"} vs {prior.toFixed(1)} prior</span>
                    <div style={{ marginLeft: "auto" }}><Sparkline values={pts} width={96} height={34} color={down ? C.warn : C.accent} /></div>
                  </div>
                  <div style={{ fontSize: 11.5, color: rt.declining2 ? C.text : C.muted, lineHeight: 1.5 }}>{msg}</div>
                </div>
              );
            })()}
            {(() => {
              const entries = Object.entries(goals).filter(([, w]) => w > 0);
              if (!entries.length) return null;
              const rows = entries.map(([exId, goal]) => {
                let bestW = 0;
                (history || []).forEach(h => (h.perf?.[exId]?.sets || []).forEach(s => { if (s.w > bestW) bestW = s.w; }));
                const ex = EX_BY_ID[exId];
                return { exId, name: ex?.name || exId, goal, bestW, pct: goal > 0 ? clamp(Math.round(bestW / goal * 100), 0, 100) : 0, reached: bestW >= goal };
              }).sort((a, b) => (a.reached === b.reached ? b.pct - a.pct : a.reached ? 1 : -1));
              return (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                    <Target size={15} color={C.accent} /><div style={{ fontSize: 14.5, fontWeight: 800 }}>Goals</div>
                    <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.muted, fontWeight: 700 }}>{rows.filter(r => r.reached).length}/{rows.length} reached</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 12 }}>Best logged weight vs your target</div>
                  {rows.map((r, i) => (
                    <div key={r.exId} style={{ marginBottom: i < rows.length - 1 ? 12 : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 8 }}>{r.name}</span>
                        <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: r.reached ? C.accent : C.muted, flexShrink: 0 }}>{Math.round(r.bestW)}/{r.goal} {unit}{r.reached ? " ✓" : ""}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: C.bg2, overflow: "hidden" }}>
                        <div style={{ width: `${r.pct}%`, height: "100%", background: C.accent, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
            {Object.keys(weekVol).length > 0 && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 14.5, fontWeight: 800 }}>Volume vs targets</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>Logged sets per muscle this week against MEV–MRV</div>
                {(() => {
                  const trained = PART_ORDER.filter(p => (weekVol[p] || 0) > 0.05);
                  let productive = 0, under = 0, over = 0;
                  trained.forEach(p => { const z = volumeZone(p, weekVol[p]); if (z.label === "productive") productive++; else if (z.label === "below MEV") under++; else over++; });
                  const chip = (n, label, color) => n > 0 && (
                    <div style={{ flex: 1, textAlign: "center", background: C.bg2, borderRadius: 10, padding: "8px 4px", border: `1px solid ${color}33` }}>
                      <div className="mono" style={{ fontSize: 18, fontWeight: 800, color }}>{n}</div>
                      <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .3 }}>{label}</div>
                    </div>
                  );
                  return (
                    <div style={{ display: "flex", gap: 7, marginBottom: 6 }}>
                      {chip(productive, "in range", C.accent)}
                      {chip(under, "below MEV", C.muted)}
                      {chip(over, "over MRV", C.warn)}
                    </div>
                  );
                })()}
                {(() => {
                  const weeksWithData = inRangeTrend.filter(w => w.trained > 0).length;
                  if (weeksWithData < 2) return null;
                  const maxV = Math.max(...inRangeTrend.map(w => w.trained), 1);
                  return (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: .4, marginBottom: 7 }}>Muscles in range · last 6 weeks</div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 46 }}>
                        {inRangeTrend.map((w, i) => {
                          const h = w.trained ? Math.max(8, (w.inRange / maxV) * 46) : 3;
                          const isNow = i === inRangeTrend.length - 1;
                          return (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                              <span className="mono" style={{ fontSize: 9.5, fontWeight: 700, color: w.trained ? (isNow ? C.accent : C.muted) : C.faint }}>{w.trained ? w.inRange : "–"}</span>
                              <div title={`${w.inRange}/${w.trained} in range`} style={{ width: "100%", height: h, borderRadius: 5, background: w.trained ? (isNow ? C.accent : C.accent + "66") : C.bg2 }} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
                {(() => {
                  const rt = rirTrend(history);
                  if (!rt.declining2) return null;
                  const trained = PART_ORDER.filter(p => (weekVol[p] || 0) > 0.05);
                  const over = trained.filter(p => volumeZone(p, weekVol[p]).label === "over MRV");
                  const targets = (over.length ? over : trained.slice().sort((a, b) => weekVol[b] - weekVol[a]).slice(0, 2)).map(p => PART_LABEL[p]);
                  return (
                    <div style={{ display: "flex", gap: 9, alignItems: "flex-start", background: (C.warn || "#e0a31e") + "14", border: `1px solid ${(C.warn || "#e0a31e")}44`, borderRadius: 12, padding: "10px 12px", margin: "4px 0 12px" }}>
                      <Battery size={14} color={C.warn} style={{ flexShrink: 0, marginTop: 1 }} />
                      <div style={{ fontSize: 11.5, color: C.text, lineHeight: 1.45 }}>Your reps-in-reserve is trending down. {over.length ? "You're over MRV on" : "Fatigue tends to pool in your highest-volume work —"} <span style={{ fontWeight: 700 }}>{targets.join(" & ")}</span>; pulling a set or two there (or taking a deload) will likely restore your reserve.</div>
                    </div>
                  );
                })()}
                <VolumeBars volume={weekVol} />
              </div>
            )}
            {advice.length > 0 && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                  <Wand2 size={15} color={C.accent} /><div style={{ fontSize: 14.5, fontWeight: 800 }}>Next block volume</div>
                </div>
                <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>Auto-regulated from last week's logged volume & progress</div>
                {advice.map(a => {
                  const up = a.delta > 0, flat = a.delta === 0;
                  const col = up ? C.accent : flat ? C.muted : C.warn;
                  return (
                    <div key={a.part} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${C.borderSoft}` }}>
                      <div style={{ width: 62, flexShrink: 0, fontSize: 13, fontWeight: 700 }}>{PART_LABEL[a.part]}</div>
                      <div style={{ width: 52, flexShrink: 0, textAlign: "center", fontSize: 12.5, fontWeight: 800, color: col, background: up ? C.accentDim : flat ? C.bg2 : C.warnDim, borderRadius: 8, padding: "3px 0" }} className="mono">{up ? `+${a.delta}` : flat ? "hold" : a.delta}</div>
                      <div style={{ flex: 1, fontSize: 11, color: C.muted, lineHeight: 1.35 }}>{a.reason}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {trends.map(t => {
              const col = t.delta > 0 ? C.accent : t.delta < 0 ? C.warn : C.muted;
              const pl = plateauOf(t);
              return (
                <button key={t.id} onClick={() => setDetail(t)} className="pressable opt" style={{ display: "block", width: "100%", textAlign: "left", background: C.card, border: `1px solid ${pl ? C.warnDim : C.border}`, borderRadius: 16, padding: 14, marginBottom: 10, color: C.text, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{PART_LABEL[t.part]} · {t.sessionsCount} session{t.sessionsCount === 1 ? "" : "s"}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                      {pl && <div style={{ fontSize: 10.5, fontWeight: 800, color: C.warn, background: C.warnDim, padding: "3px 8px", borderRadius: 8, display: "flex", alignItems: "center", gap: 4 }}><Battery size={11} /> Stalled</div>}
                      {t.sessionsCount >= 2 && (
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: col, background: t.delta > 0 ? C.accentDim : t.delta < 0 ? C.warnDim : C.bg2, padding: "3px 8px", borderRadius: 8 }}>
                          {t.delta > 0 ? "+" : ""}{t.delta} {t.unit} 1RM
                        </div>
                      )}
                    </div>
                  </div>
                  {pl && <div style={{ fontSize: 11, color: C.warn, marginTop: 8, lineHeight: 1.4 }}>{pl.advice}</div>}
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 10, gap: 10 }}>
                    <Sparkline values={t.pts} />
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{t.last.top.w}{t.last.top.r != null ? <span style={{ color: C.faint }}>×{t.last.top.r}</span> : ""}</div>
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>last · est 1RM {t.last.best}{t.unit}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>
      {detail && <ProgressDetail trend={detail} onClose={() => setDetail(null)} bodyweight={bodyweight} sex={sex} unit={unit} />}
    </div>
  );
}

const iconBtn = () => ({ width: 38, height: 38, borderRadius: 11, border: `1px solid ${C.border}`, background: C.card, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 });
const tinyBtn = () => ({ width: 30, height: 30, borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" });
const miniInput = (w) => ({ width: w, padding: "7px 6px", textAlign: "center", borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 14, fontWeight: 700 });

/* ============================== HOME / LIBRARY ============================== */
function DeloadAdviceCard({ history, onDeload, canDeload }) {
  const a = useMemo(() => deloadAdvice(history), [history]);
  if (!a) return null;
  return (
    <div style={{ background: `${C.warn || "#e0a31e"}1a`, border: `1px solid ${C.warn || "#e0a31e"}55`, borderRadius: 18, padding: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Battery size={17} color={C.warn || "#e0a31e"} />
        <span style={{ fontSize: 15, fontWeight: 800 }}>A deload looks due</span>
      </div>
      <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.5, marginBottom: a.reasons.length ? 8 : 0 }}>
        Fatigue is outpacing recovery. A lighter week — roughly half the sets and ~10% less load — will let progress rebound.
      </div>
      {a.reasons.length > 0 && (
        <div style={{ marginBottom: canDeload ? 12 : 0 }}>
          {a.reasons.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, color: C.muted, marginTop: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: C.warn || "#e0a31e", flexShrink: 0, marginTop: 6 }} />{r}
            </div>
          ))}
        </div>
      )}
      {canDeload && (
        <button onClick={onDeload} className="pressable" style={{ width: "100%", marginTop: 4, padding: "12px", borderRadius: 12, border: "none", background: C.warn || "#e0a31e", color: "#1a1500", fontSize: 13.5, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <Battery size={15} /> Train this week's deload now
        </button>
      )}
    </div>
  );
}

function WeeklyRecapCard({ history, unit }) {
  const r = useMemo(() => weeklyRecap(history), [history]);
  if (!r.count) return null;
  const delta = (cur, prev) => { if (!prev) return null; const d = Math.round((cur - prev) / prev * 100); return d; };
  const vd = delta(r.vol, r.prevVol), sd = delta(r.sets, r.prevSets);
  const Arrow = ({ d }) => d == null ? null : <span style={{ fontSize: 10.5, fontWeight: 700, color: d > 0 ? C.accent : d < 0 ? C.warn : C.muted, marginLeft: 4 }}>{d > 0 ? "▲" : d < 0 ? "▼" : ""}{d !== 0 ? `${Math.abs(d)}%` : "—"}</span>;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><BarChart3 size={16} color={C.accent} /><span style={{ fontSize: 15, fontWeight: 800 }}>This week</span></div>
        {r.prs > 0 && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: C.accent }}><Trophy size={13} /> {r.prs} PR{r.prs === 1 ? "" : "s"}</span>}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {[["Workouts", r.count, null], ["Sets", r.sets, sd], ["Volume", `${(r.vol / 1000).toFixed(r.vol >= 10000 ? 0 : 1)}k`, vd]].map(([k, v, d]) => (
          <div key={k} style={{ flex: 1, background: C.bg2, borderRadius: 12, padding: "11px 6px", textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 18, fontWeight: 800, color: C.text, lineHeight: 1 }}>{v}<Arrow d={d} /></div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4, fontWeight: 700 }}>{k}</div>
          </div>
        ))}
      </div>
      {r.topMuscle && <div style={{ fontSize: 12, color: C.muted, marginTop: 12, paddingTop: 11, borderTop: `1px solid ${C.borderSoft}` }}><span style={{ color: C.accent, fontWeight: 700 }}>Most trained:</span> {PART_LABEL[r.topMuscle[0]]} ({r.topMuscle[1]} sets){r.prevCount ? ` · ${r.count >= r.prevCount ? "on pace with" : "behind"} last week (${r.prevCount})` : ""}</div>}
    </div>
  );
}

function MuscleRecoveryCard({ history, onLight, canLight }) {
  const rec = useMemo(() => muscleRecovery(history), [history]);
  const trained = rec.filter(r => r.daysSince != null).sort((a, b) => a.readiness - b.readiness);
  if (!trained.length) return null;
  const color = (s) => s === "fresh" ? C.accent : s === "recovering" ? (C.warn || "#e0a31e") : C.danger;
  const major = ["chest", "lats", "upper_back", "shoulders", "quads", "hamstrings", "glutes", "biceps", "triceps"];
  const ready = rec.filter(r => r.readiness >= 85 && major.includes(r.part)).map(r => PART_LABEL[r.part]).slice(0, 4);
  const majorTrained = rec.filter(r => major.includes(r.part) && r.daysSince != null);
  const avgReady = majorTrained.length ? majorTrained.reduce((s, r) => s + r.readiness, 0) / majorTrained.length : 100;
  const fatigued = majorTrained.filter(r => r.readiness < 50).length;
  const restAdvised = majorTrained.length >= 3 && (avgReady < 50 || fatigued >= Math.ceil(majorTrained.length * 0.6));
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: "16px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Activity size={16} color={C.accent} />
        <span style={{ fontSize: 15, fontWeight: 800 }}>Muscle recovery</span>
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>Estimated freshness from your recent sessions</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
        {trained.slice(0, 10).map(r => (
          <div key={r.part}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: C.text }}>{PART_LABEL[r.part]}</span>
              <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: color(r.status) }}>{r.readiness}%</span>
            </div>
            <div style={{ height: 5, borderRadius: 99, background: C.bg2, overflow: "hidden" }}>
              <div style={{ width: `${r.readiness}%`, height: "100%", background: color(r.status), borderRadius: 99, transition: "width .4s" }} />
            </div>
          </div>
        ))}
      </div>
      {restAdvised ? (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.borderSoft}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: C.text }}>
            <Battery size={15} color={C.warn || "#e0a31e"} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Most muscles are still fatigued. Rest, or do a light active-recovery session — reduced volume and easy effort to drive blood flow without adding fatigue.</span>
          </div>
          {canLight && (
            <button onClick={onLight} className="pressable" style={{ width: "100%", marginTop: 11, padding: "11px", borderRadius: 11, border: `1px solid ${C.accent}55`, background: C.accentDim, color: C.accent, fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Activity size={14} /> Do a light session instead
            </button>
          )}
        </div>
      ) : ready.length > 0 && (
        <div style={{ fontSize: 12, color: C.muted, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.borderSoft}` }}>
          <span style={{ color: C.accent, fontWeight: 700 }}>Fresh &amp; ready:</span> {ready.join(", ")}
        </div>
      )}
    </div>
  );
}

function StrengthSnapshotCard({ history, bodyweight, sex, unit, onHistory }) {
  const snap = useMemo(() => strengthSnapshot(history, parseFloat(bodyweight), unit, sex), [history, bodyweight, sex, unit]);
  if (!snap) return null;
  const next = snap.overallIdx < 5 ? STD_LEVELS[snap.overallIdx + 1] : null;
  const frac = snap.score / 5;
  const top = snap.lifts.slice(0, 4);
  return (
    <button onClick={onHistory} className="pressable" style={{ width: "100%", textAlign: "left", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14, cursor: "pointer", color: C.text }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <Award size={15} color={C.accent} /><span style={{ fontSize: 14.5, fontWeight: 800 }}>Strength level</span>
        <ChevronRight size={15} color={C.faint} style={{ marginLeft: "auto" }} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.6, color: snap.overallIdx >= 4 ? C.warn : C.accent, lineHeight: 1 }}>{snap.overallLabel}</span>
        <span style={{ fontSize: 11.5, color: C.muted, marginBottom: 2 }}>across {snap.lifts.length} lift{snap.lifts.length === 1 ? "" : "s"}</span>
      </div>
      <div style={{ height: 7, borderRadius: 99, background: C.bg2, overflow: "hidden", marginBottom: next ? 5 : 12 }}>
        <div style={{ width: `${Math.round(frac * 100)}%`, height: "100%", background: snap.overallIdx >= 4 ? C.warn : C.accent, borderRadius: 99 }} />
      </div>
      {next && <div style={{ fontSize: 11, color: C.faint, marginBottom: 12 }}>Progressing toward <span style={{ color: C.muted, fontWeight: 700 }}>{next}</span></div>}
      <div className="wpb-scroll" style={{ display: "flex", gap: 7, overflowX: "auto" }}>
        {top.map(l => (
          <div key={l.id} style={{ flexShrink: 0, padding: "7px 10px", borderRadius: 11, background: C.bg2, border: `1px solid ${C.borderSoft}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>{l.name}</div>
            <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: .3, color: l.lvl.idx >= 4 ? C.warn : C.accent, marginTop: 2 }}>{l.lvl.level}</div>
          </div>
        ))}
      </div>
    </button>
  );
}
function WhatsNewCard({ onDismiss }) {
  const items = [
    [Activity, "Reps-in-reserve logging", "Tap how many reps you had left after a set — the next set and your next session's opening weights retune to it."],
    [Battery, "Fatigue trend & smart deloads", "Your logged effort drives a weekly fatigue read and a proactive deload that names the muscles to trim."],
    [Award, "Records, strength levels & PRs", "A personal-records board, a bodyweight-relative strength level, achievements, and live PR flashes at the rack."],
    [BarChart3, "Share your session", "A clean recap card (text or image) when you finish, plus CSV/Health-style exports."],
    [Layers, "Built for your gym", "Microplate-aware loading, an available-plates picker, per-exercise rest, reminders, and 7 themes."],
  ];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.accent}55`, borderRadius: 18, padding: "16px 16px 14px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Zap size={16} color={C.accent} /><span style={{ fontSize: 15, fontWeight: 800 }}>What's new</span>
        <button onClick={onDismiss} className="pressable" style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 8, border: "none", background: C.bg2, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={15} /></button>
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>A lot landed since you were last here</div>
      {items.map(([Icon, title, sub], i) => (
        <div key={i} style={{ display: "flex", gap: 11, marginBottom: i < items.length - 1 ? 13 : 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={16} color={C.accent} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>{title}</div>
            <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.45, marginTop: 1 }}>{sub}</div>
          </div>
        </div>
      ))}
      <button onClick={onDismiss} className="pressable" style={{ width: "100%", padding: "11px", borderRadius: 12, border: "none", background: C.accent, color: C.accentText, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>Got it</button>
    </div>
  );
}
function Home({ saved, history = [], onCreate, onQuick, onOpen, onDelete, onDuplicate, onNextBlock, onHistory, historyCount, upNext, onStartNext, onStartAlt, onOpenActive, onTemplate, onDeload, canDeload, onLight, canLight, onLibrary, bodyweight, sex, unit, whatsNew, onDismissWhatsNew }) {
  const mins = upNext ? estimateMinutes(upNext.program, upNext.day, upNext.weekIndex) : 0;
  const weekLabel = upNext ? (upNext.weekIndex > weeksOf(upNext.program) ? "Deload week" : `Week ${upNext.weekIndex}`) : "";
  const stats = useMemo(() => {
    const now = Date.now();
    const thisWeek = history.filter(h => h.date > now - 7 * 86400000).length;
    // current streak in days: distinct workout days counted back from today/yesterday
    const days = new Set(history.map(h => new Date(h.date).toDateString()));
    let streak = 0;
    for (let i = 0; i < 400; i++) {
      const d = new Date(now - i * 86400000).toDateString();
      if (days.has(d)) streak++;
      else if (i > 0) break; // allow today to be empty without breaking
    }
    return { total: history.length, thisWeek, streak };
  }, [history]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "28px 22px 8px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: C.accent, textTransform: "uppercase" }}>Program Builder</div>
            <h1 style={{ fontSize: 34, fontWeight: 800, margin: "6px 0 0", letterSpacing: -0.8 }}>{upNext ? "Ready to train" : "Your Library"}</h1>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {onLibrary && <button onClick={onLibrary} className="pressable" title="Exercise library" style={{ ...iconBtn() }}><Library size={19} /></button>}
            <button onClick={onHistory} className="pressable" title="Workout history" style={{ ...iconBtn(), position: "relative" }}>
              <TrendingUp size={19} />
              {historyCount > 0 && <span style={{ position: "absolute", top: -5, right: -5, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 99, background: C.accent, color: C.accentText, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{historyCount}</span>}
            </button>
          </div>
        </div>
        {!upNext && <p style={{ color: C.muted, marginTop: 8, fontSize: 14.5 }}>Build a split, save it, hit play to train.</p>}
      </div>

      <div className="wpb-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 18px 100px" }}>
        {stats.total > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[["Streak", stats.streak, stats.streak === 1 ? "day" : "days"], ["This week", stats.thisWeek, "workouts"], ["Total", stats.total, "logged"]].map(([k, v, sub]) => (
              <div key={k} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 6px", textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: C.accent, lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 10.5, color: C.muted, marginTop: 4, fontWeight: 700 }}>{k}</div>
                <div style={{ fontSize: 9.5, color: C.faint }}>{sub}</div>
              </div>
            ))}
          </div>
        )}
        {/* Up Next hero */}
        {upNext && (
          <div style={{ background: C.card, border: `1px solid ${C.accentDim}`, borderRadius: 20, padding: 18, marginBottom: 22, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 100% at 100% 0%, ${C.accentDim} 0%, transparent 55%)`, pointerEvents: "none" }} />
            <button onClick={onOpenActive} className="pressable" style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: C.text, cursor: "pointer", padding: 0, position: "relative" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.2, color: C.accent, textTransform: "uppercase" }}>Up Next · {weekLabel}{upNext.scheduled ? " · Today" : ""}</div>
              <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.5, marginTop: 6, lineHeight: 1.1 }}>{upNext.day.label}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{upNext.program.name}</span>
                <span style={{ color: C.faint }}>·</span>
                <Clock size={12} /> ~{mins} min
                <span style={{ color: C.faint }}>·</span>
                {upNext.day.exercises.length} exercises
              </div>
            </button>
            <button onClick={onStartNext} className="pressable" style={{ position: "relative", width: "100%", marginTop: 16, padding: "15px", borderRadius: 14, border: "none", background: C.accent, color: C.accentText, fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Play size={18} fill={C.accentText} /> Start workout
            </button>
            {upNext.alt && (
              <button onClick={onStartAlt} className="pressable" style={{ position: "relative", width: "100%", marginTop: 9, padding: "12px", borderRadius: 12, border: `1px solid ${C.accent}55`, background: C.accentDim, color: C.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <Activity size={14} /> Fresher today: {upNext.alt.day.label} ({upNext.alt.score}%)
              </button>
            )}
          </div>
        )}

        {whatsNew && <WhatsNewCard onDismiss={onDismissWhatsNew} />}
        {history.length > 0 && <DeloadAdviceCard history={history} onDeload={onDeload} canDeload={canDeload} />}
        {history.length > 0 && <StrengthSnapshotCard history={history} bodyweight={bodyweight} sex={sex} unit={unit} onHistory={onHistory} />}
        {history.length > 0 && <MuscleRecoveryCard history={history} onLight={onLight} canLight={canLight} />}
        {history.length > 0 && <WeeklyRecapCard history={history} unit={undefined} />}

        {/* Quick-start templates */}
        <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1, color: C.faint, textTransform: "uppercase", margin: "0 2px 12px" }}>Start from a template</div>
        <div className="wpb-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6, marginBottom: 22, scrollSnapType: "x mandatory" }}>
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => onTemplate(t)} className="pressable" style={{ flexShrink: 0, width: 210, scrollSnapAlign: "start", textAlign: "left", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "15px", cursor: "pointer", color: C.text }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .5, color: C.accent, textTransform: "uppercase" }}>{t.tag}</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 6, letterSpacing: -0.3 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.4, minHeight: 34 }}>{t.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, color: C.accent, fontSize: 12.5, fontWeight: 700 }}>
                <Zap size={13} /> Generate
              </div>
            </button>
          ))}
        </div>

        {upNext && <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1, color: C.faint, textTransform: "uppercase", margin: "0 2px 12px" }}>All programs</div>}

        {saved.length === 0 ? (
          <div style={{ marginTop: 40, textAlign: "center", color: C.faint }}>
            <Library size={48} color={C.border} style={{ margin: "0 auto" }} />
            <div style={{ marginTop: 14, fontSize: 15, color: C.muted }}>No saved programs yet.</div>
            <div style={{ fontSize: 13.5, marginTop: 4 }}>Tap “Create Program” to build your first.</div>
          </div>
        ) : (
          saved.slice().sort((a, b) => b.createdAt - a.createdAt).map(p => (
            <div key={p.id} className="opt" style={{ display: "flex", alignItems: "center", gap: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16, marginBottom: 12 }}>
              <button onClick={() => onOpen(p)} className="pressable" style={{ flex: 1, display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", color: C.text, cursor: "pointer", textAlign: "left", minWidth: 0 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Dumbbell size={22} color={C.accent} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
                    {SPLITS[p.config.split].name} · {p.config.days} days · {GOALS[p.config.goal].label}
                  </div>
                </div>
              </button>
              <button onClick={() => onNextBlock(p)} className="pressable" title="Start next block (new mesocycle, weights carry over)" style={{ ...tinyBtn(), width: 34, height: 34, color: C.accent, borderColor: `${C.accent}55` }}><Layers size={15} /></button>
              <button onClick={() => onDuplicate(p)} className="pressable" title="Duplicate" style={{ ...tinyBtn(), width: 34, height: 34, color: C.muted }}><Copy size={15} /></button>
              <button onClick={() => onDelete(p.id)} className="pressable" style={{ ...tinyBtn(), width: 34, height: 34, color: C.danger, borderColor: C.dangerDim }}><Trash2 size={15} /></button>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", background: `linear-gradient(to top, ${C.bg} 65%, transparent)`, display: "flex", gap: 10 }}>
        <button onClick={onCreate} className="pressable" style={{ flex: 1, padding: "17px", borderRadius: 16, border: "none", background: C.accent, color: C.accentText, fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Plus size={20} strokeWidth={3} /> Create Program
        </button>
        {onQuick && (
          <button onClick={onQuick} title="Log a freestyle workout" className="pressable" style={{ flexShrink: 0, padding: "17px 18px", borderRadius: 16, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Zap size={18} /> Quick
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================== ROOT ============================== */
function ConfirmButton({ label, confirmLabel, onConfirm, style }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 3000); return () => clearTimeout(t); }, [armed]);
  return (
    <button className="pressable" onClick={() => { if (armed) { onConfirm(); setArmed(false); } else setArmed(true); }}
      style={{ padding: "9px 13px", borderRadius: 10, border: `1px solid ${armed ? C.danger : C.dangerDim}`, background: armed ? C.danger : "transparent", color: armed ? "#fff" : C.danger, cursor: "pointer", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", ...style }}>
      {armed ? (confirmLabel || "Tap to confirm") : label}
    </button>
  );
}

function TabBar({ view, onNav }) {
  const tabs = [["home", "Home", HomeIcon], ["progress", "Progress", TrendingUp], ["settings", "Settings", Settings2]];
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${C.borderSoft}`, background: C.bg2, flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map(([id, label, Icon]) => {
        const on = view === id;
        return (
          <button key={id} className="pressable" onClick={() => onNav(id)} style={{ flex: 1, padding: "11px 0 14px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? C.accent : C.muted }}>
            <Icon size={21} strokeWidth={on ? 2.6 : 2} />
            <span style={{ fontSize: 10.5, fontWeight: on ? 800 : 600 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function OneRepMaxCalc({ unit }) {
  const [w, setW] = useState("");
  const [r, setR] = useState("5");
  const W = parseFloat(w), R = parseInt(r);
  const valid = W > 0 && R > 0 && R <= 20;
  const orm = valid ? e1rm(W, R) : 0;
  const step = unit === "kg" ? 2.5 : 5;
  const round = (v) => Math.max(step, Math.round(v / step) * step);
  const pcts = [100, 95, 90, 85, 80, 75, 70, 65, 60];
  const reps = [1, 2, 3, 5, 8, 10, 12, 15];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, marginBottom: 5 }}>WEIGHT ({unit})</div>
          <input inputMode="decimal" value={w} onChange={e => setW(e.target.value)} placeholder="100" className="mono" style={{ width: "100%", padding: "11px 12px", borderRadius: 11, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, fontSize: 15, fontWeight: 700 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, marginBottom: 5 }}>REPS</div>
          <input inputMode="numeric" value={r} onChange={e => setR(e.target.value)} placeholder="5" className="mono" style={{ width: "100%", padding: "11px 12px", borderRadius: 11, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, fontSize: 15, fontWeight: 700 }} />
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "10px 0 14px", borderBottom: `1px solid ${C.borderSoft}`, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>ESTIMATED 1RM</div>
        <div className="mono" style={{ fontSize: 34, fontWeight: 800, color: C.accent, lineHeight: 1.1 }}>{valid ? round(orm) : "—"}<span style={{ fontSize: 16, color: C.muted, fontWeight: 600 }}> {unit}</span></div>
      </div>
      {valid && (() => {
        const { barW, plates, leftover } = platesPerSide(round(orm), "barbell", unit);
        if (!plates.length) return null;
        const maxP = PLATES[unit][0];
        return (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>Plates per side · {barW}{unit} bar</div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, height: 56 }}>
              <div style={{ width: 18, height: 4, background: C.muted, borderRadius: 2, flexShrink: 0 }} />
              {plates.map((p, i) => (
                <div key={i} style={{ width: 13, height: 22 + (p / maxP) * 32, background: C.accent, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="mono" style={{ fontSize: 7.5, fontWeight: 700, color: C.accentText, transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>{p}</span>
                </div>
              ))}
              <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginLeft: 6 }}>{plates.join(" + ")}{leftover > 0 ? ` (+${leftover} off)` : ""}</span>
            </div>
          </div>
        );
      })()}
      {valid && (
        <div style={{ display: "flex", gap: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>% of 1RM</div>
            {pcts.map(p => (
              <div key={p} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3.5px 0" }}>
                <span style={{ color: C.muted }}>{p}%</span>
                <span className="mono" style={{ fontWeight: 700, color: C.text }}>{round(orm * p / 100)}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 8 }}>Rep targets</div>
            {reps.map(n => (
              <div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "3.5px 0" }}>
                <span style={{ color: C.muted }}>{n} rep{n === 1 ? "" : "s"}</span>
                <span className="mono" style={{ fontWeight: 700, color: C.text }}>{round(orm / (1 + n / 30))}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ fontSize: 10.5, color: C.faint, marginTop: 14, lineHeight: 1.5 }}>Epley estimate from a set taken near failure. Rep targets assume roughly maximal sets — leave 1–3 reps in reserve for working loads.</div>
    </div>
  );
}

function SettingsView({ theme, setTheme, unit, setUnit, loadMode, setLoadMode, restAutoStart, setRestAutoStart, restScale, setRestScale, reminders, setReminders, minInc, setMinInc, plates, setPlates, bodyweight, setBodyweight, sex, setSex, bannedCount, customCount, historyCount, savedCount, onClearBanned, onClearHistory, onResetAll, onExport, onExportCSV, onExportBodyCSV, onImport, onLibrary, onImportProgram, onShowIntro }) {
  const [pasteProg, setPasteProg] = useState(null); // null | { text, result }
  const [backup, setBackup] = useState(null); // "export" | "import" | null
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const openExport = () => { setExportText(onExport()); setBackup("export"); setCopied(false); };
  const copyExport = async () => { try { await navigator.clipboard.writeText(exportText); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };
  const doImport = () => { const r = onImport(importText); setImportMsg(r); if (r.ok) { setImportText(""); setTimeout(() => { setBackup(null); setImportMsg(null); }, 1400); } };
  const Row = ({ label, sub, right }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
  const Title = ({ children }) => <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: C.faint, textTransform: "uppercase", margin: "22px 4px 8px" }}>{children}</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "28px 22px 6px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: -0.6 }}>Settings</h1>
      </div>
      <div className="wpb-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 18px 30px" }}>
        <Title>Appearance</Title>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Palette size={16} color={C.muted} /><span style={{ fontSize: 13.5, color: C.muted }}>Theme</span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
          {Object.entries(THEMES).map(([id, t]) => {
            const on = theme === id;
            return (
              <button key={id} onClick={() => setTheme(id)} className="pressable" style={{ width: 64, padding: "10px 0", borderRadius: 14, border: `2px solid ${on ? t.accent : C.border}`, background: C.card, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ width: 26, height: 26, borderRadius: 99, background: t.accent, border: t.base === "light" ? `1px solid ${C.border}` : "none" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: on ? C.text : C.muted }}>{t.name}</span>
              </button>
            );
          })}
        </div>

        <Title>Units</Title>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <Row label="Weight unit" sub="Used across logging, suggestions & plates" right={
            <div style={{ display: "flex", background: C.bg2, borderRadius: 10, padding: 3, border: `1px solid ${C.border}` }}>
              {["kg", "lb"].map(u => (
                <button key={u} onClick={() => setUnit(u)} className="pressable" style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, background: unit === u ? C.accent : "transparent", color: unit === u ? C.accentText : C.muted }}>{u}</button>
              ))}
            </div>
          } />
          <Row label="Effort scale" sub="How target intensity is shown" right={
            <div style={{ display: "flex", background: C.bg2, borderRadius: 10, padding: 3, border: `1px solid ${C.border}` }}>
              {[["rir", "RIR"], ["rpe", "RPE"]].map(([m, l]) => (
                <button key={m} onClick={() => setLoadMode(m)} className="pressable" style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, background: loadMode === m ? C.accent : "transparent", color: loadMode === m ? C.accentText : C.muted }}>{l}</button>
              ))}
            </div>
          } />
          {setMinInc && (
            <Row label="Smallest jump" sub="Set this lower if you have microplates" right={
              <div style={{ display: "flex", background: C.bg2, borderRadius: 10, padding: 3, border: `1px solid ${C.border}` }}>
                {(unit === "lb" ? [[0, "Std"], [2.5, "2.5"], [1, "1"]] : [[0, "Std"], [1, "1"], [0.5, "0.5"]]).map(([v, l]) => {
                  const on = (minInc.v || 0) === v && (v === 0 || minInc.unit === unit);
                  return <button key={l} onClick={() => setMinInc({ v, unit: v ? unit : null })} className="pressable" style={{ padding: "6px 11px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 800, background: on ? C.accent : "transparent", color: on ? C.accentText : C.muted }}>{l}</button>;
                })}
              </div>
            } />
          )}
        </div>

        {plates && setPlates && (() => {
          const cur = plates[unit] || PLATES[unit];
          return (
            <>
              <Title>Plates available ({unit})</Title>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 14px" }}>
                <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 11 }}>Tap to match the plates at your gym — the plate calculator &amp; in-set hints load only these (per side).</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {ALL_PLATES[unit].map(p => {
                    const on = cur.includes(p);
                    return (
                      <button key={p} onClick={() => { const next = on ? cur.filter(x => x !== p) : [...cur, p].sort((a, b) => b - a); setPlates({ ...plates, [unit]: next }); }} className="pressable" style={{ padding: "8px 13px", borderRadius: 10, border: `1px solid ${on ? C.accent : C.border}`, background: on ? C.accent : C.bg2, color: on ? C.accentText : C.muted, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{p}</button>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })()}

        <Title>Rest timer</Title>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <Row label="Auto-start timer" sub="Start a rest countdown when you complete a set" right={
            <button onClick={() => setRestAutoStart(v => !v)} className="pressable" style={{ width: 46, height: 27, borderRadius: 99, border: "none", background: restAutoStart ? C.accent : C.border, position: "relative", cursor: "pointer", transition: "background .15s" }}>
              <span style={{ position: "absolute", top: 3, left: restAutoStart ? 22 : 3, width: 21, height: 21, borderRadius: 99, background: "#fff", transition: "left .15s" }} />
            </button>
          } />
          <Row label="Rest length" sub="Scale the suggested rest between sets" right={
            <div style={{ display: "flex", background: C.bg2, borderRadius: 10, padding: 3, border: `1px solid ${C.border}` }}>
              {[[0.7, "Short"], [1, "Standard"], [1.3, "Long"]].map(([v, l]) => (
                <button key={l} onClick={() => setRestScale(v)} className="pressable" style={{ padding: "6px 11px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 800, background: restScale === v ? C.accent : "transparent", color: restScale === v ? C.accentText : C.muted }}>{l}</button>
              ))}
            </div>
          } />
        </div>

        <Title>Training reminders</Title>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <Row label="Remind me to train" sub="A nudge at your set time on chosen days" right={
            <button onClick={() => setReminders(r => ({ ...r, enabled: !r.enabled }))} className="pressable" style={{ width: 46, height: 27, borderRadius: 99, border: "none", background: reminders.enabled ? C.accent : C.border, position: "relative", cursor: "pointer", transition: "background .15s" }}>
              <span style={{ position: "absolute", top: 3, left: reminders.enabled ? 22 : 3, width: 21, height: 21, borderRadius: 99, background: "#fff", transition: "left .15s" }} />
            </button>
          } />
          {reminders.enabled && (
            <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.borderSoft}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>Time</span>
                <input type="time" value={reminders.time} onChange={e => setReminders(r => ({ ...r, time: e.target.value }))} className="mono" style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontWeight: 700, padding: "7px 10px", colorScheme: "dark" }} />
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => {
                  const on = reminders.days.includes(i);
                  return (
                    <button key={i} onClick={() => setReminders(r => ({ ...r, days: on ? r.days.filter(x => x !== i) : [...r.days, i].sort() }))} className="pressable" style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: `1px solid ${on ? C.accent : C.border}`, background: on ? C.accent : C.card, color: on ? C.accentText : C.muted, fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}>{d}</button>
                  );
                })}
              </div>
              <div style={{ fontSize: 10.5, color: C.faint, marginTop: 10, lineHeight: 1.45 }}>Reminders fire while the app is open; allow notifications to get them in the background where your device supports it.</div>
            </div>
          )}
        </div>

        <Title>Profile</Title>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <Row label="Bodyweight" sub="Powers strength-standard levels" right={
            <input inputMode="decimal" value={bodyweight} onChange={e => setBodyweight(e.target.value)} placeholder="—"
              className="mono" style={{ width: 76, padding: "8px 10px", textAlign: "center", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, fontSize: 14.5, fontWeight: 700 }} />
          } />
          <Row label="Sex" sub="Adjusts standard thresholds" right={
            <div style={{ display: "flex", background: C.bg2, borderRadius: 10, padding: 3, border: `1px solid ${C.border}` }}>
              {["male", "female"].map(s => (
                <button key={s} onClick={() => setSex(s)} className="pressable" style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 800, textTransform: "capitalize", background: sex === s ? C.accent : "transparent", color: sex === s ? C.accentText : C.muted }}>{s}</button>
              ))}
            </div>
          } />
        </div>

        <Title>1RM calculator</Title>
        <OneRepMaxCalc unit={unit} />

        <Title>Training data</Title>
        {onLibrary && (
          <button onClick={onLibrary} className="pressable" style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", marginBottom: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Library size={17} color={C.accent} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Exercise library</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>Browse {EXERCISES.length} exercises, set goals, manage bans</div>
            </div>
            <ChevronRight size={17} color={C.faint} />
          </button>
        )}
        {onShowIntro && (
          <button onClick={onShowIntro} className="pressable" style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", marginBottom: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Info size={17} color={C.accent} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Welcome tour</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>Replay the intro &amp; feature highlights</div>
            </div>
            <ChevronRight size={17} color={C.faint} />
          </button>
        )}
        {onImportProgram && (
          <button onClick={() => setPasteProg({ text: "", result: null })} className="pressable" style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", marginBottom: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Copy size={17} color={C.accent} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Import shared program</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>Paste a plan someone shared as text</div>
            </div>
            <ChevronRight size={17} color={C.faint} />
          </button>
        )}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <Row label="Custom exercises" sub={`${customCount} created`} />
          <Row label="Banned exercises" sub={`${bannedCount} hidden from generation`} right={bannedCount > 0 && <ConfirmButton label="Clear" confirmLabel="Unban all?" onConfirm={onClearBanned} />} />
          <Row label="Workout history" sub={`${historyCount} sessions logged`} right={historyCount > 0 && <ConfirmButton label="Clear" confirmLabel="Delete all?" onConfirm={onClearHistory} />} />
        </div>
        <div style={{ marginTop: 14 }}>
          <ConfirmButton label="Reset everything" confirmLabel="Erase all data — tap to confirm" onConfirm={onResetAll} style={{ width: "100%", padding: "13px", fontSize: 13.5 }} />
        </div>

        <Title>Backup &amp; restore</Title>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, padding: "0 4px 10px" }}>
          Your data lives only on this device. Export a backup to keep it safe or move it to another device.
        </div>
        {backup === null && (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={openExport} className="pressable" style={{ flex: 1, padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Save size={15} /> Export
            </button>
            <button onClick={() => { setBackup("import"); setImportMsg(null); }} className="pressable" style={{ flex: 1, padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <RefreshCw size={15} /> Restore
            </button>
          </div>
        )}
        {backup === null && onExportCSV && (
          <button onClick={() => { setExportText(onExportCSV()); setBackup("csv"); setCopied(false); }} className="pressable" style={{ width: "100%", marginTop: 10, padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <BarChart3 size={15} /> Export workout log (CSV)
          </button>
        )}
        {backup === null && onExportBodyCSV && (
          <button onClick={() => { setExportText(onExportBodyCSV()); setBackup("csv"); setCopied(false); }} className="pressable" style={{ width: "100%", marginTop: 8, padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <Activity size={15} /> Export body metrics (CSV)
          </button>
        )}
        {(backup === "export" || backup === "csv") && (
          <div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 8 }}>{backup === "csv" ? "Copy this CSV into a spreadsheet (Excel, Google Sheets, Numbers)." : "Copy this backup somewhere safe — paste it under Restore to bring everything back."}</div>
            <textarea readOnly value={exportText} onFocus={e => e.target.select()} className="wpb-scroll mono"
              style={{ width: "100%", height: 120, padding: "11px 12px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.muted, fontSize: 11, resize: "none" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={copyExport} className="pressable" style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: C.accent, color: C.accentText, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>{copied ? "Copied ✓" : "Copy to clipboard"}</button>
              <button onClick={() => setBackup(null)} className="pressable" style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Done</button>
            </div>
            <div style={{ fontSize: 11.5, color: C.faint, marginTop: 8, padding: "0 2px" }}>Tip: paste this somewhere safe (a note to self, email, or cloud doc).</div>
          </div>
        )}
        {backup === "import" && (
          <div>
            <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="Paste your backup text here…" className="wpb-scroll mono"
              style={{ width: "100%", height: 120, padding: "11px 12px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 11, resize: "none" }} />
            {importMsg && <div style={{ fontSize: 12.5, fontWeight: 700, color: importMsg.ok ? C.accent : C.danger, marginTop: 8, padding: "0 2px" }}>{importMsg.msg}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={doImport} disabled={!importText.trim()} className="pressable" style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: importText.trim() ? C.accent : C.card, color: importText.trim() ? C.accentText : C.faint, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>Restore backup</button>
              <button onClick={() => { setBackup(null); setImportMsg(null); setImportText(""); }} className="pressable" style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
            <div style={{ fontSize: 11.5, color: C.faint, marginTop: 8, padding: "0 2px" }}>Restoring replaces your current programs, history, and settings.</div>
          </div>
        )}

        <Title>About</Title>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, padding: "0 4px" }}>
          An evidence-based training app — auto-generated programs, RIR-based progression, fractional volume tracking, and a full workout log. Your data stays on this device.
        </div>
      </div>

      {pasteProg && (
        <div onClick={() => setPasteProg(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", zIndex: 70, animation: "fadeIn .2s both" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}` }}>
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 14px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Import shared program</div>
              <button className="pressable" onClick={() => setPasteProg(null)} style={iconBtn()}><X size={18} /></button>
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>Paste a plan exported with “Share as text”. Exercises are matched to the library and rebuilt as an editable program.</div>
            <textarea value={pasteProg.text} autoFocus onChange={e => setPasteProg(p => ({ ...p, text: e.target.value, result: null }))} placeholder="Paste program text here…" className="wpb-scroll mono" style={{ width: "100%", height: 150, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 11.5, lineHeight: 1.5, resize: "none", marginBottom: 12 }} />
            {pasteProg.result && <div style={{ fontSize: 12.5, fontWeight: 600, color: pasteProg.result.ok ? C.accent : C.danger, marginBottom: 12 }}>{pasteProg.result.msg}</div>}
            <button onClick={() => { const r = onImportProgram(pasteProg.text); if (r.ok) setPasteProg(null); else setPasteProg(p => ({ ...p, result: r })); }} disabled={!pasteProg.text.trim()} className="pressable" style={{ width: "100%", padding: "14px", borderRadius: 13, border: "none", background: pasteProg.text.trim() ? C.accent : C.card, color: pasteProg.text.trim() ? C.accentText : C.faint, fontSize: 15, fontWeight: 800, cursor: pasteProg.text.trim() ? "pointer" : "default" }}>Import program</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryView({ onBack, banned = [], onBan, goals = {}, onSetGoal, unit, history = [], onCreateCustom }) {
  const [query, setQuery] = useState("");
  const [part, setPart] = useState("all");
  const [equip, setEquip] = useState("all");
  const [flag, setFlag] = useState("all"); // all | goal | banned
  const [detailId, setDetailId] = useState(null);
  const [goalVal, setGoalVal] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter(e => {
      if (part !== "all" && e.part !== part) return false;
      if (equip === "bodyweight") { if (e.equip.length) return false; }
      else if (equip !== "all") { if (!e.equip.includes(equip)) return false; }
      if (flag === "goal" && !(goals[e.id] > 0)) return false;
      if (flag === "banned" && !banned.includes(e.id)) return false;
      if (q && !e.name.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => a.part === b.part ? (a.pri - b.pri) : PART_ORDER.indexOf(a.part) - PART_ORDER.indexOf(b.part));
  }, [query, part, equip, flag, goals, banned]);

  const detail = detailId ? EX_BY_ID[detailId] : null;
  const bestFor = (id) => { let b = 0; (history || []).forEach(h => (h.perf?.[id]?.sets || []).forEach(s => { if (s.w > b) b = s.w; })); return b; };

  return (
    <div className="wpb-scroll" style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: C.bg, padding: "calc(env(safe-area-inset-top) + 12px) 16px 10px", borderBottom: `1px solid ${C.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          {onBack && <button className="pressable" onClick={onBack} style={{ ...iconBtn(), width: 38, height: 38 }}><ChevronLeft size={20} /></button>}
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.4 }}>Exercise library</div>
          <span style={{ marginLeft: "auto", fontSize: 12, color: C.muted, fontWeight: 700 }}>{list.length}</span>
        </div>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <Search size={16} color={C.faint} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search  exercises…`}
            style={{ width: "100%", padding: "11px 12px 11px 36px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 14.5 }} />
        </div>
        <div className="wpb-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }}>
          {[["all", "All muscles"], ...PART_ORDER.map(p => [p, PART_LABEL[p]])].map(([k, label]) => (
            <button key={k} onClick={() => setPart(k)} className="pressable" style={{ flexShrink: 0, padding: "7px 12px", borderRadius: 99, border: `1px solid ${part === k ? C.accent : C.border}`, background: part === k ? C.accent : C.card, color: part === k ? C.accentText : C.muted, fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{label}</button>
          ))}
        </div>
        <div className="wpb-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", paddingTop: 4 }}>
          {[["all", "Any equipment"], ["bodyweight", "Bodyweight"], ...EQUIPMENT.map(e => [e.id, e.label])].map(([k, label]) => (
            <button key={k} onClick={() => setEquip(k)} className="pressable" style={{ flexShrink: 0, padding: "6px 11px", borderRadius: 99, border: `1px solid ${equip === k ? C.accent : C.border}`, background: equip === k ? C.accentDim : "transparent", color: equip === k ? C.accent : C.faint, fontSize: 11.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, paddingTop: 6 }}>
          {[["all", "All", null], ["goal", "With goal", Target], ["banned", "Banned", Ban]].map(([k, label, Icon]) => (
            <button key={k} onClick={() => setFlag(k)} className="pressable" style={{ flex: 1, padding: "7px 8px", borderRadius: 10, border: `1px solid ${flag === k ? C.accent : C.border}`, background: flag === k ? C.accent : C.card, color: flag === k ? C.accentText : C.muted, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>{Icon && <Icon size={12} />}{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "10px 16px 0" }}>
        {list.length === 0 && (
          <div style={{ marginTop: 40, textAlign: "center", color: C.faint }}>
            <Search size={46} color={C.border} style={{ margin: "0 auto" }} />
            <div style={{ marginTop: 14, fontSize: 15, color: C.muted }}>No exercises match those filters.</div>
            <div style={{ fontSize: 13.5, marginTop: 4 }}>Try clearing a filter or searching a different term.</div>
          </div>
        )}
        {list.map(e => {
          const isBanned = banned.includes(e.id);
          const goal = goals[e.id];
          const best = bestFor(e.id);
          return (
            <button key={e.id} onClick={() => { setDetailId(e.id); setEditingGoal(false); }} className="pressable" style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", marginBottom: 7, background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, cursor: "pointer", textAlign: "left", opacity: isBanned ? 0.55 : 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: C.bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: C.accent, textTransform: "uppercase" }}>{PART_LABEL[e.part].slice(0, 3)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}{e.custom && <span style={{ color: C.accent, fontSize: 11 }}> · custom</span>}</div>
                <div style={{ fontSize: 11.5, color: C.faint }}>{PART_LABEL[e.part]} · {e.type} · {e.equip.length ? e.equip.length + " equip" : "bodyweight"}</div>
              </div>
              {best > 0 && <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, flexShrink: 0 }}>{Math.round(best)}{unit}</span>}
              {goal > 0 && <Target size={13} color={best >= goal ? C.accent : C.faint} style={{ flexShrink: 0 }} />}
              {isBanned && <Ban size={13} color={C.danger} style={{ flexShrink: 0 }} />}
              <ChevronRight size={16} color={C.faint} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
        {onCreateCustom && (
          <button className="pressable" onClick={onCreateCustom} style={{ width: "100%", marginTop: 6, padding: "12px", borderRadius: 12, border: `1px dashed ${C.border}`, background: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <PlusCircle size={15} /> Create a custom exercise
          </button>
        )}
      </div>

      {detail && (
        <div onClick={() => setDetailId(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 80, animation: "fadeIn .2s both" }}>
          <div onClick={e => e.stopPropagation()} className="wpb-scroll" style={{ width: "100%", maxWidth: 460, background: C.bg2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "10px 18px calc(env(safe-area-inset-bottom) + 26px)", animation: "sheetUp .28s cubic-bezier(.2,.7,.3,1) both", borderTop: `1px solid ${C.border}`, maxHeight: "88%", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "6px auto 16px" }} />
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.15 }}>{detail.name}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 3, marginBottom: 14 }}>{PART_LABEL[detail.part]} · {detail.type} · {detail.rep[0]}–{detail.rep[1]} reps</div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {detail.equip.length ? detail.equip.map(q => (
                <span key={q} style={{ fontSize: 11.5, fontWeight: 700, color: C.text, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>{EQUIPMENT.find(x => x.id === q)?.label || q}</span>
              )) : <span style={{ fontSize: 11.5, fontWeight: 700, color: C.text, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px" }}>Bodyweight</span>}
            </div>

            {secondaryOf(detail).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 6 }}>Also works</div>
                <div style={{ fontSize: 13, color: C.text }}>{secondaryOf(detail).map(([p, f]) => `${PART_LABEL[p]} (${Math.round(f * 100)}%)`).join(" · ")}</div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", marginBottom: 6 }}>Technique cues</div>
              {cuesFor(detail).map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: C.text, marginBottom: 5, lineHeight: 1.4 }}>
                  <span style={{ color: C.accent, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span><span>{c}</span>
                </div>
              ))}
            </div>

            {(() => {
              const goal = goals[detail.id]; const bestW = bestFor(detail.id);
              if (editingGoal || !goal) {
                return (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 9, display: "flex", alignItems: "center", gap: 6 }}><Target size={14} color={C.accent} /> {goal ? "Edit goal weight" : "Set a goal weight"}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input inputMode="decimal" value={editingGoal ? goalVal : (goalVal || (bestW ? String(Math.round(bestW * 1.05)) : ""))} onChange={e => { setEditingGoal(true); setGoalVal(e.target.value); }} placeholder={`${unit}`} className="mono" style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg2, color: C.text, fontSize: 15, fontWeight: 700, textAlign: "center" }} />
                      <button onClick={() => { onSetGoal?.(detail.id, parseFloat(goalVal) || (bestW ? Math.round(bestW * 1.05) : 0)); setEditingGoal(false); setGoalVal(""); }} className="pressable" style={{ padding: "0 18px", borderRadius: 10, border: "none", background: C.accent, color: C.accentText, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>Save</button>
                    </div>
                  </div>
                );
              }
              const pct = goal > 0 ? clamp(Math.round(bestW / goal * 100), 0, 100) : 0;
              const reached = bestW >= goal;
              return (
                <div onClick={() => { setEditingGoal(true); setGoalVal(String(goal)); }} style={{ cursor: "pointer", background: C.card, border: `1px solid ${reached ? C.accent : C.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: .5, color: C.faint, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}><Target size={12} color={reached ? C.accent : C.faint} /> Goal{reached ? " · reached!" : ""}</span>
                    <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: reached ? C.accent : C.text }}>{Math.round(bestW)} / {goal} {unit}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: C.bg2, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: C.accent, borderRadius: 99 }} /></div>
                  <div style={{ fontSize: 10.5, color: C.faint, marginTop: 6 }}>{reached ? "Tap to set a new target" : `${pct}% there · tap to edit`}</div>
                </div>
              );
            })()}

            <button onClick={() => { onBan?.(detail.id); setDetailId(null); }} className="pressable" style={{ width: "100%", padding: "13px", borderRadius: 12, border: `1px solid ${banned.includes(detail.id) ? C.border : C.dangerDim}`, background: "none", color: banned.includes(detail.id) ? C.muted : C.danger, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Ban size={15} /> {banned.includes(detail.id) ? "This exercise is banned" : "Ban from all programs"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const INTRO_VERSION = 4; // bump when onboarding content changes → returning users see it once more
const WHATS_NEW_VERSION = 1; // bump when there's an update worth showing existing users on Home
const HISTORY_CAP = 500; // keep up to ~1.5 years of sessions before the oldest roll off
function Splash({ label = "Loading your training…" }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: C.faint }}>
      <div style={{ position: "relative", width: 52, height: 52 }}>
        <div className="wpb-spin" style={{ position: "absolute", inset: 0, borderRadius: 99, border: `3px solid ${C.border}`, borderTopColor: C.accent }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Dumbbell size={22} color={C.accent} /></div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</div>
    </div>
  );
}
export default function App() {
  const [view, setView] = useState("home");
  const [saved, setSaved] = useState([]);
  const [banned, setBanned] = useState([]);
  const [equipDefault, setEquipDefault] = useState(EQUIPMENT.map(e => e.id));
  const [program, setProgram] = useState(null);
  const [unit, setUnit] = useState("kg");
  const [loadMode, setLoadMode] = useState("rir");
  const [goals, setGoals] = useState({});
  const [perf, setPerf] = useState({});
  const [history, setHistory] = useState([]);
  const [custom, setCustom] = useState([]);
  const [theme, setThemeState] = useState("lime");
  const [bodyweight, setBodyweight] = useState("");
  const [bwLog, setBwLog] = useState([]);
  const [measurements, setMeasurements] = useState({}); // { key: [{date, v, unit}] }
  const [restAutoStart, setRestAutoStart] = useState(true);
  const [restScale, setRestScale] = useState(1);
  const [reminders, setReminders] = useState({ enabled: false, time: "18:00", days: [1, 2, 3, 4, 5] });
  const [minInc, setMinInc] = useState({ v: 0, unit: null });
  const [plates, setPlates] = useState({ kg: [...PLATES.kg], lb: [...PLATES.lb] });
  const [progWeek, setProgWeek] = useState({}); // remembers the last-viewed week per program
  setLoadInc(minInc.v, minInc.unit); // keep the module-level load increment in sync each render
  setAvailPlates(plates);            // keep available-plate set in sync each render
  const [sex, setSex] = useState("male");
  const [sessionDay, setSessionDay] = useState(null);
  const [sessionWeek, setSessionWeek] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [seenIntroV, setSeenIntroV] = useState(0);
  const [seenWhatsNew, setSeenWhatsNew] = useState(0);
  const [appToast, setAppToast] = useState(null); // { msg, undo? }
  useEffect(() => { if (!appToast) return; const t = setTimeout(() => setAppToast(null), 5000); return () => clearTimeout(t); }, [appToast]);

  // register a custom exercise into the live pool so every screen can use it
  const registerCustomEx = (ex) => { if (!EX_BY_ID[ex.id]) { EX_BY_ID[ex.id] = ex; EXERCISES.push(ex); } };

  // load persisted state
  useEffect(() => {
    let alive = true;
    loadStore().then(d => {
      if (!alive || !d) { setLoaded(true); return; }
      if (d.custom) { d.custom.forEach(registerCustomEx); setCustom(d.custom); }
      if (d.theme && THEMES[d.theme]) { applyTheme(d.theme); setThemeState(d.theme); }
      if (d.bodyweight) setBodyweight(d.bodyweight);
      if (d.bwLog) setBwLog(d.bwLog);
      if (d.measurements) setMeasurements(d.measurements);
      if (typeof d.restAutoStart === "boolean") setRestAutoStart(d.restAutoStart);
      if (d.restScale) setRestScale(d.restScale);
      if (d.reminders) setReminders(d.reminders);
      if (d.minInc && typeof d.minInc === "object") setMinInc(d.minInc);
      if (d.plates && d.plates.kg && d.plates.lb) setPlates(d.plates);
      if (d.sex) setSex(d.sex);
      setSaved(d.saved || []);
      setBanned(d.banned || []);
      if (d.equipDefault) setEquipDefault(d.equipDefault);
      if (d.unit) setUnit(d.unit);
      if (d.loadMode) setLoadMode(d.loadMode);
      if (d.perf) setPerf(d.perf);
      else if (d.lastWeights) { // migrate older saves (weight only, reps unknown)
        const mig = {}; Object.entries(d.lastWeights).forEach(([k, v]) => { mig[k] = { weight: v, reps: null }; });
        setPerf(mig);
      }
      if (d.history) setHistory(d.history);
      if (d.seenIntro) setSeenIntroV(typeof d.seenIntro === "number" ? d.seenIntro : 1);
      if (typeof d.seenWhatsNew === "number") setSeenWhatsNew(d.seenWhatsNew);
      if (d.goals) setGoals(d.goals);
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  // persist on change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    saveStore({ saved, banned, equipDefault, unit, loadMode, perf, history, custom, theme, bodyweight, sex, bwLog, measurements, restAutoStart, restScale, reminders, minInc, plates, seenIntro: seenIntroV, seenWhatsNew, goals });
  }, [saved, banned, equipDefault, unit, loadMode, perf, history, custom, theme, bodyweight, sex, bwLog, measurements, restAutoStart, restScale, reminders, minInc, plates, goals, seenIntroV, seenWhatsNew, loaded]);

  // If the open program is already in the library, keep its stored copy in sync as
  // it's edited (reorder, swap, settings) so changes survive navigating away & back.
  useEffect(() => {
    if (!loaded || !program) return;
    setSaved(prev => prev.some(p => p.id === program.id && p !== program) ? prev.map(p => p.id === program.id ? program : p) : prev);
  }, [program, loaded]);

  const remindFired = useRef(null);
  useEffect(() => {
    if (!reminders.enabled) return;
    try { if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") Notification.requestPermission(); } catch {}
    const check = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const today = now.toDateString();
      if (reminders.days.includes(now.getDay()) && hhmm === reminders.time && remindFired.current !== today) {
        remindFired.current = today;
        const trained = (history || []).some(h => new Date(h.date).toDateString() === today);
        const msg = trained ? "Already trained today — nice work 💪" : "Time to train 💪";
        try { if ("Notification" in window && Notification.permission === "granted") new Notification("Workout reminder", { body: trained ? "You've already logged a session today." : "Your session is waiting." }); } catch {}
        setAppToast({ msg });
      }
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, [reminders, history]);

  const logMeasurement = (key, v) => {
    const val = parseFloat(v);
    if (!(val > 0)) return;
    setMeasurements(prev => {
      const today = new Date().toDateString();
      const arr = (prev[key] || []).filter(e => new Date(e.date).toDateString() !== today);
      return { ...prev, [key]: [...arr, { date: Date.now(), v: val, unit }].sort((a, b) => a.date - b.date).slice(-200) };
    });
  };

  const logBodyweight = (w) => {
    const val = parseFloat(w);
    if (!(val > 0)) return;
    setBwLog(prev => [...prev.filter(e => new Date(e.date).toDateString() !== new Date().toDateString()), { date: Date.now(), w: val, unit }].sort((a, b) => a.date - b.date).slice(-200));
    setBodyweight(String(val));
  };

  const chooseTheme = (id) => { applyTheme(id); setThemeState(id); };
  const resetAll = () => { setSaved([]); setBanned([]); setHistory([]); setPerf({}); setCustom([]); setBwLog([]); setMeasurements({}); setGoals({}); setReminders({ enabled: false, time: "18:00", days: [1, 2, 3, 4, 5] }); setProgram(null); setView("home"); };
  const exportData = () => JSON.stringify({ v: 1, exportedAt: Date.now(), saved, banned, equipDefault, unit, loadMode, perf, history, custom, theme, bodyweight, sex, bwLog, measurements, reminders, restAutoStart, restScale, minInc, plates, goals }, null, 2);
  const exportCSV = () => {
    const esc = c => { const s = String(c ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const rows = [["Date", "Program", "Day", "Exercise", "Muscle", "Top weight", "Top reps", "Sets", "Volume", "Unit", "Duration (min)"]];
    [...history].sort((a, b) => a.date - b.date).forEach(h => {
      const d = new Date(h.date).toISOString().slice(0, 10);
      const entries = Object.entries(h.perf || {});
      if (!entries.length) rows.push([d, h.programName, h.dayLabel, "", "", "", "", 0, 0, h.unit || unit, h.durationMin || ""]);
      entries.forEach(([id, p]) => {
        const ex = EX_BY_ID[id];
        const vol = Math.round((p.sets || []).reduce((a, s) => a + (s.w || 0) * (s.r || 0), 0));
        rows.push([d, h.programName, h.dayLabel, ex ? ex.name : id, ex ? PART_LABEL[ex.part] : "", p.weight ?? "", p.reps ?? "", (p.sets || []).length, vol, h.unit || unit, h.durationMin || ""]);
      });
    });
    return rows.map(r => r.map(esc).join(",")).join("\n");
  };
  const exportBodyCSV = () => {
    const esc = c => { const s = String(c ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const rows = [["Date", "Metric", "Value", "Unit"]];
    [...(bwLog || [])].sort((a, b) => a.date - b.date).forEach(e => rows.push([new Date(e.date).toISOString().slice(0, 10), "Bodyweight", e.w, e.unit || unit]));
    Object.entries(measurements || {}).forEach(([k, arr]) => [...(arr || [])].sort((a, b) => a.date - b.date).forEach(e => rows.push([new Date(e.date).toISOString().slice(0, 10), k.charAt(0).toUpperCase() + k.slice(1), e.v, unit === "lb" ? "in" : "cm"])));
    return rows.map(r => r.map(esc).join(",")).join("\n");
  };
  const importProgramText = (text) => {
    const prog = parseProgramText(text);
    if (!prog || !prog.days.length) return { ok: false, msg: "Couldn't find a program in that text. Paste the full exported plan." };
    let matched = 0, slots = 0;
    prog.days.forEach(d => d.exercises.forEach(() => { matched++; }));
    setSaved(prev => [...prev, prog]);
    setProgram(prog);
    setView("program");
    return { ok: true, msg: `Imported "${prog.name}" — ${prog.days.length} day${prog.days.length === 1 ? "" : "s"}, ${matched} exercises matched.` };
  };
  const importData = (json) => {
    let d;
    try { d = JSON.parse(json); } catch { return { ok: false, msg: "That doesn't look like valid backup data." }; }
    if (!d || typeof d !== "object" || (!Array.isArray(d.saved) && !Array.isArray(d.history))) return { ok: false, msg: "No recognizable backup found in that text." };
    try {
      if (Array.isArray(d.custom)) { d.custom.forEach(registerCustomEx); setCustom(d.custom); }
      const known = (id) => !!EX_BY_ID[id];
      let dropped = 0;
      const sanitizeProgram = (p) => {
        if (!p || !Array.isArray(p.days)) return p;
        const days = p.days.map(day => {
          const keep = [], idxMap = {};
          (day.exercises || []).forEach((id, oldIdx) => { if (known(id)) { idxMap[oldIdx] = keep.length; keep.push(id); } else dropped++; });
          return { ...day, exercises: keep, _idxMap: idxMap };
        }).filter(day => day.exercises.length > 0);
        const remap = (obj) => {
          if (!obj || typeof obj !== "object") return undefined;
          const out = {};
          Object.entries(obj).forEach(([k, v]) => {
            const [dId, slotStr] = k.split(":"); const slot = parseInt(slotStr);
            const day = days.find(dd => dd.id === dId);
            const ni = day && day._idxMap[slot];
            if (ni != null) out[`${dId}:${ni}`] = v;
          });
          return out;
        };
        const overrides = remap(p.overrides), ss = remap(p.ss), rounds = remap(p.rounds);
        const cleanDays = days.map(day => {
          const { _idxMap, ...rest } = day;
          let pi = _idxMap[day.primaryIndex];
          if (pi == null) pi = rest.exercises.findIndex(id => EX_BY_ID[id]?.type === "compound");
          return { ...rest, primaryIndex: pi == null || pi < 0 ? 0 : pi };
        });
        return { ...p, days: cleanDays, overrides, ss, rounds, config: { ...p.config, days: cleanDays.length } };
      };
      const cleanObj = (o) => { if (!o || typeof o !== "object") return o; const out = {}; Object.entries(o).forEach(([k, v]) => { if (known(k)) out[k] = v; }); return out; };
      if (Array.isArray(d.saved)) setSaved(d.saved.map(sanitizeProgram).filter(p => p.days && p.days.length));
      if (Array.isArray(d.banned)) setBanned(d.banned.filter(known));
      if (Array.isArray(d.equipDefault)) setEquipDefault(d.equipDefault);
      if (d.unit) setUnit(d.unit);
      if (d.loadMode) setLoadMode(d.loadMode);
      if (d.goals && typeof d.goals === "object") setGoals(cleanObj(d.goals));
      if (d.perf && typeof d.perf === "object") setPerf(cleanObj(d.perf));
      if (Array.isArray(d.history)) setHistory(d.history.map(h => h.perf ? { ...h, perf: cleanObj(h.perf) } : h));
      if (d.theme && THEMES[d.theme]) { applyTheme(d.theme); setThemeState(d.theme); }
      if (d.bodyweight) setBodyweight(String(d.bodyweight));
      if (d.sex) setSex(d.sex);
      if (Array.isArray(d.bwLog)) setBwLog(d.bwLog);
      if (d.measurements && typeof d.measurements === "object") setMeasurements(d.measurements);
      if (d.reminders && typeof d.reminders === "object") setReminders(d.reminders);
      if (d.minInc && typeof d.minInc === "object") setMinInc(d.minInc);
      if (d.plates && d.plates.kg && d.plates.lb) setPlates(d.plates);
      if (typeof d.restAutoStart === "boolean") setRestAutoStart(d.restAutoStart);
      if (d.restScale) setRestScale(d.restScale);
      setProgram(null);
      const np = Array.isArray(d.saved) ? d.saved.length : 0, nh = Array.isArray(d.history) ? d.history.length : 0;
      return { ok: true, msg: `Restored ${np} program${np === 1 ? "" : "s"} and ${nh} logged workout${nh === 1 ? "" : "s"}.${dropped ? ` ${dropped} unknown exercise${dropped === 1 ? "" : "s"} from another version were skipped.` : ""}` };
    } catch (e) {
      return { ok: false, msg: "Something went wrong applying that backup." };
    }
  };

  const createCustom = (partial) => {
    const ex = { id: `custom-${uid()}`, pri: 9000, custom: true, ...partial };
    registerCustomEx(ex);
    setCustom(prev => [...prev, ex]);
    return ex;
  };

  const isSaved = program && saved.some(p => p.id === program.id);

  const addBan = (id) => {
    let nb = banned;
    if (!banned.includes(id)) { nb = [...banned, id]; setBanned(nb); }
    return nb;
  };

  const volBiasFromHistory = () => {
    if (!history.length) return null;
    const bias = {};
    volumeAdvice(history).forEach(a => { if (a.delta) bias[a.part] = a.delta; });
    // blend in the most recent subjective recovery feedback per muscle (RP-style titration)
    const seen = {};
    history.forEach(h => {
      if (!h.feedback) return;
      Object.entries(h.feedback).forEach(([part, v]) => {
        if (v == null || (seen[part] || 0) >= 2) return; // average the 2 most recent signals
        seen[part] = (seen[part] || 0) + 1;
        bias[part] = (bias[part] || 0) + v;
      });
    });
    Object.keys(bias).forEach(p => { bias[p] = clamp(Math.round(bias[p]), -2, 2); if (!bias[p]) delete bias[p]; });
    return Object.keys(bias).length ? bias : null;
  };
  const handleGenerate = (config) => {
    setEquipDefault(config.equipment);
    const p = generateProgram(config, banned, volBiasFromHistory());
    setProgram(p);
    setView("program");
  };
  const startTemplate = (t) => {
    const equipment = (equipDefault && equipDefault.length) ? equipDefault : ["barbell", "dumbbell", "bench", "cable", "machine", "pullup", "ezbar", "dip"];
    handleGenerate(templateConfig(t, equipment));
  };
  const handleSave = () => {
    if (!program) return;
    const exists = saved.some(p => p.id === program.id);
    setSaved(prev => exists ? prev.map(p => p.id === program.id ? program : p) : [...prev, program]);
    setAppToast(exists
      ? { msg: `"${program.name}" updated` }
      : { msg: "Saved to your programs", actionLabel: "Go home", action: () => { setView("home"); setAppToast(null); } });
  };
  const handleRegenerate = () => {
    if (!program) return;
    const p = generateProgram(program.config, banned, volBiasFromHistory());
    p.id = program.id; p.name = program.name; p.createdAt = program.createdAt;
    setProgram(p);
  };
  const handleDelete = (id) => {
    const removed = saved.find(p => p.id === id);
    setSaved(prev => prev.filter(p => p.id !== id));
    if (program?.id === id && view !== "session") { setProgram(null); }
    if (removed) setAppToast({ msg: `Deleted "${removed.name}"`, undo: () => { setSaved(prev => prev.some(p => p.id === id) ? prev : [...prev, removed]); setProgram(p => p || removed); setAppToast(null); } });
  };
  const handleDuplicate = (p) => {
    const copy = { ...p, id: uid(), name: `${p.name} (copy)`, createdAt: Date.now() };
    setSaved(prev => [...prev, copy]);
    setAppToast({ msg: `Duplicated as "${copy.name}"` });
  };
  const startNextBlock = (p) => {
    const np = JSON.parse(JSON.stringify(p));
    np.id = uid();
    np.createdAt = Date.now();
    const m = (p.name || "").match(/^(.*?)\s*·\s*Block\s*(\d+)\s*$/);
    np.name = m ? `${m[1]} · Block ${Number(m[2]) + 1}` : `${p.name} · Block 2`;
    if (np.config?.progression !== "manual") np.overrides = {};
    delete np.slotBias;
    if (np.config) delete np.config.autoVolume;
    // Percentage programs (5/3/1, Madcow): advance training maxes. The size of each jump is
    // tuned by your last top-set AMRAP — strong sets (8+ reps) earn a bigger bump, grinder
    // sets (≤2) a smaller one, and a missed lift holds the weight (Wendler's reps-in-reserve idea).
    if (np.config?.percentScheme && np.trainingMax) {
      np.trainingMax = projectNextTM(np, history, unit);
    }
    distributeVolBias(np, volBiasFromHistory()); // re-tune volume from logged performance + feedback
    setSaved(prev => [...prev, np]);
    setProgram(np);
    setView("program");
    if (np.config?.percentScheme) setAppToast({ msg: "New cycle — training maxes adjusted from your AMRAP sets" });
  };
  const startSession = (day, wk) => {
    // Ensure a planned program is in the library before logging against it, so the
    // session feeds Up-next and progress tracking. (Quick/freestyle workouts skip this.)
    if (program && !program.quick && !saved.some(p => p.id === program.id)) {
      setSaved(prev => prev.some(p => p.id === program.id) ? prev : [...prev, program]);
    }
    setSessionDay(day); setSessionWeek(wk || 1); setView("session");
    // Percentage programs (5/3/1, nSuns, Madcow) only load the main lifts by % once a training
    // max is set; otherwise the session quietly falls back to a generic prescription. Nudge once.
    const needTM = program && !program.quick && program.config?.percentScheme &&
      !(program.days || []).some(d => (program.trainingMax?.[d.exercises[d.primaryIndex]] || 0) > 0);
    if (needTM) setTimeout(() => setAppToast({
      msg: `Set your training maxes so the main lifts load by the ${PCT_SCHEMES[program.config.percentScheme]?.name || "program"} scheme`,
      actionLabel: "Set maxes", action: () => { setView("program"); setAppToast(null); },
    }), 450);
  };
  const startQuickWorkout = () => {
    const day = { id: uid(), label: "Quick workout", exercises: [], primaryIndex: 0 };
    const prog = {
      id: uid(), name: "Quick workout", quick: true, createdAt: Date.now(),
      config: { name: "Quick workout", goal: "both", progression: "manual", split: null, days: 1, session: "s60", experience: "intermediate", weeks: 1, equipment: ["barbell", "dumbbell", "bench", "cable", "machine", "smith", "ezbar", "pullup", "dip", "kettlebell", "bands"], focus: {}, reduce: [], barbellCap: null, noBodyweight: false, deload: false, percentScheme: null },
      days: [day], overrides: {},
    };
    setProgram(prog);
    startSession(day, 1);
  };
  const QUICK_EQUIP = ["barbell", "dumbbell", "bench", "cable", "machine", "smith", "ezbar", "pullup", "dip", "kettlebell", "bands"];
  const repeatWorkout = (h) => {
    const prog = saved.find(p => p.id === h.programId);
    const day = prog && prog.days.find(d => d.id === h.dayId);
    if (prog && day) { setProgram(prog); startSession(day, 1); return; }
    const ids = Object.keys(h.perf || {}).filter(id => EX_BY_ID[id]);
    if (!ids.length) return;
    const pi = ids.findIndex(id => EX_BY_ID[id]?.type === "compound");
    const d = { id: uid(), label: h.dayLabel || "Workout", exercises: ids, primaryIndex: pi < 0 ? 0 : pi };
    const np = { id: uid(), name: h.programName || "Workout", quick: true, createdAt: Date.now(), config: { name: h.dayLabel || "Workout", goal: "both", progression: "manual", split: null, days: 1, session: "s60", experience: "intermediate", weeks: 1, equipment: QUICK_EQUIP, focus: {}, reduce: [], barbellCap: null, noBodyweight: false, deload: false, percentScheme: null }, days: [d], overrides: {} };
    setProgram(np); startSession(d, 1);
  };
  const saveRoutine = (ids, name) => {
    const valid = (ids || []).filter(id => EX_BY_ID[id]);
    if (!valid.length) return;
    const pi = valid.findIndex(id => EX_BY_ID[id]?.type === "compound");
    const nm = (name && name.trim()) || "My routine";
    const d = { id: uid(), label: nm, exercises: valid, primaryIndex: pi < 0 ? 0 : pi };
    const np = { id: uid(), name: nm, createdAt: Date.now(), config: { name: nm, goal: "both", progression: "manual", split: null, days: 1, session: "s60", experience: "intermediate", weeks: 1, equipment: QUICK_EQUIP, focus: {}, reduce: [], barbellCap: null, noBodyweight: false, deload: false, percentScheme: null }, days: [d], overrides: {} };
    setSaved(prev => [...prev, np]);
    setAppToast({ msg: `Saved "${nm}" to your library` });
  };
  const finishSession = (log) => {
    const entry = { id: uid(), date: Date.now(), ...log };
    const before = new Set(computeMilestones(history).filter(m => m.done).map(m => m.id));
    const fresh = computeMilestones([entry, ...history]).filter(m => m.done && !before.has(m.id));
    setHistory(prev => [entry, ...prev].slice(0, HISTORY_CAP));
    if (log.perf && Object.keys(log.perf).length) setPerf(prev => ({ ...prev, ...log.perf }));
    setSessionDay(null);
    if (program?.quick) { setProgram(null); setView("home"); }
    else setView("program");
    if (fresh.length) setTimeout(() => setAppToast({ msg: `${fresh[0].icon} Achievement unlocked — ${fresh[0].label}${fresh.length > 1 ? ` +${fresh.length - 1} more` : ""}` }), 400);
    else setTimeout(() => setAppToast({ msg: "Workout logged ✓" }), 400);
  };
  const setGoalWeight = (exId, w) => setGoals(prev => { const g = { ...prev }; if (w > 0) g[exId] = w; else delete g[exId]; return g; });
  const editHistoryEntry = (histId, exId, change) => {
    setHistory(prev => prev.map(h => {
      if (h.id !== histId) return h;
      const perf = { ...(h.perf || {}) };
      if (change == null) delete perf[exId];
      else { const ex0 = perf[exId] || {}; perf[exId] = { ...ex0, weight: change.weight, reps: change.reps, sets: [{ w: change.weight, r: change.reps }], date: ex0.date || h.date }; }
      let vol = 0, sets = 0;
      Object.values(perf).forEach(p => (p.sets || []).forEach(s => { vol += (s.w || 0) * (s.r || 0); sets++; }));
      return { ...h, perf, volume: Math.round(vol), setsDone: sets };
    }));
  };

  // Active program = the one tied to the most recent logged workout (else newest saved).
  // Next day walks the rotation from the last day trained; week advances as the block fills.
  const upNext = useMemo(() => {
    if (!saved.length) return null;
    let active = null;
    for (const h of history) { const p = saved.find(s => s.id === h.programId); if (p) { active = p; break; } }
    if (!active) active = saved.slice().sort((a, b) => b.createdAt - a.createdAt)[0];
    if (!active || !active.days.length) return null;
    const dpw = active.days.length;
    const maxWeek = weeksOf(active) + (active.config.deload ? 1 : 0);
    const entries = history.filter(h => h.programId === active.id);
    const done = entries.length;
    const lastIdx = entries.length ? active.days.findIndex(d => d.id === entries[0].dayId) : -1;
    let dayIndex = lastIdx >= 0 ? (lastIdx + 1) % dpw : 0;
    // if a weekly schedule assigns today's weekday to a specific day, honor it over the rotation
    let scheduled = false;
    if (active.schedule) {
      const schedId = active.schedule[new Date().getDay()];
      const si = schedId ? active.days.findIndex(d => d.id === schedId) : -1;
      if (si >= 0) { dayIndex = si; scheduled = true; }
    }
    const weekIndex = (Math.floor(done / dpw) % maxWeek) + 1;
    // recovery-aware emphasis: score each day by how fresh the muscles it trains are
    const rec = muscleRecovery(history);
    const readyByPart = Object.fromEntries(rec.map(r => [r.part, r.readiness]));
    const dayScore = (day) => {
      let sum = 0, wsum = 0;
      day.exercises.forEach(id => {
        const ex = EX_BY_ID[id]; if (!ex) return;
        sum += (readyByPart[ex.part] ?? 100); wsum += 1;
        secondaryOf(ex).forEach(([pp, f]) => { sum += (readyByPart[pp] ?? 100) * f * 0.5; wsum += f * 0.5; });
      });
      return wsum ? sum / wsum : 100;
    };
    const schedScore = dayScore(active.days[dayIndex]);
    let alt = null, best = schedScore + 12; // only suggest a swap that's clearly fresher
    active.days.forEach((d, i) => { if (i === dayIndex || i === lastIdx) return; const sc = dayScore(d); if (sc > best) { best = sc; alt = { day: d, dayIndex: i, score: Math.round(sc) }; } });
    return { program: active, day: active.days[dayIndex], dayIndex, weekIndex, freshness: Math.round(schedScore), alt, scheduled };
  }, [saved, history]);

  const startUpNextAlt = () => {
    if (!upNext?.alt) return;
    setProgram(upNext.program);
    startSession(upNext.alt.day, upNext.weekIndex);
  };
  const startDeload = () => {
    if (!upNext) return;
    const wk = weeksOf(upNext.program);
    if (upNext.program.config.deload) {
      setProgram(upNext.program);
      startSession(upNext.day, wk + 1);
    } else {
      // synthesize a deload: clone with deload enabled and run its reduced week
      const dp = { ...upNext.program, config: { ...upNext.program.config, deload: true } };
      setProgram(dp);
      startSession(upNext.day, wk + 1);
    }
  };
  const startLight = () => {
    if (!upNext) return;
    const day = upNext.alt?.day || upNext.day; // freshest day
    const dp = { ...upNext.program, config: { ...upNext.program.config, deload: true } };
    setProgram(dp);
    startSession(day, weeksOf(dp) + 1); // deload-intensity = light, reduced-volume session
  };

  const startUpNext = () => {
    if (!upNext) return;
    setProgram(upNext.program);
    startSession(upNext.day, upNext.weekIndex);
  };
  const openActive = () => {
    if (!upNext) return;
    setProgram(upNext.program);
    setView("program");
  };

  const tabView = view === "home" || view === "progress" || view === "settings";

  // Resilience: if the view depends on an active program/day that's no longer present
  // (e.g., deleted or reset), fall back to home rather than rendering a blank screen.
  useEffect(() => {
    if (!loaded) return;
    if (view === "session" && (!program || !sessionDay)) { setSessionDay(null); setView("home"); }
    else if (view === "program" && !program) { setView("home"); }
  }, [view, program, sessionDay, loaded]);

  return (
    <div className="wpb" style={{ background: C.bg, color: C.text, minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <StyleTag />
      <div style={{ width: "100%", maxWidth: 460, minHeight: "100vh", height: "100vh", position: "relative", background: C.bg, display: "flex", flexDirection: "column", overflow: "hidden", borderLeft: `1px solid ${C.borderSoft}`, borderRight: `1px solid ${C.borderSoft}` }}>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative" }}>
          <div key={view} className="viewIn" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {!loaded ? (
            <Splash />
          ) : view === "home" ? (
            <Home saved={saved} history={history} onCreate={() => setView("wizard")} onQuick={startQuickWorkout} onOpen={(p) => { setProgram(p); setView("program"); }} onDelete={handleDelete} onDuplicate={handleDuplicate} onNextBlock={startNextBlock} onHistory={() => setView("progress")} historyCount={history.length} upNext={upNext} onStartNext={startUpNext} onStartAlt={startUpNextAlt} onOpenActive={openActive} onTemplate={startTemplate} onDeload={startDeload} canDeload={!!upNext} onLight={startLight} canLight={!!upNext} onLibrary={() => setView("library")} bodyweight={bodyweight} sex={sex} unit={unit} whatsNew={loaded && seenWhatsNew < WHATS_NEW_VERSION && (history.length > 0 || saved.length > 0)} onDismissWhatsNew={() => setSeenWhatsNew(WHATS_NEW_VERSION)} />
          ) : view === "progress" ? (
            <HistoryView history={history} embedded onClear={() => setHistory([])} bodyweight={bodyweight} sex={sex} unit={unit} bwLog={bwLog} onLogBodyweight={logBodyweight} goals={goals} onRepeat={repeatWorkout} measurements={measurements} onLogMeasurement={logMeasurement} />
          ) : view === "settings" ? (
            <SettingsView
              theme={theme} setTheme={chooseTheme} unit={unit} setUnit={setUnit}
              loadMode={loadMode} setLoadMode={setLoadMode}
              restAutoStart={restAutoStart} setRestAutoStart={setRestAutoStart}
              restScale={restScale} setRestScale={setRestScale}
              reminders={reminders} setReminders={setReminders}
              minInc={minInc} setMinInc={setMinInc}
              plates={plates} setPlates={setPlates}
              bodyweight={bodyweight} setBodyweight={setBodyweight} sex={sex} setSex={setSex}
              bannedCount={banned.length} customCount={custom.length} historyCount={history.length} savedCount={saved.length}
              onClearBanned={() => { const prev = banned; setBanned([]); if (prev.length) setAppToast({ msg: `Cleared ${prev.length} banned exercise${prev.length === 1 ? "" : "s"}`, undo: () => { setBanned(prev); setAppToast(null); } }); }}
              onClearHistory={() => { const prev = history; setHistory([]); if (prev.length) setAppToast({ msg: `Cleared ${prev.length} logged workout${prev.length === 1 ? "" : "s"}`, undo: () => { setHistory(prev); setAppToast(null); } }); }}
              onResetAll={resetAll}
              onExport={exportData} onExportCSV={exportCSV} onExportBodyCSV={exportBodyCSV} onImport={importData}
              onLibrary={() => setView("library")}
              onImportProgram={importProgramText}
              onShowIntro={() => { setSeenIntroV(0); setView("home"); }}
            />
          ) : view === "library" ? (
            <LibraryView onBack={() => setView("home")} banned={banned} onBan={addBan} goals={goals} onSetGoal={setGoalWeight} unit={unit} history={history} onCreateCustom={() => setView("wizard")} />
          ) : view === "wizard" ? (
            <Wizard initialEquipment={equipDefault} onCancel={() => setView("home")} onDone={handleGenerate} />
          ) : view === "session" && program && sessionDay ? (
            <WorkoutSession
              program={program} day={sessionDay} weekIndex={sessionWeek}
              unit={unit} setUnit={setUnit} perf={perf}
              onExit={() => { const q = program?.quick; setSessionDay(null); if (q) { setProgram(null); setView("home"); } else setView("program"); }}
              onFinish={finishSession}
              onSaveRoutine={saveRoutine}
              restAutoStart={restAutoStart} restScale={restScale}
              onBan={addBan}
              banned={banned}
              history={history}
              loadMode={loadMode}
              onEditHistory={editHistoryEntry}
              goals={goals}
              onSetGoal={setGoalWeight}
            />
          ) : program ? (
            <ProgramView
              program={program} setProgram={setProgram}
              banned={banned} addBan={addBan}
              loadMode={loadMode} unit={unit} history={history}
              isSaved={isSaved}
              onSave={handleSave}
              onRegenerate={handleRegenerate}
              onNextCycle={startNextBlock}
              onBack={() => setView("home")}
              onStartDay={startSession}
              onCreateCustom={createCustom}
              initialWeek={program ? progWeek[program.id] : undefined}
              onWeekChange={(w) => { if (program) setProgWeek(m => ({ ...m, [program.id]: w })); }}
            />
          ) : (
            <Splash />
          )}
          </div>
        </div>
        {loaded && tabView && <TabBar view={view} onNav={setView} />}

        {appToast && (
          <div style={{ position: "absolute", left: 16, right: 16, bottom: tabView ? "calc(env(safe-area-inset-bottom) + 78px)" : "calc(env(safe-area-inset-bottom) + 24px)", zIndex: 95, display: "flex", alignItems: "center", gap: 12, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 13, padding: "12px 14px", boxShadow: "0 8px 30px rgba(0,0,0,.35)", animation: "sheetUp .25s cubic-bezier(.2,.7,.3,1) both" }}>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{appToast.msg}</span>
            {appToast.undo && <button onClick={appToast.undo} className="pressable" style={{ background: "none", border: "none", color: C.accent, fontSize: 13.5, fontWeight: 800, cursor: "pointer", flexShrink: 0, padding: "2px 4px" }}>Undo</button>}
            {appToast.action && appToast.actionLabel && <button onClick={appToast.action} className="pressable" style={{ background: "none", border: "none", color: C.accent, fontSize: 13.5, fontWeight: 800, cursor: "pointer", flexShrink: 0, padding: "2px 4px", whiteSpace: "nowrap" }}>{appToast.actionLabel}</button>}
            <button onClick={() => setAppToast(null)} className="pressable" style={{ background: "none", border: "none", color: C.faint, cursor: "pointer", flexShrink: 0, padding: 2, display: "flex" }}><X size={16} /></button>
          </div>
        )}

        {loaded && seenIntroV < INTRO_VERSION && (
          <div style={{ position: "absolute", inset: 0, zIndex: 90, background: C.bg, display: "flex", flexDirection: "column", animation: "fadeIn .25s both" }}>
            <div className="wpb-scroll" style={{ flex: 1, overflowY: "auto", padding: "calc(env(safe-area-inset-top) + 40px) 26px 24px" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Dumbbell size={28} color={C.accentText} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15 }}>Train smarter,<br />progress faster.</div>
              <div style={{ fontSize: 14.5, color: C.muted, marginTop: 12, lineHeight: 1.5 }}>An evidence-based coach in your pocket — periodized programs that autoregulate to how each set actually goes. 280+ exercises across 17 muscle groups, 14 templates, 7 themes, zero accounts. Everything stays on your device.</div>
              <div style={{ marginTop: 26 }}>
                {[
                  [Wand2, "Smart program builder", "Pick your split, days, equipment & goal — get a periodized plan that opens each muscle with a compound, varies movement patterns, and ramps volume MEV→MRV through named phases. Or start from a template — 5/3/1, Madcow, PPL and more."],
                  [Activity, "Coaches you set by set", "Log the reps you had left and it retunes the next set for fatigue, your rep range, and even your exact plates — then calibrates next session's opening weights. New PRs flash live at the rack."],
                  [Battery, "Knows when to back off", "Per-muscle recovery, a fatigue trend read from your logged effort, and a proactive deload when your reserve drops — including which muscles to trim first. Push hard without digging a hole."],
                  [TrendingUp, "Progress you can see", "Estimated-1RM trends, a strength-level board, achievements, intensity distribution, body measurements, and a shareable recap card after every session."],
                  [Layers, "Built around your gym", "Supersets & circuits, RIR or RPE, kg/lb, microplate-aware plate math, per-exercise rest, a weekly schedule, reminders, and full CSV/JSON export — all editable on the fly."],
                ].map(([Icon, title, sub], i) => (
                  <div key={i} style={{ display: "flex", gap: 13, marginBottom: 18 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={19} color={C.accent} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{title}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.45, marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 22px calc(env(safe-area-inset-bottom) + 26px)", background: `linear-gradient(to top, ${C.bg} 70%, transparent)` }}>
              <button onClick={() => { setSeenIntroV(INTRO_VERSION); setSeenWhatsNew(WHATS_NEW_VERSION); setView("wizard"); }} className="pressable" style={{ width: "100%", padding: "16px", borderRadius: 15, border: "none", background: C.accent, color: C.accentText, fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Wand2 size={18} /> Build my program
              </button>
              <button onClick={() => { setSeenIntroV(INTRO_VERSION); setSeenWhatsNew(WHATS_NEW_VERSION); setView("home"); }} className="pressable" style={{ width: "100%", padding: "13px", marginTop: 9, borderRadius: 14, border: `1px solid ${C.border}`, background: "none", color: C.text, fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}>
                Browse ready-made templates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
