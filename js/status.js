(function() {
    var ua = navigator.userAgent;
    var uaLower = ua.toLowerCase();

    var isNotSupportedPage = window.location.pathname.indexOf('not-supported') !== -1 || 
                             document.title.toLowerCase().indexOf('not supported') !== -1;

    if (isNotSupportedPage) {
        var isTV = /SmartTV|Tizen|Web0S|BRAVIA|NetCast|GoogleTV|AppleTV|HbbTV/i.test(ua);
        if (!isTV) {
            window.location.replace('/404');
            return;
        }
    }

    var initHomeButton = function() {
        var btn = document.getElementById('home-btn');
        if (btn) {
            var tvKeywords = [
                "smart-tv", "smarttv", "appletv", "googletv", "hbbtv", 
                "netcast", "webos", "tizen", "viera", "bravia", 
                "roku", "firetv", "android tv", "xbox", "playstation", 
                "nintendo", "crkey", "dtv"
            ];

            var isTVDevice = tvKeywords.some(function(keyword) {
                return uaLower.indexOf(keyword) !== -1;
            });

            if (isTVDevice) {
                btn.href = "/tv";
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHomeButton);
    } else {
        initHomeButton();
    }
})();
