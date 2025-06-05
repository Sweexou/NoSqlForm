<script lang="ts">
  let email = "";
  let password = "";

  const login = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    // ✅ Save token + Redirect to /forms-home
    localStorage.setItem("token", data.token);
    window.location.href = "/forms-home";
  };
</script>

<form on:submit|preventDefault={login}>
  <h2>Login</h2>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input
    type="password"
    bind:value={password}
    placeholder="Password"
    required
  />
  <button type="submit">Login</button>
  <p style="text-align: center;">
    No account? <a href="/register">Register here</a>
  </p>
</form>

<style>
  h2 {
    text-align: center;
    margin-bottom: 1rem;
    color: #003366;
  }

  form {
    max-width: 400px;
    margin: 12rem auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  input {
    display: block;
    width: 94%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  p {
    text-align: center;
    margin-top: 1rem;
  }

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
