
const challenges = [
  {
    title: "Notice five things growing",
    description: "Step outside and find five living things. Look closely at their shapes, colours, and tiny details.",
    emoji: "🌿",
    tag: "A gentle reset",
    mood: "calm",
    place: ["anywhere", "park", "city", "home"],
    min: 5
  },
  {
    title: "Take a sound walk",
    description: "Walk slowly and notice five different sounds. Try to identify where each one comes from.",
    emoji: "👂",
    tag: "Mindful moment",
    mood: "calm",
    place: ["anywhere", "park", "city"],
    min: 5
  },
  {
    title: "Find a patch of sky",
    description: "Look up safely from a comfortable spot. Watch the clouds or changing light for a few quiet minutes.",
    emoji: "☁️",
    tag: "Slow down",
    mood: "calm",
    place: ["anywhere", "park", "city", "home"],
    min: 5
  },
  {
    title: "Explore a new street",
    description: "Choose a nearby street or path you rarely take. Notice a shopfront, tree, or detail you have never seen.",
    emoji: "🧭",
    tag: "Little explorer",
    mood: "curious",
    place: ["city", "park"],
    min: 15
  },
  {
    title: "Go on a colour hunt",
    description: "Pick one colour and find ten things in nature that contain it. Different shades count!",
    emoji: "🎨",
    tag: "Curious eyes",
    mood: "curious",
    place: ["anywhere", "park", "city", "home"],
    min: 5
  },
  {
    title: "Meet a tree",
    description: "Find a tree or plant. Notice its bark, leaves, shape, and the life around it. Leave it undisturbed.",
    emoji: "🌳",
    tag: "Nature connection",
    mood: "curious",
    place: ["anywhere", "park", "city"],
    min: 15
  },
  {
    title: "Take a brisk mini-walk",
    description: "Walk at a comfortable, energetic pace. Let your arms swing and notice how your body feels.",
    emoji: "🚶",
    tag: "Move a little",
    mood: "active",
    place: ["anywhere", "park", "city"],
    min: 15
  },
  {
    title: "Stretch in fresh air",
    description: "Find a safe, comfortable place and do a few gentle shoulder rolls, side stretches, and ankle circles.",
    emoji: "☀️",
    tag: "Energy reset",
    mood: "active",
    place: ["park", "home", "anywhere"],
    min: 5
  },
  {
    title: "Water something green",
    description: "Water a balcony plant, garden bed, or community plant if you have permission. Check the soil first.",
    emoji: "🪴",
    tag: "Care for nature",
    mood: "active",
    place: ["home", "park"],
    min: 5
  },
  {
    title: "Share a small hello",
    description: "If it feels comfortable and safe, greet a neighbour, thank a gardener, or smile at someone you pass.",
    emoji: "👋",
    tag: "Tiny connection",
    mood: "social",
    place: ["city", "park", "anywhere"],
    min: 5
  },
  {
    title: "Invite someone for a walk",
    description: "Send a friend a simple message asking if they would like to take a short walk together this week.",
    emoji: "💚",
    tag: "Together is better",
    mood: "social",
    place: ["anywhere", "city", "park"],
    min: 5
  },
  {
    title: "Leave a place better",
    description: "If safe, pick up a small piece of litter using gloves or a tissue and put it in the right bin. Skip hazardous waste.",
    emoji: "🧤",
    tag: "Kind to the planet",
    mood: "active",
    place: ["city", "park"],
    min: 15
  },
  {
    title: "Watch a tiny creature",
    description: "From a respectful distance, observe an ant, butterfly, bird, or other small creature. Do not touch or feed wildlife.",
    emoji: "🦋",
    tag: "Wildlife watcher",
    mood: "curious",
    place: ["park", "city", "home", "anywhere"],
    min: 15
  },
  {
    title: "Make a mini nature journal",
    description: "Write or sketch three things you noticed outside. A leaf shape, a cloud, or a bird call is enough.",
    emoji: "📓",
    tag: "Notice and remember",
    mood: "calm",
    place: ["anywhere", "park", "home"],
    min: 15
  }
];

// Get an HTML element by its ID.
const $ = (id) => document.getElementById(id);

let currentChallenge = challenges[0];

// Use the local date, independent of UTC conversion.
function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Read saved progress safely.
function getProgress() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("touchGrassProgress")
    );

    if (saved && Array.isArray(saved.days)) {
      return {
        days: saved.days,
        lastDone: saved.lastDone || ""
      };
    }
  } catch (error) {
    console.warn("Could not read saved progress.", error);
  }

  return { days: [], lastDone: "" };
}

