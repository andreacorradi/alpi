# static-player

Develop static web things with happiness exploiting runtime ‘includes’ and a powerful ‘templating system’.




## How it works

You have this .html file

```html
<html process-init>
	<head></head>
	<body>

		<div process=“_partial_1.html”></div>

		<script src=“bower_components/jquery/dist/jquery.js”></script>
		<script src=“bower_components/lodash/lodash.js”></script>
		<script src=“bower_components/static-player/static-player.js”></script>
		
	</body>
</html>
```

And the partial markup file ‘_partial_1.html’:

```html
<section class=“main”>
	<h1>Title 1</h1>
</section>
```

You’ll get this at run time

```html
<html process-init>
	<head></head>
	<body>

		<section class=“main”>
			<h1>Title 1</h1>
		</section>

		<script src=“bower_components/jquery/dist/jquery.js”></script>
		<script src=“bower_components/lodash/lodash.js”></script>
		<script src=“bower_components/static-player/static-player.js”></script>
		
	</body>
</html>
```


Or let’s say the partial is something like:

```html
<section class=“main”>
	<h1><%- title %></h1>
</section>
```

and the ‘main.html’ file:

```html
<html process-init>
	<head></head>
	<body>

		<div process=“_partial_1.html” model=“data”></div>
		
		<script>
		data = {title: “Super Title”}
		</script>

		<script src=“bower_components/jquery/dist/jquery.js”></script>
		<script src=“bower_components/lodash/lodash.js”></script>
		<script src=“bower_components/static-player/static-player.js”></script>
		
	</body>
</html>
```

you’ll get something like:

```html
<html process-init>
	<head></head>
	<body>

		<section class=“main”>
			<h1>Super Title</h1>
		</section>

		<script src=“bower_components/jquery/dist/jquery.js”></script>
		<script src=“bower_components/lodash/lodash.js”></script>
		<script src=“bower_components/static-player/static-player.js”></script>
		
	</body>
</html>
```

You get the point.

More about templating? It’s just [lodash.template()](https://lodash.com/docs#template).

And all this stuff will be then baked through a Grunt script for server happiness (release soon).




## Install

If you use Bower you can install with this line:

	bower install static-player

You can also download the .zip of this repo and include the library in your html file.
You need to include the all the required scripts that are ```jquery```, ```lodash``` and ```static-player```.




## Documentation


#### Wrapper

By default the wrapper that contains the ```process``` attribute will be stripped out instead of the processed template.
If you need to keep in the markup su need to add an additional attribute ```process-keep```

```html

	<div process-keep process=“_partial_1.html” model=“data”></div>

```


## Contribute


## License

Copyright (c) 2016 abusedmedia

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.


## Changelog

#### Alpha release

- initial release
