var configData = {
    root:  process.env.SITE_URL || 'http://localhost:3000'
};

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var inPlace = require('metalsmith-in-place');
var collections = require('metalsmith-collections');
var projectImages = require('metalsmith-project-images');
var metadata = require('metalsmith-metadata');
var excerpts = require('metalsmith-better-excerpts');
var writemetadata = require('metalsmith-writemetadata')
var permalinks = require('metalsmith-permalinks');
var tags = require('metalsmith-tags');
var drafts = require('metalsmith-drafts');
var pagination = require('metalsmith-pagination');
var htmlMinifier = require("metalsmith-html-minifier");
var metadata = require('metalsmith-metadata');
var sass = require('metalsmith-sass');
var concat = require('metalsmith-concat');
var browserSync = require('metalsmith-browser-sync');
var assets = require('metalsmith-assets');
var changed = require('metalsmith-changed');
var drafts = require('metalsmith-drafts');
var pagination = require('metalsmith-pagination');
var copyAssets = require('metalsmith-copy-assets-540');
var slug = require('metalsmith-slug');
var swig = require('swig');
var rename = require('metalsmith-rename');
var wordcloud = require('metalsmith-wordcloud');
var uglify  = require('metalsmith-uglify'); 
var images = require("metalsmith-scan-images");





var extras = require('swig-extras');
extras.useFilter(swig, 'split');
extras.useFilter(swig, 'markdown');
extras.useFilter(swig, 'truncate');

swig.setDefaults({
    cache: false
});


Metalsmith(__dirname)
.metadata(configData)
 .use(metadata({
    categories: '_data/categories.yaml',
    site: '_data/site.yaml',
}))     
.use(drafts())
.clean(false)
.use(changed()) 
.use(slug( {
    patterns: ['*.md'],
    property: 'title',
    renameFiles: false,
    lower: true
})) 
.use(images( 'gallery/index.md' ))   
.use(collections({       
    blog: {
        pattern: 'blog/*/*.md',
        sortBy: 'date',
        reverse: true,
        refer: true        
    },
    pages: {
        pattern: '*.md'
    }
}))   
.use(projectImages({
    pattern: 'blog/*/*.md',
    imagesDirectory: '',
}))
.use(markdown())   
.use(inPlace({
    engine: 'swig',
    pattern: '**/*.md',      
    directory: "templates"
}))
.use(excerpts({
    pruneLength: 160
}))
.use(tags({
    handle: 'tags',
    layout:'tags.html',
    path: 'tags/:tag/index.html',
    pathPage: 'tags/:tag/:num/index.html',
    perPage: 1000,
    sortBy: 'data',
    reverse: true
}))
.use(wordcloud({
    category: 'tags', //optional, default is tags 
    reverse: false, //optional sort value on category, default is false 
    path: '/tags' // <- Notice that path is prefixed with slash for absolute path  
}))
.use(layouts({
    engine: 'swig',
    directory: "templates"
}))
.use(writemetadata({
    bufferencoding: 'utf8',
    collections: {
        blog: {
            output: {
                asObject: true,
                path: 'blog/index.json',
                metadata: {
                    "type": "list"
                }
            },
            ignorekeys: ['history', 'stats', 'collection', 'mode'],
        }
    }
}))    
.use(sass({
    outputDir: '_assets/css/', // This changes the output dir to "build/css/" instead of "build/scss/"
    sourceMap: true,
    sourceMapContents: true
}))
.use(concat({
    files: [
        'jquery/dist/jquery.js',
        'imagesloaded/imagesloaded.pkgd.js',
         'what-input/what-input.js',
        'foundation-sites/js/foundation.core.js',
        'foundation-sites/js/foundation.util.*.js',       
        //'foundation-sites/js/foundation.abide.js',
        //'foundation-sites/js/foundation.accordion.js',
        //'foundation-sites/js/foundation.accordionMenu.js',
        //'foundation-sites/js/foundation.drilldown.js',
          'foundation-sites/js/foundation.dropdown.js',
          'foundation-sites/js/foundation.dropdownMenu.js',
        //'foundation-sites/js/foundation.equalizer.js',
        //'foundation-sites/js/foundation.interchange.js',
        //'foundation-sites/js/foundation.magellan.js',
        //'foundation-sites/js/foundation.offcanvas.js',
        //'foundation-sites/js/foundation.orbit.js',
           'foundation-sites/js/foundation.responsiveMenu.js',
           'foundation-sites/js/foundation.responsiveToggle.js',
        //'foundation-sites/js/foundation.reveal.js',
        //'foundation-sites/js/foundation.slider.js',
        //'foundation-sites/js/foundation.sticky.js',
        //'foundation-sites/js/foundation.tabs.js',
        //'foundation-sites/js/foundation.toggler.js',
        //'foundation-sites/js/foundation.tooltip.js',
        '_assets/js/**/*.js',
        '_assets/js/app.js'
    ],
    output: '_assets/js/scripts.js',
    searchPaths: [ 'src/js','bower_components' ]
}))    
.use(uglify({
    removeOriginal: true,
    preserveComments: true
}))
 .use(copyAssets(
      {
        src: 'bower_components/fontawesome/fonts',
        dest: '_assets/fonts'
      }
   ))    
.use(browserSync({
    server: "build",
    files: ["src/**/*", "templates/**/*.html"]
}))    
.destination('build/')
.build(function(err, files) {
    if (err) { console.log(err); }
});

function build() {
    Metalsmith().build()
}