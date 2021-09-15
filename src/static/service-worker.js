console.log(self);

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

console.log(self.clients);
