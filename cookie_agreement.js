/**
 * Created by Lubos Zima on 11/01/16.
 */


cookieAgreement = {
    strings: {
        message: "This website uses cookies to ensure you get the best experience on our website.",
        buttonLabel: "Got it",
        moreInfo: "More info"
    },
    settings: {
        style: "dark",
        styleClass: "",
        bannerPosition: "top",
        effectDisplay: "slideDown",
        effectHide: "slideUp",
        scriptdelay: 800,
        tagClass: "cookie-agreement",
        usedTag: "section",
        template: "{begin}{col1s}{icon}{content}{moreInfo}{col1e}{col2s}{button}{col2e}{end}",
        cookieName: "",
        wrappertag: "div",
        wrapperClass: "",
        icon: "",
        button: {
            target: "_blank",
            link: "#"
        },
        columns: {
            col1: "col-sm-9",
            col2: "col-sm-3",
            col3: "",
            col4: "",
            col5: "",
            col6: "",
            col7: "",
            col8: "",
            col9: "",
            col10: "",
            col11: "",
            col12: "",
        }
    },
    initialiseComplete: false,
    rendered: false,
    getmarkup: function () {
        var se = cookieAgreement.settings;
        var st = cookieAgreement.strings;

        var template = se.template;
        var btn = se.button;
        var col = se.columns;

        var button = '<span class="' + se.tagClass + '-conset' + '">' + st.buttonLabel + '</span>';
        var moreInfo = '<a href="' + btn.link + '" target="'+btn.target+'" class="' + se.tagClass + '-moreinfo' + '">' + st.moreInfo + '</a>';
        var content = '<span class="' + se.tagClass + '-message' + '">' + st.message + '</span>'

        // set begin & end tags & wrapper
        template = template.replace('{begin}', '<' + se.usedTag + ' id="' + se.tagClass + '">' +
            '<' + se.wrappertag + ' class="' + se.tagClass + '-wrapper ' + se.wrapperClass + '">');
        template = template.replace('{end}', '</' + se.wrappertag + '></' + se.usedTag + '>');

        // set icons
        template = template.replace('{icon}', cookieAgreement.settings.icon);

        // set columns
        $.each(col, function(i, val) {
            template = template.replace('{'+i+'s}', '<div class="'+val+'">');
            template = template.replace('{'+i+'e}', '</div>');
        });

        // set content & more info
        template = template.replace('{content}', content);
        template = template.replace('{moreInfo}', moreInfo);

        // set button
        template = template.replace('{button}', button);

        return template;
    },
    setcookie: function (name, value, expirydays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expirydays);
        document.cookie = name + '=' + value + '; expires=' + exdate.toUTCString() + '; path=/'
    },
    getcookie: function (name) {
        var i, x, y, cookies = document.cookie.split(";");

        for (i = 0; i < cookies.length; i++) {
            x = cookies[i].substr(0, cookies[i].indexOf("="));
            y = cookies[i].substr(cookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");

            if (x == name) {
                return unescape(y);
            }
        }
        return false;
    },
    deletecookie: function (name) {
        if ($.type(name) == 'undefined')
            name = cookieAgreement.settings.cookieName;

        log(name);

        date = new Date();
        date.setDate(date.getDate() - 1);
        document.cookie = escape(name) + '=; path=/; expires=' + date;
    },
    onload: function () {
        // get cookie

        if (!cookieAgreement.getcookie(cookieAgreement.settings.cookieName)) {
            // show cookie agreement
            if (!cookieAgreement.rendered) {
                var markup = cookieAgreement.getmarkup();

                // append cookie agreement to page markup
                switch (cookieAgreement.settings.bannerPosition) {
                    case "top":
                        $('header').before(markup);
                        break;
                    case "bottom":
                        $('footer').after(markup);
                        break;
                }
                $(document).ready(function(){
                    // hide cookie agreement
                    var ca = $('#' + cookieAgreement.settings.tagClass);
                    ca.css('display', 'none');

                    // show cookie agreement with effect
                    switch (cookieAgreement.settings.effectDisplay) {
                        case "slideDown":
                            ca.slideDown("slow");
                            break;
                        case "fadeIn":
                            ca.fadeIn("slow");
                            break;
                        case "show":
                            ca.show();
                            break;
                    }

                    cookieAgreement.rendered = true;
                    cookieAgreement.onconset();
                });
            }
        }
    },
    onconset: function () {
        if (!cookieAgreement.getcookie(cookieAgreement.settings.cookieName)) {
            // show cookie agreement
            if (cookieAgreement.rendered) {
                var buttonClass = cookieAgreement.settings.tagClass + '-conset';

                $('.' + buttonClass).click(function () {
                    // hide cookie agreement
                    var ca = $('#' + cookieAgreement.settings.tagClass);

                    // hide cookie agreement with effect
                    switch (cookieAgreement.settings.effectHide) {
                        case "slideUp":
                            ca.slideUp("slow");
                            break;
                        case "fadeOut":
                            ca.fadeOut("slow");
                            break;
                        case "hide":
                            ca.hide();
                            break;
                    }

                    // cookie set
                    cookieAgreement.setcookie(cookieAgreement.settings.cookieName, true, 365);
                });
            }
        }
    },
    initialise: function (obj) {
        if ($.type(obj) == 'undefined')
            obj = {};

        // set new settings
        if (obj.settings !== 'undefined') {
            for (var attrname in obj.settings) {
                this.settings[attrname] = obj.settings[attrname];
            }
        }
        // set new strings
        if (obj.strings !== 'undefined') {
            for (var attrname in obj.strings) {
                this.strings[attrname] = obj.strings[attrname];
            }
        }

        // set class for html elements
        cookieAgreement.settings.styleClass = cookieAgreement.settings.tagClass + cookieAgreement.settings.style;
        cookieAgreement.settings.cookieName = 'ca_' + $(location).attr('host');

        setTimeout(function () {
            // run plugin
            if (window.jQuery) {
                cookieAgreement.settings.initialiseComplete = true;
                cookieAgreement.onload();
            }
        }, cookieAgreement.settings.scriptdelay);
    }
};