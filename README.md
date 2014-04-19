smarttext
=========

smarttext is a jQuery plugin that builds off of the HTML5 contenteditable attribute to create a smart editable element that makes it easy to sync your markup with your data.

Features:

  * parse urls out of the content and create active links the user can click, while escaping all content to protect against insertion attacks.

  * Specify placeholder text for the look and feel of a textarea, or input element

Example Usage:

Include the css file

    <link rel="stylesheet" href="jquery.smarttext.css">

HTML

add the 'data-placeholder' attribute to give the look and feel of a form element

    <div id="smartEl" data-placeholder="Click to edit me"></div>

Include the Javascript after jQuery is loaded, e.g.

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.smarttext.js"></script>

Once the page is ready

    $(function () {
    
        ...

        // initialize an element
        $('#smartEl').smarttext({ /* options */ });

        ...

        // later on get the value
        var val = $('#smartEl').smarttext('value');

    });

Default Options:

    linkAttributes: {
        // any attribute you would like added to the anchor tags that will be created for links
        title: 'Click outside of link to edit',
        contenteditable: 'false',
        'data-special': 'my special data attribute'
    },
    // whether you want smarttext to preserve the line breaks
    newlines: true,
    editable: true

Methods:

  * value: without additional arguments it gets current value, with arguments it sets the value
  * destroy: removes event listener from the element
