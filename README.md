# CommuteEasy

Chrome extension that adds commute times to [StreetEasy](https://streeteasy.com) and craigslist listings.

![StreetEasy Listings Screenshot](/promo/listings-screenshot.png)
![Listings Screenshot](/promo/craigslist-listing-screenshot.png)

## Install

	$ yarn install

## Development

    yarn run dev chrome
    yarn run dev firefox
    yarn run dev opera
    yarn run dev edge

## Build

    yarn run build chrome
    yarn run build firefox
    yarn run build opera
    yarn run build edge

## Environment

The build tool also defines a variable named `process.env.NODE_ENV` in your scripts.

## Docs

* [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox)
* [Google distance matrix API](https://developers.google.com/maps/documentation/distance-matrix/)
* [Google URL building API](https://developers.google.com/maps/documentation/urls/guide#directions-action)

