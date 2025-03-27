// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('#github-form');
  const searchInput = document.querySelector('#search');
  const userList = document.querySelector('#user-list');
  const repoList = document.querySelector('#repos-list');

  // Handle form submission
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    searchInput.value = '';
    userList.innerHTML = '<li>Loading users...</li>';
    repoList.innerHTML = '';
    fetch(`https://api.github.com/search/users?q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.items.length === 0) {
          userList.innerHTML = '<li>No users found.</li>';
        } else {
          renderUsers(data.items);
        }
      })
      .catch(() => {
        userList.innerHTML = '<li>Error loading users.</li>';
      });
  });

  // Render user cards
  function renderUsers(users) {
    userList.innerHTML = '';
    users.forEach(user => {
      const li = document.createElement('li');
      li.className = 'user-card';
      li.innerHTML = `
        <div class="user-info">
          <img src="${user.avatar_url}" class="avatar" alt="${user.login}" />
          <div>
            <a href="${user.html_url}" target="_blank" class="username">${user.login}</a>
          </div>
        </div>
      `;
      li.addEventListener('click', () => {
        repoList.innerHTML = '<li>Loading repositories...</li>';
        fetch(`https://api.github.com/users/${user.login}/repos`)
          .then(res => res.json())
          .then(data => {
            if (data.length === 0) {
              repoList.innerHTML = '<li>No repositories found.</li>';
            } else {
              renderRepos(data);
            }
          })
          .catch(() => {
            repoList.innerHTML = '<li>Error loading repositories.</li>';
          });
      });
      userList.appendChild(li);
    });
  }

  // Render repo list
  function renderRepos(repos) {
    repoList.innerHTML = '';
    repos.forEach(repo => {
      const li = document.createElement('li');
      li.className = 'repo-item';
      li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
      repoList.appendChild(li);
    });
  }
});
