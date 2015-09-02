/* global require, module, console, exports, saveAs */
(function() {
    'use strict';
    
    var log = (typeof(console) !== 'undefined' && console.debug) ? console.debug : function() {};
    var slugify = require('./js/slugify.js');
    
    var templateManagers = {
        'idpf-wasteland': require("../src/js/template-builders/idpf-wasteland-builder.js").builder
    };
    
    var EpubMaker = function() {
        var self = this;
        var epubConfig = {};
        
        this.newMaker = function() {
            return new EpubMaker();
        };
        
        this.withTitle = function(title) {
            epubConfig.title = title;
            epubConfig.slug = slugify(title);
            return self;
        };
        
        this.withTemplate = function(templateName) {
            epubConfig.templateName = templateName;
            return self;
        };
        
        this.makeEpub = function() {
            templateManagers[epubConfig.templateName].make(epubConfig).then(function(epubZip) {
    			log.call(console, 'generating epub for: ' + epubConfig.title);
    			var content = epubZip.generate({ type: "blob", mimeType: "application/epub+zip", compression: "DEFLATE" });
    			var filename = epubConfig.slug + '.epub';
    			log.call(console, 'saving "' + filename + '"...');
    			saveAs(content, filename);
            });
        };
    };

    // manage dependency exports
    if (typeof module !== 'undefined') {
        module.exports.EpubMaker = EpubMaker;
    }
    else if (typeof exports !== 'undefined') {
        exports.EpubMaker = EpubMaker;
    }
    else if (typeof window === 'undefined') {
        throw new Error('unable to expose EpubMaker: no module, exports object and no global window detected');
    }

    if (typeof window !== 'undefined') {
        window.epubMaker = new EpubMaker();
    }
}());