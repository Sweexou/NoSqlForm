<script>
    let name = "";
    let email = "";
    let password = "";
    let confirmPassword = "";

    const register = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log({ name, email, password });
    };
</script>

<form on:submit|preventDefault={register}>
    <h2>Register</h2>
    <input type="text" bind:value={name} placeholder="Full Name" required />
    <input type="email" bind:value={email} placeholder="Email" required />
    <input
        type="password"
        bind:value={password}
        placeholder="Password"
        required
    />
    <input
        type="password"
        bind:value={confirmPassword}
        placeholder="Confirm Password"
        required
    />
    <button type="submit">Register</button>
    <p style="text-align: center; margin-top: 1rem;">
        Already have an account?
        <a href="#login">Login here</a>
    </p>
</form>
