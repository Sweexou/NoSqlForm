<script lang="ts">
  let name = '';
  let email = '';
  let password = '';
  let confirm = '';

  const register = async () => {
    if (password !== confirm) return alert('Passwords do not match');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);
    alert('Registered successfully');
  };
</script>

<h2>Register</h2>
<form on:submit|preventDefault={register}>
  <input type="text" bind:value={name} placeholder="Full Name" required />
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <input type="password" bind:value={confirm} placeholder="Confirm Password" required />
  <button type="submit">Register</button>
</form>

<p style="text-align: center;">
  Already registered? <a href="/login">Login here</a>
</p>
