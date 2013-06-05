Simple Validation with jQuery
=============================

A simpler approach to client-side validation.

- No initialization, or reinitialziation.
- Data attribute driven.
- Validate on change.
- Pass/Fail validation testing. No messages to complicate things.
- No extra js configuration (unless you're into that sort of thing).


## Example Usage

**Example 1: required and a format alias.**

```html
<form>
	<div class="form-field">
		<input name="email" type="text" data-validate='{"required":true,"format": "email"}'>
	</div>
</form>
```

**Example 2: Custom formats**

```html
<form>
	<div class="form-field">
		<input name="name" type="text" data-validate='{"format": "^Tommy\\sLee\\sJones$"}'>
		<input name="occupation" type="text" data-validate='{"format": "^(fugative|sheriff|MIB\\sagent)$"}'>
	</div>
</form>
```

**Example 3: Match another input**

```html
<form>
	<div class="form-field">
		<input type="password" id="user-password" data-validate='{"required": true, "min": 8, "max": 30}'>
	</div>
	<div class="form-field">
		<input type="password" id="user-password-confirmation" data-validate='{"required": true, "min": 8, "max": 30, "matches": "#user-password"}'>
	</div>
</form>
```

**Example 4: Date parsing validation with Moment.js**

```html
<form>
	<div class="form-field">
		<input type="text" name="user[birthday]" placeholder="Dec 3, 1985" data-validate='{"required": true, "moment": "MMM D, YYYY"}' >
	</div>
</form>
```

## Extending

You can extend the base validation rules with your own, and can override the classname settings. 
```js

$.simpleValidation.fn.extend( {
	'settings': {
		'validClass': 'sooooo-valid',
		'invalidClass': 'totally-not-valid'
	},
	'ruleFn': {
		'leftBlank': function( val, arg ) {
			// val is the fields value
			// arg is the arg passed in the data attribute
			// arg is not very useful in this example...

			// Make sure your returning a boolean
			// true if it validates
			// false if it fails 
			return val.length === 0;
		}
	}
} );

```