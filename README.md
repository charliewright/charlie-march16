## Quickstart Instructions

- You will need a node version > 12.0.0. I recommend using [NVM](https://danyal.dk/blog/2018/11/11/install-nvm-node-version-manager-node-on-mac/) to manage your node version.
- `yarn && yarn start` to get a local build set up.
- `yarn test` to run the unit tests
- check out a live version at

## Q/A

### What would you add to your solution if you had more time?

There are a lot of cool ways to improve the order book:

Render performance and UX could be improved by grouping orders by price. If you group the orders together in $50 or $100 (or variable) segments, the entire book component row would not need to render as frequently. Top prices would stay roughly the same while the volume + totals would shift.

If it were a production app, I might make an api layer that validates the messages coming in from the websocket. I might use a package like [Runtypes](https://github.com/pelotom/runtypes) to ensure that the messages conform to the contract the frontend is expecting.

I might also spend lots more time fiddling with CSS to make the app look unique and great!

### What would you have done differently if you knew this page was going to get thousands of views per second vs per week?

Aggregating the deltas and re-rendering the order book is moderately expensive computationally. This aggregation and rendering happens on the client browser side, so as long as we efficiently serve the page assets (html and bundled JavaScript) the page should load properly.

I think that there are concerns with having thousands (tens of thousands) of concurrent websocket connections, although the folks at [stackoverflow](https://stackoverflow.com/questions/15872788/maximum-concurrent-socket-io-connections) say that with a bit of optimization it is possible to have 1 million active socket connections. We might want to plan for the order book to handle dropped messages from the websockets, occasionally purging the order book I am storing in browser memory.

If this were a production app serving thousands of concurrent users, I would want to have appropriate logging (sentry) and health checks to be able to diagnose and fix issues.

If I knew that my page was getting thousands of views per second, I would certainly build in a monetization strategy 😏.

### What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.

I think it is very important for teams to write JS applications in TypeScript over JavaScript. TypeScript is slightly more restrictive when writing code but pays off when collaborating in code reviews or reading code. Having type annotations and code completion in your IDE is also a gamechanger.

TypeScript transpiles to JavaScript, and lets you use language features that might not be available in all runtime environments (internet explorer).

Optional chaining `orderBook?.bids` is a very useful feature in TypeScript. Optional chaining allows us to read a property deep within a nested object without having to validate if everything in the chain is defined.

For example, in this code (taken from the project) oldOrders might be null

```
oldOrders?.forEach((order) => (orderMap[order[0].toString()] = order[1]));

```

Rather than writing an `if` statement and increasing the complexity of the code by adding another code path with indentation and curly brackets `{`, I can optionally chain off the `oldOrders` object. This results in more readable code, and hopefully fewer "cannot access X of undefined" errors.

### How would you track down a performance issue in production? Have you ever had to do this?

Google chrome has a great tool for frontend performance profiling. It is possible to use the [js profiler](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/) to track down bottlenecks when executing JavaScript and rendering DOM. It is sometimes difficult to make sense of the profiler in production if your JavaScript bundle is minified.

Ideally, when tracking down a performance issue I would be able to replicate the issue locally. Sometimes you might need to use a [faker](https://github.com/marak/Faker.js/) to stress-test and replicate the performance bottleneck.

Once I have the performance issue locally, I like to use `console.time()` calls while progressively commenting out code to track down the offending line/component. I call this method "binary search debugging".

I have had to track down production issues before. At a previous company, we had shipped an angular data table component that would lag and hang the browser if there were too many rows. I was able to isolate the bug to an input form that we were initializing for each row - meaning that our page had hundreds of `angular watchers`. I fixed this by initializing the edit form only when clicking on the cell in question.

### Can you describe common security concerns to consider for a frontend developer?

Frontend developers certainly need to be concerned about Cross-Site-Scripting (XSS) vulnerabilities.

In simple terms, agents with malicious intent might persist data into a Web Application that causes a harmful script to be executed on another client's browser.

Frontend developers need to take care to sanitize data input/output and avoid rendering unsafe/unsanitized HTML to the client.

Protecting an application against XSS vulnerabilities is challenging because of the dependency-management system of modern web applications (npm/yarn and node modules). In addition to writing defensive code, we need to ensure that we are not using compromised packages in our dependency tree. It is smart to use an automated tool to audit NodeJS dependencies for known vulnerabilities.

When working with a team of developers, it is important to raise security questions at code review and development time. There are many other potential exploits (clickjacking, PII leaks) that we need to guard against, and so it is important not to introduce potential vulnerabilities.

### How would you improve the API that you just used?

As a consumer of the orders API, I had to write logic to aggregate the orders delta.

I were developing the API for many clients (web, mobile app, more than one web client app) it might be better to have the WebSocket aggregate the orders on the server side. Having a more complete server (returns all orders, spread, groupings) with a "thin client" is sometimes easier from a development perspective.

<!-- TODO:

- error handling around dead socket maybe!?
- make sure the layout works on mobile (table + header + dark mode)
- percentage based order colour maybe!? that would actually be hype
- Lots of writing (two parts, right? I should spend time writing down my answers in the readme)

css fiddle on mobile/desktop
get rid of noisy numbers (group orders together! that is a good feature on the exchange)
drop it onto netlify!
more clickability (links to websocket!? other order books) -->
