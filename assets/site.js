const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    navigation.classList.toggle("is-open", !open);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      menuButton.focus();
    }
  });
}

const firstSegment = window.location.pathname.split("/").filter(Boolean)[0] || "start";
const sectionMap = {
  "serwis-okien-poznan": "okna",
  "naprawa-okien-poznan": "okna",
  "regulacja-okien-poznan": "okna",
  "wymiana-zamka-w-oknie-poznan": "okna",
  "naprawa-drzwi-balkonowych-poznan": "drzwi",
  "regulacja-drzwi-balkonowych-poznan": "drzwi",
};
const section = sectionMap[firstSegment] || firstSegment;
document.querySelectorAll(".nav a[data-section]").forEach((link) => {
  if (link.dataset.section === section) {
    link.setAttribute("aria-current", "page");
  }
});
