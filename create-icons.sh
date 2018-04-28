#!/bin/sh
convert logo.svg -resize 128 -format png -transparent white src/icons/icon-128.png
convert logo.svg -resize 16 -format png -transparent white src/icons/icon-16.png
convert logo.svg -resize 19 -format png -transparent white src/icons/icon-19.png
convert logo.svg -resize 38 -format png -transparent white src/icons/icon-38.png
convert logo.svg -resize 64 -format png -transparent white src/icons/icon-64.png
convert logo.svg -resize 32 -format png -transparent white src/icons/icon-32.png
