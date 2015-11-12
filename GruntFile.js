module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		typescript: {
			options: {
      			module: 'commonJS',
		        removeComments: false,
		        target: "ES5"
			},
			dist: {
				src: "src/bindings.ts",
		        options: {
		        	out: "dist/bindings.js"
		        }
			},
			src: {
				src: "src/bindings.ts",
				dest: "build/"
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
		},
	    jsdoc: {
	        dist: {
	            src: ['build/**/*.js'],
	            options: {
	                destination: 'doc',
	                configure: 'conf.json'
	            }
	        }
	    }
	})

	grunt.loadNpmTasks('grunt-typescript-compile');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default',['typescript:dist','concat:dist','uglify:dist']);
	grunt.registerTask('build',['typescript:dist','concat:dist','uglify:dist']);
	grunt.registerTask('docs',['typescript:src','jsdoc:dist']);
}