// Filter activities using the user's selections.
function getFilteredChallenges() {
  const mood = $("mood").value;
  const place = $("place").value;
  const minutes = Number($("duration").value);

  return challenges.filter((challenge) => {
    const moodMatches =
      mood === "any" || challenge.mood === mood;

    const placeMatches =
      place === "anywhere" ||
      challenge.place.includes(place);

    const timeMatches = challenge.min <= minutes;

    return moodMatches && placeMatches && timeMatches;
  });
}

// Display a challenge on the page.
function displayChallenge(challenge) {
  currentChallenge = challenge;

  $("challengeTitle").textContent = challenge.title;
  $("challengeDescription").textContent = challenge.description;
  $("challengeEmoji").textContent = challenge.emoji || "🌿";
  $("challengeTag").textContent = challenge.tag || "Made for you";
  $("challengeTime").textContent = `${$("duration").value} min`;
}

// Generate a random suitable activity.
function generateChallenge() {
  const options = getFilteredChallenges();

  if (options.length === 0) {
    $("feedback").textContent =
      "No exact match. Try another mood, location, or longer time.";
    return;
  }

  const alternatives = options.filter(
    (challenge) => challenge.title !== currentChallenge.title
  );

  const pool = alternatives.length ? alternatives : options;

  const randomIndex = Math.floor(Math.random() * pool.length);

  displayChallenge(pool[randomIndex]);

  $("feedback").textContent =
    "Your next little adventure is ready. Head outside and enjoy!";
}

// Display the number of days on which activities were completed.
function updateStreak() {
  const progress = getProgress();
  $("streakCount").textContent = progress.days.length;
}

// Record today's completed outdoor activity.
function completeChallenge() {
  const progress = getProgress();
  const today = getToday();

  if (progress.lastDone === today) {
    $("feedback").textContent =
      "You have already logged today's outdoor activity. Well done! 🌱";
    return;
  }

  progress.days.push(today);
  progress.lastDone = today;

  try {
    localStorage.setItem(
      "touchGrassProgress",
      JSON.stringify(progress)
    );

    updateStreak();

    $("feedback").textContent =
      "Lovely work! Your outdoor activity has been saved on this device. 🌱";
  } catch (error) {
    $("feedback").textContent =
      "Activity completed! Browser storage is unavailable, so progress could not be saved.";
  }
}

// Optional local AI integration using Ollama.
// Requires Ollama, the llama3.2:1b model, and permitted browser access.
async function askLocalAI() {
  const mood = $("mood").value;
  const duration = $("duration").value;
  const place = $("place").value;

  const button = $("aiChallenge");

  button.disabled = true;
  button.textContent = "Thinking…";

  $("aiStatus").textContent =
    "Connecting to your local Ollama model...";

  $("feedback").textContent = "";

  try {
    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3.2:1b",
          stream: false,
          format: "json",
          prompt: `
Create one safe, simple outdoor or nature-connected activity.

Mood: ${mood}
Available time: ${duration} minutes
Location: ${place}

Return JSON with these keys:
title, description, emoji, tag.

Rules:
- Keep the activity low-cost and realistic.
- Respect wildlife and the environment.
- Never suggest trespassing or dangerous activities.
- Keep the description under 35 words.
- Make the activity suitable for the available time.
`
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Ollama did not respond. Check that it is running and the model is installed."
      );
    }

    const data = await response.json();
    const task = JSON.parse(data.response);

    if (!task.title || !task.description) {
      throw new Error("The AI returned an incomplete activity.");
    }

    displayChallenge({
      title: task.title,
      description: task.description,
      emoji: task.emoji || "🌿",
      tag: task.tag || "Created by local AI",
      mood: mood,
      place: [place, "anywhere"],
      min: Number(duration)
    });

    $("aiStatus").textContent =
      "Your challenge was generated by your local AI model.";

    $("feedback").textContent =
      "Your local AI created this idea. Skip it if it is unsuitable or unsafe.";
  } catch (error) {
    $("aiStatus").textContent =
      "Local AI is not connected. Your built-in challenge generator still works.";

    $("feedback").textContent =
      "AI connection failed: " + error.message +
      " Install Ollama and check its browser-origin permissions.";
  } finally {
    button.disabled = false;
    button.textContent = "Ask local AI";
  }
}

// Connect the buttons to their functions.
$("newChallenge").addEventListener(
  "click",
  generateChallenge
);

$("completeChallenge").addEventListener(
  "click",
  completeChallenge
);

$("aiChallenge").addEventListener(
  "click",
  askLocalAI
);

// Generate a fresh activity when filters change.
["mood", "duration", "place"].forEach((id) => {
  $(id).addEventListener("change", generateChallenge);
});

// Initialise the page.
updateStreak();