<code>bind-event-(event name)="function"</code>

you can pass it a function or a piece of code

_HTML_
```html
<form bind-event-submit="app.login(email,password)">
	<input name="email" type="email" bind-value="email">
	<input name="password" type="password" bind-value="password">
	<button type="submit">Login</button>
</form>
```