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
<div>
	<p>{title}</p>
</div>
```