smarttext
=========

smarttext is a jQuery plugin that builds off of the HTML5 contenteditable attribute to create an editable element that may have placeholder text, parses URLs out of content and correctly escapes them, allows getting and setting the content while maintaining whitespace.

Installation
============

make sure jQuery is on the page first, e.g. `<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>`

download [jquery.smarttext.js](https://raw.githubusercontent.com/JoeWagner/smarttext/master/jquery.smarttext.js).  Add it to your page with a script tag, e.g. `<script type="text/javascript" src="/path/to/jquey.smarttext.js"></script>`

download [jquery.smarttext.css](https://raw.githubusercontent.com/JoeWagner/smarttext/master/jquery.smarttext.css).  Add it to your page with a link tag, e.g. `<link rel="stylesheet" href="/path/to/jquery.smarttext.css">`

Options
=======

  * `linkAttributes` - any attribute you would like added to the anchor tags that will be created for links that are detected
  * `newlines` - whether you want smarttext to allow multiple lines.  Setting this to `false` is a good way to create something that acts like an input element.
  * `editable` - whether the element should be editable.  Setting this to false is useful if you just want to use the link detection and injection escaping features.

####Default values
    linkAttributes: {
        title: 'Click outside of link to edit',
        contenteditable: 'false',
        'data-special': 'my special data attribute'
    },
    // whether you want smarttext to preserve the line breaks
    newlines: true,
    editable: true

Methods
=======

  * `value`: without additional arguments it gets current value, with arguments it sets the value
  * `destroy`: removes event listeners attached by smarttext

Features
========

  * parse urls out of the content and create active links the user can click, while escaping all content to protect against insertion attacks.

  * Allows you to get and set the value of the element as plain text with whitespace preserved so that things look the same across modern browsers

  * Specify placeholder text for the look and feel of a textarea, or input element

  * Unifies behaviour of `contenteditable` attribute across browsers

Example Usage
=============

After including everything described in the Installation portion of this document...

You need to add some HTML to the page.  You can add the 'data-placeholder' attribute to give the look and feel of a form element

    <div id="smartEl" data-placeholder="Click to edit me"></div>

Once the page is ready, you can add some javascript that initializes then gets and/or sets the value of the element

    $(function () {
    
        ...

        // initialize an element
        $('#smartEl').smarttext({ /* options */ });

        ...

        // later on get the value a user may have entered
        var val = $('#smartEl').smarttext('value');

        // you can also set the value after init
        var val = $('#smartEl').smarttext('value', 'Hi world!\nI like smarttext.\nHere is a link https://github.com/joewagner/smarttext');

    });
