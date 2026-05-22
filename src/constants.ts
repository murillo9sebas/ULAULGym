export const WORKOUTS = [
  {
    id: "quads-calves",
    name: "Lower 1",
    subtitle: "Quads & Calves",
    color: "#CFE8E1", // Sage Mint
    exercises: [
      { id: "leg-press", name: "Leg Press (Quad focused)", sets: 3, reps: "8-10" },
      { id: "db-rdl", name: "Dumbbell Romanian Deadlift", sets: 3, reps: "8-10" },
      { id: "leg-extensions", name: "Seated Leg Extensions", sets: 3, reps: "10-15" },
      { id: "walking-lunges", name: "Inner Thigh Abductors (close)", sets: 2, reps: "8-10/leg" },
      { id: "calf-raise", name: "Standing Weighted Calf Raise", sets: 3, reps: "10-15" }
    ]
  },
  {
    id: "chest-back-shoulders",
    name: "Upper 1",
    subtitle: "Chest & Back & Shoulders",
    color: "#EFEFF4",
    exercises: [
      { id: "bb-bench", name: "Barbell Bench Press", sets: 3, reps: "8-10" },
      { id: "lat-pulldown", name: "Lat Pulldown", sets: 3, reps: "8-10" },
      { id: "bb-ohp", name: "Overhead Press", sets: 3, reps: "6-8" },
      { id: "db-fly", name: "Dumbbell Fly", sets: 2, reps: "10-15" },
      { id: "db-row", name: "Dumbbell Chest Supported Row", sets: 3, reps: "10-12" },
      { id: "lat-raise", name: "Lateral Raise", sets: 3, reps: "15-20" }
    ]
  },
  {
    id: "abs-cardio",
    name: "Abs",
    subtitle: "Core & Cardio",
    color: "#F9F9FB",
    exercises: [
      { id: "weighted-crunches", name: "Weighted Crunches", sets: 3, reps: "12-15" },
      { id: "leg-raises", name: "Leg Raises", sets: 3, reps: "10-15" },
      { id: "cable-rotation", name: "Standing Cable Rotation", sets: 3, reps: "10-12/side" }
    ]
  },
  {
    id: "glutes-hams-calves",
    name: "Lower 2",
    subtitle: "Glutes & Hamstrings",
    color: "#CFE8E1",
    exercises: [
      { id: "bb-deadlift", name: "Barbell Deadlift", sets: 3, reps: "6-8" },
      { id: "hip-thrust", name: "Barbell Hip Thrust", sets: 3, reps: "10-15" },
      { id: "leg-curl", name: "Lying Leg Curls", sets: 3, reps: "10-15" },
      { id: "seated-calf", name: "Seated Weighted Calf Raise", sets: 3, reps: "10-15" },
      { id: "face-pulls", name: "Outer Thigh Abductor (open)", sets: 2, reps: "10" }
    ]
  },
  {
    id: "chest-back-arms",
    name: "Upper 2",
    subtitle: "Chest & Back & Arms",
    color: "#EFEFF4",
    exercises: [
      { id: "incline-db", name: "Low Incline DB Press", sets: 3, reps: "8-10" },
      { id: "cable-row", name: "Seated Cable Row", sets: 3, reps: "8-10" },
      { id: "flat-db", name: "Flat DB Press", sets: 2, reps: "8-10" },
      { id: "cable-lateral", name: "Cable Lateral Raise", sets: 3, reps: "15-20" },
      { id: "tri-ext", name: "Overhead Extensions", sets: 2, reps: "10-15" },
      { id: "db-curl", name: "Incline DB Curls", sets: 2, reps: "8-10" }
    ]
  }
];

