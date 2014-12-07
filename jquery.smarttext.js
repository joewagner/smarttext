
(function ($) {

    // Use underscore.js html escaper
    // http://underscorejs.org/#escape
    var _escape;
    (function () {
        var entityMap = {
            escape: {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;'
            }
        };

        var escapeKeys = [];
        for (var k in entityMap.escape) {
            if (entityMap.escape.hasOwnProperty(k)) {
                escapeKeys.push(k);
            }
        }
        escapeKeys = escapeKeys.join('');

        var entityRegexes = {
            escape: new RegExp('[' + escapeKeys + ']', 'g')
        };


        _escape = function (string) {
            if (string == null) { return ''; }
            return ('' + string).replace(entityRegexes['escape'], function (match) {
                return entityMap['escape'][match];
            });
        };

    })();

    var _defaultOptions = {
        linkAttributes: {
            title: 'Click outside of link to edit',
            contenteditable: 'false'
        },
        parseLinks: true,
        newlines: true,
        editable: true
    };

    var _options = null;
    
    var _methods = {

        destroy: function () {
            // remove listeners
            this.off('change keydown keypress input', _placeholderUpdate);
            this.off('blur', this.data('onBlurListener'));
            this.off('focus', this.data('onFocusListener'));

            this.find('a').off('mousedown', this.data('onMouseDownListener'));
        },

        value: function (val) {
            if (typeof val === 'string') {
                return _methods.setValue.call(this, val);
            }
            return _methods.getValue.call(this);
        },

        getValue: function () {
            var text, inner;
            var textEl = this.clone();
            var children = textEl.children('div');
            textEl.find('br').replaceWith('\n');
            if (children) {
                children.detach();
                text = textEl.text();
                children.each(function (indx, child) {
                    inner = $(child).text();
                    if (inner === '\n') {
                        text += inner;
                    } else {
                        text += ('\n' + inner);
                    }
                });
            } else {
                text = textEl.text();
            }
            return text;
        },

        setValue: function (val) {
            if (_options && _options.parseLinks) {
                this.html(_parseLinks(val));
            } else {
                this.html(val);
            }
            _placeholderUpdate.call(this);
            return this;
        }

    };

    var _parseLinks = function (text, options) {
        if (!text) { return ''; }
        options || (options = {});
        var linkMaps = [];
        var escaped = [];
        // use String.prototype.replace because its a crossbrowser way to iterate over links
        text.replace(_linkDetectionRegex, function () {
            var url = arguments[0];
            var index = arguments[arguments.length - 2];
            // Map the positions of link and non-link text
            linkMaps.push({
                linkTag: _makeLink(url, options.linkAttributes),
                linkStart: index,
                linkEnd: index + url.length
            });
            // don't actually change the text yet
            return url;
        });
        var lastI = 0;
        // Go though each link, and escape the text between it and the last link
        for (var i = 0; i < linkMaps.length; i++) {
            escaped.push(_escape(text.slice(lastI, linkMaps[i].linkStart)));
            escaped.push(linkMaps[i].linkTag);
            lastI = linkMaps[i].linkEnd;
        };
        // Escape everything after the last link
        if (lastI) {
            escaped.push(_escape(text.slice(lastI)));
        } else {
            // or if there where no links just escape the whole string
            escaped.push(_escape(text));
        }
        escaped = escaped.join('');
        if (options.newlines) { escaped = escaped.replace(/\n/g, '<br>'); }
        return escaped;
    };

    var _makeLink = function (url, attrs) {
        var linkStart = "<a href='" + (url.substr(0,4) == 'http' ? url : 'http://' + url) + "' ";
        var linkEnd = ">" + url + "</a>";
        var linkAttributes = '';
        for (var a in attrs) {
            if (attrs.hasOwnProperty(a) && a !== 'href' && a !== 'src') {
                linkAttributes += (a + "='" + attrs[a] + "' ");
            }
        }
        return linkStart + linkAttributes + linkEnd;
    };

    var _linkDetectionRegex = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(?=(\)|\(|\<|\>|\s|$))/gi;

    // emulate placeholder text in contenteditable HTML
    // this was inspired by https://github.com/sprucemedia/jQuery.divPlaceholder.js
    var _placeholderUpdate = function () {
        $(this).each(function () {
            if (this.textContent) {
                this.setAttribute('data-div-placeholder-content', 'true');
            }
            else {
                this.removeAttribute('data-div-placeholder-content');
            }
        });
    };

    var _smarttext = function ($el, options) {
        if (options.parseLinks) {
            $el.html(_parseLinks(_methods['value'].call($el), options));
        } else {
            $el.html(_methods['value'].call($el));
        }
        // This ensures (cross-browser) that if the user clicks the link before
        // the element gets focus we follow the hyperlink as usual 
        $el.find('a').one('mousedown', $el.data('onMouseDownListener'));
        return $el;
    };

    $.fn.smarttext = function () {
        var args = Array.prototype.slice.apply(arguments);
        var isMethod = typeof args[0] === 'string';
        if (isMethod) {
            return _methods[args[0]].apply(this, args.slice(1));
        }
        _options = $.extend(true, {}, _defaultOptions, args[0]);
        return this.each(function (indx, el) {

            var $el = $(el);
            $el.attr('contenteditable', _options.editable);

            var onFocusListener = function () {
                if ($el.data('follow-link')) { return; }
                $el.find('a').attr('contenteditable', _options.editable);
            };

            var onBlurListener = function () {
                _smarttext($el, _options);
                $el.find('a').attr('contenteditable', _options.linkAttributes.contenteditable);
                $el.data('follow-link', false);
            };

            var onMouseDownListener = function () {
                // we are relying on the mousedown event firing before focus
                if ($(this).attr('contenteditable') === 'false') {
                    $el.data('follow-link', true);
                }
            }

            $el.data('onFocusListener', onFocusListener);
            $el.data('onBlurListener', onBlurListener);
            $el.data('onMouseDownListener', onMouseDownListener);

            _smarttext($el, _options);
            _placeholderUpdate.call($el);

            $el.on('focus', onFocusListener).on('blur', onBlurListener);

            $el.on('change keydown keypress input', _placeholderUpdate);
        });
    };

})(jQuery);
