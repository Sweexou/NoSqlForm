<script>
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';
  let route = 'login'; // default route
</script>

<nav>
  <button on:click={() => route = 'login'}>Login</button>
  <button on:click={() => route = 'register'}>Register</button>
</nav>

{#if route === 'login'}
  <Login />
{:else if route === 'register'}
  <Register />
{/if}
