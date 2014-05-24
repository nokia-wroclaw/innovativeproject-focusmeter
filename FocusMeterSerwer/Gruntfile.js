module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['tests/*.js']
			}
		} // beautifier
	});

	grunt.registerTask('default', 'mochaTest');
};