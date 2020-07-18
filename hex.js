// Hex JavaScript decoder
// Copyright (c) 2008-2020 Lapo Luchini <lapo@lapo.it>

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
// 
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

(function () {
"use strict";

var Hex = {},
    decoder, // populated on first usage
    haveU8 = ('Uint8Array' in (typeof window == 'object' ? window : global));

Hex.decode = function(a) {
    var isString = (typeof a == 'string');
    var i;
    if (decoder === undefined) {
        var hex = "0123456789ABCDEF",
            ignore = " \f\n\r\t\u00A0\u2028\u2029";
        decoder = [];
        for (i = 0; i < 16; ++i)
            decoder[hex.charCodeAt(i)] = i;
        hex = hex.toLowerCase();
        for (i = 10; i < 16; ++i)
            decoder[hex.charCodeAt(i)] = i;
        for (i = 0; i < ignore.length; ++i)
            decoder[ignore.charCodeAt(i)] = -1;
    }
    var out = haveU8 ? new Uint8Array(a.length >> 1) : [],
        bits = 0,
        char_count = 0,
        len = 0;
    for (i = 0; i < a.length; ++i) {
        var c = isString ? a.charCodeAt(i) : a[i];
        c = decoder[c];
        if (c == -1)
            continue;
        if (c === undefined)
            throw 'Illegal character at offset ' + i;
        bits |= c;
        if (++char_count >= 2) {
            out[len++] = bits;
            bits = 0;
            char_count = 0;
        } else {
            bits <<= 4;
        }
    }
    if (char_count)
        throw "Hex encoding incomplete: 4 bits missing";
    if (haveU8 && out.length > len) // in case it was originally longer because of ignored characters
        out = out.subarray(0, len);
    return out;
};

// export globals
if (typeof module !== 'undefined') { module.exports = Hex; } else { window.Hex = Hex; }
})();
