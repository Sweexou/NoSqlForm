<script>
  let email = '';
  let password = '';
  const register = () => {
    // handle register logic
    console.log({ email, password });
  };
</script>

<form on:submit|preventDefault={register}>
  <input type="email" bind:value={email} placeholder="Email" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button type="submit">Register</button>
</form>
