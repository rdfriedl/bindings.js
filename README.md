##**Bindings**
Bindings.js is a simple javascript html binding library.
its purpose is to provie simple "Modal View" capabilities to javascript.

###NOTE:
this library is in ealy stages of development, it **dose** contain bugs.
this library uses <code>Object.observe</code>, Getters and Setters;

### Using

#####Simble Bindings

*Javascript*

```js
	//custome javascript object
	myModal = {
		title: 'title'
	};

	//create a modal
	bindings.createModal(myModal);
	//bind to dom element
	bindings.applyBindings(myModal,document);
```

*HTML*

```html
	<html>
		<head>
			<title bind=text="this.title"></title>
		</head>
		<body>
			<script type="text/javascript" src="url/to/bindings.min.js"></script>
			<!-- optional pollyfill for firefox and IE -->
			<script type="text/javascript" src="url/to/object.observe.min.js"></script>
			<!-- your javascript after this -->
		</body>
	</html>
```

this will set the title of the page to the value in <code>myModal.title</code>, and if it change it will update the title of the page.

#####Functions

*Javascript*

```js
	//custome javascript object
	myModal = {
		action: function(){
			alert('Hello World');
		}
	};

	//create a modal
	bindings.createModal(myModal);
	//bind to dom element
	bindings.applyBindings(myModal,document);
```

*HTML*

```html
	<html>
		<head>
			<title>Hello World</title>
		</head>
		<body>
			<button bind-click="this.action()">Hello World</button>

			<script type="text/javascript" src="url/to/bindings.min.js"></script>
			<!-- optional pollyfill for firefox and IE -->
			<script type="text/javascript" src="url/to/object.observe.min.js"></script>
			<!-- your javascript after this -->
		</body>
	</html>
```