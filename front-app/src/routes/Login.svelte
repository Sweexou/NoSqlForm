<script>
    let email = "";
    let password = "";

    const login = async () => {
        const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.error);
        } else {
            localStorage.setItem("token", data.token);
            alert("Login successful");
        }
    };
</script>

<form on:submit|preventDefault={login} id="login">
    <h2>Login</h2>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input
        type="password"
        bind:value={password}
        placeholder="Password"
        required
    />
    <button type="submit">Login</button>
    <p style="text-align: center; margin-top: 1rem;">
        Don't have an account?
        <a href="#register">Register here</a>
    </p>
</form>
