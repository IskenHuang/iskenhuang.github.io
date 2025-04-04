// GENERATE_LINE_START
    var APP_PREFIX = 'iskenme_'
    var VERSION = '18'
    var CACHE_NAME = APP_PREFIX + VERSION
    var URLS = [
    '/',
    '/favicon.ico?v=1.1',
    '/common.min.css',
    '/resume/',
    '/lab/',
    '/lab/aria2ng/',
    '/lab/china-salary/',
    '/lab/currency/',
    '/lab/dingtalk-url/',
    '/lab/editor/',
    '/lab/expenser/',
    '/lab/file-transfer/',
    '/lab/file-transfer-temp/',
    '/lab/google-calendar/',
    '/lab/house-loan/',
    '/lab/i18n/',
    '/lab/location/',
    '/lab/lotto/',
    '/lab/qrcode/',
    '/lab/qrcode-scan/',
    '/lab/qrcode-wifi-card/',
    '/lab/random-string/',
    '/lab/reaction-game/',
    '/lab/shadowsocks/',
    '/lab/tempo/',
    '/lab/url/'
]
    // GENERATE_LINE_END

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }

            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    )
})

// Cache resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(URLS)
        })
    )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            var cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })
            // add current cache name to white list
            cacheWhitelist.push(CACHE_NAME)

            return Promise.all(keyList.map(function (key, i) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i])
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})
