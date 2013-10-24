
$(document).ready(function () {

    var asyncSeries = function (series, done) {
        var i = 0;
        var next = function () {
            var j = Number(i);
            i += 1;
            if (series[j]) {
                series[j].call(this, next);
            } else {
                done && done();
            }
        }
        next();
    };

    module('smarttext', {
        setup: function () {
            var $fixture = $('#qunit-fixture');
            strictEqual($fixture.html(), '', 'fixture was cleared before test');
            $fixture.append('<div id="ct">');
        }
    });

    test('Init test', function () {
        $('#qunit-fixture').append('<div id="ct">');
        var ct = $('#ct');
        ct.smarttext();
        ok(ct.attr('contenteditable') === 'true', 'contenteditable is present');
        
        var p = ct.append('<p>');
        ok(p.attr('contenteditable') !== 'false', 'children are editable by default')
    });

    test('value method gets sanitized string', function () {
        var sanitized = 'First line of text.\n'
                        + 'Second line\n'
                        + '\n'
                        + 'Fourth line with link, https://google.com';
        var ct = $('#ct');
        ct.smarttext();

        ct.html('First line of text.'
                + '<div>Second line</div>'
                + '<div><br></div>'
                + '<div>Fourth line with link, <a href="https://google.com">https://google.com</a>');
        strictEqual(ct.smarttext('value'), sanitized, 'div based line breaks are handled (Chrome)');

        ct.html('First line of text.<br>'
                        + 'Second line<br>'
                        + '<br>'
                        + 'Fourth line with link, <a href="https://google.com">https://google.com</a>');
        strictEqual(ct.smarttext('value'), sanitized, 'break tag based line breaks are handled');
    });

    test('value method allows setting of text', function () {
        var ct = $('#ct');
        ct.smarttext();

        ct.smarttext('value', 'Its text that may be edited!');
        strictEqual(ct.smarttext('value'), 'Its text that may be edited!', 'value may be set in the smarttext element');

        ct.smarttext('value', '');
        strictEqual(ct.smarttext('value'), '', 'value may be set to empty string in the smarttext element');
    });

    test('value method does not set arbitrary html content', function () {
        var ct = $('#ct');
        ct.smarttext();

        ct.smarttext('value', '<script>alert("xss")</script><p>paragraph element</p>');
        strictEqual(ct.find('p').get(0), void 0, 'paragraph element was not injected');
        strictEqual(ct.find('script').get(0), void 0, 'script element was not injected');
        strictEqual(ct.text().indexOf('<'), 0, 'html is escaped');
    });

    test('hyperlinks in text are converted to live links on init', function () {
        var ct = $('#ct');
        ct.html('Hello SmartText, here is a link https://github.com/JoeWagner/smarttext');
        ct.smarttext();
        var link = ct.find('a');

        strictEqual(link.attr('href'), 'https://github.com/JoeWagner/smarttext', 'link with correct href was created');
        strictEqual(link.attr('contenteditable'), 'false', 'created link can be followed');
    });

    test('hyperlinks should be converted to contenteditable when smarttext get focus', function () {
        var ct = $('#ct');
        ct.html('Hello SmartText, here is a link https://github.com/JoeWagner/smarttext');
        ct.smarttext();

        ct.focus();
        var link = ct.find('a');
        strictEqual(link.attr('contenteditable'), 'true', 'link may be edited');
        ct.blur();
        link = ct.find('a');
        strictEqual(link.attr('contenteditable'), 'false', 'link may be used after editing');
    });

    test('placeholder text should be specifyable with the data-placeholder attribute', function () {
        var ct = $('#ct');
        ct.attr('data-placeholder', 'placeholder text');
        ct.smarttext();
        var placeholderValue = window.getComputedStyle(ct.get(0), ':before').getPropertyValue('content');
        strictEqual(placeholderValue, "'placeholder text'", 'placeholder text is visible by default');
        ct.html('Hey SmartText').trigger('input');
        placeholderValue = window.getComputedStyle(ct.get(0), ':before').getPropertyValue('content');
        strictEqual(placeholderValue, "", 'placeholder text is hidden once text is entered');
    });

    test('options should allow specifying link attributes', function () {
        var ct = $('#ct');
        ct.smarttext({linkAttributes: {
            class: 'link smarttext',
            title: 'Special title'
        }});
        ct.html('smart text link https://github.com/JoeWagner/smarttext').trigger('blur');
        var link = ct.find('a');
        ok(link.hasClass('link'));
        ok(link.hasClass('smarttext'));
    });

});
