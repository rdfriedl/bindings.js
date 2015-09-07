module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		typescript: {
			options: {
      			module: 'commonJS',
		        removeComments: false,
		        target: "ES5",
		        out: "dist/bindings.js"
			},
			dist: {
				src: "src/bindings.ts"
			}
		},
		uglify: {
			options: {
			    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
		  	dist: {
			    files: {
			      	'dist/bindings.min.js': ['dist/bindings.js'],
			      	'dist/bindings-bundle.min.js': ['dist/bindings-bundle.js']
			    }
		  	}
		},
		concat: {
			dist: {
				src: ['node_modules/object.observe/dist/object-observe.js','dist/bindings.js'],
				dest: 'dist/bindings-bundle.js'
			}
		}
	})

	grunt.loadNpmTasks('grunt-typescript-compile');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default',['typescript:dist','concat:dist','uglify:dist']);
	grunt.registerTask('tsBuild',['typescript:dist']);
}