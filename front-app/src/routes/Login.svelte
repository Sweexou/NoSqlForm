<script>
  let email = '';
  let password = '';
  const login = () => {
    // handle login logic
    console.log({ email, password });
  };
</script>

<form on:submit|preventDefault={login}>
  <input type="email" bind:value={email} placeholder="Email" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button type="submit">Login</button>
</form>
