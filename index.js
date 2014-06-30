/*!
 * assemble-middleware-add <https://github.com/assemble/assemble-middleware-add>
 *
 * Copyright (c) 2014 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var through = require('through2');


/**
 * ## .add
 *
 * Add files to the current Assemble stream.
 *
 * **Example**
 *
 * ```js
 *
 *  var assemble = require('assemble');
 *  var add = require('assemble-middleware-add')(assemble);
 *
 *  assemble.src('path/to/pages/*.hbs')
 *    .pipe(assemble.dest('path/to/dest/pages/')
 *    .pipe(add('path/to/posts/*.md'))
 *    .pipe(assemble.dest('path/to/dest/blog/');
 *
 * ```
 *
 * @param assemble
 * @returns {addSrc}
 */

module.exports = function add (assemble) {

  var addSrc = function addSrc (glob, options) {

    // forget the initial files
    return through.obj(function (file, enc, callback) {
        callback();
      },

      // when all the current files are done,
      // read in the new files and pass those
      // into the current stream (self.push)
      function (callback) {
        var self = this;

        // use the normal `assemble.src` to ensure
        // everything is loaded/read the same way
        assemble.src(glob, options)

          // push the new files into the parent stream
          .pipe(through.obj(function (file, enc, cb) {
              self.push(file);
              cb();
            },

            // let the parent know when this is complete
            function (cb) {
              callback();
              cb();
            }));
      });
  };

  return addSrc;

};