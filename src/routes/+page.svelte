<script>
	import { auth } from '$lib/firebase/firebase.js';
	import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
  
	export let email = "";
	export let password = "";
	export let errorMessage = ""; 
	let showPassword = false; // Track whether to show the password
  
	// Check for and load session data when the component mounts
	onMount(() => {
		const userData = localStorage.getItem('user');

		if (userData) {
			const user = JSON.parse(userData);
			auth.currentUser = user;
			goto('/assignment');
		}
		// No user data found, do nothing (login page will be shown)
	});
	async function handleSubmit() {
	  try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
  
		// Store user information in localStorage for persistent session
		localStorage.setItem('user', JSON.stringify(user));
  
		errorMessage = "";
  
		// Navigate to the /Homepage route after successful login
		goto('/assignment');
	  } catch (error) {
		// Display error message if login fails
		errorMessage = "Invalid username or password.";
		console.error("Error logging in:", error.message);
	  }
	}
  
	const togglePasswordVisibility = () => {
	  // Toggle the password visibility
	  showPassword = !showPassword;
      
	}

	async function handleSignInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Store user information in localStorage for persistent session
      localStorage.setItem('user', JSON.stringify(user));

      errorMessage = "";

      // Navigate to the /assignment route after successful login
      goto('/assignment');
    } catch (error) {
      // Display error message if login fails
      errorMessage = "Failed to sign in with Google.";
      console.error("Error signing in with Google:", error.message);
    }
  }
   
 

  </script>
 
 
  <form on:submit={handleSubmit} class="container">
	<div class="imgcontainer">
	  <img src="https://recruitlycdn.com/assets/v3/login400x.png" alt="Avatar" class="avatar">
	</div>
	<div class="google-signin-img-container" on:click={handleSignInWithGoogle}>
		<img src="https://onymos.com/wp-content/uploads/2020/10/google-signin-button.png" alt="Sign in with Google" class="google-signin-img"  >
	  </div>
	<div class="mb-6">
	  <Label for="email" class="block mb-2">Email:</Label>
	  <Input type="email" bind:value={email} required id="email" class="form-input" placeholder="Enter Email"  />
	</div>
  
	<div class="mb-6">
	  <div class="password-container">
		<Label for="password" class="block mb-2">Password:</Label>
		<Input
		  type={showPassword ? "text" : "password"} 
		  bind:value={password}
		  required
		  id="password"
		  placeholder="Enter Password"
		  class="form-input"
		/>
		<label class="password-toggle">
		  <input
			type="checkbox"
			checked={showPassword}
			on:change={togglePasswordVisibility}
		  />
		  Show Password
		</label>
	  </div>
	</div>
  
	{#if errorMessage}
	<p style="color: red;">{errorMessage}</p>
	{/if}
  
	<div class="mb-6">
	  <button type="button" on:click={handleSubmit} >Login</button>
	</div>
  
	<div class="mb-6">
	  <p>Please click on Register to create a new account.</p>
	  <a href="/register" style="color: blue; font-weight: bold; font-size: 18px; ">New User? Register</a>
	</div>

  </form>

  <style>

  
	.mb-6 {
	  border-radius: 1.25rem; 
	}
  
	.imgcontainer {
	  text-align: center;
	  margin: 24px 0 12px 0;
	  margin-left: 130px;
      margin-top: 0px;
	  padding: 10px;
	}
  
	img.avatar {
	  width: 40%;
	  border-radius: 50%;
	}
  
	.container {
	  padding: 16px;
	  width: 500px;
	  background-color:rgb(225, 224, 228);
	  margin-left: 500px;
	  margin-top: 30px;
	  height: 650px;
	
	}
	
  
	button {
	  background-color: #04AA6D;
	  color: white;
	  padding: 14px 20px;
	  margin: 8px 0;
	  border: none;
	  cursor: pointer;
	  width: 100%;
	}
  
	button:hover {
	  opacity: 0.8;
	}
	  
	  .google-signin-img-container {
    text-align: center;
	
  }

  /* Style the Google image */
  .google-signin-img {
    cursor: pointer;
	height:45px;
	width: 200px;
	margin-left: 100px;
	margin-top: -10px;
  }
  </style>