export const EXERCISE_ALTERNATIVES: Record<string, Array<{ id: string, name: string }>> = {
  "leg-press": [
    { id: "leg-press", name: "Leg Press (Quad focused)" },
    { id: "squats", name: "Barbell Back Squat" },
    { id: "hack-squat", name: "Hack Squat" }
  ],
  "db-rdl": [
    { id: "db-rdl", name: "Dumbbell Romanian Deadlift" },
    { id: "bb-rdl", name: "Barbell Romanian Deadlift" },
    { id: "hamstring-curl-lying", name: "Hamstring Curl" }
  ],
  "leg-extensions": [
    { id: "leg-extensions", name: "Seated Leg Extensions" },
    { id: "sissy-squat", name: "Sissy Squats" },
    { id: "bulgarian-split", name: "Bulgarian Split Squats" }
  ],
  "walking-lunges": [
    { id: "walking-lunges", name: "Inner Thigh Abductors (close)" },
    { id: "reverse-lunges", name: "Deficit Reverse Lunges" },
    { id: "step-ups", name: "Weighted Step-ups" }
  ],
  "calf-raise": [
    { id: "calf-raise", name: "Standing Weighted Calf Raise" },
    { id: "seated-calf-raise", name: "Seated Calf Raise" },
    { id: "donkey-calf-raise", name: "Donkey Calf Raise" }
  ],
  "bb-bench": [
    { id: "bb-bench", name: "Barbell Bench Press" },
    { id: "db-bench", name: "Flat Dumbbell Bench Press" },
    { id: "weighted-dips", name: "Weighted Chest Dips" }
  ],
  "lat-pulldown": [
    { id: "lat-pulldown", name: "Lat Pulldown" },
    { id: "pull-ups", name: "Weighted Pull-ups" },
    { id: "chins", name: "Weighted Chin-ups" }
  ],
  "bb-ohp": [
    { id: "bb-ohp", name: "Overhead Press" },
    { id: "db-shoulder-press", name: "Seated DB Shoulder Press" },
    { id: "hspu", name: "Deficit Handstand Pushups" }
  ],
  "db-fly": [
    { id: "db-fly", name: "Dumbbell Fly" },
    { id: "cable-fly", name: "Cable Crossover Fly" },
    { id: "pec-deck", name: "Pec Deck Machine" }
  ],
  "db-row": [
    { id: "db-row", name: "Dumbbell Chest Supported Row" },
    { id: "barbell-row", name: "Bent Over Barbell Row" },
    { id: "t-bar-row", name: "T-Bar Row" }
  ],
  "lat-raise": [
    { id: "lat-raise", name: "Lateral Raise" },
    { id: "db-lateral-raise", name: "Dumbbell Lateral Raise" },
    { id: "cable-lateral-raise", name: "Cable Lateral Raise" }
  ],
  "weighted-crunches": [
    { id: "weighted-crunches", name: "Weighted Crunches" },
    { id: "decline-situps", name: "Decline Weighted Situps" },
    { id: "cable-crunches", name: "Standing Cable Crunches" }
  ],
  "leg-raises": [
    { id: "leg-raises", name: "Leg Raises" },
    { id: "hanging-leg-raises", name: "Hanging Knee/Leg Raises" },
    { id: "ab-wheel", name: "Ab Wheel Rollouts" }
  ],
  "cable-rotation": [
    { id: "cable-rotation", name: "Standing Cable Rotation" },
    { id: "russian-twists", name: "Weighted Russian Twists" },
    { id: "woodchoppers", name: "Cable Woodchoppers" }
  ],
  "bb-deadlift": [
    { id: "bb-deadlift", name: "Barbell Deadlift" },
    { id: "sumo-deadlift", name: "Sumo Deadlift" },
    { id: "trap-bar-deadlift", name: "Trap Bar Deadlift" }
  ],
  "hip-thrust": [
    { id: "hip-thrust", name: "Barbell Hip Thrust" },
    { id: "b-stance-hip-thrust", name: "B-Stance Hip Thrust" },
    { id: "cable-pullthrough", name: "Cable Pullthrough" }
  ],
  "leg-curl": [
    { id: "leg-curl", name: "Lying Leg Curls" },
    { id: "seated-leg-curl", name: "Seated Leg Curls" },
    { id: "nordic-curl", name: "Nordic Hamstring Curls" }
  ],
  "seated-calf": [
    { id: "seated-calf", name: "Seated Weighted Calf Raise" },
    { id: "standing-calf-raise-alt", name: "Standing Calf Raise" },
    { id: "calf-press", name: "Calf Press on Leg Press" }
  ],
  "face-pulls": [
    { id: "face-pulls", name: "Outer Thigh Abductor (open)" },
    { id: "rear-delt-fly", name: "Rear Delt Dumbbell Fly" },
    { id: "banded-pull-aparts", name: "Banded Pull-Aparts" }
  ],
  "incline-db": [
    { id: "incline-db", name: "Low Incline DB Press" },
    { id: "incline-bb", name: "Incline Barbell Press" },
    { id: "incline-hammer-strength", name: "Incline Chest Press Machine" }
  ],
  "cable-row": [
    { id: "cable-row", name: "Seated Cable Row" },
    { id: "chest-supported-t-bar", name: "Chest Supported T-Bar Row" },
    { id: "single-arm-lat-pullin", name: "Single Arm Lat Pullin" }
  ],
  "flat-db": [
    { id: "flat-db", name: "Flat DB Press" },
    { id: "weighted-dips-alt", name: "Weighted Dips" },
    { id: "hammer-strength-flat", name: "Flat Chest Press Machine" }
  ],
  "cable-lateral": [
    { id: "cable-lateral", name: "Cable Lateral Raise" },
    { id: "db-lateral-raise-alt", name: "Dumbbell Lateral Raise" },
    { id: "around-the-worlds", name: "Dumbbell Around the Worlds" }
  ],
  "tri-ext": [
    { id: "tri-ext", name: "Overhead Extensions" },
    { id: "cable-pushdowns", name: "Tricep Cable Pushdowns" },
    { id: "skull-crushers", name: "EZ Bar Skull Crushers" }
  ],
  "db-curl": [
    { id: "db-curl", name: "Incline DB Curls" },
    { id: "hammer-curls", name: "Dumbbell Hammer Curls" },
    { id: "cable-bicep-curls", name: "Supinated Cable Curls" }
  ]
};

