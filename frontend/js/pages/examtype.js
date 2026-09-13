(function () {
  const session = UI.requireSession(["subjectId", "name", "block"]);
  if (!session) return;

  UI.qs("#student-label").textContent = session.name + " | " + UI.subjectName(session.subjectId);
  UI.qs("#back-btn").addEventListener("click", () => {
    window.location.href = "details.html";
  });

  const list = UI.qs("#examtype-list");
  const arrow = '<span class="tile-go">Begin<svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  CONFIG.EXAM_TYPES.forEach((examType) => {
    const available = UI.isWithinWindow(examType.opensAt, examType.closesAt);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile-card" + (available ? "" : " is-locked");
    button.disabled = !available;
    const duration = examType.durationMinutes === 60 ? "1 hour" : examType.durationMinutes + " minutes";
    button.innerHTML =
      '<span class="tile-title">' + examType.name + '</span>' +
      '<span class="tile-desc"><span>' + duration + '</span><span class="tile-window">Open: ' + UI.formatDateTime(examType.opensAt) + '<br>Close: ' + UI.formatDateTime(examType.closesAt) + '</span></span>' +
      '<span class="tile-footer"><span class="pill ' + (available ? "" : "is-locked") + '">' + (available ? "Available" : "Locked") + '</span>' + (available ? arrow : "") + '</span>';
    if (available) {
      button.addEventListener("click", () => {
        Store.set({ examTypeId: examType.id });
        window.location.href = "exam.html";
      });
    }
    list.appendChild(button);
  });
})();
