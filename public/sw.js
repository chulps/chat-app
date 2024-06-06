/* eslint-disable */
self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'icon.png',
      data: {
        url: data.url
      },
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const url = notification.data.url;
    event.waitUntil(
      clients.openWindow(url)
    );
    notification.close();
  });
  