const bid = [
  [52920.5, 8082],
  [53201, 100003],
  [53205, 0],
  [53254, 150002],
  [53265.5, 0],
  [53319, 248083],
];

// this is an example of a bid. Usually, they are only sending me up to 50 bids
// we want to show the price, size (how many orders at that level)
// and the total: t​he summed amount of the size at the current level and every level below it

// I'm a little confused - The orders returned by the feed are in the format of ​[price, size][]​. If the size returned by a delta is 0​ then that price level should be removed from the orderbook, otherwise you can safely overwrite the state of that price level with new data returned by that delta. There is an example of a working order book located h​ere.

// There doesn't seem to be any reason why I can't just render the new orders? Maybe b/c it is more efficient somehow?

// OOOOOHHHH, its actually a bit complex there. Its a delta. If it is zero, I should remove it. If its there, I can overwrite it. If its not there, I should still keep it in memory :D

// Lets do the base case first - grab the state every second and send it up to the parent to render?

// It could also be done outside the react lifecycle 🤔
