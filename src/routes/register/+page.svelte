<script lang="ts">
  let name = "";
  let email = "";
  let password = "";
  let confirm = "";

  const register = async () => {
    if (password !== confirm) return alert("Passwords do not match");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    // ✅ Auto-redirect to form-home (already logged in via cookie)
    window.location.href = "/forms-home";
  };
</script>

<form on:submit|preventDefault={register}>
  <h2>Register</h2>
  <input
    type="text"
    bind:value={name}
    placeholder="Full Name"
    required
    minlength="3"
  />
  <input type="email" bind:value={email} placeholder="Email" required />
  <input
    type="password"
    bind:value={password}
    placeholder="Password"
    required
  />
  <input
    type="password"
    bind:value={confirm}
    placeholder="Confirm Password"
    required
  />
  <button type="submit">Register</button>
  <p style="text-align: center;">
    Already registered? <a href="/login">Login here</a>
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
