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
