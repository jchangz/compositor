# Selection

## Notes

### y-Position when scrolling

`@use-gesture` useDrag `y, iy` values are based on the current window viewport.

On first render we calculate our image dimensions with `getBoundingClientRect()`.

When we scroll, the top position is no longer correct relative to the window viewport.

Instead of recalculating the image bounds every time we begin a selection, we store the initial `window.scrollY` and calculate the amount we need to add to the image `top` position:

```javascript
newScrollY = initialScrollY - window.scrollY;
```

Now we can calculate the `top` position that is aligned relative to the window viewport:

```javascript
newTop = originalTop + newScrollY;
```

Now we can use `((y - newTop) / height) * 100` which gives us the `y` position percentage relative to the bounds of the image.
