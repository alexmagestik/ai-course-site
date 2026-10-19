const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const resetFilters = document.querySelector("#resetFilters");
const visibleCount = document.querySelector("#visibleCount");
const resultWord = document.querySelector("#resultWord");
const emptyState = document.querySelector("#emptyState");
const coursesSection = document.querySelector("#courses");
const filterChips = Array.from(document.querySelectorAll(".filter-chip"));
const courseCards = Array.from(document.querySelectorAll(".course-card"));

let activeTag = "all";

function getMaterialsWord(count) {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "материалов";
  }

  if (lastOne === 1) {
    return "материал";
  }

  if (lastOne >= 2 && lastOne <= 4) {
    return "материала";
  }

  return "материалов";
}

function updateResults() {
  const query = searchInput.value.trim().toLowerCase();
  let shownCards = 0;

  courseCards.forEach((card) => {
    const cardTags = card.dataset.tags.split("|");
    const matchesTag = activeTag === "all" || cardTags.includes(activeTag);
    const matchesSearch = query === "" || card.dataset.search.includes(query);
    const shouldShow = matchesTag && matchesSearch;

    card.hidden = !shouldShow;

    if (shouldShow) {
      shownCards += 1;
    }
  });

  visibleCount.textContent = shownCards;
  resultWord.textContent = getMaterialsWord(shownCards);
  emptyState.hidden = shownCards !== 0;
  clearSearch.hidden = query === "";
}

function setActiveTag(tag, shouldScroll = false) {
  activeTag = tag;

  filterChips.forEach((chip) => {
    const isActive = chip.dataset.tag === tag;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });

  updateResults();

  if (shouldScroll) {
    coursesSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function resetAllFilters() {
  searchInput.value = "";
  setActiveTag("all");
  searchInput.focus();
}

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => setActiveTag(chip.dataset.tag));
});

document.querySelectorAll(".tag-chip").forEach((chip) => {
  chip.addEventListener("click", () => setActiveTag(chip.dataset.tag, true));
});

searchInput.addEventListener("input", updateResults);

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  updateResults();
  searchInput.focus();
});

resetFilters.addEventListener("click", resetAllFilters);

document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  const isTyping =
    activeElement.tagName === "INPUT" ||
    activeElement.tagName === "TEXTAREA" ||
    activeElement.isContentEditable;

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key === "Escape" && activeElement === searchInput && searchInput.value !== "") {
    searchInput.value = "";
    updateResults();
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  courseCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height - 0.5) * -4.5).toFixed(2);
      const rotateY = ((x / rect.width - 0.5) * 4.5).toFixed(2);

      card.style.setProperty("--rx", `${rotateX}deg`);
      card.style.setProperty("--ry", `${rotateY}deg`);
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  });
}
