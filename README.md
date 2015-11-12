# **Bindings**
Bindings.js is a simple javascript html binding library. its purpose is to provide a simple and easy "Modal View" for javascript.

## NOTE:
this library is in ealy stages of development, it **dose** contain bugs.
this library uses `Object.observe`, `Object.defineGetter` and `Object.defineSetter`.

use [object-observe](https://github.com/MaxArt2501/object-observe) polyfill for browsers that dont suport `Object.observe`

# Using
## Simble Bindings
_Javascript_

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

_HTML_

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

this will set the title of the page to the value in `myModal.title`, and if it change it will update the title of the page.

## Functions
_Javascript_

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

_HTML_

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

## ToDo

 - fix bug where if the user uses a "&" or a "|" in there expression it will only bind to the first value ie. "array1.length > 0 && array2.length > 0" it will only bind to array1
 - fix bug with arrays, if you call array.push it dose not add an element to the array because its using a copy of the array
 - improve expression.run, needs to run the expression on the original object and not a copy of it
 - add comment bindings
 - work on undefined bindings
 - test bug with inline bindings in bind-foreach bindings
 - fix examples/todo, todo.txt#3
 - dont allow expresions in two way bindings
 - create new type of binding, NodeBinding, it will effect the children nodes
 - add a flag to expresions, for testing weather they are complext or simple

## browser suport

| browsers | suport |
| -------- | ------ |
| chrome   | yes    |
| FireFox  | yes    |
| IE       | yes    |
| Opera    | yes    |