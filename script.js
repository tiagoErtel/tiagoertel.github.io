const form = document.getElementById("my-form");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const submitButton = document.getElementById("submit-btn");

  submitButton.disabled = true;
  submitButton.innerText = "Sending...";

  fetch("https://formspree.io/f/mkovqbpz", {
    method: "POST",
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        status.innerHTML = "Thanks! I'll get back to you soon.";
        status.style.color = "#38bdf8"; // Your accent color
        form.reset();
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            status.innerHTML = data["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            status.innerHTML =
              "Oops! There was a problem submitting your form.";
          }
        });
      }
    })
    .catch((error) => {
      status.innerHTML = "Oops! Connectivity issue.";
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.innerText = "Send Message";
    });
});

const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal");
    } else {
      entry.target.classList.remove("reveal");
    }
  });
}, observerOptions);

document.querySelectorAll("section, .card").forEach((el) => {
  el.classList.add("hide-item");
  observer.observe(el);
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

const textElement = document.getElementById("typewriter");
const words = ["Software Engineer", "Backend Specialist", "Data Engineer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    textElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    textElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 150;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typeSpeed = 2000;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", type);

async function fetchGitHubStats() {
  const repoCards = document.querySelectorAll("[data-repo]");

  for (const card of repoCards) {
    const repoPath = card.getAttribute("data-repo");
    const starsEl = card.querySelector(".stars");
    const updatedEl = card.querySelector(".last-updated");

    try {
      const response = await fetch(`https://api.github.com/repos/${repoPath}`);
      if (!response.ok) throw new Error("Not found");

      const data = await response.json();

      if (starsEl)
        starsEl.innerHTML = `<i class="fas fa-star"></i> ${data.stargazers_count}`;

      if (updatedEl) {
        const date = new Date(data.pushed_at).toLocaleDateString("en-IE", {
          month: "short",
          year: "numeric",
        });
        updatedEl.innerText = `Updated: ${date}`;
      }
    } catch (error) {
      console.error("Error fetching repo:", error);
      if (updatedEl) updatedEl.innerText = "Check GitHub";
    }
  }
}

document.addEventListener("DOMContentLoaded", fetchGitHubStats);

const themeToggle = document.getElementById("theme-toggle");
const icon = themeToggle.querySelector("i");

const currentTheme = localStorage.getItem("theme");
if (currentTheme === "light") {
  document.body.classList.add("light-mode");
  icon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  let theme = "dark";
  if (document.body.classList.contains("light-mode")) {
    theme = "light";
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
  }

  localStorage.setItem("theme", theme);
});
