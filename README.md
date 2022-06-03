# codethief's JSFuck compiler
Compile any JavaScript code to
[JSFuck](https://en.wikipedia.org/wiki/JSFuck), i.e. to fully equivalent
JavaScript code that only consists of characters in the set `()[]!+`.

This code was written within a handful of hours on a late Thursday night
in June 2022 during which I was trying to reverse-engineer and
understand some of the posts in the original
[thread](https://web.archive.org/web/20110301054929/http://sla.ckers.org/forum/read.php?24,32930
). In particular, since the solutions there usually only went as far as
reproducing / JSFuck-encoding `eval()` (or `Function()`), I was
interested in how *any* character could be encoded. Put differently: How
could I get to `String.fromCodePoint()` as quickly as possible?

Only once I was almost through with writing this code I realized that
there's jsfuck.com that comes with rather detailed explanations of how
JSFuck works and lots of additional tricks that I hadn't known. Oh well.
It was a fun exercise at the very least.


# Running this
Just copy & paste the code into your browser's console and, afterwards,
invoke `compile("<Your JS code>")`. Note that your browser needs to
support `Array.prototype.at()` or otherwise the compiler's code would
need to be modified slightly (see comments).


# A note regarding style
This code is messy and entirely linear for a reason. The point was *not*
to write a compiler with beautifully organized yet difficult to
understand code, nor was the goal to write a compiler like JSFuck.com
that minimizes output length as far as possible.

Rather, the goal was to get to a fully working compiler (that's able to
compile arbitrary JavaScript code containing any Unicode characters) in
as short a time as possible, using as few tricks and techniques as
possible.

Moreover, I also wanted to understand how exactly the different
techniques depended and built upon one another. This is one reason why I
made extensive use of variables and JavaScript's template literal syntax
and of non-hoisted functions (`const f = () => { … }`), so that I could
see the precise cross-code dependencies and also make sure (through
linting) that dependencies never remained unresolved and everything got
defined in the right order.

All in all, it's a collection of arcane techniques and tricks that
you're supposed to read from top to bottom until they culminate in a
very simple `compile()` function. One might say it's an example of
(probably bad) literal programming.
