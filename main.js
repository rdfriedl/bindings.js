page = {
	testing: 'testing',
	t: function(){
		console.log('testing')
	}
}

$(document).ready(function() {
	bindings.createModal(page,{
		element: document
	});
	bindings.applyBindings(page)
});