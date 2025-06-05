<script lang="ts">
  let email = '';
  let password = '';

  const login = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);
    localStorage.setItem('token', data.token);
    alert('Login successful');
  };
</script>

<h2>Login</h2>
<form on:submit|preventDefault={login}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Login</button>
</form>

<p style="text-align: center;">
  No account? <a href="/register">Register here</a>
  <a href="/form-builder">Form Builder</a>
</p>

