<script lang="ts">
  import { onMount } from "svelte";
  let forms: { _id: string; title: string }[] = [];

  onMount(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const res = await fetch("/api/forms-home", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      alert("Unauthorized");
      window.location.href = "/login";
      return;
    }

    forms = await res.json();
  });

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
</script>

<svelte:head>
  <title>Forms Home</title>
</svelte:head>

<header>
  <div class="header-content">
    <h2>All Forms</h2>
    <button on:click={logout}><img src="/images/disconnect.png" alt="src"></button>
  </div>
</header>

<ul>
  {#each forms as form}
    <li>{form.title}</li>
  {/each}
</ul>

<a href="/create">
  <button>Create New Form</button>
</a>

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

  h2{
    font-size: 1.8rem;
    font-weight: 500;
    color: #3c2e5a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 2rem auto;
    max-width: 600px;
  }

  li {
    background: white;
    padding: 1rem;
    margin-bottom: 1rem;
    border-left: 5px solid #007bff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    font-size: 1rem;
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

  a button {
    display: block;
    margin: 2rem auto;
    background: #007bff;
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  a button:hover {
    background: #0056b3;
  }
</style>
