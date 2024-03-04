<svelte:head>
	<title>contact</title>
</svelte:head>

<h1>contact me here</h1>

<form action="mailto:annegv@mit.edu" method="post" enctype="text/plain" class="contact-form">
    <label for="email">enter your email: 
      <input type="email" name="email" required />
    </label>
    <label for="subject">enter your subject: 
        <input name="subject" required />
    </label>
    <label for="body">enter your message: 
        <textarea name="body"></textarea>
    </label>
    <button>submit</button>
</form>