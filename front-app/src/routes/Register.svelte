<script>
    let name = "";
    let email = "";
    let password = "";
    let confirmPassword = "";

    const register = async () => {
        const res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) alert(data.error);
        else alert("Registered successfully");
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
