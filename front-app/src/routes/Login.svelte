<script>
    let email = "";
    let password = "";

    const login = () => {
        console.log({ email, password });
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
