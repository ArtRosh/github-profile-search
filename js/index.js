// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
  
    // Get reference to HTML elements
    const searchForm = document.querySelector('#github-form');
    const searchInput = document.querySelector('#search');
    const githubContainer = document.querySelector('#github-container');
    const userList = document.querySelector('#user-list');
    const repoList = document.querySelector('#repos-list');
  
    // Handle form submission
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const searchQuery = searchInput.value.trim();
  
      if (!searchQuery) return;
  
      searchInput.value = '';
      userList.innerHTML = '<li>Loading users...</li>';
      repoList.innerHTML = '';
      fetchUsers(searchQuery);
    });
  
    // Fetch users from GitHub API
    function fetchUsers(searchQuery) {
      fetch(`https://api.github.com/search/users?q=${searchQuery}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => {
          if (data.items.length === 0) {
            userList.innerHTML = '<li>No users found.</li>';
          } else {
            renderUsers(data.items);
          }
        })
        .catch(error => {
          console.error('Error fetching users:', error);
          userList.innerHTML = '<li>Something went wrong. Please try again.</li>';
        });
    }
  
    // Render users to the DOM
    function renderUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
          <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        userList.appendChild(userItem);
  
        // On click, fetch user's repos
        userItem.addEventListener('click', () => {
          repoList.innerHTML = '<li>Loading repositories...</li>';
          fetchUserRepos(user.login);
        });
      });
    }
  
    // Fetch user repositories from GitHub API
    function fetchUserRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(repos => {
          if (repos.length === 0) {
            repoList.innerHTML = '<li>No repositories found.</li>';
          } else {
            renderRepos(repos);
          }
        })
        .catch(error => {
          console.error('Error fetching repositories:', error);
          repoList.innerHTML = '<li>Failed to load repositories. Try again later.</li>';
        });
    }
  
    // Render user repositories to the DOM
    function renderRepos(repos) {
      repoList.innerHTML = '';
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        `;
        repoList.appendChild(repoItem);
      });
    }
  });