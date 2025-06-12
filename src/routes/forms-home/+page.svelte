<script lang="ts">
  export let data;
  const user = data.user;
  const forms: { id: string; title: string }[] = data.forms;
</script>

<svelte:head>
  <title>Forms Home</title>
</svelte:head>

<header>
  <div class="header-content">
    <h2>Welcome, {user.name}</h2>
    <form method="POST" action="/api/logout">
      <button type="submit">
        <img src="images/disconnect.png" alt="Logout" />
      </button>
    </form>
  </div>
</header>

<main>
  <div class="create-button">
    <a href="/form-builder">
      <button>Create New Form</button>
    </a>
  </div>
  
  <div class="form-list">
    <h3>Your Forms</h3>
    {#if forms.length > 0}
      <ul>
        {#each forms as form}
          <li class="form-item">
            <div class="form-info">
              <h4>{form.title}</h4>
            </div>
            <div class="form-actions">
              <a href="/form-builder/{form.id}" class="edit-btn">
                <button>Edit</button>
              </a>
              <a href="/forms/{form.id}/responses" class="responses-btn">
                <button>View Responses</button>
              </a>
              <a href="/form/{form.id}" class="share-btn" target="_blank">
                <button>Preview</button>
              </a>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p>No forms yet.</p>
    {/if}
  </div>
</main>

<style>
  header {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 2px 8px #b7b7c933;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }

  .form-list {
    margin-top: 1rem;
    width: 100%;
    max-width: 800px;
  }

  .create-button {
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.8rem;
    color: #3c2e5a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 2rem auto;
    max-width: 800px;
  }

  .form-item {
    background: white;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-left: 5px solid #007bff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-info h4 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
  }

  .form-actions button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .edit-btn button {
    background: #28a745;
    color: white;
  }

  .edit-btn button:hover {
    background: #218838;
  }

  .responses-btn button {
    background: #17a2b8;
    color: white;
  }

  .responses-btn button:hover {
    background: #138496;
  }

  .share-btn button {
    background: #ffc107;
    color: #212529;
  }

  .share-btn button:hover {
    background: #e0a800;
  }

  header button {
    border: 0;
    background: transparent;
    border-radius: 6px;
    padding: 4px 2px 0px 4px;
  }

  header button img {
    width: 35px;
    height: 35px;
  }

  header button:hover {
    background: #72727269;
  }

  .create-button a button {
    display: block;
    background: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .create-button a button:hover {
    background: #0056b3;
  }
</style>
