/**
 * Name: Accessible Modal Plugin
 * Contributors: Tim Wright (tim@10up.com, @csskarma)
 * License: MIT, https://opensource.org/licenses/MIT
 * Converted from a jQuery plugin originally written by @scottohara: https://github.com/scottaohara/accessible-components
 */

( function() {

	'use strict';

	// Define global TenUp object if it doesn't exist
	if ( 'object' !== typeof window.TenUp ) {
		window.TenUp = {};
	}


	// Polyfill for el.matches
	if (!Element.prototype.matches) {
		Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function(s) {
			var matches = (this.document || this.ownerDocument).querySelectorAll(s),
			i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1;
		};
	}

	/*
	 * Cross-browser way to deal with class management
	 */

	TenUp.hasClass = function ( el, cls ) {
		return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test( el.className );
	};

	/*
	 * Cross-browser way to add a class
	 */

	TenUp.addClass = function ( el, cls ) {

		if ( el.classList ) {
			el.classList.add(cls);
		} else if (!TenUp.hasClass(el, cls)) {
			el.className += " " + cls;
		}

	};

	/*
	 * Cross-browser way to remove a class
	 */

	TenUp.removeClass = function ( el, cls ) {
		if ( el.classList ) {
			el.classList.remove( cls );
		} else if( TenUp.hasClass( el, cls ) ) {
			var reg = new RegExp( '(\\s|^)' + cls + '(\\s|$)' );
			el.className = el.className.replace( reg, ' ' );
		}
	};

	// Caching and setting up some variables

	var i;

	// use this defualt title if the attr isn't set
	var safetyModalTitle  = "Dialog Window";






	// initialize all the modals
	TenUp.modal = function ( options, callback ) {

		// Define the default values
		var defaults = {
			'target': '.a11y-modal'
		};
		var defaults_count = defaults.length;
		var opt;

		// Map all default settings to user defined options
		for ( opt = 0; opt < defaults_count; opt = opt + 1) {
			if( typeof options[opt] === "undefined" ) {
				options[opt] = defaults[opt];
			}
		}

		var el = document.querySelector( options.target );

		if ( ! el ) {
			return;
		}

		var id = el.id;
		var self = document.getElementById( id );

		var modalTrigger = options.trigger;
		var modal = '.a11y-modal';
		var modalDoc = '.modal';
		var modalTitle = '[data-modal-title]';
		var modalClose = '[data-modal-close]';
		var bodyElements = 'a11y-hide-if-modal-open';
		var genModalClose = document.createElement( 'button' );
		var html = document.body;
		var modallisting = document.querySelectorAll( modal );
		var modallistingCount = modallisting.length;

		// build out the fallback button
		genModalClose.setAttribute( 'type', 'button' );
		genModalClose.setAttribute( 'data-modal-close', 'true' );
		TenUp.addClass( genModalClose, 'modal__outro__close' );

		genModalClose.innerHTML = '<span aria-hidden="true">x</span>';
		// setup modals properly
		var setup_a11y_modal = function () {

			// setup each modal instance to have the
			// appropriate attributes. These attributes
			// are applied to what would be considered the
			// modal container, or 'overlay'

			var findTitle = self.querySelector( modalTitle );
			var findHeading = self.querySelector( '[data-modal-title]' );
			var modalDocVar = self.querySelectorAll( modalDoc );
			var modalDocVarCount = modalDocVar.length;
			var modalObj;
			var thisLabel;
			var j;

			// first check to see what sort of dialog this should be
			// if a data-modal-alert attribute is set to true, then
			// this is meant to be an alert dialog, so set the role
			// to 'alertdialog'. If it's not set, it's mean to be
			// a normal dialog. So set the role to just 'dialog'

			if ( self.getAttribute( 'data-modal-alert' ) === 'true' ) {
				self.setAttribute( 'role', 'alertdialog' );
			} else {
				self.setAttribute( 'role', 'dialog' );
			}

			// we will need to set focus to the modal content
			// container for focus trapping reasons, so we
			// need this to have a tabindex

			self.setAttribute( 'tabindex', '-1' );
			self.querySelector( modalDoc ).setAttribute( 'tabindex', '-1' );

			// check to see if an aria-label was set on the modal
			// if not, then start running checks to apply an aria-labelledby

			if ( !self.getAttribute( 'aria-label' ) ) {

				// if the modal window has a child modalTitle set,
				// then add an aria-labelledby attribute to the dialog,
				// pointing to that element.

				if ( findTitle ) {

					thisLabel = findTitle.getAttribute( 'id' );

				} //if

				// in the event that a modalTitle wasn't manually set,
				// then we should look to see if there's a heading element
				// present at all, and then make THAT the source for the
				// aria-labelledby

				else if ( findHeading ) {

					// does the heading we found have an id already?
					// let's check

					if ( findHeading.setAttribute( 'id' ) ) {

						thisLabel = findHeading.setAttribute( 'id' );

					} else { // if it doesn't, then generate one

						thisLabel = self.setAttribute( 'id' ) + '_title';

						findHeading.setAttribute( 'id', thisLabel );

					} // else

				} // else/if

				self.setAttribute( 'aria-labelledby', thisLabel );

			} // if

			// setup each modal content area (the component that
			// contains the actual content)

			for ( j = 0; j < modalDocVarCount; j = j + 1 ) {

				modalObj = modalDocVar[j];

				// important for older versions of NVDA to accurately
				// understand a modal's content

				modalObj.setAttribute( 'role', 'document' );

				// Modals need a close button, and it should be the last
				// element in the modal.

				// If a modal doesn't have a close button, create it.

				if ( typeof modalObj.querySelector( modalClose ) === 'undefined' ) {

					if ( typeof modalObj.querySelector( '.modal__outro' ) === 'undefined' ) {

						modalObj.querySelector( '.modal__outro' ).appendChild( genModalClose );

					} else {

						modalObj.appendChild( genModalClose );

					} // if/else

				} // if

				// Set aria-label and control attributes to the close trigger.

				modalObj.querySelector( modalClose ).setAttribute( 'aria-label', 'Close Modal' );
				modalObj.querySelector( modalClose ).setAttribute( 'aria-controls', modalObj.parentNode.getAttribute( 'id' ) );

			} // end for loop

		};

		// setup modal triggers
		// the following applies needed aria-attributes
		// to the modal triggers, as well as doing a
		// final check to ensure that the modal window
		// has appropriate labeling

		var setup_a11y_modal_triggers = function () {

			var modalTriggerEl = document.querySelectorAll( modalTrigger );
			var modalTriggerCount = modalTriggerEl.length;
			var grabTarget;
			var modalTarget;
			var modalObj;
			var m;

			for ( m = 0; m < modalTriggerCount; m = m + 1 ) {

				modalObj = modalTriggerEl[m];

				// if the trigger is a link, we need to give it a
				// button role.

				if ( modalObj.getAttribute( 'href' ) ) {

					modalObj.setAttribute( 'role', 'button' );

				}

				// The triggers need to point to the modals they control via
				// the aria-controls attribute. So run a check to see if the
				// attribute exists on the button.
				//
				// It's likely that it WON'T exist, as the optimal method for
				// the minimum mark-up is to use a data-modal-open attribute
				// instead. The reason for this is that in situations without
				// JavaScript, we don't want partial ARIA hooks, as that can
				// create confusion for ATs that would expect certain
				// functionality that wouldn't be available due to lack of JS.

				if ( !modalObj.getAttribute( 'aria-controls' ) ) {

					// make sure that the trigger actually triggers something.
					// if it there's no data-modal-open attribute set, then
					// pull the target from the href

					if ( modalObj.getAttribute( 'data-modal-open' ) ) {

						grabTarget = modalObj.getAttribute( 'data-modal-open' );
						modalObj.setAttribute( 'aria-controls', grabTarget );

					}
					// if there's no data-modal-open, pull the target from
					// from the href

					else if ( modalObj.getAttribute( 'href' ) ) {

						grabTarget = modalObj.getAttribute( 'href' ).split( '#' )[1];
						modalObj.setAttribute( 'aria-controls', grabTarget );

					}

					// if neither of the above are set, then this just won't work

					else {
						// No target set. A target is set by setting the value of an aria-controls attribute, which if absent, can be generated by the trigger's href URI, or a data-modal-open attribute to the value of the modal window ID you are attempting to open.
						return false;
					}

				} // end if aria-controls

				// now that the aria-controls is set, point to the modal's target
				// so we can run the next if

				modalTarget = document.querySelector( '#' + modalObj.getAttribute( 'aria-controls' ) );

				// finally a last check to see if the trigger is meant to launch
				// an alert dialog modal. If the alertdialog role wasn't set during
				// the initial setup function, then look to see if the 'data-modal-alert'
				// attribute is present on the trigger, and if so, apply the alertdialog
				// role to the modal on trigger activation.

				if ( modalObj.getAttribute( 'data-modal-alert' ) === 'true' && modalTarget.getAttribute( 'role' ) !== 'alertdialog' ) {
					modalTarget.setAttribute( 'role', 'alertdialog' );
				}

			} // for loop
		};

		// Place modal window(s) as the first child(ren)
		// of the body element so tabbing backwards can
		// move focus into the browser's address bar

		var organize_dom = function () {

			var body = document.body;
			var modalEl = document.querySelectorAll( modal );
			var modalElCount = modalEl.length;
			var k;

			// place all the modal dialogs at the top of the DOM, as the
			// first children of BODY. This will allow for backwards tabbing
			// into the browser's address bar, where as if the modals were
			// not located at the top of the DOM, keyboard focus would be
			// completely trapped within the modal window.

			for( k = 0; k < modalElCount; k = k + 1 ) {
				body.insertBefore( modalEl[k], body.firstChild );
			}

			// for all direct children of the BODY element, add a class
			// to target during open/close
			TenUp.addClass( body.querySelector( '*:not(.a11y-modal)' ), bodyElements );

		};

		var open_a11y_modal = function ( e ) {

			// setup vars

			var openTarget = e.target;
			var modalTarget = document.getElementById( openTarget.getAttribute( 'aria-controls' ) );

			// Check to see if the modal has either an aria-label or labelledby attribute
			// if not, that means that the modal didn't have a manually set aria-label,
			// nor does the modal have any sort of heading element to draw a title from.
			// In this instance, pull the safetyModalTitle var in as an aria-label

			if ( !modalTarget.getAttribute( 'aria-labelledby' ) && !modalTarget.getAttribute( 'aria-label' ) ) {

				// Last ditch effort to allow control over what the aria-label will be.
				// If the data-set-modal-title attribute is set to the modal trigger,
				// its value will be set as the modal's aria-label

				if ( openTarget.getAttribute( 'data-set-modal-title' ) ) {
					safetyModalTitle = openTarget.getAttribute( 'data-set-modal-title' );
				}

				// set an aria-label to the modal
				modalTarget.setAttribute( 'aria-label', safetyModalTitle );

			} // if

			// traps focus while the modal is open

			trap_focus();

			// if modal trigger is an <a>, make sure that URI isn't
			// updated and more importantly that the document doesn't
			// auto-jump to the DOM location of the modal window.

			e.preventDefault();

			// set that modal be visible, controlled by the
			// aria-hidden attribute and CSS
			// then shift focus to it

			modalTarget.setAttribute( 'aria-hidden', 'false' );

			// add a class to the HTML, to allow for a CSS hook
			// to help restrict document scroll while the modal
			// is open

			TenUp.addClass( html, 'modal-is-open' );

			// Hide main document content from screen readers by
			// applying an aria-hidden attribute to all direct
			// siblings of the modal windows. (var bodyElements)

			document.querySelector( '.' + bodyElements ).setAttribute( 'aria-hidden', 'true' );

			// finally, apply focus to the newly opened modal window

			modalTarget.querySelector( modalDoc ).focus();

		};

		// Bind to both the button click and the escape key to
		// close the modal window  but only if isModalOpen is set to true

		var close_a11y_modal = function ( e ) {

			e.preventDefault();

			var returnFocus = document.querySelectorAll( '[aria-controls="' + self.getAttribute( 'id' ) + '"]');
			var returnFocusCount = returnFocus.length;

			returnFocus = returnFocus[returnFocusCount - 1];

			TenUp.removeClass( html, 'modal-is-open' );
			self.setAttribute( 'aria-hidden', 'true' );

			// remove the aria-hidden that was applied during modal open

			document.querySelector( '.' + bodyElements ).removeAttribute( 'aria-hidden' );

			returnFocus.focus();

		};

		// keyboard controls specific to the modal dialog windows

		var keytrolls_a11y_modal_trigger = function ( e ) {

			var keyCode = e.keyCode || e.which;

			switch ( keyCode ) {

				// space & enter

				case 32:
				case 13:
					e.stopPropagation();
					e.target.click();
					break;

			} // switch

		};

		// trap focus within the modal window, because otherwise
		// users can tab to obscured elements, and that's just
		// bad UX.

		var trap_focus = function () {

			// I'm open to better solutions for trapping focus within the modal with it's open
			var all_nodes = document.querySelectorAll( "*" );
			var trapArea = self.querySelector( modalDoc );
			var nodeCount =  all_nodes.length;
			var j;


			for ( j = 0; j < nodeCount; j = j + 1 ) {
				all_nodes.item( j ).addEventListener( "focus", function( e ) {

					if ( TenUp.hasClass( html, 'modal-is-open' ) && !trapArea.contains( e.target ) ) {

						e.stopPropagation();
						trapArea.focus();

					}
				}, false );
			}

		}; // end trap_focus

		/*
		 * SETUP FUNCTIONS
		 */

		organize_dom();
		setup_a11y_modal();
		setup_a11y_modal_triggers();

		/*
		 * EVENT BINDINGS
		 */

		// close the modal is the overlay is clicked

		self.addEventListener( "click", function( e ) {

			if ( e.target === self.querySelector( modalDoc ).parentNode ) {
				e.stopPropagation();
				close_a11y_modal( e );
			}
		}, false );

		// close the modal on ESC

		self.addEventListener("keydown", function( e ) {

			if( e.keyCode == 27 && TenUp.hasClass( html, 'modal-is-open' ) ) {
				close_a11y_modal( e );
			}
		}, false);

		// close the modal if you click the close button

		self.querySelector( modalClose ).addEventListener('click', function( e ) {
			close_a11y_modal( e );
		}, false );

		// open the modal when the trigger is clicked

		document.addEventListener( "click", function( e ) {

			if ( e.target.matches( modalTrigger ) ) {
				e.stopPropagation();
				open_a11y_modal( e );
			}

		}, false );

		// making sure the modal triggers open with <enter> and <space> (making it act like a button, if it's a link)

		document.addEventListener( "keydown", function( e ) {
			if (e.target.matches( modalTrigger )) {
				e.stopPropagation();
				keytrolls_a11y_modal_trigger( e );
			}
		}, false );

		// accept callback functions, because why not?

		if ( typeof callback === 'function' ) {
			callback.call();
		}

	}; // end: a11y_modal: function

} )();
