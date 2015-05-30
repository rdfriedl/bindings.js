page = {
	testing: 'testing',
	t: function(){
		console.log('testing')
	},
	array: [
		1,
		'testing',
		function(){

		},
		{
			t: 't'
		}
	]
}

$(document).ready(function() {
	bindings.createModal(page,{
		element: document
	});
	bindings.applyBindings(page)
});