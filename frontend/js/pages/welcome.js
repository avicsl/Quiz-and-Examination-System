(function () {
  const list = UI.qs("#subject-list");
  const arrow = '<span class="tile-go">Select subject<svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  CONFIG.SUBJECTS.forEach((subject) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile-card";
    button.innerHTML =
      '<span class="tile-emblem">' + subject.code.charAt(0) + '</span>' +
      '<span class="tile-title">' + subject.code + '</span>' +
      '<span class="tile-desc">' + subject.name + '</span>' +
      '<span class="tile-footer">' + arrow + '</span>';
    button.addEventListener("click", () => {
      Store.set({ subjectId: subject.id });
      window.location.href = "details.html";
    });
    list.appendChild(button);
  });
})();
