/*jslint regexp: true, nomen: true */
/*global console, moment, jQuery */

// Simple Validation-- a jQuery plugin by Adam Miller
;(function( $ ) {

	var pluginName = "simplieValidation",
		dataAPI = "[data-validate]";

	$[pluginName] = {
		
		'settings': {
			'validClass': 'sv-valid',		// class to apply to the parent element when validation passes
			'invalidClass': 'sv-invalid'	// class to apply to the parent element when valiation fails
		},

		'evt': {
			/*
			 * Handles change events on our inputs. Build the context object and triggers validation.
			 * 
			 * @method change 
			 * @param evt object The change event object
			 */
			'change': function( evt ) {
				var context = $.extend({}, $[pluginName].settings);
				context.$ele = $( this );
				context.$parent = context.$ele.parent();
				context.rules = context.$ele.data( 'validate' ) || {};
				context.val = context.$ele.val();
				$[pluginName].fn.validate( context );
			}
		},

		'ruleFn': {
			/*
			 * Checks that the value is present and not an empty string
			 * 
			 * @method required 
			 * @param val string Current context value
			 * @param arg boolean Unused
			 */
			'required': function ( val, arg ) {
				return (val && val !== "") ? true : false;
			},
			/*
			 * Checks that the value matches the passed regex or regex alias. Supported aliases are:
			 * - zipcode: Matches US zipcodes
			 * - name: Matches strings 2-100 characters in length
			 * - email: Matches email addresses
			 * 
			 * @method format 
			 * @param val string Current context value
			 * @param arg string Regex or regex alias
			 */
			'format': function ( val, arg ) {
				if ( arg === "zipcode" ) {
					// matches US zips
					arg = /^\d{5}(-\d{4})?$/;
					// matches US and Canadian zips
					// arg = "(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)";
				} else if ( arg === "name" ) {
					// matches strings 2-100 characters in length
					arg = "^.{2,100}$";
				} else if ( arg === "email" ) {
					arg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
				}
				return val.match( arg );
			},
			/*
			 * Checks that the value does not exceed the provided maximum length
			 * 
			 * @method max 
			 * @param val string Current context value
			 * @param arg number Max length
			 */
			'max': function( val, arg ) {
				return (val.length <= arg );
			},
			/*
			 * Checks that the value exceeds the provided minimum length
			 * 
			 * @method min 
			 * @param val string Current context value
			 * @param arg number Minimum length
			 */
			'min': function( val, arg ) {
				return (val.length >= arg );
			},
			/*
			 * Checks that the value matches the value of the provided selector
			 * 
			 * @method matches 
			 * @param val string Current context value
			 * @param arg sting Selector pointing to the input you'd like to compare this text field with. 
			 */
			'matches': function( val, arg ) {
				var testVal = $( arg ).val();
				return val === testVal;
			},
			/*
			 * Uses moment.js to check that the value is a parseable time. If moment.js is not available,
			 * an warning is logged and validation is allowed to continue
			 * 
			 * @method moment 
			 * @param val string Current context value
			 * @param arg sting The expected format, used to help moment.js accurately parse the value. 
			 */
			'moment': function( val, arg ) {
				if ( typeof(moment) !== "function" ) {
					console.warn( "jQuery::" + pluginName, "moment.js not available --- skipping validation");
					return true;
				}
				return moment(val, arg).isValid();
			}
		},

		'fn': {
			/*
			 * Allows the base rules and settings to be extended
			 * 
			 * @method extend 
			 * @param options object Object containing settings and/or ruleFn properties to extend the defaults with
			 */
			'extend': function( options ) {
				$.extend( $[pluginName].settings, options.settings );
				$.extend( $[pluginName].ruleFn, options.ruleFn );
			},
			/*
			 * Validate the current contenxt
			 * 
			 * @method validate 
			 * @param context object The context object established in the change event handler
			 */
			'validate': function( context ) {
				var validFlag = true, 
					rule;
				$[pluginName].fn.reset( context );
				for( rule in context.rules ) {
					if ( context.rules.hasOwnProperty( rule ) && rule in $[pluginName].ruleFn ) {
						if ( $[pluginName].ruleFn[rule]( context.val, context.rules[rule] ) ) {
							continue;
						} else {
							validFlag = false;
							break;
						}
					}
				}
				if ( validFlag ) {
					$[pluginName].fn.setValid( context );
				} else {
					$[pluginName].fn.setInvalid( context );
				}
			},
			/*
			 * Sets the current context to valid
			 * 
			 * @method setValid 
			 * @param context object The context object established in the change event handler
			 */
			'setValid': function ( context ) {
				context.$parent
					.addClass( context.validClass );
			},
			/*
			 * Sets the current context to invalid
			 * 
			 * @method setValid 
			 * @param context object The context object established in the change event handler
			 */
			'setInvalid': function( context ) {
				context.$parent
					.addClass( context.invalidClass );
			},
			/*
			 * Removes all validation classes from the current context
			 * 
			 * @method setValid 
			 * @param context object The context object established in the change event handler
			 */
			'reset': function( context ) {
				context.$parent
					.removeClass( [context.invalidClass, context.validClass].join(" ") );
			}
		}

	};

	// Catch change events on our inputs when they hit the body element
	// and trigger validation
	$( 'body' )
		.on( 'change.' + pluginName, dataAPI, $[pluginName].evt.change );

}(jQuery));