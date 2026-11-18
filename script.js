const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");
const listStatus = document.querySelector("#list-status");

function formatDate(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${dateString}T00:00:00Z`));
}

function createRepositoryItem(repository) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const description = document.createElement("p");
  const meta = document.createElement("div");
  const language = document.createElement("span");
  const date = document.createElement("time");

  item.className = "repository-item";
  link.className = "repository-link";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.setAttribute("aria-label", `${repository.repository} (opens in a new tab)`);
  link.textContent = repository.repository;

  description.className = "repository-description";
  description.textContent = repository.description;

  meta.className = "repository-meta";
  language.className = "repository-language";
  language.textContent = repository.language;

  date.className = "repository-date";
  date.dateTime = repository.starredAt;
  date.textContent = `Starred ${formatDate(repository.starredAt)}`;

  meta.append(language);
  item.append(link, description, meta, date);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    repositoryList.replaceChildren(...repositories.map(createRepositoryItem));
    repositoryCount.textContent = repositories.length;
    const repositoryLabel = repositories.length === 1 ? "repository" : "repositories";
    listStatus.textContent = repositories.length
      ? `${repositories.length} ${repositoryLabel} loaded.`
      : "No starred repositories yet.";
  } catch (error) {
    listStatus.textContent = "Repositories could not be loaded. Please try again later.";
    console.error("Unable to load starred repositories:", error);
  }
}

loadRepositories();