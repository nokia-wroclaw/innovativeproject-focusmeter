module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: 'nyan'
				},
				src: ['tests/*.js']
			}
		}
	});

	grunt.registerTask('default', 'mochaTest');
};