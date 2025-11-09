document.addEventListener("DOMContentLoaded", function () {
  let activeTag = "all";

  const filterByTag = (tag) => {
    activeTag = tag;

    // Update active button state
    document.querySelectorAll(".bib-tag-btn").forEach((btn) => {
      if (btn.dataset.tag === tag) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Filter bibliography items
    document.querySelectorAll(".bibliography > li").forEach((li) => {
      const row = li.querySelector(".row");
      if (!row) return;

      const itemTags = row.dataset.tags || "";

      if (tag === "all") {
        li.classList.remove("unloaded");
      } else {
        // Check if the item has the selected tag
        const tags = itemTags.split(",").map((t) => t.trim().toLowerCase());
        if (tags.includes(tag.toLowerCase())) {
          li.classList.remove("unloaded");
        } else {
          li.classList.add("unloaded");
        }
      }
    });

    // Hide/show year headers based on visible items
    document.querySelectorAll("h2.bibliography").forEach(function (element) {
      let iterator = element.nextElementSibling;
      let hideFirstGroupingElement = true;

      while (iterator && iterator.tagName !== "H2") {
        if (iterator.tagName === "OL") {
          const ol = iterator;
          const unloadedSiblings = ol.querySelectorAll(":scope > li.unloaded");
          const totalSiblings = ol.querySelectorAll(":scope > li");

          if (unloadedSiblings.length === totalSiblings.length) {
            ol.previousElementSibling?.classList.add("unloaded");
            ol.classList.add("unloaded");
          } else {
            hideFirstGroupingElement = false;
            ol.previousElementSibling?.classList.remove("unloaded");
            ol.classList.remove("unloaded");
          }
        }
        iterator = iterator.nextElementSibling;
      }

      if (hideFirstGroupingElement) {
        element.classList.add("unloaded");
      } else {
        element.classList.remove("unloaded");
      }
    });

    // Also check h3 year headers
    document.querySelectorAll("h3.bibliography").forEach(function (element) {
      let iterator = element.nextElementSibling;
      let hasVisibleItems = false;

      while (iterator && iterator.tagName !== "H3" && iterator.tagName !== "H2") {
        if (iterator.tagName === "OL") {
          const ol = iterator;
          const unloadedSiblings = ol.querySelectorAll(":scope > li.unloaded");
          const totalSiblings = ol.querySelectorAll(":scope > li");

          if (unloadedSiblings.length < totalSiblings.length) {
            hasVisibleItems = true;
          }
        }
        iterator = iterator.nextElementSibling;
      }

      if (!hasVisibleItems) {
        element.classList.add("unloaded");
      } else {
        element.classList.remove("unloaded");
      }
    });
  };

  // Add click event listeners to tag buttons
  document.querySelectorAll(".bib-tag-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tag = this.dataset.tag;
      filterByTag(tag);
    });
  });

  // Initialize with "all" tag
  filterByTag("all");
});
