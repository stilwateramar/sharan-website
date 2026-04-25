(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".nav-links .has-sub > a").forEach((a) => {
    a.addEventListener("click", (e) => {
      if (window.matchMedia("(max-width: 980px)").matches) {
        e.preventDefault();
        a.parentElement.classList.toggle("open");
      }
    });
  });

  const path = location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "/");
  document.querySelectorAll(".nav-links a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    const normalized = href.replace(/index\.html$/, "").replace(/\/$/, "/");
    if (path && normalized && (path === normalized || (normalized !== "/" && path.startsWith(normalized)))) {
      a.classList.add("active");
    }
  });

  document.querySelectorAll("form[data-noop]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = f.querySelector(".form-note");
      if (note) {
        note.hidden = false;
        note.textContent = "Thanks — your message has been recorded. The team will reach out soon.";
      }
      f.reset();
    });
  });
})();
