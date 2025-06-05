<script>
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';

  let route = window.location.hash.slice(1) || 'login';

  const handleHashChange = () => {
    route = window.location.hash.slice(1) || 'login';
  };

  window.addEventListener('hashchange', handleHashChange);
</script>

{#if route === 'login'}
  <Login />
{:else if route === 'register'}
  <Register />
{/if}
