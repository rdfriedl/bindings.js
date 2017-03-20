<code>bind-click="function"</code>

you can pass it either a function or a piece of code

```html
<button bind-click="profile.logout">logout</button>
```

or

```html
<button bind-click="alert('click')">a button</button>
```

or

```html
<button bind-click="messager.sendMessage('hello world')">Send</button>
```