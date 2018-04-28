#!/bin/sh
convert logo.svg -resize 128 -format png -transparent white app/images/icon-128.png
convert logo.svg -resize 16 -format png -transparent white app/images/icon-16.png
convert logo.svg -resize 19 -format png -transparent white app/images/icon-19.png
convert logo.svg -resize 38 -format png -transparent white app/images/icon-38.png
convert logo.svg -resize 64 -format png -transparent white app/images/icon-64.png
convert logo.svg -resize 32 -format png -transparent white app/images/icon-32.png
